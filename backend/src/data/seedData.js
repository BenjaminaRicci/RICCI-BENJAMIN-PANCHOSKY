// Datos iniciales para que la API no arranque vacía (persistencia en memoria).
const foto = (id) => `https://images.unsplash.com/photo-${id}?w=600&h=450&fit=crop&auto=format`;

export const categoriasIniciales = [
    { nombre: 'Panchos' },
    { nombre: 'Hamburguesas' },
    { nombre: 'Sandwiches' },
    { nombre: 'Empanadas' },
    { nombre: 'Medialunas' },
    { nombre: 'Bebidas' }
];

export const productosIniciales = [
    { nombre: 'Pancho Completo', descripcion: 'Salchicha, cheddar, panceta crocante, cebolla caramelizada.', precio: 3900, categoriaId: 1, destacado: true, imagen: foto('1612392062422-ef19b42f74df') },
    { nombre: 'Pancho Clásico', descripcion: 'Salchicha alemana, pan de viena, mostaza y ketchup.', precio: 2500, categoriaId: 1, imagen: foto('1599599810694-b5b37304c041') },
    { nombre: 'Pancho Napo', descripcion: 'Salchicha, salsa de tomate, jamón y mozzarella gratinada.', precio: 3600, categoriaId: 1, imagen: foto('1678033382919-fa907632fdda') },
    { nombre: 'Pancho Picante', descripcion: 'Salchicha, jalapeños, salsa picante y papas pay.', precio: 3400, categoriaId: 1, imagen: foto('1695089026763-0d984cbf7088') },
    { nombre: 'Hamburguesa Doble Cheddar', descripcion: 'Doble medallón de carne, doble cheddar y pepinillos.', precio: 5800, categoriaId: 2, destacado: true, imagen: foto('1651993841930-946a700c1524') },
    { nombre: 'Hamburguesa Clásica', descripcion: 'Medallón de carne, lechuga, tomate y mayonesa.', precio: 4500, categoriaId: 2, imagen: foto('1568901346375-23c9450c58cd') },
    { nombre: 'Hamburguesa Bacon', descripcion: 'Medallón de carne, panceta, cheddar y barbacoa.', precio: 5400, categoriaId: 2, imagen: foto('1550547660-d9450f859349') },
    { nombre: 'Sandwich de Milanesa', descripcion: 'Milanesa de carne, lechuga, tomate y huevo.', precio: 5200, categoriaId: 3, destacado: true, imagen: foto('1528735602780-2552fd46c7af') },
    { nombre: 'Sandwich de Bondiola', descripcion: 'Bondiola braseada, cebolla morada y salsa criolla.', precio: 5500, categoriaId: 3, imagen: foto('1481070555726-e2fe8357725c') },
    { nombre: 'Sandwich de Miga', descripcion: 'Jamón y queso, triple de pan de miga.', precio: 2200, categoriaId: 3 },
    { nombre: 'Empanada de Carne', descripcion: 'Carne cortada a cuchillo, huevo y aceitunas.', precio: 1200, categoriaId: 4, destacado: true, imagen: foto('1624128082323-beb6b8b508db') },
    { nombre: 'Empanada de Jamón y Queso', descripcion: 'Jamón cocido y mozzarella.', precio: 1100, categoriaId: 4, imagen: foto('1601050690597-df0568f70950') },
    { nombre: 'Empanada de Pollo', descripcion: 'Pollo, morrón y cebolla de verdeo.', precio: 1150, categoriaId: 4, imagen: foto('1609525313344-a56b96f20718') },
    { nombre: 'Medialuna de Manteca', descripcion: 'Clásica medialuna dulce de manteca.', precio: 700, categoriaId: 5, imagen: foto('1700915704616-b455b3679024') },
    { nombre: 'Medialuna de Grasa', descripcion: 'Medialuna salada, ideal para el mate.', precio: 650, categoriaId: 5, imagen: foto('1693483640461-267d788b6148') },
    { nombre: 'Medialuna Rellena', descripcion: 'Rellena de jamón y queso.', precio: 1300, categoriaId: 5, disponible: false, imagen: foto('1555507036-ab1f4038808a') },
    { nombre: 'Coca-Cola 500 ml', descripcion: 'Gaseosa bien fría.', precio: 1500, categoriaId: 6, imagen: foto('1554866585-cd94860890b7') },
    { nombre: 'Agua mineral 500 ml', descripcion: 'Con o sin gas.', precio: 1000, categoriaId: 6, imagen: foto('1548839140-29a749e1cf4d') },
    { nombre: 'Jugo de naranja', descripcion: 'Exprimido en el momento, 400 ml.', precio: 1800, categoriaId: 6, imagen: foto('1600271886742-f049cd451bba') }
];

// componentes: categorías de las que el cliente elige un producto (RN-08).
export const combosIniciales = [
    {
        nombre: 'Combo Pancho + Bebida',
        descripcion: 'Cualquier pancho del menú más bebida a elección.',
        precioPromocional: 3100,
        precioOriginal: 4200,
        horaLimite: '22:00',
        componentes: [1, 6],
        imagen: foto('1612392062422-ef19b42f74df')
    },
    {
        nombre: 'Combo Burger + Bebida',
        descripcion: 'Cualquier hamburguesa del menú más bebida a elección.',
        precioPromocional: 5900,
        precioOriginal: 7300,
        horaLimite: '23:30',
        componentes: [2, 6],
        imagen: foto('1651993841930-946a700c1524')
    }
];

export const sucursalesIniciales = [
    { nombre: 'Microcentro', direccion: 'Florida 520, CABA' },
    { nombre: 'Palermo', direccion: 'Av. Santa Fe 3450, CABA' },
    { nombre: 'Belgrano', direccion: 'Av. Cabildo 1820, CABA' },
    { nombre: 'Vicente López', direccion: 'Av. Maipú 1250, Vicente López' },
    { nombre: 'San Isidro', direccion: 'Belgrano 350, San Isidro' }
];

// Usuarios de prueba: las contraseñas se hashean al cargar el repositorio.
export const usuariosIniciales = [
    { nombre: 'Ana', apellido: 'Admin', email: 'admin@panchosky.com', password: 'Admin1234', telefono: '1140001000', rol: 'ADMINISTRADOR' },
    { nombre: 'Emilio', apellido: 'Empleado', email: 'empleado@panchosky.com', password: 'Empleado1234', telefono: '1140002000', rol: 'EMPLEADO', sucursalId: 1 },
    { nombre: 'Carla', apellido: 'Cliente', email: 'cliente@panchosky.com', password: 'Cliente1234', telefono: '1140003000', rol: 'CLIENTE' }
];
