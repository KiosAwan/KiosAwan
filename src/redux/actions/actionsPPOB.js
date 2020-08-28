//Cart
export const AddPPOBToCart = data => {
	return {
		type: "ADD_PRODUCT_PPOB",
		payload: data,
	}
}

export const SetIdMultiCart = item => {
	return {
		type: "SET_ID_MULTI",
		payload: item,
	}
}
