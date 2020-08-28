const initialState = {
	data: [],
	isError: false,
	isLoading: true,
}

const reducerCustomer = (state = initialState, actions) => {
	switch (actions.type) {
		case "GET_CUSTOMER":
			return {
				...state,
				data: actions.payload,
				isLoading: true,
			}
		case "GET_CUSTOMER_FULFILLED":
			return {
				...state,
				data: actions.payload.data.data,
				isLoading: false,
			}
		case "GET_CUSTOMER_REJECTED":
			return {
				...state,
				isError: true,
				isLoading: false,
			}
		default:
			return state
	}
}

export default reducerCustomer
