export const categoryReducer = (state, action) => {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: true };
        case "GET_CATEGORIES":
            return { ...state, categories: action.payload, loading: false, error: null };
        
        case "ADD_CATEGORY":
            return { ...state, categories: [...state.categories, action.payload] };
        case "UPDATE_CATEGORY":
            return {
                ...state,
                categories: state.categories.map(cat =>
                    cat.id === action.payload.id ? action.payload : cat
                ),
            };
        case "DELETE_CATEGORY":
            return {
                ...state,
                categories: state.categories.filter(cat => cat.id !== action.payload),
            };
        case "SET_ERROR":
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};
