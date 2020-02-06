import PPOB from "src/screens/AuthScreen/PPOB/PPOB"
import Topup from "src/screens/AuthScreen/PPOB/Topup"
import TopupDetail from "src/screens/AuthScreen/PPOB/TopupDetail"
import RiwayatTransaksi from "src/screens/AuthScreen/PPOB/RiwayatTransaksi"
import PpobPulsa from "src/screens/AuthScreen/PPOB/Pulsa"
import SettingHargaPPOB from "src/screens/AuthScreen/PPOB/HargaPPOB"
import AturPaketData from "src/screens/AuthScreen/PPOB/HargaPPOB/PaketData"
import AturPulsa from "src/screens/AuthScreen/PPOB/HargaPPOB/Pulsa"
import AturListrik from "src/screens/AuthScreen/PPOB/HargaPPOB/Listrik"
import AturBPJS from "src/screens/AuthScreen/PPOB/HargaPPOB/BPJS"
import AturTvKabel from "src/screens/AuthScreen/PPOB/HargaPPOB/TVKabel"
import AturTelkom from "src/screens/AuthScreen/PPOB/HargaPPOB/Telkom"

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
	'/ppob/pulsa': {
		screen: PpobPulsa,
		navigationOptions: {
			header: null
		}
	},
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
}
export default PPOBNavigator