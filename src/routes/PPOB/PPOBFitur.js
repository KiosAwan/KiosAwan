import PpobPulsa from "src/screens/AuthScreen/PPOB/Pulsa"
import PpobPaketData from "src/screens/AuthScreen/PPOB/PaketData"
import PpobListrik from "src/screens/AuthScreen/PPOB/Listrik"
import ListrikToken from "src/screens/AuthScreen/PPOB/Listrik/ListrikToken"
import ListrikNonTagihanListrik from "src/screens/AuthScreen/PPOB/Listrik/ListrikNonTagihanListrik"
import ListrikPrabayar from "src/screens/AuthScreen/PPOB/Listrik/ListrikPrabayar"
import BPJS from "src/screens/AuthScreen/PPOB/BPJS"
import TVKabel from "src/screens/AuthScreen/PPOB/TVKabel"
import Telkom from "src/screens/AuthScreen/PPOB/Telkom"
import Kredit from "src/screens/AuthScreen/PPOB/Kredit"
import PDAM from "src/screens/AuthScreen/PPOB/PDAM"
import Emoney from "src/screens/AuthScreen/PPOB/Emoney"
import Asuransi from "src/screens/AuthScreen/PPOB/Asuransi"
import AsuransiTipus from "src/screens/AuthScreen/PPOB/Asuransi/AsuransiTipus"

const PPOBFitur = {
	'/ppob/pulsa': {
		screen: PpobPulsa
	},
	'/ppob/paketdata': {
		screen: PpobPaketData
	},
	'/ppob/listrik': {
		screen: PpobListrik
	},
	'/ppob/listrik/token': {
		screen: ListrikToken
	},
	'/ppob/listrik/ntl': {
		screen: ListrikNonTagihanListrik
	},
	'/ppob/listrik/prabayar': {
		screen: ListrikPrabayar
	},
	'/ppob/bpjs': {
		screen: BPJS
	},
	'/ppob/telkom': {
		screen: Telkom
	},
	'/ppob/tvkabel': {
		screen: TVKabel
	},
	'/ppob/kredit': {
		screen: Kredit
	},
	'/ppob/pdam': {
		screen: PDAM
	},
	'/ppob/emoney': {
		screen: Emoney
	},
	'/ppob/asuransi': {
		screen: Asuransi
	},
	'/ppob/asuransi/tipus':{
		screen: AsuransiTipus
	}
}

export default PPOBFitur