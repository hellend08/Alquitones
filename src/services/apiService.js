import axios from "axios";
import { localDB } from "../database/LocalDB";
// URL del backend, obtenida desde variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
// Función para verificar si el backend está disponible
const checkBackendStatus = async () => {
    try {
        await axios.get(`${API_BASE_URL}/health/ping`); // El backend debe tener un endpoint /ping que devuelva un simple "ok"
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
        console.log(`Fetching ${endpoint} from backend.`);
        
        try {
            const response = await axios.get(`${API_BASE_URL}${endpoint}`);
            console.log(`Data fetched from backend:`, response.data);
            
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint} from backend:`, error);
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
        instruments = instruments.map(instrument => {
            if (typeof instrument.category === "object") {
                instrument.categoryId = instrument.category.id;
            }
            return instrument;
        }
        );
        return instruments;
    },
    getCategories: () => fetchData("/categories", () => localDB.getAllCategories()),
    getInstrumentsPagined: async (page, size, searchQuery, paginated) => {
        console.log(`Fetching page ${page} of size ${size} with search query "${searchQuery}" and paginated ${paginated}`);
        
        let instrumentsPaginated = await fetchData(`/instruments/page?page=${page}&size=${size}&search=${searchQuery}&paginated=${paginated}`, localDB.getProductsPaginated(page, size, searchQuery, paginated));
        instrumentsPaginated.products = instrumentsPaginated.products.map(instrument => {
            if (typeof instrument.category === "object") {
                instrument.categoryId = instrument.category.id;
            }
            return instrument;
        }
        );
        return  instrumentsPaginated;
    }
};