export const userReducer = (state, action) => {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: true };
        case "GET_USERS":
            return { ...state, users: action.payload, loading: false };
        case "UPDATE_USER_ROLE":
            return {
                ...state,
                users: state.users.map(user =>
                    user.id === action.payload.userId
                        ? { ...user, role: action.payload.newRole }
                        : user
                ),
            };
        case "SET_ERROR":
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
};