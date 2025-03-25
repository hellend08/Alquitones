export const instrumentReducer = (state, action) => {
    switch (action.type) {
        case 'GET_INSTRUMENTS':
            return { ...state, instruments: action.payload , loading: false };
        case 'GET_INSTRUMENTS_RANDOMED':
            return { ...state, instruments: action.payload.sort(() => Math.random() - 0.5) , loading: false };
        case 'ADD_INSTRUMENT':
            return { ...state, instruments: [...state.instruments, action.payload] };
        case 'UPDATE_INSTRUMENT':
            return {
                ...state,
                instruments: state.instruments.map(inst =>
                    inst.id === action.payload.id ? action.payload : inst
                ),
            };
        case 'DELETE_INSTRUMENT':
            return {
                ...state,
                instruments: state.instruments.filter(inst => inst.id !== action.payload),
            };
        case 'SET_LOADING':
            return { ...state, loading: true };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'SET_SPECIFICATIONS':
            return { ...state, specifications: action.payload };

        case 'ADD_SPECIFICATION':
            return { ...state, specifications: [...state.specifications, action.payload] };
        case 'UPDATE_SPECIFICATION':
            return {
                ...state,
                specifications: state.specifications.map(spec =>
                    spec.id === action.payload.id ? action.payload : spec
                ),
            };
        case 'DELETE_SPECIFICATION':
            return {
                ...state,
                specifications: state.specifications.filter(spec => spec.id !== action.payload),
            };
        default:
            return state;
    }
};
