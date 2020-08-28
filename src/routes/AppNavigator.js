import { createAppContainer, createSwitchNavigator } from "react-navigation"

import UnauthNavigator from "./UnauthRoutes"
import CheckMember from "./CheckMember"
import AuthNavigator from "./AuthRoutes"
import AppIntro from "../screens/Registration/AppIntro"
import NotConnected from "../screens/NotConnected"

const transitionConfig = nav => {
	console.debug(nav)
}

const AppNavigator = createSwitchNavigator(
	{
		UnauthNavigator,
		AuthNavigator,
		"/splashscreen": CheckMember,
		"/not-connected": NotConnected,
		"/intro": AppIntro,
	},
	{
		transitionConfig: nav => transitionConfig(nav),
		initialRouteName: "/splashscreen",
	},
)

export default createAppContainer(AppNavigator)
