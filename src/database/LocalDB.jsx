// LocalDB.jsx
class LocalDB {
    constructor() {
        this.data = {
            // En LocalDB.jsx, actualiza categories:
categories: [
    { id: 1, name: 'Cuerdas', icon: '/src/assets/icons/guitar.png', description: 'Instrumentos de cuerda' },
    { id: 2, name: 'Viento', icon: '/src/assets/icons/flute.png', description: 'Instrumentos de viento' },
    { id: 3, name: 'Percusión', icon: '/src/assets/icons/drums.png', description: 'Instrumentos de percusión' },
    { id: 4, name: 'Teclados', icon: '/src/assets/icons/piano.png', description: 'Instrumentos de teclado' }
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
                }
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
                        { label: 'Marca', value: 'Fender' },
                        { label: 'Modelo', value: 'Stratocaster Player' },
                        { label: 'Cuerpo', value: 'Aliso' },
                        { label: 'Mástil', value: 'Arce' },
                        { label: 'Pastillas', value: '3 Single-coil' },
                        { label: 'Trastes', value: '22 Medium Jumbo' }
                    ],
                    images: [
                        'https://alquitones.s3.us-east-2.amazonaws.com/01.PNG',
                        'https://alquitones.s3.us-east-2.amazonaws.com/02.PNG',
                        'https://alquitones.s3.us-east-2.amazonaws.com/03.jpg',
                        'https://alquitones.s3.us-east-2.amazonaws.com/04.jpg',
                        'https://alquitones.s3.us-east-2.amazonaws.com/05.webp',
                        'https://alquitones.s3.us-east-2.amazonaws.com/06.jpg'
                    ],
                    mainImage: 'https://alquitones.s3.us-east-2.amazonaws.com/05.jpg',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Violín Stradivarius (Réplica)',
                    description: 'Violín 4/4 de alta calidad con acabado antiguo',
                    categoryId: 1,
                    pricePerDay: 50.00,
                    status: 'Disponible',
                    specifications: [
                        { label: 'Tipo', value: 'Réplica Stradivarius' },
                        { label: 'Tamaño', value: '4/4' },
                        { label: 'Tapa', value: 'Abeto macizo' },
                        { label: 'Fondo', value: 'Arce flameado' },
                        { label: 'Arco', value: 'Madera de Brasil' },
                        { label: 'Incluye', value: 'Estuche y resina' }
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
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: 'Bajo Eléctrico Music Man StingRay',
                    description: 'Bajo eléctrico profesional activo de 4 cuerdas',
                    categoryId: 1,
                    pricePerDay: 55.00,
                    status: 'Disponible',
                    specifications: [
                        { label: 'Marca', value: 'Music Man' },
                        { label: 'Modelo', value: 'StingRay' },
                        { label: 'Cuerpo', value: 'Fresno' },
                        { label: 'Mástil', value: 'Arce tostado' },
                        { label: 'Pastillas', value: 'Humbucker' },
                        { label: 'Electrónica', value: 'Activa 3 bandas' }
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
                    createdAt: new Date().toISOString()
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
                        { label: 'Marca', value: 'Selmer Paris' },
                        { label: 'Modelo', value: 'Series III' },
                        { label: 'Material', value: 'Latón' },
                        { label: 'Acabado', value: 'Chapado en oro' },
                        { label: 'Boquilla', value: 'S80 C*' },
                        { label: 'Incluye', value: 'Estuche premium' }
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
                    createdAt: new Date().toISOString()
                },
                {
                    id: 5,
                    name: 'Clarinete Buffet R13',
                    description: 'Clarinete profesional en Si♭',
                    categoryId: 2,
                    pricePerDay: 45.00,
                    status: 'Disponible',
                    specifications: [
                        { label: 'Marca', value: 'Buffet Crampon' },
                        { label: 'Modelo', value: 'R13' },
                        { label: 'Material', value: 'Granadilla' },
                        { label: 'Sistema', value: 'Boehm' },
                        { label: 'Llaves', value: 'Plateadas' },
                        { label: 'Barril', value: '66mm' }
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
                    createdAt: new Date().toISOString()
                },
                {
                    id: 6,
                    name: 'Trompeta Bach Stradivarius 180S',
                    description: 'Trompeta profesional en Si♭ plateada',
                    categoryId: 2,
                    pricePerDay: 50.00,
                    status: 'Disponible',
                    specifications: [
                        { label: 'Marca', value: 'Bach' },
                        { label: 'Modelo', value: 'Stradivarius 180S' },
                        { label: 'Material', value: 'Latón dorado' },
                        { label: 'Acabado', value: 'Plateado' },
                        { label: 'Campana', value: '4.8"' },
                        { label: 'Boquilla', value: 'Bach 3C' }
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
                    createdAt: new Date().toISOString()
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
                        { label: 'Marca', value: 'DW Drums' },
                        { label: 'Serie', value: 'Collectors' },
                        { label: 'Material', value: 'Arce' },
                        { label: 'Piezas', value: '6 cuerpos' },
                        { label: 'Herrajes', value: 'DW 9000' },
                        { label: 'Platillos', value: 'No incluidos' }
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
                    createdAt: new Date().toISOString()
                },
                {
                    id: 8,
                    name: 'Congas LP Galaxy Giovanni',
                    description: 'Set de congas profesionales de fibra de vidrio',
                    categoryId: 3,
                    pricePerDay: 45.00,
                    status: 'Disponible',
                    specifications: [
                        { label: 'Marca', value: 'Latin Percussion' },
                        { label: 'Modelo', value: 'Galaxy Giovanni' },
                        { label: 'Material', value: 'Fibra de vidrio' },
                        { label: 'Tamaños', value: '11" y 12"' },
                        { label: 'Parches', value: 'LP Galaxy' },
                        { label: 'Acabado', value: 'Gold Sparkle' }
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
                    createdAt: new Date().toISOString()
                },
                {
                    id: 9,
                    name: 'Set de Platillos Zildjian K Custom',
                    description: 'Set profesional de platillos dark',
                    categoryId: 3,
                    pricePerDay: 55.00,
                    status: 'Disponible',
                    specifications: [
                        { label: 'Marca', value: 'Zildjian' },
                        { label: 'Serie', value: 'K Custom Dark' },
                        { label: 'Hi-hat', value: '14"' },
                        { label: 'Crash', value: '16" y 18"' },
                        { label: 'Ride', value: '20"' },
                        { label: 'Material', value: 'B20 Bronze' }
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
                    createdAt: new Date().toISOString()
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
                        { label: 'Marca', value: 'Steinway & Sons' },
                        { label: 'Modelo', value: 'D-274' },
                        { label: 'Longitud', value: '274 cm' },
                        { label: 'Teclas', value: '88 marfil sintético' },
                        { label: 'Acabado', value: 'Negro pulido' },
                        { label: 'Pedales', value: '3 tradicionales' }
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
                    createdAt: new Date().toISOString()
                },
                {
                    id: 11,
                    name: 'Sintetizador Moog One',
                    description: 'Sintetizador analógico polifónico de 16 voces',
                    categoryId: 4,
                    pricePerDay: 85.00,
                    status: 'Disponible',
                    specifications: [
                        { label: 'Marca', value: 'Moog' },
                        { label: 'Modelo', value: 'One' },
                        { label: 'Voces', value: '16 polifónicas' },
                        { label: 'Osciladores', value: '3 por voz' },
                        { label: 'Teclado', value: '61 teclas' },
                        { label: 'Memoria', value: '64 bancos' }
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
                    createdAt: new Date().toISOString()
                },
                {
                    id: 12,
                    name: 'Nord Stage 3 88',
                    description: 'Piano de escenario profesional con sintetizador',
                    categoryId: 4,
                    pricePerDay: 70.00,
                    status: 'Disponible',
                    specifications: [
                        { label: 'Marca', value: 'Nord' },
                        { label: 'Modelo', value: 'Stage 3' },
                        { label: 'Teclas', value: '88 contrapesadas' },
                        { label: 'Secciones', value: 'Piano/Synth/Organ' },
                        { label: 'Memoria', value: '2GB piano' },
                        { label: 'Efectos', value: 'Múltiples por sección' }
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
                    createdAt: new Date().toISOString()
                }
            ]
        };
        
        // Forzar actualización de datos
        localStorage.removeItem('alquitonesDB');
        this.initializeStorage();
    }

    // Inicialización
    initializeStorage() {
        if (!localStorage.getItem('alquitonesDB')) {
            localStorage.setItem('alquitonesDB', JSON.stringify(this.data));
        } else {
            this.data = JSON.parse(localStorage.getItem('alquitonesDB'));
        }
    }

    // Métodos de persistencia
    saveToStorage() {
        localStorage.setItem('alquitonesDB', JSON.stringify(this.data));
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

        const newUser = {
            id: this.data.users.length + 1,
            ...userData,
            createdAt: new Date().toISOString(),
            isActive: true
        };

        this.data.users.push(newUser);
        this.saveToStorage();
        return newUser;
    }

    updateUser(id, userData) {
        const index = this.data.users.findIndex(user => user.id === id);
        if (index === -1) throw new Error('Usuario no encontrado');

        // Si se está actualizando el email, verificar que no exista
        if (userData.email && userData.email !== this.data.users[index].email) {
            if (this.getUserByEmail(userData.email)) {
                throw new Error('El email ya está registrado');
            }
        }

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

getProductsPaginated(page = 1, size = 10) {
    try {
        // Obtener todos los productos
        const products = this.data.products;
        const totalProducts = products.length;
        
        // Calcular número total de páginas
        const totalPages = Math.ceil(totalProducts / size);
        
        // Validar que la página solicitada sea válida
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        
        // Calcular índices de inicio y fin para la página actual
        const startIndex = (page - 1) * size;
        const endIndex = Math.min(startIndex + size, totalProducts);
        
        // Obtener los productos de la página solicitada
        const paginatedProducts = products.slice(startIndex, endIndex);
        
        // Retornar estructura con metadata de paginación
        return {
            products: paginatedProducts,
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
        return this.data.products.find(product => product.id === id);
    }

    createProduct(productData) {
        // Modificar validación para permitir 1-5 imágenes
        if (!productData.images || productData.images.length < 1 || productData.images.length > 5) {
            throw new Error('El producto debe por lo menos 1 imagen');
        }
    
        const newProduct = {
            id: this.data.products.length + 1,
            ...productData,
            mainImage: productData.mainImage, // Primera imagen como principal
            createdAt: new Date().toISOString()
        };
    
        this.data.products.push(newProduct);
        this.saveToStorage();
        return newProduct;
    }

    updateProduct(id, productData) {
        const index = this.data.products.findIndex(product => product.id === id);
        if (index === -1) throw new Error('Producto no encontrado');

        // Si se actualizan las imágenes, validar que sean 5
        if (productData.images && productData.images.length !== 5) {
            throw new Error('El producto debe tener exactamente 5 imágenes');
        }

        // Si hay nuevas imágenes, actualizar la imagen principal
        if (productData.images) {
            productData.mainImage = productData.images[0];
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
        // Almacenar sesión en localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }

    logout() {
        localStorage.removeItem('currentUser');
        return true;
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    isAdmin() {
        const user = this.getCurrentUser();
        return user?.role === 'admin';
    }
}

// Exportar una única instancia
export const localDB = new LocalDB();