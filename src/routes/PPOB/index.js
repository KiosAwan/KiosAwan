import PPOBFitur from "./PPOBFitur"
import PPOBSetting from "./PPOBSetting"
import PPOB from "src/screens/AuthScreen/PPOB/PPOB"
import Topup from "src/screens/AuthScreen/PPOB/Topup"
import RiwayatTransaksi from "src/screens/AuthScreen/PPOB/RiwayatTransaksi"
import Favorite from "src/screens/AuthScreen/PPOB/Favorite"
import StatusPesanan from "src/screens/AuthScreen/PPOB/StatusPesanan"

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
	'/ppob/status': {
		screen: StatusPesanan
	},
	...PPOBFitur,
	...PPOBSetting
}
export default PPOBNavigator