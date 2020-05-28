import Akun from "src/screens/AuthScreen/Drawer"
import TransactionNavigator from "./DrawerComponent/TransactionNavigator"
import SettingNavigator from "./DrawerComponent/SettingNavigator"
import ManajemenNavigator from "./DrawerComponent/ManajemenNavigator"
import Report from "src/screens/AuthScreen/Drawer/Report"
import FAQ from "src/screens/AuthScreen/Drawer/FAQ"
import Help from "src/screens/AuthScreen/Drawer/Help"
import ReportOld from "src/screens/AuthScreen/Drawer/Report copy"

const DrawerNavigation = {
	'/drawer': {
		screen: Akun,
		navigationOptions: {
			header: null
		}
	},
	'reportOld': {
		screen: ReportOld,
		navigationOptions: {
			header: null
		}
	},
	'/drawer/laporan': {
		screen: Report,
		navigationOptions: {
			header: null
		}
	},
	'/drawer/faq': {
		screen: FAQ,
		navigationOptions: {
			header: null
		}
	},
	'/drawer/help': {
		screen: Help,
		navigationOptions: {
			header: null
		}
	},
	...TransactionNavigator,
	...SettingNavigator,
	...ManajemenNavigator,
}

export default DrawerNavigation