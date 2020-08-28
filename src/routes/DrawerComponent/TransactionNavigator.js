import TransactionList from "src/screens/AuthScreen/Drawer/Transaction"
import TransactionDetail from "src/screens/AuthScreen/Drawer/Transaction/TransactionDetail"
import TransactionDetailBatalkan from "src/screens/AuthScreen/Drawer/Transaction/TransactionDetailBatalkan"
import TransactionDetailLunasi from "src/screens/AuthScreen/Drawer/Transaction/TransactionDetailLunasi"
import TransactionCetakStruk from "src/screens/AuthScreen/Drawer/Transaction/TransactionCetakStruk"
import TambahPrinter from "src/screens/AuthScreen/Drawer/Transaction/TambahPrinter"
import UbahEmailInfoScreen from "src/screens/AuthScreen/Drawer/Setting/UbahEmailInfoScreen"
import TransactionDigitalDetail from "src/screens/AuthScreen/Drawer/Transaction/TransactionDigitalDetail"
import RingkasanHutang from "src/screens/AuthScreen/Drawer/Transaction/TransactionListHutang"

const TransactionNavigator = {
	"/drawer/transaction": {
		screen: TransactionList,
		navigationOptions: {
			header: null,
		},
	},
	"/drawer/transaction/ringkasan_hutang": {
		screen: RingkasanHutang,
		navigationOptions: {
			header: null,
		},
	},
	"/drawer/transaction/detail": {
		screen: TransactionDetail,
		navigationOptions: {
			header: null,
		},
	},
	"/drawer/transaction/detail/digital": {
		screen: TransactionDigitalDetail,
		navigationOptions: {
			header: null,
		},
	},
	"/drawer/transaction/detail/batalkan": {
		screen: TransactionDetailBatalkan,
		navigationOptions: {
			header: null,
		},
	},
	"/drawer/transaction/detail/lunasi": {
		screen: TransactionDetailLunasi,
		navigationOptions: {
			header: null,
		},
	},
	"/drawer/transaction/cetakstruk": {
		screen: TransactionCetakStruk,
		navigationOptions: {
			header: null,
		},
	},
	"/drawer/transaction/tambahprinter": {
		screen: TambahPrinter,
		navigationOptions: {
			header: null,
		},
	},
	"/drawer/settings/change-email": {
		screen: UbahEmailInfoScreen,
		navigationOptions: {
			header: null,
		},
	},
}

export default TransactionNavigator
