const initialState = {
	data: [],
	localeId: "id",
	isError: false,
	isLoading: true,
}

const reducerLocale = (state = initialState, actions) => {
	switch (actions.type) {
		case "GET_LANGUAGE":
			return {
				...state,
				localeId: actions.payload.localeId,
				data: actions.payload.locale,
				isLoading: true,
			}
		case "GET_LANGUAGE_FULFILLED":
			return {
				...state,
				isLoading: false,
			}
		case "GET_LANGUAGE_REJECTED":
			return {
				...initialState,
				isError: true,
				isLoading: false,
			}
		default:
			return state
	}
}

export default reducerLocale
