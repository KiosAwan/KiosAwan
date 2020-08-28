const initialState = {
	data: [],
	store: [],
	isError: false,
	isLoading: true,
}

const reducerUser = (state = initialState, actions) => {
	switch (actions.type) {
		case "GET_PROFILE":
			return {
				...state,
				data: actions.payload,
				isLoading: true,
			}
		case "GET_PROFILE_FULFILLED":
			return {
				...state,
				data: actions.payload.data.data,
				store: actions.payload.data.user_store,
				isLoading: false,
			}
		case "GET_PROFILE_REJECTED":
			return {
				...state,
				isError: true,
				isLoading: false,
			}
		default:
			return state
	}
}

export default reducerUser
