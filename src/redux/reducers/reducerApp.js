const initState = {}

const reducerApp = (state = initState, actions) => {
	switch (actions.type) {
		case "GET_APP":
			return { ...state, ...actions.payload }
		case "GET_APP_FULFILLED":
			return { ...state, ...actions.payload }
		case "GET_APP_REJECTED":
			return { ...state }
		default:
			return state
	}
}

export default reducerApp
