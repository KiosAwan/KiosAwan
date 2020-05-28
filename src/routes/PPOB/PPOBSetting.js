import SettingHargaPPOB from "src/screens/AuthScreen/PPOB/HargaPPOB"
import SubProduct from "src/screens/AuthScreen/PPOB/HargaPPOB/SubProduct"
import ListTransaksiPPOB from "src/screens/AuthScreen/PPOB/ListTransaksi.js"

const PPOBSetting = {
	'/ppob/settings': {
		screen: SettingHargaPPOB,
		navigationOptions: {
			header: null
		}
	},
	'/ppob/settings/sub-product': {
		screen: SubProduct
	},
	'/ppob/list-transaksi': {
		screen: ListTransaksiPPOB,
	},
}

export default PPOBSetting