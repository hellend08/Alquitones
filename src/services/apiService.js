import axios from "axios";
import { localDB } from "../database/LocalDB";
// URL del backend, obtenida desde variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const CHECK_BACKEND = import.meta.env.VITE_CHECK_BACKEND === "true"; // Por defecto es `true`

// Función para verificar si el backend está disponible
const checkBackendStatus = async () => {
    if (!CHECK_BACKEND) {
        console.warn("🔧 Chequeo de backend deshabilitado. Usando solo datos locales.");
        return false;
    }
    try {
        await axios.get(`${API_BASE_URL}/health/ping`);
        return true;
    } catch (error) {
        return false;
    }
};
// Función genérica para hacer peticiones al backend con fallback a `localDB`
const fetchData = async (endpoint, localFallback) => {
    const backendAvailable = await checkBackendStatus();
    console.log(`Backend disponible: ${backendAvailable}`);
    
    if (backendAvailable) {
        console.log(`>>> Obteniendo datos de ${endpoint} desde el backend...`);
        try {
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
// Objeto con los servicios de la API
export const apiService = {
    getInstruments: async() => {
        let instruments = await fetchData("/instruments/random/40", localDB.getAllProducts().sort(() => Math.random() - 0.5))
        //instruments es un objeto de que contiene varios instrument quiero chequear si un instrument.category es un objeto, en ese caso quiero convertirlo en un numero que sea el id de category y que se llame categoryId (o sea, instrument.categoryId)
        if (typeof instruments[0].category === "object") {
            instruments = instruments.map(instrument => {
                instrument.categoryId = instrument.category.id;
                return instrument;
            });
        }
        return instruments;
    },
    getCategories: () => fetchData("/categories", localDB.getAllCategories()),
    getInstrumentsPagined: async (page, size, searchQuery, paginated) => {
        
        let instrumentsPaginated = await fetchData(`/instruments/results?page=${page}&size=${size}&search=${searchQuery}&paginated=${paginated}`, localDB.getProductsPaginated(page, size, searchQuery, paginated));
        instrumentsPaginated.products = instrumentsPaginated.products.map(instrument => {
            if (typeof instrument.category === "object") {
                instrument.categoryId = instrument.category.id;
            }
            return instrument;
        }
        );
        return  instrumentsPaginated;
    },
    addInstrument: async (instrumentData, imagesAdj) => {
        const backendAvailable = await checkBackendStatus();
    console.log(`Backend disponible: ${backendAvailable}`);
    if (!backendAvailable) {
        return localDB.createProduct(instrumentData);
    }

        const formData = new FormData();
        
        instrumentData.category = { id: instrumentData.categoryId };
        delete instrumentData.categoryId;
        instrumentData.stock = 5;
        delete instrumentData.status;
        instrumentData.createdAt = new Date();
        delete instrumentData.images;
        instrumentData.mainImage = "url";
        // Convertir el objeto a JSON string
        const instrumentJson = JSON.stringify(instrumentData);
        console.log("instrumentJson", instrumentJson);
        formData.append("instrument", instrumentJson);
        console.log("formData", formData);
        // Agregar imágenes al FormData
        if (imagesAdj.length > 0) {
            for (let i = 0; i < imagesAdj.length; i++) {
                formData.append("images", imagesAdj[i]);
            }
        }
        // Mostrar los valores de FormData manualmente
for (let pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
}
        return axios.post(`${API_BASE_URL}/instruments/add`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};