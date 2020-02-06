import PpobPulsa from "src/screens/AuthScreen/PPOB/Pulsa"
import PpobPaketData from "src/screens/AuthScreen/PPOB/PaketData"
import PpobListrik from "src/screens/AuthScreen/PPOB/Listrik"
import ListrikToken from "src/screens/AuthScreen/PPOB/Listrik/ListrikToken"
import ListrikNonTagihanListrik from "src/screens/AuthScreen/PPOB/Listrik/ListrikNonTagihanListrik"
import ListrikPrabayar from "src/screens/AuthScreen/PPOB/Listrik/ListrikPrabayar"

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
}

export default PPOBFitur