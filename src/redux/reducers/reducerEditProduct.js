const initialState = {
    id_product: '',
    barcode: null,
    name: '',
    price_in: '',
    price_out: '',
    id_category: '',
    id_store: '',
    qty_stock: '',
    qty_min_stock: '',
    image: '',
    temp_image: '',
    manageStock: '',
    sendNotif: ''
}

const reducerEditProduct = (state = initialState, actions) => {
    switch (actions.type) {
        case "EDIT_BARCODE":
            return {
                ...state,
                barcode: actions.payload
            }
        case "EDIT_ADD_ID_PRODUCT":
            return {
                ...state,
                id_product: actions.payload
            }
        case "EDIT_NAME":
            return {
                ...state,
                name: actions.payload
            }
        case "EDIT_MANAGE_STOCK":
            return {
                ...state,
                manageStock: actions.payload
            }
        case "EDIT_SEND_NOTIF":
            return {
                ...state,
                sendNotif: actions.payload
            }
        case "EDIT_PRICE_IN":
            return {
                ...state,
                price_in: actions.payload
            }
        case "EDIT_PRICE_OUT":
            return {
                ...state,
                price_out: actions.payload
            }
        case "EDIT_ID_CATEGORY":
            return {
                ...state,
                id_category: actions.payload
            }
        case "EDIT_QTY_STOCK":
            return {
                ...state,
                qty_stock: actions.payload
            }
        case "EDIT_PRODUCT_IMAGE":
            return {
                ...state,
                image: actions.payload
            }
        case "EDIT_TEMP_IMAGE":
            return {
                ...state,
                temp_image: actions.payload
            }
        case "EDIT_QTY_MIN_STOCK":
            return {
                ...state,
                qty_min_stock: actions.payload
            }
        case "EDIT_CLEAR_ALL_PRODUCT_FORM":
            return {
                id_product: '',
                barcode: null,
                name: '',
                price_in: '',
                price_out: '',
                id_category: '',
                id_store: '',
                qty_stock: '',
                qty_min_stock: '',
                image: '',
                manageStock: '',
                sendNotif: '',
                temp_image: ''
            }
        default:
            return state
    }
}

export default reducerEditProduct