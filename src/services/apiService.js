import axios from "axios";
import { localDB } from "../database/LocalDB";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const CHECK_BACKEND = import.meta.env.VITE_CHECK_BACKEND === "true";

const checkBackendStatus = async () => CHECK_BACKEND ? await axios.get(`${API_BASE_URL}/health/ping`).then(() => true).catch(() => false) : false;

const fetchData = async (endpoint, localFallback) => {
    const backendAvailable = await checkBackendStatus();
    
    if (backendAvailable) {
        console.log(`>>> Obteniendo datos de ${endpoint} desde el backend...`);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate server delay
            const response = await axios.get(`${API_BASE_URL}${endpoint}`);
            console.log(`Datos obtenidos de ${endpoint}: `, response.data);
            
            return response.data;
        } catch (error) {
            console.error(`Error al obtener datos de ${endpoint}: `, error);
        }
    }
    
    console.warn(`Backend no disponible, usando datos locales para ${endpoint}.`);
    return localFallback;
};

export const apiService = {
    getInstruments: async() => {
        const instruments = await fetchData("/instruments", localDB.getAllProducts().sort(() => Math.random() - 0.5));
        
        return instruments;
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
    getSpecifications: async () => {
        const specifications = await fetchData("/specifications", localDB.getAllSpecifications());
        return specifications;
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
            category: { id: instrumentData.categoryId },
            stock: 5,
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
};