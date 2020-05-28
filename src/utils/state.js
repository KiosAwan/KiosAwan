import { useState } from "react"

let typingTimer
const typingWaitCallback = callback => {
	clearTimeout(typingTimer)
	typingTimer = setTimeout(callback, 1000)
}

const stateObject = initValue => {
	const [state, _setState] = useState(initValue || {})
	const setState = (value, callback) => {
		// console.debug(callback)
		_setState({ ...state, ...value })
	}
	return [state, setState, () => _setState(initValue || {})]
}
const stateArray = initValue => {
	const [state, _setState] = useState(initValue || [])
	const setData = (_state, value, i) => {
		_state[i] = value
		return _state
	}
	const setState = (value, i) => {
		if (i != undefined && i >= 0) {
			let data = setData(state, value, i)
			_setState(data)
		} else {
			_setState([...state, value])
		}
	}
	return [state, setState, val => {
		if (val) {
			let newVal = Array.isArray(val) ? val : [val]
			_setState(newVal)
		} else {
			_setState(initValue || [])
		}
	}]
}

export { stateObject, stateArray, typingWaitCallback }