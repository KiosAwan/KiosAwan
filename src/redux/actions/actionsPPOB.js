
//Cart
export const AddPPOBToCart = (data) => {
    return {
        type: "ADD_PRODUCT_PPOB",
        payload: data
    }
}

export const RemovePPOBFromCart = (item) => {
    return {
        type: "REMOVE_PPOB_ITEM",
        payload: item
    }
}
