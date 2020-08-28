const initialState = {
	barcode: "",
	name: "",
	price_in: "",
	price_out: "",
	id_category: null,
	id_store: "",
	qty_stock: "",
	qty_min_stock: "",
	image: "",
	fromManajemen: null,
}

const reducerNewProduct = (state = initialState, actions) => {
	switch (actions.type) {
		case "SET_ROUTE":
			return {
				...state,
				fromManajemen: actions.payload,
			}
		case "ADD_BARCODE":
			return {
				...state,
				barcode: actions.payload,
			}
		case "ADD_NAME":
			return {
				...state,
				name: actions.payload,
			}
		case "ADD_PRICE_IN":
			return {
				...state,
				price_in: actions.payload,
			}
		case "ADD_PRICE_OUT":
			return {
				...state,
				price_out: actions.payload,
			}
		case "ADD_ID_CATEGORY":
			return {
				...state,
				id_category: actions.payload,
			}
		case "ADD_QTY_STOCK":
			return {
				...state,
				qty_stock: actions.payload,
			}
		case "ADD_PRODUCT_IMAGE":
			return {
				...state,
				image: actions.payload,
			}
		case "ADD_QTY_MIN_STOCK":
			return {
				...state,
				qty_min_stock: actions.payload,
			}
		case "CLEAR_ALL_PRODUCT_FORM":
			return {
				barcode: "",
				name: "",
				price_in: "",
				price_out: "",
				id_category: "",
				id_store: "",
				qty_stock: "",
				qty_min_stock: "",
				image: "",
			}
		default:
			return state
	}
}

export default reducerNewProduct
