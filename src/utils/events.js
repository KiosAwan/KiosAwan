import { prettyConsole } from "src/utils/authhelper"
import analytics, { firebase } from "@react-native-firebase/analytics"

let currentActionState
const timer = 60 * 6 // in minutes
const inActiveTimer = timer * 60 * 1000

const onInactive = async isActive => {
	console.log(isActive)
}

const navigationStateChange = async (_prev, _next, action) => {
	if (firebase.apps.length > 0) {
		const { routeName = "" } = action
		const eventName = `Page_${routeName.replace(/\//g, "011").replace(/\W/g, "_")}`
		await analytics().logEvent(eventName, {
			data: JSON.stringify(action),
		})
	}
	// 	switch (action.type) {
	// 		case 'Navigation/BACK':
	// 			break;
	// case 'Navigation/'
	// 		default:
	// 			break;
	// 	}
	// currentActionState = action
}

export { onInactive, inActiveTimer, navigationStateChange }
