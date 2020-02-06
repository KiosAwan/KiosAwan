import PPOB from "src/screens/AuthScreen/PPOB/PPOB"
import Topup from "src/screens/AuthScreen/PPOB/Topup"
import TopupDetail from "src/screens/AuthScreen/PPOB/TopupDetail"
import RiwayatTransaksi from "src/screens/AuthScreen/PPOB/RiwayatTransaksi"

// Fitur PPOB
import PpobPulsa from "src/screens/AuthScreen/PPOB/Pulsa"
import PpobPaketData from "src/screens/AuthScreen/PPOB/PaketData"

// Settings PPOB
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
	// {PPOB Fitur}
	'/ppob/pulsa': {
		screen: PpobPulsa,
		navigationOptions: {
			header: null
		}
	},
	'/ppob/paketdata': {
		screen: PpobPaketData,
		navigationOptions: {
			header: null
		}
	},

	// {Settings PPOB}
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
export default PPOBNavigator