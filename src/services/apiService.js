import axios from "axios";
import { localDB } from "../database/LocalDB";
const URL = import.meta.env.VITE_URL || "http://localhost:8080";
const API_BASE_URL = URL + "/api";
const CHECK_BACKEND = import.meta.env.VITE_CHECK_BACKEND === "true";

const checkBackendStatus = async () => CHECK_BACKEND ? await axios.get(`${API_BASE_URL}/health/ping`).then(() => true).catch(() => false) : false;

const fetchData = async (endpoint, localFallback) => {
    const backendAvailable = await checkBackendStatus();

    if (backendAvailable) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate server delay
            const response = await axios.get(`${API_BASE_URL}${endpoint}`);
            console.log(`>>> 💻 ${endpoint}: `, response.data);

            return response.data;
        } catch (error) {
            console.error(`Error al obtener datos de ${endpoint}: `, error);
        }
    }

    console.warn(`Backend no disponible, usando datos locales para ${endpoint}.`);
    return localFallback;
};


function adjustDateString(dateString, days) {
    // Formato esperado: "YYYY-MM-DD"
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);

    // Devolver en formato YYYY-MM-DD
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export const apiService = {


    getInstruments: async () => {
        const instruments = await fetchData("/instruments", localDB.getAllProducts().sort(() => Math.random() - 0.5));

        return instruments;
    },
    getInstrumentsPagined: async (page, size, searchQuery, paginated) => {
        let instrumentsPaginated = await fetchData(`/instruments/results?page=${page}&size=${size}&search=${searchQuery}&paginated=${paginated}`, localDB.getProductsPaginated(page, size, searchQuery, paginated));

        instrumentsPaginated.products = instrumentsPaginated.products.map(instrument => ({
            ...instrument,
            categoryId: typeof instrument.category === "object" ? instrument.category.id : instrument.categoryId,
        }));
        return instrumentsPaginated;
    },
    getInstrumentsByCategory: async (categoryId) => {
        const instruments = await fetchData(`/instruments/filter?categoryId=${categoryId}`, localDB.getProductsByCategory(categoryId));

        return instruments;
    },
    getInstrumentById: async (id) => {
        const instrument = await fetchData(`/instruments/${id}`, localDB.getProductById(id));
        const backendAvailable = await checkBackendStatus();

        if (backendAvailable) {
            instrument.images = instrument.images.map(image => image.url);
        }

        return instrument;
    },

    createReservation: async (reservationData) => {
        const backendAvailable = await checkBackendStatus();
        if (backendAvailable) {
            try {
                const adjustedStartDate = adjustDateString(reservationData.startDate, 0);
                const adjustedEndDate = reservationData.endDate ?
                    adjustDateString(reservationData.endDate, 0) :
                    adjustDateString(reservationData.startDate, 0);
                // Formato esperado por el backend según el swagger
                const apiData = {
                    instrumentId: reservationData.instrumentId,
                    userId: reservationData.userId,
                    startDate: adjustedStartDate, // Fecha ajustada restando 1 día
                    endDate: adjustedEndDate, // Fecha ajustada restando 1 día
                    quantity: reservationData.quantity || 1 // Asegurar que siempre haya una cantidad
                };
                console.log('Enviando reserva al backend con fechas ajustadas (-1 día):', apiData);
                // Asegurarse de que las cabeceras sean correctas
                const response = await axios.post(`${API_BASE_URL}/availability/reserve`, apiData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Respuesta de reserva del backend:', response.data);
                return response.data;
            } catch (error) {
                console.error('Error al crear reserva:', error.response?.data || error.message);
                throw error;
            }
        } else {
            throw new Error('Backend no disponible. La reserva no pudo ser procesada.');
        }
     },



    // Agregar estos métodos a apiService.js
    // Enviar o actualizar una valoración
    submitRating: async (ratingData) => {
        if (!(await checkBackendStatus())) {
            // Simulación local, mantén igual
            return { success: true, data: { id: Math.floor(Math.random() * 1000), ...ratingData, createdAt: new Date().toISOString() } };
        }

        try {
            // Formato corregido según API
            const formattedData = {
                instrumentId: ratingData.instrumentId,
                userId: ratingData.userId,
                stars: ratingData.stars,
                comment: ratingData.comment || ""  // Asegura que nunca sea null
            };

            console.log('Enviando valoración al servidor:', formattedData);

            const response = await axios.post(
                `${API_BASE_URL}/ratings`,
                formattedData,
                { headers: { 'Content-Type': 'application/json' } }
            );

            return response.data;
        } catch (error) {
            console.error('Error al enviar valoración:', error);

            // Mejor manejo de errores
            if (error.response?.status === 500) {
                throw new Error('Error interno del servidor. Intenta más tarde.');
            } else if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error('Error al enviar la valoración');
            }
        }
    },

    // Obtener valoraciones por instrumento
    getRatingsByInstrument: async (instrumentId) => {
        if (!(await checkBackendStatus())) {
            return localDB.getRatingsByInstrument(instrumentId);
        }

        return axios.get(`${API_BASE_URL}/ratings/instrument/${instrumentId}`)
            .then(response => response.data);
    },

    // Corrección de la función getUserReservations en apiService.js

    getUserReservations: async (userId) => {
        const backendAvailable = await checkBackendStatus();

        if (!backendAvailable) {
            // Simulación local
            return {
                data: [
                    {
                        id: 1,
                        instrumentId: 4,
                        instrumentName: "Saxofón Alto Selmer Series III",
                        instrumentImage: "https://alquitones.s3.us-east-2.amazonaws.com/24.PNG",
                        category: "Viento",
                        status: "Reservado",
                        startDate: "2025-03-23",
                        endDate: "2025-03-26"
                    }
                ]
            };
        }

        try {
            // Nota que el endpoint correcto según Swagger es /api/reservations/user/{id}
            const response = await axios.get(`${API_BASE_URL}/reservations/user/${userId}`);

            // Transformar los datos para que coincidan con lo esperado por el componente
            const reservationsWithDetails = await Promise.all(
                (response.data || []).map(async (reservation) => {
                    try {
                        // Obtener detalles del instrumento si es posible
                        const instrument = await apiService.getInstrumentById(reservation.instrumentId);

                        return {
                            id: reservation.id,
                            instrumentId: reservation.instrumentId,
                            instrumentName: instrument?.name || `Instrumento ${reservation.instrumentId}`,
                            instrumentImage: instrument?.mainImage || instrument?.images?.[0],
                            category: instrument?.category?.name || "Sin categoría",
                            status: reservation.status || "Reservado",
                            startDate: reservation.startDate,
                            endDate: reservation.endDate
                        };
                    } catch (err) {
                        // En caso de error, devolver datos mínimos
                        return {
                            id: reservation.id,
                            instrumentId: reservation.instrumentId,
                            status: reservation.status || "Reservado",
                            startDate: reservation.startDate,
                            endDate: reservation.endDate
                        };
                    }
                })
            );

            return { data: reservationsWithDetails };
        } catch (error) {
            console.error("Error al obtener reservas:", error);
            return { data: [] };
        }
    },

    submitRating: async (ratingData) => {
        if (!(await checkBackendStatus())) {
            // Simulación local si no hay backend
            return {
                success: true,
                data: {
                    id: Math.floor(Math.random() * 1000),
                    ...ratingData,
                    createdAt: new Date().toISOString()
                }
            };
        }

        try {
            // Asegúrate de enviar exactamente este formato
            const formattedData = {
                instrumentId: Number(ratingData.instrumentId),
                userId: Number(ratingData.userId),
                stars: Number(ratingData.stars),
                comment: ratingData.comment || ""
            };

            console.log('Enviando valoración:', formattedData);

            // Usar axios.post con el formato correcto
            const response = await axios.post(
                `${API_BASE_URL}/ratings`,
                formattedData
            );

            return response.data;
        } catch (error) {
            console.error('Error al enviar valoración:', error);

            // Capturar específicamente el error 500 
            if (error.response?.status === 500) {
                throw new Error('Error interno del servidor. Por favor, intenta más tarde.');
            } else if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error('Error al enviar la valoración');
            }
        }
    },

    // Obtener valoraciones por instrumento
    getRatingsByInstrument: async (instrumentId) => {
        if (!(await checkBackendStatus())) {
            // Datos de ejemplo para modo sin backend
            console.log('Backend no disponible, usando valoraciones simuladas');
            return [
                {
                    id: 1,
                    instrumentId: instrumentId,
                    userId: 1,
                    stars: 4,
                    comment: "Muy buen instrumento, suena excelente y estaba en perfecto estado."
                },
                {
                    id: 2,
                    instrumentId: instrumentId,
                    userId: 2,
                    stars: 5,
                    comment: "Excelente calidad, lo volvería a alquilar."
                }
            ];
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/ratings/instrument/${instrumentId}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener valoraciones:', error);
            return [];
        }
    },


    cancelReservation: async (reservationId) => {
        const backendAvailable = await checkBackendStatus();

        if (!backendAvailable) {
            // Simulación local para pruebas
            console.log(`Simulando cancelación de reserva ${reservationId}`);
            return { success: true, message: "Reserva cancelada (simulación)" };
        }

        try {
            console.log(`Cancelando reserva ${reservationId}`);
            // Esta URL debe ajustarse según la documentación del swagger
            const response = await axios.put(
                `${API_BASE_URL}/reservations/${reservationId}/cancel`,
                {},
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error cancelando reserva:", error);
            throw new Error(error.response?.data?.message || "No se pudo cancelar la reserva");
        }
    },

    addInstrument: async (instrumentData, imagesAdj) => {
        if (!(await checkBackendStatus())) {
            const newInstrument = await localDB.createProduct(instrumentData);
            return { data: newInstrument };
        }

        const formData = new FormData();
        const processedInstrument = {
            ...instrumentData,
            category: { id: instrumentData.categoryId },
            stock: 5,
            createdAt: new Date(),
        };
        delete processedInstrument.categoryId;
        delete processedInstrument.status;
        delete processedInstrument.images;

        formData.append("instrument", JSON.stringify(processedInstrument));

        // Convertir FileList a Array antes de usar forEach
        if (imagesAdj && imagesAdj.length > 0) {
            Array.from(imagesAdj).forEach(image => formData.append("images", image));
        }

        const response = await axios.post(`${API_BASE_URL}/instruments/add`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        // Asegurarse de que la respuesta tenga el formato correcto
        return {
            data: {
                ...response.data,
                categoryId: response.data.category?.id || response.data.categoryId,
                images: response.data.images || [],
                mainImage: response.data.mainImage || response.data.images[0]
            }
        };
    },
    updateInstrument: async (id, instrumentData, imagesAdj = []) => {
        if (!(await checkBackendStatus())) {
            return localDB.updateProduct(id, instrumentData);
        }

        const formData = new FormData();
        const processedInstrument = {
            ...instrumentData,
            images: instrumentData.images.map(image => ({ id: image.id })),
            category: { id: instrumentData.categoryId },
            stock: 5,
        };
        delete processedInstrument.categoryId;
        delete processedInstrument.status;

        formData.append("instrument", JSON.stringify(processedInstrument));

        // Convertir FileList a Array antes de usar forEach
        if (imagesAdj && imagesAdj.length > 0) {
            Array.from(imagesAdj).forEach(image => formData.append("images", image));
        }

        return axios.put(`${API_BASE_URL}/instruments/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    deleteInstrument: async (id) => {
        if (!(await checkBackendStatus())) {
            return localDB.deleteProduct(id);
        }

        return axios.delete(`${API_BASE_URL}/instruments/${id}`);
    },
    getAvailabilityById: async (id, startDate, endDate) => {
        if (!(await checkBackendStatus())) {
            return localDB.getAvailabilityById(id);
        }

        const availability = await axios.get(`${API_BASE_URL}/availability/daily-stock?instrumentId=${id}&startDate=${startDate}&endDate=${endDate}`);
        return availability.data;
    },
    getCategories: async () => {
        const categories = await fetchData("/categories", localDB.getAllCategories());
        // let instruments = await fetchData("/instruments", localDB.getAllProducts());

        // categories = categories.map(category => ({
        //     ...category,
        //     productCount: instruments.filter(instrument => instrument.categoryId === category.id).length,
        // }));

        return categories;
    },
    addCategory: async (categoryData) => {
        if (!(await checkBackendStatus())) {
            const newCategory = await localDB.createCategory(categoryData);
            return { data: newCategory };
        }

        return axios.post(`${API_BASE_URL}/categories/add`, categoryData);
    },
    updateCategory: async (id, categoryData) => {
        if (!(await checkBackendStatus())) {
            return localDB.updateCategory(id, categoryData);
        }

        return axios.put(`${API_BASE_URL}/categories/${id}`, categoryData);
    },
    deleteCategory: async (id) => {
        if (!(await checkBackendStatus())) {
            return localDB.deleteCategory(id);
        }

        return axios.delete(`${API_BASE_URL}/categories/${id}`);
    },
    getSpecifications: async () => {
        const specifications = await fetchData("/specifications", localDB.getAllSpecifications());
        return specifications;
    },
    addSpecification: async (specificationData) => {
        if (!(await checkBackendStatus())) {
            const newSpecification = await localDB.createSpecification(specificationData);
            return { data: newSpecification };
        }

        return axios.post(`${API_BASE_URL}/specifications/add`, specificationData);
    },
    updateSpecification: async (id, specificationData) => {
        if (!(await checkBackendStatus())) {
            return localDB.updateSpecification(id, specificationData);
        }

        return axios.put(`${API_BASE_URL}/specifications/${id}`, specificationData);
    },
    deleteSpecification: async (id) => {
        if (!(await checkBackendStatus())) {
            return localDB.deleteSpecification(id);
        }

        return axios.delete(`${API_BASE_URL}/specifications/${id}`);
    },
    getUsers: async () => {
        const users = await fetchData("/users", localDB.getAllUsers());
        console.log("👥 Usuarios: ", users);

        return users;
    },
    updateUserRole: async (userId, newRole) => {
        if (!(await checkBackendStatus())) {
            return localDB.updateUserRole(userId, newRole);
        }
        console.log();

        return axios.put(`${API_BASE_URL}/users/${userId}/role?role=${newRole}`);
    },
    login: async (email, password) => {
        const backendAvailable = await checkBackendStatus();
        if (backendAvailable) {
            try {
                const userLogin = {
                    email: email,
                    password: password,
                };
                console.log("🔑 Autenticando usuario...");

                const response = await axios.post(`${URL}/login`, userLogin, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                localStorage.setItem('currentUser', JSON.stringify(response.data));
                console.log("currentUser", JSON.parse(localStorage.getItem('currentUser')));

                console.log("🔑 Usuario autenticado: ", response.data);


                console.log("🔑 Usuario autenticado: ", response.data);

                return response.data;
            } catch (error) {
                console.error("Error en login:", error.response?.data || error.message);
                throw new Error(error.response?.data?.message || 'Credenciales inválidas');
            }
        } else {
            return localDB.login(email, password);
        }
    },
    logout: () => {
        localStorage.removeItem('currentUser');
    },
    register: async (userData) => {
        if (!(await checkBackendStatus())) {
            const newUser = await localDB.createUser(userData);
            return newUser;
        }

        return axios.post(`${API_BASE_URL}/users/register`, userData);
    },
    // Métodos para favoritos
    addFavorite: async (userId, instrumentId) => {
        if (!(await checkBackendStatus())) {
            return localDB.addFavorite(userId, instrumentId);
        }
        return axios.post(`${API_BASE_URL}/favorites/users/${userId}/instruments/${instrumentId}`);
    },
    removeFavorite: async (userId, instrumentId) => {
        if (!(await checkBackendStatus())) {
            return localDB.removeFavorite(userId, instrumentId);
        }
        return axios.delete(`${API_BASE_URL}/favorites/users/${userId}/instruments/${instrumentId}`);
    },
    getFavorites: async (userId) => {
        if (!(await checkBackendStatus())) {
            return localDB.getFavorites(userId);
        }
        const favorites = await axios.get(`${API_BASE_URL}/favorites/users/${userId}`);
        //favorites.data es un array de objetos con la estructura { id: 1, user:{}, instrument:{}, createdAt: "2021-09-01T00:00:00.000Z" }, necesito solo los instrumentos, que sea un array de instrumentos
        console.log("🌟 Favoritos: ", favorites.data);

        const instruments = favorites.data.map(favorite => favorite.instrument);
        console.log("🌟 Favoritos: ", instruments);

        //necesito retornar un array de objetos instrument
        return instruments;
    }
};