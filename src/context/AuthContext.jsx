// filepath: p:\React\alquitonesfront\src\context\AuthContext.jsx
import { createContext, useReducer, useEffect, useContext } from "react";
import { apiService } from "../services/apiService";

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

const initialState = {
    user: null,
    loading: true,
    error: null,
    favorites: []
};

const authReducer = (state, action) => {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: true };
        case "LOGIN_SUCCESS":
            return { ...state, user: action.payload, loading: false };
        case "LOGOUT":
            return { ...state, user: null, loading: false };
        case "SET_ERROR":
            return { ...state, error: action.payload, loading: false };
        case "SET_CURRENT_USER":
            return { ...state, user: action.payload, loading: false };
        case "SET_FAVORITES":
            return { ...state, favorites: action.payload, loading: false };
        case "ADD_FAVORITE":
            return { ...state, favorites: [...state.favorites, action.payload], loading: false };
        case "REMOVE_FAVORITE":
            return { ...state, favorites: state.favorites.filter(fav => fav.id !== action.payload), loading: false };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const getCurrentUser = () => {
        try {
            const userStr = localStorage.getItem('currentUser');
            if (userStr) {
                return JSON.parse(userStr);
            }
            return null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    };

    useEffect(() => {
        const checkCurrentUser = async () => {
            dispatch({ type: "SET_LOADING" });
            try {
                const user = getCurrentUser();
                if (user) {
                    dispatch({ type: "SET_CURRENT_USER", payload: user });
                    // Cargar favoritos al iniciar sesión
                    const favorites = await apiService.getFavorites(user.id);
                    dispatch({ type: "SET_FAVORITES", payload: favorites });
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                } else {
                    dispatch({ type: "LOGOUT" });
                    dispatch({ type: "SET_FAVORITES", payload: [] });
                    localStorage.removeItem('favorites');
                }
            } catch (error) {
                dispatch({ type: "SET_ERROR", payload: "Error al obtener el usuario actual" });
            }
        };
        checkCurrentUser();
    }, []);

    const login = async (email, password) => {
        dispatch({ type: "SET_LOADING" });
        try {
            const user = await apiService.login(email, password);
            dispatch({ type: "LOGIN_SUCCESS", payload: user });
            const favorites = await apiService.getFavorites(user.id);
            dispatch({ type: "SET_FAVORITES", payload: favorites });
            localStorage.setItem('favorites', JSON.stringify(favorites));
            return user;
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: error.message });
            
            throw error;
        }
    };

    const logout = () => {
        apiService.logout();
        dispatch({ type: "LOGOUT" });
    };

    const register = async (userData) => {
        dispatch({ type: "SET_LOADING" });
        try {
            const user = await apiService.register(userData);
            dispatch({ type: "LOGIN_SUCCESS", payload: user });
            return user;
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: error.message });
            throw error;
        }
    };

    const toggleFavorite = async (instrument) => {
        console.log(instrument);
        
        if (!state.user) {
            throw new Error("Usuario no autenticado");
        }

        try {
            const isFavorite = state.favorites.some(fav => fav.id === instrument.id);
            
            if (isFavorite) {
                await apiService.removeFavorite(state.user.id, instrument.id);
                dispatch({ type: "REMOVE_FAVORITE", payload: instrument.id });
                const updatedFavorites = state.favorites.filter(fav => fav.id !== instrument.id);
                localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            } else {
                await apiService.addFavorite(state.user.id, instrument.id);
                dispatch({ type: "ADD_FAVORITE", payload: instrument });
                const updatedFavorites = [...state.favorites, instrument];
                localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            }
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: error.message });
            throw error;
        }
    };
    const isAuthenticated = () => !!state.user;

    return (
        <AuthStateContext.Provider value={{ 
            ...state, 
            login, 
            logout, 
            getCurrentUser, 
            register,
            toggleFavorite,
            isAuthenticated,
            favorites: state.favorites
        }}>
            <AuthDispatchContext.Provider value={dispatch}>
                {children}
            </AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
    );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);