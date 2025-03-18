import { createContext, useReducer, useEffect, useContext } from "react";
import { categoryReducer } from "../reducers/categoryReducer";
import { apiService } from "../services/apiService";

const CategoryStateContext = createContext();
const CategoryDispatchContext = createContext();

const initialState = {
    categories: [],
    loading: true,
    error: null
};

export const CategoryProvider = ({ children }) => {
    const [state, dispatch] = useReducer(categoryReducer, initialState);

    useEffect(() => {
        const fetchCategories = async () => {
            dispatch({ type: "SET_LOADING" });
            try {
                const data = await apiService.getCategories();
                dispatch({ type: "GET_CATEGORIES", payload: data });
            } catch (error) {
                dispatch({ type: "SET_ERROR", payload: "Error al obtener categorías" });
            }
        };
        fetchCategories();
    }, []);

    return (
        <CategoryStateContext.Provider value={state}>
            <CategoryDispatchContext.Provider value={dispatch}>
                {children}
            </CategoryDispatchContext.Provider>
        </CategoryStateContext.Provider>
    );
};

// Custom hooks para acceder al contexto
export const useCategoryState = () => useContext(CategoryStateContext);
export const useCategoryDispatch = () => useContext(CategoryDispatchContext);
