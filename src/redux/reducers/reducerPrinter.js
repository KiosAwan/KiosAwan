const initialState = {
	data: [],
}

const reducerPrinter = (state = initialState, actions) => {
	switch (actions.type) {
		case "ADD_PRINTER":
			return {
				...state,
				data: actions.payload,
			}
		default:
			return state
	}
}

export default reducerPrinter
