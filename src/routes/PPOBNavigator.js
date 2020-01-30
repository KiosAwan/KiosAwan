import PPOB from "src/screens/AuthScreen/PPOB/PPOB"
import Topup from "src/screens/AuthScreen/PPOB/Topup"
import TopupDetail from "src/screens/AuthScreen/PPOB/TopupDetail"
import RiwayatTransaksi from "src/screens/AuthScreen/PPOB/RiwayatTransaksi"

const PPOBNavigator = {
	'/ppob': {
		screen: PPOB,
		navigationOptions: {
			header: null
		}
	},
	'/ppob/riwayat': {
		screen: RiwayatTransaksi,
		navigationOptions: {
			header: null
		}
	},
	'/ppob/topup' : {
		screen : Topup,
		navigationOptions : {
			header : null
		}
	},
	'/ppob/topup/detail' : {
		screen : TopupDetail,
		navigationOptions : {
			header : null
		}
	},
}
export default PPOBNavigator