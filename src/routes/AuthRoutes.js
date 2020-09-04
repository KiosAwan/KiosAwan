import { createAppContainer } from "react-navigation"
import { createStackNavigator } from "react-navigation-stack"

//Import Screen
import CashierNavigator from "./DrawerComponent/CashierNavigator"
import { fromLeft, fromRight, fadeOut } from "react-navigation-transitions"
import Home from "../screens/AuthScreen/Home"
import NewsScreen from "src/screens/AuthScreen/NewsScreen"
import TempNavigator from "./TempNavigator"
import DrawerNavigation from "./DrawerNavigator"
import EnterPIN from "src/screens/AuthScreen/EnterPIN"
import PPOBNavigator from "./PPOB"
import BottomTabNavigator from "./BottomTabNavigator"
import InputCode from "src/components/Input/InputCode"
import Perangkat from "src/screens/AuthScreen/Printer"
import AddPrinter from "src/screens/AuthScreen/Printer/AddPrinter"

const handleCustomTransition = ({ scenes }) => {
	global.prevScene = scenes[scenes.length - 2]
	global.nextScene = scenes[scenes.length - 1]
	if (
		prevScene &&
		prevScene.route.routeName === "/" &&
		nextScene.route.routeName === "/drawer"
	) {
		return fromLeft(250)
	}
	return fromRight()
}

const Navs = {
	"/": {
		screen: BottomTabNavigator,
		navigationOptions: {
			header: null,
		},
	},
	"/input-code": {
		screen: InputCode,
		navigationOptions: {
			header: null,
		},
	},
	"/enterpin": {
		screen: EnterPIN,
		navigationOptions: {
			header: null,
		},
	},
	"/news-screen": {
		screen: NewsScreen,
		navigationOptions: {
			header: null,
		},
	},
	"/printer": {
		screen: Perangkat
	},
	"/printer/add": {
		screen: AddPrinter
	},
	...CashierNavigator,
	...DrawerNavigation,
	...PPOBNavigator,
	...TempNavigator,
}
// console.debug(Object.keys(Navs).rMap(key => [key, Navs[key].screen]))

// https://github.com/plmok61/react-navigation-transitions
const AuthNavigator = createStackNavigator(Navs, {
	headerMode: "none",
	initialRouteName: "/",
	transitionConfig: nav => handleCustomTransition(nav),
})

export default createAppContainer(AuthNavigator)
