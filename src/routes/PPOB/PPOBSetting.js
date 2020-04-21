import SettingHargaPPOB from "src/screens/AuthScreen/PPOB/HargaPPOB"
import SubProduct from "src/screens/AuthScreen/PPOB/HargaPPOB/SubProduct"

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
}

export default PPOBSetting