// LocalDB.jsx
class LocalDB {
    constructor() {
        this.data = {
            // En LocalDB.jsx, actualiza categories:
            categories: [
                { id: 1, name: 'Cuerdas', icon: 'https://alquitones.s3.us-east-2.amazonaws.com/banjo.png', description: 'Instrumentos de cuerda' },
                { id: 2, name: 'Viento', icon: 'https://alquitones.s3.us-east-2.amazonaws.com/french-horn.png', description: 'Instrumentos de viento' },
                { id: 3, name: 'Percusión', icon: 'https://alquitones.s3.us-east-2.amazonaws.com/drum.png', description: 'Instrumentos de percusión' },
                { id: 4, name: 'Teclados', icon: 'https://alquitones.s3.us-east-2.amazonaws.com/piano-keys.png', description: 'Instrumentos de teclado' }
            ],
            users: [
                {
                    id: 1,
                    username: 'admin',
                    email: 'admin@alquitones.com',
                    password: 'admin123',
                    role: 'admin',
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: 2,
                    username: 'cliente1',
                    email: 'cliente@alquitones.com',
                    password: 'cliente123',
                    role: 'client',
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: 3,
                    username: 'mariaperez',
                    email: 'maria@ejemplo.com',
                    password: 'maria123',
                    role: 'client',
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: 4,
                    username: 'juangarcia',
                    email: 'juan@ejemplo.com',
                    password: 'juan123',
                    role: 'client',
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: 5,
                    username: 'carlosmendez',
                    email: 'carlos@ejemplo.com',
                    password: 'carlos123',
                    role: 'client',
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: 6,
                    username: 'luisafernandez',
                    email: 'luisa@ejemplo.com',
                    password: 'luisa123',
                    role: 'client',
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: 7,
                    username: 'pedroramirez',
                    email: 'pedro@ejemplo.com',
                    password: 'pedro123',
                    role: 'client',
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: 8,
                    username: 'sofiavega',
                    email: 'sofia@ejemplo.com', 
                    password: 'sofia123',
                    role: 'client',
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: 9,
                    username: 'davidmartinez',
                    email: 'david@ejemplo.com',
                    password: 'david123',
                    role: 'client',
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: 10,
                    username: 'anaromero',
                    email: 'ana@ejemplo.com',
                    password: 'ana123',
                    role: 'client',
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: 11,
                    username: 'josegonzalez',
                    email: 'jose@ejemplo.com',
                    password: 'jose123',
                    role: 'client',
                    createdAt: new Date().toISOString(),
                    isActive: false
                },
                {
                    id: 12,
                    username: 'laurarodriguez',
                    email: 'laura@ejemplo.com',
                    password: 'laura123',
                    role: 'client',
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: 13,
                    username: 'albertorivas',
                    email: 'alberto@ejemplo.com',
                    password: 'alberto123',
                    role: 'client',
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: 14,
                    username: 'martacortes',
                    email: 'marta@ejemplo.com',
                    password: 'marta123',
                    role: 'client',
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: 15,
                    username: 'felipeduran',
                    email: 'felipe@ejemplo.com',
                    password: 'felipe123',
                    role: 'client',
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: 16,
                    username: 'paolaherrera',
                    email: 'paola@ejemplo.com',
                    password: 'paola123',
                    role: 'client',
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: 17,
                    username: 'robertocastro',
                    email: 'roberto@ejemplo.com',
                    password: 'roberto123',
                    role: 'client',
                    createdAt: new Date().toISOString(),
                    isActive: false
                }
            ],

            // En el constructor de LocalDB, actualiza el array specifications:
            specifications: [
                { id: 1, label: 'Marca', description: 'Marca del instrumento', icon: 'fa-trademark' },
                { id: 2, label: 'Modelo', description: 'Modelo específico del instrumento', icon: 'fa-cube' },
                { id: 3, label: 'Material', description: 'Material principal del instrumento', icon: 'fa-tree' },
                { id: 4, label: 'Tipo', description: 'Tipo o clasificación del instrumento', icon: 'fa-shapes' },
                { id: 5, label: 'Características técnicas', description: 'Detalles técnicos específicos', icon: 'fa-cogs' },
                { id: 6, label: 'Accesorios', description: 'Elementos incluidos con el instrumento', icon: 'fa-plug' }
            ],
            products: [
                // CUERDAS (ID: 1)
                {
                    id: 1,
                    name: 'Guitarra Eléctrica Fender Stratocaster',
                    description: 'Guitarra eléctrica profesional con pastillas single-coil',
                    categoryId: 1,
                    pricePerDay: 45.00,
                    status: 'Disponible',
                    specifications: [
                        { spValue: 'Fender', specification: { id: 1 } },
                        { spValue: 'Stratocaster Player', specification: { id: 2 } },
                        { spValue: 'Aliso y Arce', specification: { id: 3 } },
                        { spValue: '3 Single-coil, 22 trastes Medium Jumbo', specification: { id: 5 } }
                    ],
                    images: [
                        'https://alquitones.s3.us-east-2.amazonaws.com/01.PNG',
                        'https://alquitones.s3.us-east-2.amazonaws.com/02.PNG',
                        'https://alquitones.s3.us-east-2.amazonaws.com/03.jpg',
                        'https://alquitones.s3.us-east-2.amazonaws.com/04.jpg',
                        'https://alquitones.s3.us-east-2.amazonaws.com/05.jpg',
                        'https://alquitones.s3.us-east-2.amazonaws.com/06.jpg'
                    ],
                    mainImage: 'https://alquitones.s3.us-east-2.amazonaws.com/05.jpg',
                    createdAt: new Date().toISOString(),
                    availability: [
                        { date: "2025-03-15", availableQuantity: 3 },
  { date: "2025-03-16", availableQuantity: 2 },
  { date: "2025-03-17", availableQuantity: 5 },
  { date: "2025-03-18", availableQuantity: 4 },
  { date: "2025-03-19", availableQuantity: 3 },
  { date: "2025-03-20", availableQuantity: 2 },
  { date: "2025-03-21", availableQuantity: 1 },
  { date: "2025-03-27", availableQuantity: 2 },
  { date: "2025-03-28", availableQuantity: 3 },
  { date: "2025-03-29", availableQuantity: 4 },
  { date: "2025-03-30", availableQuantity: 2 },
  { date: "2025-04-05", availableQuantity: 1 },
  { date: "2025-04-06", availableQuantity: 1 },
  { date: "2025-04-12", availableQuantity: 2 },
  { date: "2025-04-13", availableQuantity: 3 }
                      ]
                },
                {
                    id: 2,
                    name: 'Violín Stradivarius (Réplica)',
                    description: 'Violín 4/4 de alta calidad con acabado antiguo',
                    categoryId: 1,
                    pricePerDay: 50.00,
                    status: 'Disponible',
                    specifications: [
                        { spValue: 'Réplica Stradivarius', specification: { id: 4 } },
                        { spValue: '4/4', specification: { id: 5 } },
                        { spValue: 'Abeto macizo y Arce flameado', specification: { id: 3 } },
                        { spValue: 'Estuche y resina, Arco de Madera de Brasil', specification: { id: 6 } }
                    ],
                    images: [

                        'https://alquitones.s3.us-east-2.amazonaws.com/1.webp',

                        'https://alquitones.s3.us-east-2.amazonaws.com/2.PNG',

                        'https://alquitones.s3.us-east-2.amazonaws.com/3.PNG',

                        'https://alquitones.s3.us-east-2.amazonaws.com/4.PNG',

                        'https://alquitones.s3.us-east-2.amazonaws.com/5.PNG',
                        'https://alquitones.s3.us-east-2.amazonaws.com/6.jpg'

                    ],
                    mainImage: 'https://alquitones.s3.us-east-2.amazonaws.com/3.PNG',
                    createdAt: new Date().toISOString(),
                    availability: [
                        { date: "2025-03-18", availableQuantity: 2 },
                        { date: "2025-03-19", availableQuantity: 2 },
                        { date: "2025-03-20", availableQuantity: 2 },
                        { date: "2025-03-21", availableQuantity: 2 },
                        { date: "2025-03-22", availableQuantity: 2 },
                        { date: "2025-04-01", availableQuantity: 3 },
                        { date: "2025-04-02", availableQuantity: 3 },
                        { date: "2025-04-03", availableQuantity: 3 },
                        { date: "2025-04-04", availableQuantity: 3 },
                        { date: "2025-04-05", availableQuantity: 3 },
                        { date: "2025-04-15", availableQuantity: 1 },
                        { date: "2025-04-16", availableQuantity: 1 },
                        { date: "2025-04-17", availableQuantity: 1 },
                        { date: "2025-05-01", availableQuantity: 4 },
                        { date: "2025-05-02", availableQuantity: 4 },
                        { date: "2025-05-03", availableQuantity: 4 }
                      ]
                },
                {
                    id: 3,
                    name: 'Bajo Eléctrico Music Man StingRay',
                    description: 'Bajo eléctrico profesional activo de 4 cuerdas',
                    categoryId: 1,
                    pricePerDay: 55.00,
                    status: 'Disponible',
                    specifications: [
                        { spValue: 'Music Man', specification: { id: 1 } },
                        { spValue: 'StingRay', specification: { id: 2 } },
                        { spValue: 'Fresno y Arce tostado', specification: { id: 3 } },
                        { spValue: 'Humbucker, Electrónica Activa 3 bandas', specification: { id: 5 } }
                    ],
                    images: [

                        'https://alquitones.s3.us-east-2.amazonaws.com/10.PNG',

                        'https://alquitones.s3.us-east-2.amazonaws.com/11.PNG',

                        'https://alquitones.s3.us-east-2.amazonaws.com/12.PNG',

                        'https://alquitones.s3.us-east-2.amazonaws.com/13.PNG',

                        'https://alquitones.s3.us-east-2.amazonaws.com/14.PNG',
                        'https://alquitones.s3.us-east-2.amazonaws.com/15.jpg'

                    ],
                    mainImage: 'https://alquitones.s3.us-east-2.amazonaws.com/11.PNG',
                    createdAt: new Date().toISOString(),
                    availability: [
                        { date: "2025-03-15", availableQuantity: 1 },
                        { date: "2025-03-17", availableQuantity: 1 },
                        { date: "2025-03-19", availableQuantity: 1 },
                        { date: "2025-03-21", availableQuantity: 1 },
                        { date: "2025-03-23", availableQuantity: 1 },
                        { date: "2025-04-02", availableQuantity: 2 },
                        { date: "2025-04-04", availableQuantity: 2 },
                        { date: "2025-04-06", availableQuantity: 2 },
                        { date: "2025-04-08", availableQuantity: 2 },
                        { date: "2025-04-10", availableQuantity: 2 },
                        { date: "2025-05-03", availableQuantity: 3 },
                        { date: "2025-05-05", availableQuantity: 3 },
                        { date: "2025-05-07", availableQuantity: 3 },
                        { date: "2025-05-09", availableQuantity: 3 },
                        { date: "2025-05-11", availableQuantity: 3 }
                      ]
                },

                // VIENTO (ID: 2)
                {
                    id: 4,
                    name: 'Saxofón Alto Selmer Series III',
                    description: 'Saxofón alto profesional chapado en oro',
                    categoryId: 2,
                    pricePerDay: 65.00,
                    status: 'Disponible',
                    specifications: [
                        { spValue: 'Selmer Paris', specification: { id: 1 } },
                        { spValue: 'Series III', specification: { id: 2 } },
                        { spValue: 'Latón chapado en oro', specification: { id: 3 } },
                        { spValue: 'Boquilla S80 C*, Estuche premium', specification: { id: 6 } }
                    ],
                    images: [

                        'https://alquitones.s3.us-east-2.amazonaws.com/20.PNG',

                        'https://alquitones.s3.us-east-2.amazonaws.com/21.PNG',

                        'https://alquitones.s3.us-east-2.amazonaws.com/22.PNG',

                        'https://alquitones.s3.us-east-2.amazonaws.com/23.PNG',

                        'https://alquitones.s3.us-east-2.amazonaws.com/24.PNG',
                        'https://alquitones.s3.us-east-2.amazonaws.com/25.webp'

                    ],
                    mainImage: 'https://alquitones.s3.us-east-2.amazonaws.com/24.PNG',
                    createdAt: new Date().toISOString(),
                    availability: [
                        { date: "2025-03-25", availableQuantity: 1 },
  { date: "2025-03-26", availableQuantity: 1 },
  { date: "2025-03-27", availableQuantity: 1 },
  { date: "2025-04-05", availableQuantity: 5 },
  { date: "2025-04-06", availableQuantity: 5 },
  { date: "2025-04-07", availableQuantity: 5 },
  { date: "2025-04-08", availableQuantity: 5 },
  { date: "2025-04-09", availableQuantity: 5 },
  { date: "2025-04-15", availableQuantity: 4 },
  { date: "2025-04-16", availableQuantity: 4 },
  { date: "2025-04-17", availableQuantity: 4 },
  { date: "2025-04-18", availableQuantity: 4 },
  { date: "2025-05-10", availableQuantity: 2 },
  { date: "2025-05-11", availableQuantity: 2 },
  { date: "2025-05-12", availableQuantity: 2 }
                      ]
                },
                {
                    id: 5,
                    name: 'Clarinete Buffet R13',
                    description: 'Clarinete profesional en Si♭',
                    categoryId: 2,
                    pricePerDay: 45.00,
                    status: 'Disponible',
                    specifications: [
                        { spValue: 'Buffet Crampon', specification: { id: 1 } },
                        { spValue: 'R13', specification: { id: 2 } },
                        { spValue: 'Granadilla', specification: { id: 3 } },
                        { spValue: 'Sistema Boehm, Llaves plateadas, Barril 66mm', specification: { id: 5 } }
                    ],
                    images: [

                        'https://alquitones.s3.us-east-2.amazonaws.com/30.webp',

                        'https://alquitones.s3.us-east-2.amazonaws.com/31.jpg',

                        'https://alquitones.s3.us-east-2.amazonaws.com/32.PNG',

                        'https://alquitones.s3.us-east-2.amazonaws.com/33.PNG',

                        'https://alquitones.s3.us-east-2.amazonaws.com/34.PNG',
                        'https://alquitones.s3.us-east-2.amazonaws.com/35.jpg'

                    ],
                    mainImage: 'https://alquitones.s3.us-east-2.amazonaws.com/32.PNG',
                    createdAt: new Date().toISOString(),
                    availability: [
                        { date: "2025-03-20", availableQuantity: 2 },
  { date: "2025-03-21", availableQuantity: 2 },
  { date: "2025-03-22", availableQuantity: 2 },
  { date: "2025-04-01", availableQuantity: 3 },
  { date: "2025-04-02", availableQuantity: 3 },
  { date: "2025-04-03", availableQuantity: 3 },
  { date: "2025-04-10", availableQuantity: 4 },
  { date: "2025-04-11", availableQuantity: 4 },
  { date: "2025-04-12", availableQuantity: 4 },
  { date: "2025-04-20", availableQuantity: 2 },
  { date: "2025-04-21", availableQuantity: 2 },
  { date: "2025-04-22", availableQuantity: 2 },
  { date: "2025-05-05", availableQuantity: 1 },
  { date: "2025-05-06", availableQuantity: 1 },
  { date: "2025-05-07", availableQuantity: 1 }
                      ]
                },
                {
                    id: 6,
                    name: 'Trompeta Bach Stradivarius 180S',
                    description: 'Trompeta profesional en Si♭ plateada',
                    categoryId: 2,
                    pricePerDay: 50.00,
                    status: 'Disponible',
                    specifications: [
                        { spValue: 'Bach', specification: { id: 1 } },
                        { spValue: 'Stradivarius 180S', specification: { id: 2 } },
                        { spValue: 'Latón dorado con acabado plateado', specification: { id: 3 } },
                        { spValue: 'Campana 4.8", Boquilla Bach 3C', specification: { id: 5 } }
                    ],
                    images: [

                        'https://alquitones.s3.us-east-2.amazonaws.com/40.jpg',

                        'https://alquitones.s3.us-east-2.amazonaws.com/41.webp',

                        'https://alquitones.s3.us-east-2.amazonaws.com/42.PNG',

                        'https://alquitones.s3.us-east-2.amazonaws.com/43.PNG',

                        'https://alquitones.s3.us-east-2.amazonaws.com/44.PNG',
                        'https://alquitones.s3.us-east-2.amazonaws.com/45.webp'

                    ],
                    mainImage: 'https://alquitones.s3.us-east-2.amazonaws.com/41.webp',
                    createdAt: new Date().toISOString(),
                    availability: [
                        { date: "2025-03-15", availableQuantity: 1 },
  { date: "2025-03-16", availableQuantity: 1 },
  { date: "2025-03-17", availableQuantity: 1 },
  { date: "2025-03-18", availableQuantity: 1 },
  { date: "2025-03-19", availableQuantity: 1 },
  { date: "2025-04-10", availableQuantity: 1 },
  { date: "2025-04-11", availableQuantity: 1 },
  { date: "2025-04-12", availableQuantity: 1 },
  { date: "2025-04-13", availableQuantity: 1 },
  { date: "2025-04-14", availableQuantity: 1 },
  { date: "2025-05-01", availableQuantity: 1 },
  { date: "2025-05-02", availableQuantity: 1 },
  { date: "2025-05-03", availableQuantity: 1 },
  { date: "2025-05-04", availableQuantity: 1 },
  { date: "2025-05-05", availableQuantity: 1 }
                      ]
                },

                // PERCUSIÓN (ID: 3)
                {
                    id: 7,
                    name: 'Batería DW Collectors Series',
                    description: 'Batería profesional de arce personalizada',
                    categoryId: 3,
                    pricePerDay: 75.00,
                    status: 'Disponible',
                    specifications: [
                        { spValue: 'DW Drums', specification: { id: 1 } },
                        { spValue: 'Collectors', specification: { id: 2 } },
                        { spValue: 'Arce', specification: { id: 3 } },
                        { spValue: '6 cuerpos, Herrajes DW 9000', specification: { id: 5 } },
                        { spValue: 'Platillos no incluidos', specification: { id: 6 } }
                    ],
                    images: [

                        'https://alquitones.s3.us-east-2.amazonaws.com/50.PNG',

                        'https://alquitones.s3.us-east-2.amazonaws.com/51.jpg',

                        'https://alquitones.s3.us-east-2.amazonaws.com/52.PNG',

                        'https://alquitones.s3.us-east-2.amazonaws.com/53.PNG',

                        'https://alquitones.s3.us-east-2.amazonaws.com/54.jpg',
                        'https://alquitones.s3.us-east-2.amazonaws.com/55.webp'

                    ],
                    mainImage: 'https://alquitones.s3.us-east-2.amazonaws.com/50.PNG',
                    createdAt: new Date().toISOString(),
                    availability: [
                        { date: "2025-03-22", availableQuantity: 6 },
  { date: "2025-03-23", availableQuantity: 6 },
  { date: "2025-03-29", availableQuantity: 6 },
  { date: "2025-03-30", availableQuantity: 6 },
  { date: "2025-04-05", availableQuantity: 5 },
  { date: "2025-04-06", availableQuantity: 5 },
  { date: "2025-04-12", availableQuantity: 5 },
  { date: "2025-04-13", availableQuantity: 5 },
  { date: "2025-04-19", availableQuantity: 5 },
  { date: "2025-04-20", availableQuantity: 5 },
  { date: "2025-05-03", availableQuantity: 4 },
  { date: "2025-05-04", availableQuantity: 4 },
  { date: "2025-05-10", availableQuantity: 4 },
  { date: "2025-05-11", availableQuantity: 4 },
  { date: "2025-05-17", availableQuantity: 4 },
  { date: "2025-05-18", availableQuantity: 4 }
                      ]
                },
                {
                    id: 8,
                    name: 'Congas LP Galaxy Giovanni',
                    description: 'Set de congas profesionales de fibra de vidrio',
                    categoryId: 3,
                    pricePerDay: 45.00,
                    status: 'Disponible',
                    specifications: [
                        { spValue: 'Latin Percussion', specification: { id: 1 } },
                        { spValue: 'Galaxy Giovanni', specification: { id: 2 } },
                        { spValue: 'Fibra de vidrio', specification: { id: 3 } },
                        { spValue: 'Tamaños 11" y 12", Acabado Gold Sparkle', specification: { id: 5 } },
                        { spValue: 'Parches LP Galaxy', specification: { id: 6 } }
                    ],
                    images: [

                        'https://alquitones.s3.us-east-2.amazonaws.com/60.webp',

                        'https://alquitones.s3.us-east-2.amazonaws.com/61.jpg',

                        'https://alquitones.s3.us-east-2.amazonaws.com/62.jpg',

                        'https://alquitones.s3.us-east-2.amazonaws.com/63.jpg',

                        'https://alquitones.s3.us-east-2.amazonaws.com/64.jpg',
                        'https://alquitones.s3.us-east-2.amazonaws.com/65.jpg'

                    ],
                    mainImage: 'https://alquitones.s3.us-east-2.amazonaws.com/61.jpg',
                    createdAt: new Date().toISOString(),
                    availability: [
                        { date: "2025-03-18", availableQuantity: 2 },
  { date: "2025-03-19", availableQuantity: 3 },
  { date: "2025-03-20", availableQuantity: 4 },
  { date: "2025-03-21", availableQuantity: 3 },
  { date: "2025-03-22", availableQuantity: 2 },
  { date: "2025-04-08", availableQuantity: 1 },
  { date: "2025-04-09", availableQuantity: 2 },
  { date: "2025-04-10", availableQuantity: 3 },
  { date: "2025-04-11", availableQuantity: 2 },
  { date: "2025-04-12", availableQuantity: 1 },
  { date: "2025-05-05", availableQuantity: 5 },
  { date: "2025-05-06", availableQuantity: 4 },
  { date: "2025-05-07", availableQuantity: 3 },
  { date: "2025-05-08", availableQuantity: 2 },
  { date: "2025-05-09", availableQuantity: 1 }
                      ]
                },
                {
                    id: 9,
                    name: 'Set de Platillos Zildjian K Custom',
                    description: 'Set profesional de platillos dark',
                    categoryId: 3,
                    pricePerDay: 55.00,
                    status: 'Disponible',
                    specifications: [
                        { spValue: 'Zildjian', specification: { id: 1 } },
                        { spValue: 'K Custom Dark', specification: { id: 2 } },
                        { spValue: 'B20 Bronze', specification: { id: 3 } },
                        { spValue: 'Hi-hat 14", Crash 16" y 18", Ride 20"', specification: { id: 5 } }
                    ],
                    images: [

                        'https://alquitones.s3.us-east-2.amazonaws.com/70.webp',

                        'https://alquitones.s3.us-east-2.amazonaws.com/71.webp',

                        'https://alquitones.s3.us-east-2.amazonaws.com/72.jpg',

                        'https://alquitones.s3.us-east-2.amazonaws.com/73.webp',

                        'https://alquitones.s3.us-east-2.amazonaws.com/74.jpg',
                        'https://alquitones.s3.us-east-2.amazonaws.com/75.webp'

                    ],
                    mainImage: 'https://alquitones.s3.us-east-2.amazonaws.com/73.webp',
                    createdAt: new Date().toISOString(),
                    availability: [
                        { date: "2025-03-12", availableQuantity: 3 },
                        { date: "2025-03-13", availableQuantity: 3 },
                        { date: "2025-03-14", availableQuantity: 3 },
                        { date: "2025-03-15", availableQuantity: 3 },
                        { date: "2025-03-16", availableQuantity: 3 },
                        { date: "2025-04-10", availableQuantity: 2 },
                        { date: "2025-04-11", availableQuantity: 2 },
                        { date: "2025-04-12", availableQuantity: 2 },
                        { date: "2025-04-13", availableQuantity: 2 },
                        { date: "2025-04-14", availableQuantity: 2 },
                        { date: "2025-05-15", availableQuantity: 4 },
                        { date: "2025-05-16", availableQuantity: 4 },
                        { date: "2025-05-17", availableQuantity: 4 },
                        { date: "2025-05-18", availableQuantity: 4 },
                        { date: "2025-05-19", availableQuantity: 4 }
                      ]
                },

                // TECLADOS (ID: 4)
                {
                    id: 10,
                    name: 'Piano de Cola Steinway & Sons D-274',
                    description: 'Piano de cola de concierto profesional',
                    categoryId: 4,
                    pricePerDay: 150.00,
                    status: 'Disponible',
                    specifications: [
                        { spValue: 'Steinway & Sons', specification: { id: 1 } },
                        { spValue: 'D-274', specification: { id: 2 } },
                        { spValue: 'Madera con acabado negro pulido', specification: { id: 3 } },
                        { spValue: 'Longitud 274 cm, 88 teclas de marfil sintético', specification: { id: 5 } },
                        { spValue: '3 pedales tradicionales', specification: { id: 6 } }
                    ],
                    images: [

                        'https://alquitones.s3.us-east-2.amazonaws.com/80.png',

                        'https://alquitones.s3.us-east-2.amazonaws.com/81.jpg',

                        'https://alquitones.s3.us-east-2.amazonaws.com/82.jpg',

                        'https://alquitones.s3.us-east-2.amazonaws.com/83.PNG',

                        'https://alquitones.s3.us-east-2.amazonaws.com/84.webp',
                        'https://alquitones.s3.us-east-2.amazonaws.com/85.jpg'

                    ],
                    mainImage: 'https://alquitones.s3.us-east-2.amazonaws.com/81.jpg',
                    createdAt: new Date().toISOString(),
                    availability: [
                        { date: "2025-03-10", availableQuantity: 2 },
                        { date: "2025-03-11", availableQuantity: 2 },
                        { date: "2025-03-12", availableQuantity: 2 },
                        { date: "2025-03-13", availableQuantity: 2 },
                        { date: "2025-04-07", availableQuantity: 3 },
                        { date: "2025-04-08", availableQuantity: 3 },
                        { date: "2025-04-09", availableQuantity: 3 },
                        { date: "2025-04-10", availableQuantity: 3 },
                        { date: "2025-05-05", availableQuantity: 1 },
                        { date: "2025-05-06", availableQuantity: 1 },
                        { date: "2025-05-07", availableQuantity: 1 },
                        { date: "2025-05-08", availableQuantity: 1 },
                        { date: "2025-05-25", availableQuantity: 4 },
                        { date: "2025-05-26", availableQuantity: 4 },
                        { date: "2025-05-27", availableQuantity: 4 },
                        { date: "2025-05-28", availableQuantity: 4 }
                      ]
                },
                {
                    id: 11,
                    name: 'Sintetizador Moog One',
                    description: 'Sintetizador analógico polifónico de 16 voces',
                    categoryId: 4,
                    pricePerDay: 85.00,
                    status: 'Disponible',
                    specifications: [
                        { spValue: 'Moog', specification: { id: 1 } },
                        { spValue: 'One', specification: { id: 2 } },
                        { spValue: 'Metal y plástico de alta resistencia', specification: { id: 3 } },
                        { spValue: '16 voces polifónicas, 3 osciladores por voz', specification: { id: 5 } },
                        { spValue: 'Teclado de 61 teclas, 64 bancos de memoria', specification: { id: 6 } }
                    ],
                    images: [

                        'https://alquitones.s3.us-east-2.amazonaws.com/90.jpg',

                        'https://alquitones.s3.us-east-2.amazonaws.com/91.jpg',

                        'https://alquitones.s3.us-east-2.amazonaws.com/92.jpg',

                        'https://alquitones.s3.us-east-2.amazonaws.com/93.jpg',

                        'https://alquitones.s3.us-east-2.amazonaws.com/94.jpg',
                        'https://alquitones.s3.us-east-2.amazonaws.com/95.jpg'

                    ],
                    mainImage: 'https://alquitones.s3.us-east-2.amazonaws.com/93.jpg',
                    createdAt: new Date().toISOString(),
                    availability: [
                        { date: "2025-03-05", availableQuantity: 1 },
                        { date: "2025-03-06", availableQuantity: 1 },
                        { date: "2025-03-07", availableQuantity: 1 },
                        { date: "2025-03-08", availableQuantity: 1 },
                        { date: "2025-03-09", availableQuantity: 1 },
                        { date: "2025-04-15", availableQuantity: 2 },
                        { date: "2025-04-16", availableQuantity: 2 },
                        { date: "2025-04-17", availableQuantity: 2 },
                        { date: "2025-04-18", availableQuantity: 2 },
                        { date: "2025-04-19", availableQuantity: 2 },
                        { date: "2025-05-10", availableQuantity: 3 },
                        { date: "2025-05-11", availableQuantity: 3 },
                        { date: "2025-05-12", availableQuantity: 3 },
                        { date: "2025-05-13", availableQuantity: 3 },
                        { date: "2025-05-14", availableQuantity: 3 }
                      ]
                },
                {
                    id: 12,
                    name: 'Nord Stage 3 88',
                    description: 'Piano de escenario profesional con sintetizador',
                    categoryId: 4,
                    pricePerDay: 70.00,
                    status: 'Disponible',
                    specifications: [
                        { spValue: 'Nord', specification: { id: 1 } },
                        { spValue: 'Stage 3', specification: { id: 2 } },
                        { spValue: 'Plástico de alta resistencia y metal', specification: { id: 3 } },
                        { spValue: '88 teclas contrapesadas, Memoria 2GB piano', specification: { id: 5 } },
                        { spValue: 'Secciones Piano/Synth/Organ, Múltiples efectos', specification: { id: 6 } }
                    ],
                    images: [
                        'https://alquitones.s3.us-east-2.amazonaws.com/110.jpg',
                        'https://alquitones.s3.us-east-2.amazonaws.com/111.webp',
                        'https://alquitones.s3.us-east-2.amazonaws.com/112.jpg',
                        'https://alquitones.s3.us-east-2.amazonaws.com/113.jpg',
                        'https://alquitones.s3.us-east-2.amazonaws.com/114.jpg',
                        'https://alquitones.s3.us-east-2.amazonaws.com/115.jpg'
                    ],
                    mainImage: 'https://alquitones.s3.us-east-2.amazonaws.com/114.jpg',
                    createdAt: new Date().toISOString(),
                    availability: [
                        { date: "2025-03-08", availableQuantity: 7 },
                        { date: "2025-03-15", availableQuantity: 7 },
                        { date: "2025-03-22", availableQuantity: 7 },
                        { date: "2025-03-29", availableQuantity: 7 },
                        { date: "2025-04-05", availableQuantity: 6 },
                        { date: "2025-04-12", availableQuantity: 6 },
                        { date: "2025-04-19", availableQuantity: 6 },
                        { date: "2025-04-26", availableQuantity: 6 },
                        { date: "2025-05-03", availableQuantity: 5 },
                        { date: "2025-05-10", availableQuantity: 5 },
                        { date: "2025-05-17", availableQuantity: 5 },
                        { date: "2025-05-24", availableQuantity: 5 },
                        { date: "2025-05-31", availableQuantity: 5 }
                      ]
                }
            ]
        };

        // Forzar actualización de datos
        
        this.initializeStorage();
    }

