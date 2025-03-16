export const categoryReducer = (state, action) => {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: true };
        case "GET_CATEGORIES":
            return { ...state, categories: action.payload, loading: false, error: null };
        case "SET_ERROR":
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};
