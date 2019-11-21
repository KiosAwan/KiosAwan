const initialState = {
    data : [],
    isError : false,
    isLoading : true
}

const reducerStoreProduct = (state = initialState, actions) => {
    switch(actions.type) {
        case "GET_PRODUCT":
        return {
            ...state,
            data: actions.payload,
            isLoading: true
        };
        case "GET_PRODUCT_FULFILLED":
        return {
            ...state,
            data: actions.payload.data.data,
            isLoading: false
        };
        case "GET_PRODUCT_REJECTED":
        return {
            ...state,
            isError: true,
            isLoading: false
        };
        default : 
            return state            
    }
}

export default reducerStoreProduct