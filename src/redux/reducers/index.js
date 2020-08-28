import { combineReducers } from "redux"
import { persistReducer } from "redux-persist"
import createEncryptor from "redux-persist-transform-encrypt"
import Storage, { storageKey as key } from "src/utils/keyStores"

// Reducer List
import reducerRegistration from "./reducerRegistration"
import reducerUser from "./reducerUser"
import reducerNewProduct from "./reducerNewProduct"
import reducerStoreCategory from "./reducerStoreCategory"
import reducerStoreProduct from "./reducerStoreProduct"
import reducerTransactionList from "./reducerTransactionList"
import reducerCustomer from "./reducerCustomer"
import reducerStoreDiscount from "./reducerDiscount"
import reducerEditProduct from "./reducerEditProduct"
import reducerPrinter from "./reducerPrinter"
import reducerRiwayatTransaksi from "./reducerRiwayatTransaksi"
import reducerLocale from "./reducerLocale"
import reducerApp from "src/redux/reducers/reducerApp"

const encryptor = createEncryptor({
	secretKey: key,
	onError: error => {
		console.log("reducer error", error)
	},
})

const appReducer = combineReducers({
	Registration: reducerRegistration,
	User: reducerUser,
	NewProduct: reducerNewProduct,
	EditProduct: reducerEditProduct,
	Category: reducerStoreCategory,
	Product: reducerStoreProduct,
	Discount: reducerStoreDiscount,
	Transaction: reducerTransactionList,
	Customer: reducerCustomer,
	Printer: reducerPrinter,

	//PPOB
	RiwayatTransaksi: reducerRiwayatTransaksi,
	Locale: reducerLocale,
	App: reducerApp,
})

const reducer = persistReducer(
	{
		key,
		storage: Storage,
		transforms: [encryptor],
	},
	appReducer,
)

export default reducer
