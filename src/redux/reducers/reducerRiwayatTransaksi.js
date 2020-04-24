const initialState = {
    data: [],
    nextPage: 1,
    total: 1,
    isError: false,
    isLoading: true,
}

const reducerRiwayatTransaksi = (state = initialState, actions) => {
    switch (actions.type) {
        case "GET_RIWAYAT_TRANSAKSI":
            return {
                ...state,
                isLoading: true
            };
        case "GET_RIWAYAT_TRANSAKSI_FULFILLED":
            if (state.nextPage == 1) {
                return {
                    ...state,
                    data: [...actions.payload.data.data.history],
                    nextPage: parseInt(actions.payload.data.data.current_page) + 1,
                    total: parseInt(actions.payload.data.data.total_pages),
                    isLoading: false
                };
            } else {
                return {
                    ...state,
                    data: [...state.data, ...actions.payload.data.data.history],
                    nextPage: parseInt(actions.payload.data.data.current_page) + 1,
                    total: parseInt(actions.payload.data.data.total_pages),
                    isLoading: false
                };
            }
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