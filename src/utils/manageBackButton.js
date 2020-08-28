import { BackHandler as BackHandlerRN } from "react-native"

const BackHandler = ({
	callback = () => {},
	ret = false,
	removeTriggered = true,
}) => {
	const backHandler = BackHandlerRN.addEventListener("hardwareBackPress", e => {
		callback(e)
		if (removeTriggered) backHandler.remove()
		return ret
	})
}
export default BackHandler
