export const instrumentReducer = (state, action) => {
    switch (action.type) {
        case 'GET_INSTRUMENTS':
            return { ...state, instruments: action.payload, loading: false };
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
        default:
            return state;
    }
};
