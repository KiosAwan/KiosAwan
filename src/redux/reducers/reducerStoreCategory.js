const initialState = {
    data : [],
    isError : false,
    isLoading : true
}

const reducerStoreCategory = (state = initialState, actions) => {
    switch(actions.type) {
        case "GET_CATEGORY":
        return {
            ...state,
            data: actions.payload,
            isLoading: true
        };
        case "GET_CATEGORY_FULFILLED":
        return {
            ...state,
            data: actions.payload.data.data,
            isLoading: false
        };
        case "GET_CATEGORY_REJECTED":
        return {
            ...state,
            isError: true,
            isLoading: false
        };
        default : 
            return state            
    }
}

export default reducerStoreCategory