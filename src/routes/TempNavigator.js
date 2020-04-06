import CreatePIN from "src/screens/AuthScreen/Drawer/CreatePIN"
import UpdateProfil from "src/screens/AuthScreen/Drawer/UpdateProfil"
import VerifikasiEmail from "src/screens/AuthScreen/Drawer/Temp/VerifikasiEmail"

const TempNavigator = {
	'/temp/create-pin': {
		screen: CreatePIN,
		navigationOptions: {
			header: null
		}
	},
	'/temp/create-pin/re-enter': {
		screen: CreatePIN,
		navigationOptions: {
			header: null
		}
	},
	'/temp/update-profile': {
		screen: UpdateProfil,
		navigationOptions: {
			header: null
		}
	},
	'/temp/verifikasi-email': {
		screen: VerifikasiEmail,
		navigationOptions: {
			header: null
		}
	}
}
export default TempNavigator