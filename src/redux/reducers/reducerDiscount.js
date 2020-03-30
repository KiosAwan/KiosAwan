const initialState = {
    data: [],
    isError: false,
    isLoading: true
}

const reducerStoreDiscount = (state = initialState, actions) => {
    switch (actions.type) {
        case "GET_DISCOUNT":
            return {
                ...state,
                data: actions.payload,
                isLoading: true
            };
        case "GET_DISCOUNT_FULFILLED":
            return {
                ...state,
                data: actions.payload.data.data,
                isLoading: false
            };
        case "GET_DISCOUNT_REJECTED":
            return {
                ...state,
                isError: true,
                isLoading: false
            };
        default:
            return state
    }
}

export default reducerStoreDiscount