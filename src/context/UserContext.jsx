import { createContext, useReducer, useEffect, useContext } from "react";
import { userReducer } from "../reducers/userReducer";
import { apiService } from "../services/apiService";

const UserStateContext = createContext();
const UserDispatchContext = createContext();

const initialState = {
    users: [],
    loading: true,
    error: null
};

export const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    useEffect(() => {
        const fetchUsers = async () => {
            dispatch({ type: "SET_LOADING" });
            try {
                const data = await apiService.getUsers();
                console.log("👥 Usuarios: ", data);
                
                dispatch({ type: "GET_USERS", payload: data });
            } catch (error) {
                dispatch({ type: "SET_ERROR", payload: "Error al obtener usuarios" });
            }
        };
        fetchUsers();
    }, []);

    const updateUserRole = async (userId, newRole) => {
        try {
            const response = await apiService.updateUserRole(userId, newRole);
            dispatch({ type: "UPDATE_USER_ROLE", payload: { userId, newRole } });
            return response.data;
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Error al actualizar rol de usuario" });
            throw error;
        }
    };

    return (
        <UserStateContext.Provider value={{ ...state, updateUserRole }}>
            <UserDispatchContext.Provider value={dispatch}>
                {children}
            </UserDispatchContext.Provider>
        </UserStateContext.Provider>
    );
};

// Custom hooks para acceder al contexto
export const useUserState = () => useContext(UserStateContext);
export const useUserDispatch = () => useContext(UserDispatchContext);