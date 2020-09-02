import { Alert as AlertRN } from "react-native"
// https://www.npmjs.com/package/react-native-sweet-alert

const Alert = (...params) => {
	let _title, _msg, _buttons, _others
	const [title, msg, buttons, others] = params
	if (params.length >= 1) {
		_title = "Alert"
		_msg = title
	}
	if (params.length >= 2) {
		_title = title
		_msg = msg
	}
	if (params.length >= 3) {
		_buttons = buttons.rMap(item => {
			const [text, _onPress, style] = item
			const onPress = _onPress ? _onPress : () => {}
			return { text, onPress, style }
		})
	}
	if (params.length == 4) {
		const [cancelable, onDismiss] = others
		_others = { cancelable, onDismiss }
	}
	AlertRN.alert(_title, _msg, _buttons, _others)
}
export default Alert
