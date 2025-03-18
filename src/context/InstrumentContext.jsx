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

    return (
        <InstrumentStateContext.Provider value={{ ...state, addInstrument }}>
            <InstrumentDispatchContext.Provider value={dispatch}>
                {children}
            </InstrumentDispatchContext.Provider>
        </InstrumentStateContext.Provider>
    );
};

// Custom hooks para acceder al contexto
export const useInstrumentState = () => useContext(InstrumentStateContext);
export const useInstrumentDispatch = () => useContext(InstrumentDispatchContext);
