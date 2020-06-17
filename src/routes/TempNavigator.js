import UpdateProfil from "src/screens/AuthScreen/Drawer/UpdateProfil"
import VerifikasiEmail from "src/screens/AuthScreen/Drawer/Temp/VerifikasiEmail"

const TempNavigator = {
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