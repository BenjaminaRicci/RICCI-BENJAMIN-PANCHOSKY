import CategoriaRepository from '../repositories/CategoriaRepository.js';
import SucursalRepository from '../repositories/SucursalRepository.js';
import ProductoRepository from '../repositories/ProductoRepository.js';
import ComboRepository from '../repositories/ComboRepository.js';
import UsuarioRepository from '../repositories/UsuarioRepository.js';
import { Roles } from '../enums/Roles.js';
import { hashPassword } from '../utils/passwordHasher.js';

const CATEGORIAS = ['Panchos', 'Hamburguesas', 'Sandwiches', 'Empanadas', 'Medialunas', 'Bebidas'];

const SUCURSALES = [
    { nombre: 'Microcentro', direccion: 'Florida 520, CABA' },
    { nombre: 'Palermo', direccion: 'Av. Santa Fe 3450, CABA' },
    { nombre: 'Belgrano', direccion: 'Av. Cabildo 1820, CABA' },
    { nombre: 'Vicente López', direccion: 'Av. Maipú 1250, Vicente López' },
    { nombre: 'San Isidro', direccion: 'Belgrano 350, San Isidro' }
];

const foto = (id) => `https://images.unsplash.com/photo-${id}?w=600&h=450&fit=crop&auto=format`;

// [nombre, descripcion, precio, categoria, disponible, imagen]
const PRODUCTOS = [
    ['Pancho clásico', 'Salchicha, pan de viena y salsas a elección.', 1800, 'Panchos', true, foto('1599599810694-b5b37304c041')],
    ['Pancho completo', 'Con papas pay, lluvia de queso y salsas.', 2300, 'Panchos', true, foto('1612392062422-ef19b42f74df')],
    ['Pancho cheddar y panceta', 'Salchicha, cheddar fundido y panceta crocante.', 2900, 'Panchos', true, foto('1695089026763-0d984cbf7088')],
    ['Hamburguesa clásica', 'Carne, queso, lechuga, tomate y aderezo.', 4200, 'Hamburguesas', true, foto('1568901346375-23c9450c58cd')],
    ['Hamburguesa doble cheddar', 'Doble carne, doble cheddar y panceta.', 5800, 'Hamburguesas', true, foto('1651993841930-946a700c1524')],
    ['Hamburguesa veggie', 'Medallón de lentejas, rúcula y tomate.', 4500, 'Hamburguesas', false, foto('1550547660-d9450f859349')],
    ['Lomito completo', 'Lomo, jamón, queso, huevo, lechuga y tomate.', 6500, 'Sandwiches', true, foto('1481070555726-e2fe8357725c')],
    ['Milanesa completa', 'Milanesa de ternera con jamón, queso y huevo.', 5900, 'Sandwiches', true, foto('1528735602780-2552fd46c7af')],
    ['Empanada de carne', 'Carne cortada a cuchillo, horno de barro.', 900, 'Empanadas', true, foto('1624128082323-beb6b8b508db')],
    ['Empanada de jamón y queso', 'Clásica de jamón y muzzarella.', 850, 'Empanadas', true, foto('1601050690597-df0568f70950')],
    ['Empanada de humita', 'Choclo cremoso y cebolla de verdeo.', 850, 'Empanadas', true, foto('1609525313344-a56b96f20718')],
    ['Medialuna de manteca', 'Dulce, recién horneada.', 600, 'Medialunas', true, foto('1700915704616-b455b3679024')],
    ['Medialuna de grasa', 'Salada y crocante.', 550, 'Medialunas', true, foto('1693483640461-267d788b6148')],
    ['Gaseosa 500 ml', 'Cola, lima-limón o naranja.', 1500, 'Bebidas', true, foto('1554866585-cd94860890b7')],
    ['Agua mineral 500 ml', 'Con o sin gas.', 1000, 'Bebidas', true, foto('1548839140-29a749e1cf4d')],
    ['Jugo de naranja', 'Exprimido en el momento, 400 ml.', 1800, 'Bebidas', true, foto('1600271886742-f049cd451bba')]
];

const USUARIOS = [
    {
        nombre: 'Ana',
        apellido: 'Administradora',
        email: 'admin@panchosky.com',
        password: 'Admin1234',
        telefono: '1150000001',
        rol: Roles.ADMINISTRADOR
    },
    {
        nombre: 'Eli',
        apellido: 'Empleado',
        email: 'empleado@panchosky.com',
        password: 'Empleado1234',
        telefono: '1150000002',
        rol: Roles.EMPLEADO,
        sucursalId: 1
    },
    {
        nombre: 'Carla',
        apellido: 'Cliente',
        email: 'cliente@panchosky.com',
        password: 'Cliente1234',
        telefono: '1150000003',
        rol: Roles.CLIENTE
    }
];

// Datos de demostración: la persistencia es en memoria, por lo que se cargan en cada inicio.
export const cargarDatosIniciales = () => {
    CATEGORIAS.forEach((nombre) => CategoriaRepository.create({ nombre }));
    SUCURSALES.forEach((sucursal) => SucursalRepository.create(sucursal));

    PRODUCTOS.forEach(([nombre, descripcion, precio, categoria, disponible, imagen]) =>
        ProductoRepository.create({
            nombre,
            descripcion,
            precio,
            imagen,
            disponible,
            categoriaId: CategoriaRepository.findByNombre(categoria).id
        })
    );

    ComboRepository.create({
        nombre: 'Combo Pancho + Bebida',
        precioOriginal: 3300,
        precioPromocional: 2700,
        horaLimite: '22:00'
    });

    USUARIOS.forEach((usuario) =>
        UsuarioRepository.create({ ...usuario, password: hashPassword(usuario.password) })
    );
};
