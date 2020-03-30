const initialState = {
    data: [],
    isError: false,
    isLoading: true
}

const reducerRiwayatTransaksi = (state = initialState, actions) => {
    switch (actions.type) {
        case "GET_RIWAYAT_TRANSAKSI":
            return {
                ...state,
                // data: actions.payload,
                isLoading: true
            };
        case "GET_RIWAYAT_TRANSAKSI_FULFILLED":
            return {
                ...state,
                data: actions.payload.data.data,
                isLoading: false
            };
        case "GET_RIWAYAT_TRANSAKSI_REJECTED":
            return {
                ...state,
                isError: true,
                isLoading: false
            };
        default:
            return state
    }
}

export default reducerRiwayatTransaksi