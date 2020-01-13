export const editProductName = (name) => {
    return {
        type : "EDIT_NAME",
        payload : name   
    }
}

//Action for adding product barcode to reducer 
export const editProductBarcode = ( barcode ) => {
    return {
        type : "EDIT_BARCODE",
        payload : barcode
    }
}

//Action for adding product priice in to reducer 
export const editProductPriceIn = ( price_in ) => {
    return {
        type : "EDIT_PRICE_IN",
        payload : price_in
    }
}

//Action for adding product priice out to reducer 
export const editProductPriceOut = (price_out) => {
    return {
        type : "EDIT_PRICE_OUT",
        payload : price_out
    }
}

//Action for adding product category id in to reducer 
export const editProductIdCategory = ( id_category ) => {
    return {
        type : "EDIT_ID_CATEGORY",
        payload : id_category
    }
}
export const editQuantityStock = ( qty ) => {
    return {
        type : "EDIT_QTY_STOCK",
        payload : qty
    }
}
export const editMinQtyStock = ( min_qty ) => {
    return {
        type : "EDIT_QTY_MIN_STOCK",
        payload : min_qty
    }
}

export const editProductImage = ( image ) => {
    return {
        type : "EDIT_PRODUCT_IMAGE",
        payload : image
    }
}

export const editTempImage = ( image ) => {
    return {
        type : "EDIT_TEMP_IMAGE",
        payload : image
    }
}

export const editProductManageStock = ( mngstock ) => {
    return {
        type : "EDIT_MANAGE_STOCK",
        payload : mngstock
    }
}

export const editProductSendNotif = ( notif ) => {
    return {
        type : "EDIT_SEND_NOTIF",
        payload : notif
    }
}

export const editProductAddId = ( notif ) => {
    return {
        type : "EDIT_ADD_ID_PRODUCT",
        payload : notif
    }
}

//Clear All Data 
export const editRemoveAllNewProduct = ( ) => {
    return {
        type : "EDIT_CLEAR_ALL_PRODUCT_FORM",
    }
}