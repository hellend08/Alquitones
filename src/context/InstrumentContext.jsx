import { createContext, useReducer, useEffect, useContext } from "react";
import { instrumentReducer } from "../reducers/instrumentReducer";
import { apiService } from "../services/apiService";

const InstrumentStateContext = createContext();
const InstrumentDispatchContext = createContext();

const initialState = { 
    instruments: [],
    loading: true, 
    error: null 
};

export const InstrumentProvider = ({ children }) => {
    const [state, dispatch] = useReducer(instrumentReducer, initialState);

    useEffect(() => {
        const fetchInstruments = async () => {
            dispatch({ type: "SET_LOADING" });
            try {
                const data = await apiService.getInstruments();
                dispatch({ type: "GET_INSTRUMENTS_RANDOMED", payload: data });
            } catch (error) {
                dispatch({ type: "SET_ERROR", payload: "Error al obtener instrumentos" });
            }
        };
        fetchInstruments();
    }, []);

    return (
        <InstrumentStateContext.Provider value={state}>
            <InstrumentDispatchContext.Provider value={dispatch}>
                {children}
            </InstrumentDispatchContext.Provider>
        </InstrumentStateContext.Provider>
    );
};

// Custom hooks para acceder al contexto
export const useInstrumentState = () => useContext(InstrumentStateContext);
export const useInstrumentDispatch = () => useContext(InstrumentDispatchContext);
