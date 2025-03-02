import axios from "axios";
import { localDB } from "../database/LocalDB";
// URL del backend, obtenida desde variables de entorno
const API_BASE_URL = import.meta.env.API_BASE_URL || "http://localhost:8080/api";
// Función para verificar si el backend está disponible
const checkBackendStatus = async () => {
    try {
        await axios.get(`${API_BASE_URL}/auth/ping`); // El backend debe tener un endpoint /ping que devuelva un simple "ok"
        return true;
    } catch (error) {
        return false;
    }
};

export const apiService = {
    getInstruments: async () => {
        const backendAvailable = await checkBackendStatus();

        console.log("Backend disponible:", backendAvailable);
        
        if (backendAvailable) {
            try {
                const response = await axios.get(`${API_BASE_URL}/instruments/random/40`);
                return response.data;
            } catch (error) {
                console.error("Error fetching data from backend:", error);
                return localDB.getAllProducts(); // Fallback a los datos locales
            }
        } else {
            console.warn("Backend no disponible, usando datos locales.");
            const randomProducts = localDB.getAllProducts().sort(() => Math.random() - 0.5);

            return randomProducts
        }
    },
    getCategories: async () => {
        const backendAvailable = await checkBackendStatus();

        if (backendAvailable) {
            try {
                const response = await axios.get(`${API_BASE_URL}/categories`);
                return response.data;
            } catch (error) {
                console.error("Error fetching data from backend:", error);
                return localDB.getAllCategories; // Fallback a los datos locales
            }
        } else {
            console.warn("Backend no disponible, usando datos locales.");
            return localDB.getAllCategories();
        }
    },
};
