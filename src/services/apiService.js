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

    // Método para crear reservas en apiService.js
    // Agregar en el objeto exportado apiService

    createReservation: async (reservationData) => {
        const backendAvailable = await checkBackendStatus();

        if (backendAvailable) {
            try {
                // Formato esperado por el backend según el swagger
                const apiData = {
                    instrumentId: reservationData.instrumentId,
                    userId: reservationData.userId,
                    startDate: reservationData.startDate,
                    endDate: reservationData.endDate || reservationData.startDate,
                    quantity: reservationData.quantity || 1
                };

                console.log('Enviando reserva al backend:', apiData);
                
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
            console.log('Backend no disponible, utilizando simulación local');
            // Implementación de respaldo usando localDB
            // Esta es una simulación, ya que actualmente localDB no tiene
            // un método específico para reservas
            const mockReservation = {
                id: Math.floor(Math.random() * 10000),
                instrumentId: reservationData.instrumentId,
                userId: reservationData.userId,
                startDate: reservationData.startDate,
                endDate: reservationData.endDate || reservationData.startDate,
                quantity: reservationData.quantity || 1,
                status: 'CONFIRMED',
                createdAt: new Date().toISOString()
            };
            
            console.log('Reserva simulada creada:', mockReservation);
            return mockReservation;
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
            mainImage: "url",
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