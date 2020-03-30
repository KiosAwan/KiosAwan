import { useState } from "react"

const stateObject = initValue => {
	const [state, _setState] = useState(initValue || {})
	const setState = value => {
		_setState({ ...state, ...value })
	}
	return [state, setState, () => _setState(initValue || {})]
}

export { stateObject }