    // Inicialización
    initializeStorage() {
        // Verificar si existe data en localStorage
        if (!localStorage.getItem('alquitonesDB')) {
            // Si no existe, inicializar con los datos por defecto
            localStorage.setItem('alquitonesDB', JSON.stringify(this.data));
        } else {
            // Si ya existe, cargar los datos del localStorage
            this.data = JSON.parse(localStorage.getItem('alquitonesDB'));
        }
        
        // También asegurarse de que el currentUser esté disponible
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            // Verificar que el usuario exista en la base de datos actualizada
            const userData = JSON.parse(currentUser);
            const userExists = this.data.users.some(u => u.id === userData.id);
            
            // Si el usuario ya no existe, limpiar la sesión
            if (!userExists) {
                localStorage.removeItem('currentUser');
            }
        }
    }

    // Métodos de persistencia
    saveToStorage() {
        localStorage.setItem('alquitonesDB', JSON.stringify(this.data));
    }


    // Añadir estos métodos en LocalDB.jsx, dentro de la clase LocalDB

    getAllCategories() {
        return this.data.categories;
    }

    getCategoryById(id) {
        return this.data.categories.find(category => category.id === id);
    }

    createCategory(categoryData) {
        // Validar que el nombre no esté vacío
        if (!categoryData.name || categoryData.name.trim() === '') {
            throw new Error('El nombre de la categoría no puede estar vacío');
        }

        // Validar que no exista una categoría con el mismo nombre
        const existingCategory = this.data.categories.find(
            cat => cat.name.toLowerCase() === categoryData.name.toLowerCase()
        );
        if (existingCategory) {
            throw new Error('Ya existe una categoría con este nombre');
        }

        const newCategory = {
            id: this.data.categories.length + 1,
            ...categoryData,
            icon: categoryData.icon || '/src/assets/icons/default-category.png',
            isActive: true
        };

        this.data.categories.push(newCategory);
        this.saveToStorage();
        return newCategory;
    }

    updateCategory(id, categoryData) {
        const index = this.data.categories.findIndex(category => category.id === id);
        if (index === -1) throw new Error('Categoría no encontrada');

        // Validar nombre único
        const existingCategory = this.data.categories.find(
            cat => cat.name.toLowerCase() === categoryData.name.toLowerCase() && cat.id !== id
        );
        if (existingCategory) {
            throw new Error('Ya existe una categoría con este nombre');
        }

        this.data.categories[index] = {
            ...this.data.categories[index],
            ...categoryData
        };

        this.saveToStorage();
        return this.data.categories[index];
    }

    deleteCategory(id) {
        // Verificar si hay productos con esta categoría
        const productsInCategory = this.getProductsByCategory(id);
        if (productsInCategory.length > 0) {
            throw new Error('No se puede eliminar una categoría con productos asociados');
        }

        const index = this.data.categories.findIndex(category => category.id === id);
        if (index === -1) throw new Error('Categoría no encontrada');

        this.data.categories.splice(index, 1);
        this.saveToStorage();
        return true;
    }

    // CRUD Usuarios
    getAllUsers() {
        return this.data.users;
    }

    getUserById(id) {
        return this.data.users.find(user => user.id === id);
    }

    getUserByEmail(email) {
        return this.data.users.find(user => user.email === email);
    }

    createUser(userData) {
        // Validar si el email ya existe
        if (this.getUserByEmail(userData.email)) {
            throw new Error('El email ya está registrado');
        }
    
        // Verificar que los campos requeridos estén presentes
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
            throw new Error('Todos los campos son obligatorios');
        }
    
        const newUser = {
            id: this.data.users.length + 1,
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username || `${userData.firstName} ${userData.lastName}`,
            email: userData.email,
            password: userData.password,
            role: userData.role || 'client',
            createdAt: new Date().toISOString(),
            isActive: true,
            // Eliminar el campo emailVerified
            // emailVerified: userData.emailVerified || false
        };
    
        this.data.users.push(newUser);
        this.saveToStorage();
        return newUser;
    }

    updateUser(id, userData) {
        const index = this.data.users.findIndex(user => user.id === id);
        if (index === -1) throw new Error('Usuario no encontrado');
    
        this.data.users[index] = {
            ...this.data.users[index],
            ...userData
        };
    
        this.saveToStorage();
        return this.data.users[index];
    }

    deleteUser(id) {
        const index = this.data.users.findIndex(user => user.id === id);
        if (index === -1) throw new Error('Usuario no encontrado');

        this.data.users.splice(index, 1);
        this.saveToStorage();
        return true;
    }

    // CRUD Productos
    getAllProducts() {
        return this.data.products;
    }

    // Agregar este método a la clase LocalDB justo después de getAllProducts()

    getProductsPaginated(page = 1, size = 10, searchQuery = '', paginate = true) {
        try {
            let products = this.data.products;
            
            // Aplicar filtro de búsqueda primero
            if (searchQuery) {
                const lowerQuery = searchQuery.toLowerCase();
                products = products.filter(product => 
                    product.name.toLowerCase().includes(lowerQuery) ||
                    product.description.toLowerCase().includes(lowerQuery)
                );
            }
    
            if (!paginate) { // Si no se requiere paginación
                return {
                    products: products,
                    metadata: {
                        totalProducts: products.length
                    }
                };
            }
    
            const totalProducts = products.length;
            const totalPages = Math.ceil(totalProducts / size);
            
            page = Math.max(1, Math.min(page, totalPages));
            
            const startIndex = (page - 1) * size;
            const endIndex = startIndex + size;
            
            return {
                products: products.slice(startIndex, endIndex),
                metadata: {
                    currentPage: page,
                    pageSize: size,
                    totalPages: totalPages,
                    totalProducts: totalProducts,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            };
        } catch (error) {
            console.error('Error en paginación:', error);
            throw new Error('Error al paginar productos');
        }
    }

    getProductById(id) {
        console.log(this.data.products);
        
        return this.data.products.find(product => product.id === id);
    }

    createProduct(productData) {
        // Modificar validación para permitir 1-5 imágenes
        if (!productData.images || productData.images.length < 1 || productData.images.length > 6) {
          throw new Error('El producto debe tener entre 1 y 6 imágenes');
        }
      
        const newProduct = {
          id: this.data.products.length + 1,
          ...productData,
          mainImage: productData.images[0], // Usar primera imagen como principal
          createdAt: new Date().toISOString()
        };
      
        this.data.products.push(newProduct);
        this.saveToStorage();
        return newProduct;
      }

    updateProduct(id, productData) {
        const index = this.data.products.findIndex(product => product.id === id);
        if (index === -1) throw new Error('Producto no encontrado');

        // Manejar las especificaciones del producto
        if (productData.specifications) {
            // Validar que cada especificación exista
            productData.specifications.forEach(spec => {
                if (!this.getSpecificationById(spec.specification.id)) {
                    throw new Error(`La característica con ID ${spec.specification.id} no existe`);
                }
            });
        }

        this.data.products[index] = {
            ...this.data.products[index],
            ...productData
        };

        this.saveToStorage();
        return this.data.products[index];
    }

    deleteProduct(id) {
        const index = this.data.products.findIndex(product => product.id === id);
        if (index === -1) throw new Error('Producto no encontrado');

        this.data.products.splice(index, 1);
        this.saveToStorage();
        return true;
    }

    // Métodos de búsqueda y filtrado
    searchProducts(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.data.products.filter(product =>
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.description.toLowerCase().includes(lowercaseQuery)
        );
    }

    getProductsByCategory(categoryId) {
        return this.data.products.filter(product =>
            product.categoryId === categoryId
        );
    }


    // Métodos de utilidad
    getProductStats() {
        return {
            total: this.data.products.length,
            byCategory: this.data.products.reduce((acc, product) => {
                acc[product.categoryId] = (acc[product.categoryId] || 0) + 1;
                return acc;
            }, {})
        };
    }


    getUserStats() {
        return {
            total: this.data.users.length,
            admins: this.data.users.filter(user => user.role === 'admin').length,
            clients: this.data.users.filter(user => user.role === 'client').length
        };
    }

    login(email, password) {
        const user = this.getUserByEmail(email);
        if (!user || user.password !== password) {
            throw new Error('Credenciales inválidas');
        }
        if (!user.isActive) {
            throw new Error('Cuenta desactivada');
        }
        
        // Eliminar solo la verificación de correo electrónico
        // if (user.role !== 'admin' && !user.emailVerified) {
        //     const confirmedInStorage = localStorage.getItem(`email_confirmed_${email}`) === 'true';
        //     if (confirmedInStorage) {
        //         user.emailVerified = true;
        //         this.updateUser(user.id, { emailVerified: true });
        //     } else {
        //         throw new Error('Por favor confirma tu cuenta de correo electrónico antes de iniciar sesión');
        //     }
        // }
        
        // Almacenar sesión en localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }

    logout() {
        localStorage.removeItem('currentUser');
        return true;
    }

    getCurrentUser() {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            return null;
        }
        
        try {
            const userData = JSON.parse(currentUser);
            
            // Verificar que el usuario sigue existiendo en la base de datos
            const userExists = this.data.users.some(u => u.id === userData.id);
            if (!userExists) {
                console.warn('Usuario en sesión no encontrado en la base de datos');
                localStorage.removeItem('currentUser');
                return null;
            }
            
            // Actualizar los datos del usuario desde la base de datos
            const updatedUser = this.getUserById(userData.id);
            if (updatedUser) {
                // Si el rol ha cambiado, actualizar en la sesión
                if (updatedUser.role !== userData.role) {
                    userData.role = updatedUser.role;
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                }
            }
            
            return userData;
        } catch (e) {
            console.error('Error al obtener el usuario actual:', e);
            localStorage.removeItem('currentUser');
            return null;
        }
    }

    isAdmin() {
        const user = this.getCurrentUser();
        return user?.role === 'admin';
    }

    // Métodos para gestionar especificaciones
    getAllSpecifications() {
        return Array.isArray(this.data.specifications) ? this.data.specifications : [];
    }

    
    getSpecificationById(id) {
        return this.data.specifications.find(spec => spec.id === id);
    }

    createSpecification(specificationData) {
        // Validar que el nombre no esté vacío
        if (!specificationData.name || specificationData.name.trim() === '') {
            throw new Error('El nombre de la característica no puede estar vacío');
        }

        // Validar que no exista una característica con el mismo nombre
        const existingSpecification = this.data.specifications.find(
            spec => spec.name.toLowerCase() === specificationData.name.toLowerCase()
        );
        if (existingSpecification) {
            throw new Error('Ya existe una característica con este nombre');
        }

        const newSpecification = {
            id: this.data.specifications.length + 1,
            label: specificationData.label,
            description: specificationData.description || '',
            icon: specificationData.icon || 'fa-tag' // Nuevo campo
          };

        this.data.specifications.push(newSpecification);
        this.saveToStorage();
        return newSpecification;
    }

    updateSpecification(id, specificationData) {
        const index = this.data.specifications.findIndex(spec => spec.id === id);
        if (index === -1) throw new Error('Característica no encontrada');

        // Validar nombre único
        const existingSpecification = this.data.specifications.find(
            spec => spec.label.toLowerCase() === specificationData.name.toLowerCase() && spec.id !== id
        );
        if (existingSpecification) {
            throw new Error('Ya existe una característica con este nombre');
        }

        this.data.specifications[index] = {
            ...this.data.specifications[index],
            ...specificationData,
            icon: specificationData.icon, // Asegurar que se actualice el icono
            label: specificationData.name // Actualizar el nombre de la característica
          };

        this.saveToStorage();
        return this.data.specifications[index];
    }

    deleteSpecification(id) {
        // Verificar si hay productos con esta característica
        const productsWithSpecification = this.getProductsBySpecification(id);
        if (productsWithSpecification.length > 0) {
            throw new Error('No se puede eliminar una característica que está siendo utilizada por productos');
        }

        const index = this.data.specifications.findIndex(spec => spec.id === id);
        if (index === -1) throw new Error('Característica no encontrada');

        this.data.specifications.splice(index, 1);
        this.saveToStorage();
        return true;
    }

    // Método para obtener productos que usan una característica específica
    getProductsBySpecification(specificationId) {
        return this.data.products.filter(product =>
            product.specifications &&
            product.specifications.some(spec => spec.specification.id === specificationId)
        );
    }

}




// Exportar una única instancia
export const localDB = new LocalDB();