// filepath: p:\React\alquitonesfront\src\context\AuthContext.jsx
import { createContext, useReducer, useEffect, useContext } from "react";
import { apiService } from "../services/apiService";
import { localDB } from "../database/LocalDB";

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

const initialState = {
    user: null,
    loading: true,
    error: null
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
                } else {
                    dispatch({ type: "LOGOUT" });
                }
            } catch (error) {
                dispatch({ type: "SET_ERROR", payload: "Error al obtener el usuario actual" });
            }
        };
        checkCurrentUser();
    }, []);

    const login = async (email, password) => {
        dispatch({ type: "SET_LOADING", payload: true });
        try {
            const user = await apiService.login(email, password);
            dispatch({ type: "LOGIN_SUCCESS", payload: user });
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

    return (
        <AuthStateContext.Provider value={{ ...state, login, logout, getCurrentUser, register }}>
            <AuthDispatchContext.Provider value={dispatch}>
                {children}
            </AuthDispatchContext.Provider>
        </AuthStateContext.Provider>
    );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);