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
        };
        case "GET_TRANSACTION_FULFILLED":
            let a = []

            for (const key in actions.payload.data.data){
                a.push(actions.payload.data.data[key])
            }
            return {
                ...state,
                data: a,
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