import PPOBFitur from "./PPOBFitur"
import PPOBSetting from "./PPOBSetting"
import PPOB from "src/screens/AuthScreen/PPOB/PPOB"
import Topup from "src/screens/AuthScreen/PPOB/Topup"
import TopupDetail from "src/screens/AuthScreen/PPOB/TopupDetail"
import RiwayatTransaksi from "src/screens/AuthScreen/PPOB/RiwayatTransaksi"
import Favorite from "src/screens/AuthScreen/PPOB/Favorite"

const PPOBNavigator = {
	'/ppob': {
		screen: PPOB,
	},
	'/ppob/favorit': {
		screen: Favorite,
	},
	'/ppob/riwayat': {
		screen: RiwayatTransaksi,
		navigationOptions: {
			header: null
		}
	},
	'/ppob/topup': {
		screen: Topup,
		navigationOptions: {
			header: null
		}
	},
	'/ppob/topup/detail': {
		screen: TopupDetail,
		navigationOptions: {
			header: null
		}
	},
	...PPOBFitur,
	...PPOBSetting
}
export default PPOBNavigator