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
        try {
            const response = await axios.get(`${API_BASE_URL}${endpoint}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint} from backend:`, error);
        }
    }
    
    console.warn(`Backend no disponible, usando datos locales para ${endpoint}.`);
    return localFallback();
};
// Objeto con los servicios de la API
export const apiService = {
    getInstruments: () => fetchData("/instruments/random/40", localDB.getAllProducts().sort(() => Math.random() - 0.5)),
    getCategories: () => fetchData("/categories", () => localDB.getAllCategories()),
};