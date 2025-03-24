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

    const addCategory = async (categoryData) => {
        try {
            const response = await apiService.addCategory(categoryData);
            dispatch({ type: "ADD_CATEGORY", payload: response.data });
            return response.data;
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Error al agregar categoría" });
            throw error;
        }
    };

    const updateCategory = async (categoryId, categoryData) => {
        try {
            const response = await apiService.updateCategory(categoryId, categoryData);
            console.log("response", response);
            console.log("categoryData", categoryData);
            console.log("categoryId", categoryId);
            
            
            
            dispatch({ type: "UPDATE_CATEGORY", payload: response.data });
            return response.data;
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Error al actualizar categoría" });
            throw error;
        }
    };

    const deleteCategory = async (categoryId) => {
        try {
            const response = await apiService.deleteCategory(categoryId);
            dispatch({ type: "DELETE_CATEGORY", payload: categoryId });
            return response;
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Error al eliminar categoría" });
            throw error;
        }
    };

    return (
        <CategoryStateContext.Provider value={ { ...state, addCategory, updateCategory, deleteCategory } }>
            <CategoryDispatchContext.Provider value={dispatch}>
                {children}
            </CategoryDispatchContext.Provider>
        </CategoryStateContext.Provider>
    );
};

// Custom hooks para acceder al contexto
export const useCategoryState = () => useContext(CategoryStateContext);
export const useCategoryDispatch = () => useContext(CategoryDispatchContext);
