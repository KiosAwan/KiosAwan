//Action for adding product name to reducer 
export const addProductName = (name) => {
    return {
        type : "ADD_NAME",
        payload : name   
    }
}

//Action for adding product barcode to reducer 
export const addProductBarcode = ( barcode ) => {
    return {
        type : "ADD_BARCODE",
        payload : barcode
    }
}

//Action for adding product priice in to reducer 
export const addProductPriceIn = ( price_in ) => {
    return {
        type : "ADD_PRICE_IN",
        payload : price_in
    }
}

//Action for adding product priice out to reducer 
export const addProductPriceOut = (price_out) => {
    return {
        type : "ADD_PRICE_OUT",
        payload : price_out
    }
}

//Action for adding product category id in to reducer 
export const addProductIdCategory = ( id_category ) => {
    return {
        type : "ADD_ID_CATEGORY",
        payload : id_category
    }
}
export const addQuantityStock = ( qty ) => {
    return {
        type : "ADD_QTY_STOCK",
        payload : qty
    }
}
export const addMinQtyStock = ( min_qty ) => {
    return {
        type : "ADD_QTY_MIN_STOCK",
        payload : min_qty
    }
}

export const addProductImage = ( image ) => {
    return {
        type : "ADD_PRODUCT_IMAGE",
        payload : image
    }
}

//Clear All Data 
export const clearAllNewProduct = ( ) => {
    return {
        type : "CLEAR_ALL_PRODUCT_FORM",
    }
}