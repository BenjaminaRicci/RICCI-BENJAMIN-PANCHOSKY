import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { cargarDatosIniciales } from '../src/data/seed.js';

let server;
let baseUrl;

const request = async (method, path, { body, token } = {}) => {
    const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: body ? JSON.stringify(body) : undefined
    });
    return { status: response.status, body: await response.json() };
};

const login = async (email, password) => (await request('POST', '/auth/login', { body: { email, password } })).body.data.token;

before(async () => {
    cargarDatosIniciales();
    await new Promise((resolve) => {
        server = app.listen(0, resolve);
    });
    baseUrl = `http://localhost:${server.address().port}`;
});

after(() => server.close());

describe('Autenticación y registro', () => {
    const datos = {
        nombre: 'Lucía',
        apellido: 'Gómez',
        email: 'lucia@mail.com',
        password: 'segura1234',
        repetirPassword: 'segura1234',
        telefono: '1144445555'
    };

    test('registra un cliente y no expone la contraseña', async () => {
        const { status, body } = await request('POST', '/auth/registro', { body: datos });
        assert.equal(status, 201);
        assert.equal(body.data.usuario.rol, 'cliente');
        assert.equal(body.data.usuario.password, undefined);
        assert.ok(body.data.token);
    });

    test('rechaza email duplicado (RN-10)', async () => {
        const { status } = await request('POST', '/auth/registro', { body: datos });
        assert.equal(status, 409);
    });

    test('valida contraseña corta, no coincidente y email inválido', async () => {
        const corta = await request('POST', '/auth/registro', {
            body: { ...datos, email: 'otra@mail.com', password: '123', repetirPassword: '123' }
        });
        const distinta = await request('POST', '/auth/registro', {
            body: { ...datos, email: 'otra@mail.com', repetirPassword: 'otra-cosa' }
        });
        const email = await request('POST', '/auth/registro', {
            body: { ...datos, email: 'sin-arroba' }
        });
        assert.deepEqual([corta.status, distinta.status, email.status], [400, 400, 400]);
    });

    test('rechaza credenciales incorrectas', async () => {
        const { status } = await request('POST', '/auth/login', {
            body: { email: 'cliente@panchosky.com', password: 'incorrecta' }
        });
        assert.equal(status, 401);
    });
});

describe('Permisos por rol', () => {
    test('el menú es público pero crear productos requiere administrador', async () => {
        const publico = await request('GET', '/productos');
        const sinSesion = await request('POST', '/productos', { body: {} });
        const cliente = await request('POST', '/productos', {
            body: {},
            token: await login('cliente@panchosky.com', 'Cliente1234')
        });
        assert.deepEqual([publico.status, sinSesion.status, cliente.status], [200, 401, 403]);
    });
});

