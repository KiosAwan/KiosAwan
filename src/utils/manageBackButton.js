import { BackHandler as BackHandlerRN } from "react-native"

const BackHandler = (route, condition) => {
	const backHandler = BackHandlerRN.addEventListener('hardwareBackPress', (e) => {
		if (condition) {
			navigation.navigate(route)
			backHandler.remove()
			return true
		}
		return false
	})
}
export default BackHandler