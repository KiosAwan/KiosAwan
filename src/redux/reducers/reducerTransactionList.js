const initialState = {
    data : [],
    isError : false,
    isLoading : true
}

const reducerTransactionList = (state = initialState, actions) => {
    switch(actions.type) {
        case "GET_TRANSACTION":
        return {
            ...state,
            data: actions.payload,
            isLoading: true
        };
        case "GET_TRANSACTION_FULFILLED":
        return {
            ...state,
            data: actions.payload.data.data,
            isLoading: false
        };
        case "GET_TRANSACTION_REJECTED":
        return {
            ...state,
            isError: true,
            isLoading: false
        };
        default : 
            return state            
    }
}

export default reducerTransactionList