describe('Flujo de pedido', () => {
    let token;
    let pedidoId;

    before(async () => {
        token = await login('cliente@panchosky.com', 'Cliente1234');
    });

    const pedido = (extra = {}) => ({
        items: [{ productoId: 4, cantidad: 1 }],
        modalidad: 'envio',
        zona: 'Centro',
        direccion: 'Av. Siempre Viva 742',
        sucursalId: 1,
        medioPago: 'efectivo',
        ...extra
    });

    test('requiere sesión iniciada (RN-09)', async () => {
        const { status } = await request('POST', '/pedidos', { body: pedido() });
        assert.equal(status, 401);
    });

    test('rechaza pedido sin ítems (RN-01)', async () => {
        const { status } = await request('POST', '/pedidos', { token, body: pedido({ items: [] }) });
        assert.equal(status, 400);
    });

    test('rechaza producto no disponible (RN-02)', async () => {
        const { status } = await request('POST', '/pedidos', {
            token,
            body: pedido({ items: [{ productoId: 6, cantidad: 1 }] })
        });
        assert.equal(status, 409);
    });

    test('rechaza envío bajo el mínimo (RN-03)', async () => {
        const { status, body } = await request('POST', '/pedidos', {
            token,
            body: pedido({ items: [{ productoId: 1, cantidad: 1 }] })
        });
        assert.equal(status, 400);
        assert.match(body.message, /3000/);
    });

    test('rechaza zonas sin cobertura (RN-05) y cantidades inválidas', async () => {
        const zona = await request('POST', '/pedidos', { token, body: pedido({ zona: 'GBA Sur' }) });
        const cantidad = await request('POST', '/pedidos', {
            token,
            body: pedido({ items: [{ productoId: 4, cantidad: 21 }] })
        });
        assert.deepEqual([zona.status, cantidad.status], [400, 400]);
    });

    test('el retiro exige sucursal y medio de pago, y no cobra envío (RN-06)', async () => {
        const sinSucursal = await request('POST', '/pedidos', {
            token,
            body: pedido({ modalidad: 'retiro', sucursalId: undefined })
        });
        const sinPago = await request('POST', '/pedidos', {
            token,
            body: pedido({ modalidad: 'retiro', medioPago: undefined })
        });
        const retiro = await request('POST', '/pedidos', {
            token,
            body: pedido({ modalidad: 'retiro', items: [{ productoId: 1, cantidad: 1 }] })
        });
        assert.deepEqual([sinSucursal.status, sinPago.status, retiro.status], [400, 400, 201]);
        assert.equal(retiro.body.data.costoEnvio, 0);
        assert.equal(retiro.body.data.total, 1800);
    });

    test('cobra envío bajo el umbral y es gratis por encima (RN-04)', async () => {
        const conCosto = await request('POST', '/pedidos', { token, body: pedido() });
        const gratis = await request('POST', '/pedidos', {
            token,
            body: pedido({ items: [{ productoId: 5, cantidad: 2 }] })
        });
        assert.equal(conCosto.body.data.costoEnvio, 800);
        assert.equal(conCosto.body.data.total, 5000);
        assert.equal(gratis.body.data.costoEnvio, 0);
        pedidoId = conCosto.body.data.id;
    });

    test('el combo exige pancho y bebida válidos (RN-08)', async () => {
        const base = { modalidad: 'retiro', sucursalId: 1, medioPago: 'efectivo' };
        const sinBebida = await request('POST', '/pedidos', {
            token,
            body: { ...base, items: [{ comboId: 1, cantidad: 1, panchoId: 1 }] }
        });
        const bebidaIncorrecta = await request('POST', '/pedidos', {
            token,
            body: { ...base, items: [{ comboId: 1, cantidad: 1, panchoId: 1, bebidaId: 4 }] }
        });
        const correcto = await request('POST', '/pedidos', {
            token,
            body: { ...base, items: [{ comboId: 1, cantidad: 1, panchoId: 1, bebidaId: 14 }] }
        });
        assert.deepEqual([sinBebida.status, bebidaIncorrecta.status], [400, 400]);
        assert.equal(correcto.status, 201);
        assert.equal(correcto.body.data.total, 2700);
    });

    test('el combo no se vende pasada su hora límite (RN-07)', async () => {
        const admin = await login('admin@panchosky.com', 'Admin1234');
        await request('PUT', '/combos/1', {
            token: admin,
            body: { nombre: 'Combo Pancho + Bebida', precioOriginal: 3300, precioPromocional: 2700, horaLimite: '00:00' }
        });
        const { status } = await request('POST', '/pedidos', {
            token,
            body: {
                modalidad: 'retiro',
                sucursalId: 1,
                medioPago: 'efectivo',
                items: [{ comboId: 1, cantidad: 1, panchoId: 1, bebidaId: 14 }]
            }
        });
        assert.equal(status, 409);
    });

    test('congela el precio del pedido aunque cambie el producto (RN-12)', async () => {
        const admin = await login('admin@panchosky.com', 'Admin1234');
        await request('PUT', '/productos/4', { token: admin, body: { precio: 9999 } });
        const { body } = await request('GET', `/pedidos/${pedidoId}`, { token });
        assert.equal(body.data.detalles[0].precioUnitario, 4200);
    });

    test('un producto vendido no se elimina, queda no disponible', async () => {
        const admin = await login('admin@panchosky.com', 'Admin1234');
        const { body } = await request('DELETE', '/productos/4', { token: admin });
        assert.equal(body.data.eliminado, false);
        assert.equal(body.data.producto.disponible, false);
    });

    test('un cliente no puede ver pedidos ajenos (RN-13)', async () => {
        await request('POST', '/auth/registro', {
            body: {
                nombre: 'Otro',
                apellido: 'Cliente',
                email: 'otro@mail.com',
                password: 'otraClave123',
                repetirPassword: 'otraClave123',
                telefono: '1155556666'
            }
        });
        const otro = await login('otro@mail.com', 'otraClave123');
        const detalle = await request('GET', `/pedidos/${pedidoId}`, { token: otro });
        const listado = await request('GET', '/pedidos', { token: otro });
        assert.equal(detalle.status, 404);
        assert.deepEqual(listado.body.data, []);
    });

    test('valida transiciones de estado y cancelación limitada (RN-11)', async () => {
        const empleado = await login('empleado@panchosky.com', 'Empleado1234');

        const saltear = await request('PATCH', `/pedidos/${pedidoId}/estado`, {
            token: empleado,
            body: { estado: 'Finalizado' }
        });
        const clienteCambiaEstado = await request('PATCH', `/pedidos/${pedidoId}/estado`, {
            token,
            body: { estado: 'Confirmado' }
        });
        assert.deepEqual([saltear.status, clienteCambiaEstado.status], [409, 403]);

        for (const estado of ['Confirmado', 'En preparación']) {
            const { status } = await request('PATCH', `/pedidos/${pedidoId}/estado`, {
                token: empleado,
                body: { estado }
            });
            assert.equal(status, 200);
        }

        const cancelar = await request('PATCH', `/pedidos/${pedidoId}/cancelar`, { token });
        assert.equal(cancelar.status, 409);

        for (const estado of ['Listo', 'En camino', 'Finalizado']) {
            const { body } = await request('PATCH', `/pedidos/${pedidoId}/estado`, {
                token: empleado,
                body: { estado }
            });
            assert.equal(body.data.estado, estado);
        }

        const final = await request('GET', `/pedidos/${pedidoId}`, { token });
        assert.equal(final.body.data.historial.length, 6);
    });

    test('el cliente puede cancelar un pedido Pendiente', async () => {
        const creado = await request('POST', '/pedidos', { token, body: pedido({ items: [{ productoId: 5, cantidad: 1 }] }) });
        const { status, body } = await request('PATCH', `/pedidos/${creado.body.data.id}/cancelar`, { token });
        assert.equal(status, 200);
        assert.equal(body.data.estado, 'Cancelado');
    });
});
