import { createContext, useReducer, useEffect, useContext } from "react";
import { instrumentReducer } from "../reducers/instrumentReducer";
import { apiService } from "../services/apiService";

const InstrumentStateContext = createContext();
const InstrumentDispatchContext = createContext();

const initialState = { 
    instruments: [],
    loading: true, 
    error: null,
    specifications: []
};

export const InstrumentProvider = ({ children }) => {
    const [state, dispatch] = useReducer(instrumentReducer, initialState);

    useEffect(() => {
        const fetchInstruments = async () => {
            dispatch({ type: "SET_LOADING" });
            try {
                const [instrumentsData, specificationsData] = await Promise.all([
                    apiService.getInstruments(),
                    apiService.getSpecifications()
                ]);
                dispatch({ type: "GET_INSTRUMENTS_RANDOMED", payload: instrumentsData });
                dispatch({ type: "SET_SPECIFICATIONS", payload: specificationsData });
            } catch (error) {
                dispatch({ type: "SET_ERROR", payload: "Error al obtener instrumentos" });
            }
        };
        fetchInstruments();
    }, []);

    const addInstrument = async (instrumentData, imagesAdj) => {
        try {
            const response = await apiService.addInstrument(instrumentData, imagesAdj);
            dispatch({ type: "ADD_INSTRUMENT", payload: response.data });
            return response.data;
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Error al agregar instrumento" });
            throw error;
        }
    };
    const getInstrumentById = async (instrumentId) => {
        try {
            const response = await apiService.getInstrumentById(instrumentId);
            return response;
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Error al obtener instrumento" });
            throw error;
        }
    };

    const updateInstrument = async (instrumentId, instrumentData, imagesAdj) => {
        try {
            console.log("instrumentData", instrumentData);
            
            const response = await apiService.updateInstrument(instrumentId , instrumentData, imagesAdj);
            dispatch({ type: "UPDATE_INSTRUMENT", payload: response.data });
            return response.data;
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Error al actualizar instrumento" });
            throw error;
        }
    }
    const deleteInstrument = async (instrumentId) => {
        try {
            const response = await apiService.deleteInstrument(instrumentId);
            dispatch({ type: "DELETE_INSTRUMENT", payload: instrumentId });
            return response.data;
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Error al eliminar instrumento" });
            throw error;
        }
    };

    const addSpecification = async (specificationData) => {
        console.log("specificationData", specificationData);
        
        try {
            const response = await apiService.addSpecification(specificationData);
            dispatch({ type: "ADD_SPECIFICATION", payload: response.data });
            return response.data;
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Error al agregar especificación" });
            throw error;
        }
    };
    
    const updateSpecification = async (specificationId, specificationData) => {
        console.log("specificationData", specificationData);
        
        try {
            const response = await apiService.updateSpecification(specificationId, specificationData);
            dispatch({ type: "UPDATE_SPECIFICATION", payload: response.data });
            return response.data;
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Error al actualizar especificación" });
            throw error;
        }
    };
    const deleteSpecification = async (specificationId) => {
        try {
            const response = await apiService.deleteSpecification(specificationId);
            dispatch({ type: "DELETE_SPECIFICATION", payload: specificationId });
            return response.data;
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Error al eliminar especificación" });
            throw error;
        }
    };
    const getAvailabilityById = async (instrumentId, startDate, endDate) => {
        try {
            const response = await apiService.getAvailabilityById(instrumentId, startDate, endDate);
            return response;
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: "Error al obtener disponibilidad" });
            throw error;
        }
    };


    return (
        <InstrumentStateContext.Provider value={{ ...state, addInstrument, updateInstrument, deleteInstrument, addSpecification, getInstrumentById, updateSpecification, deleteSpecification, getAvailabilityById }}>
            <InstrumentDispatchContext.Provider value={dispatch}>
                {children}
            </InstrumentDispatchContext.Provider>
        </InstrumentStateContext.Provider>
    );
};

// Custom hooks para acceder al contexto
export const useInstrumentState = () => useContext(InstrumentStateContext);
export const useInstrumentDispatch = () => useContext(InstrumentDispatchContext);
