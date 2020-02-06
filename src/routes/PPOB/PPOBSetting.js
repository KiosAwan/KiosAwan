import AturPaketData from "src/screens/AuthScreen/PPOB/HargaPPOB/PaketData"
import AturPulsa from "src/screens/AuthScreen/PPOB/HargaPPOB/Pulsa"
import AturListrik from "src/screens/AuthScreen/PPOB/HargaPPOB/Listrik"
import AturBPJS from "src/screens/AuthScreen/PPOB/HargaPPOB/BPJS"
import AturTvKabel from "src/screens/AuthScreen/PPOB/HargaPPOB/TVKabel"
import AturTelkom from "src/screens/AuthScreen/PPOB/HargaPPOB/Telkom"
import AturKredit from "src/screens/AuthScreen/PPOB/HargaPPOB/Kredit"
import AturPDAM from "src/screens/AuthScreen/PPOB/HargaPPOB/PDAM"
import AturGames from "src/screens/AuthScreen/PPOB/HargaPPOB/Games"
import AturEmoney from "src/screens/AuthScreen/PPOB/HargaPPOB/Emoney"
import SettingHargaPPOB from "src/screens/AuthScreen/PPOB/HargaPPOB"

const PPOBSetting = {
	'/ppob/settings': {
		screen: SettingHargaPPOB,
		navigationOptions: {
			header: null
		}
	},
	'/ppob/settings/pulsa': {
		screen: AturPulsa,
		navigationOptions: {
			header: null
		}
	},
	'/ppob/settings/paketdata': {
		screen: AturPaketData,
		navigationOptions: {
			header: null
		}
	},
	'/ppob/settings/listrik': {
		screen: AturListrik,
		navigationOptions: {
			header: null
		}
	},
	'/ppob/settings/bpjs': {
		screen: AturBPJS,
		navigationOptions: {
			header: null
		}
	},
	'/ppob/settings/tvkabel': {
		screen: AturTvKabel,
		navigationOptions: {
			header: null
		}
	},
	'/ppob/settings/telkom': {
		screen: AturTelkom,
		navigationOptions: {
			header: null
		}
	},
	'/ppob/settings/kredit': {
		screen: AturKredit,
		navigationOptions: {
			header: null
		}
	},
	'/ppob/settings/pdam': {
		screen: AturPDAM,
		navigationOptions: {
			header: null
		}
	},
	'/ppob/settings/games': {
		screen: AturGames,
		navigationOptions: {
			header: null
		}
	},
	'/ppob/settings/emoney': {
		screen: AturEmoney,
		navigationOptions: {
			header: null
		}
	},
}

export default PPOBSetting