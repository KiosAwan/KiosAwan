const initialState = {
    data: [],
    isError: false,
    isLoading: true,
    total: 0,
    total_diskon: 0,
    belanja: [],
    jumlahitem: 0,
    cash_payment: 0,
    due_debt_date: null,
    customer: null,
    discount_total_persen: 0,
    discount_total_rupiah: 0,
    discount_name: '',
    catatan_pembelian: ''
}

const reducerStoreProduct = (state = initialState, actions) => {
    switch (actions.type) {
        case "GET_PRODUCT":
            return {
                ...state,
                data: actions.payload,
                isLoading: true
            };
        case "GET_PRODUCT_FULFILLED":
            return {
                ...state,
                data: actions.payload.data.data,
                isLoading: false
            };
        case "GET_PRODUCT_REJECTED":
            return {
                ...state,
                isError: true,
                isLoading: false
            };
        case "ADD_BY_BAROCDE":
            let barcode = actions.payload
            let barcodeProduct = state.data.find(item => barcode == item.barcode_product)
            let barcodeExistedItem = state.belanja.find(item => barcode == item.barcode_product)
            if (barcodeExistedItem) {
                barcodeProduct.quantity++ ,
                    barcodeProduct.total += barcodeProduct.price_out_product
                state.jumlahitem++
                if (!barcodeProduct.discount_rupiah) {
                    barcodeProduct.discount_total += parseInt(barcodeProduct.discount_persen) / 100 * parseInt(barcodeProduct.price_out_product)
                    return {
                        ...state,
                        total: state.total + parseInt(barcodeProduct.price_out_product),
                        total_diskon: state.total_diskon + parseInt(barcodeProduct.discount_persen) / 100 * parseInt(barcodeProduct.price_out_product),
                        belanja: [...state.belanja]
                    }
                }
                else {
                    return {
                        ...state,
                        total: state.total + parseInt(barcodeProduct.price_out_product)
                    }
                }
            }
            else {
                barcodeProduct.quantity = 1
                state.jumlahitem++
                barcodeProduct.discount_rupiah = false
                barcodeProduct.discount_persen = 0
                barcodeProduct.discount_total = 0
                barcodeProduct.total = barcodeProduct.price_out_product
                let newTotal = state.total + parseInt(barcodeProduct.price_out_product)
                return {
                    ...state,
                    total: newTotal,
                    belanja: [...state.belanja, barcodeProduct],
                }
            }
        case "ADD_TO_CART_MANUAL":
            let newBelanja = actions.payload
            newBelanja.discount_rupiah = false
            newBelanja.discount_persen = 0
            newBelanja.discount_total = 0
            newBelanja.total = newBelanja.price_out_product * parseInt(newBelanja.quantity)
            let newTotal = state.total + newBelanja.total
            return {
                ...state,
                total: newTotal,
                belanja: [...state.belanja, newBelanja],
                jumlahitem: state.jumlahitem + parseInt(newBelanja.quantity)
            }
        case "REMOVE_ALL":
            return {
                ...state,
                belanja: [],
                total: 0,
                total_diskon: 0,
                jumlahitem: 0
            }
        case "ADD_PAYMENT_CASH":
            const payment = actions.payload
            return {
                ...state,
                cash_payment: payment
            }
        case "ADD_DEBT_DATE":
            const date = actions.payload
            return {
                ...state,
                due_debt_date: date
            }
        case "ADD_CUSTOMER":
            const a = actions.payload
            return {
                ...state,
                customer: a
            }
        case "ADD_TRANSACTION_NOTES":
            const notes = actions.payload
            return {
                ...state,
                catatan_pembelian: notes
            }
        case "ADD_DISCOUNT_PERSEN":
            const persenDisc = actions.payload
            if (persenDisc == "" || persenDisc == null) {
                return {
                    ...state,
                    discount_total_persen: null
                }
            } else {
                return {
                    ...state,
                    total_diskon: parseInt(persenDisc) / 100 * state.total,
                    discount_total_persen: persenDisc,
                    discount_total_rupiah: 0
                }
            }
        case "ADD_DISCOUNT_RUPIAH":
            const rupiahDisc = actions.payload
            return {
                ...state,
                total_diskon: rupiahDisc,
                discount_total_persen: 0,
                discount_total_rupiah: rupiahDisc
            }
        case "ADD_DISCOUNT_NAME":
            const name = actions.payload
            return {
                ...state,
                discount_name: name
            }
        case "QUANTITY_INCREMENT":
            let itemTambah = actions.payload
            const itemMauDitambah = state.belanja.find(item => itemTambah.id_product === item.id_product)
            if (itemMauDitambah) {
                itemMauDitambah.quantity++
                itemMauDitambah.total += itemMauDitambah.price_out_product
                state.jumlahitem++
                if (!itemMauDitambah.discount_rupiah) {
                    itemMauDitambah.discount_total += parseInt(itemMauDitambah.discount_persen) / 100 * parseInt(itemMauDitambah.price_out_product)
                    return {
                        ...state,
                        total: state.total + parseInt(itemMauDitambah.price_out_product),
                        total_diskon: state.total_diskon + parseInt(itemMauDitambah.discount_persen) / 100 * parseInt(itemMauDitambah.price_out_product),
                        belanja: [...state.belanja]
                    }
                }
                else {
                    return {
                        ...state,
                        total: state.total + parseInt(itemMauDitambah.price_out_product),
                        belanja: [...state.belanja]
                    }
                }
            }
            else {
                itemTambah.quantity = 1
                itemTambah.discount_rupiah = false
                itemTambah.discount_persen = 0
                itemTambah.discount_total = 0
                itemTambah.total = itemTambah.price_out_product
                state.jumlahitem++
                let newTotal = state.total + parseInt(itemTambah.price_out_product)
                return {
                    ...state,
                    total: newTotal,
                    belanja: [...state.belanja, itemTambah],
                }
            }
        case "ADD_DISCOUNT_PRODUCT_RUPIAH":
            let itemDiskonRupiah = actions.payload.item
            let besar_diskon = actions.payload.besar_diskon
            const discountItemRupiah = state.belanja.find(item => itemDiskonRupiah.id_product === item.id_product)
            if (discountItemRupiah) {
                let log_diskon = itemDiskonRupiah.discount_total
                itemDiskonRupiah.discount_total = 0
                itemDiskonRupiah.discount_persen = false
                itemDiskonRupiah.discount_rupiah = true
                itemDiskonRupiah.discount_total = besar_diskon
                return {
                    ...state,
                    total_diskon: state.total_diskon - log_diskon + itemDiskonRupiah.discount_total,
                }
            }
        case "ADD_DISCOUNT_PRODUCT_PERSEN":
            let itemDiskonPersen = actions.payload.item
            let persen_diskon = actions.payload.besar_diskon
            const discountItemPersen = state.belanja.find(item => itemDiskonPersen.id_product === item.id_product)
            if (discountItemPersen) {
                let diskon_sebelum = itemDiskonPersen.discount_total
                itemDiskonPersen.discount_total = 0
                itemDiskonPersen.discount_rupiah = false
                itemDiskonPersen.discount_persen = persen_diskon
                itemDiskonPersen.discount_total += parseInt(itemDiskonPersen.discount_persen) / 100 * parseInt(itemDiskonPersen.total)
                return {
                    ...state,
                    total_diskon: state.total_diskon - diskon_sebelum + itemDiskonPersen.discount_total
                }
            }
        case "QUANTITY_DECREMENT":
            let itemKurang = actions.payload
            const itemMauDikurang = state.belanja.find(item => itemKurang.id_product === item.id_product)
            if (itemMauDikurang) {
                if (itemMauDikurang.quantity != 0) {
                    itemMauDikurang.total -= itemMauDikurang.price_out_product
                    itemMauDikurang.quantity--
                    state.jumlahitem--
                    if (!itemMauDikurang.discount_rupiah) {
                        itemMauDikurang.discount_total -= parseInt(itemMauDikurang.discount_persen) / 100 * parseInt(itemMauDikurang.price_out_product)
                        if (itemMauDikurang.quantity == 0) {
                            let a = state.belanja.filter(item => item.id_product != itemMauDikurang.id_product)
                            return {
                                ...state,
                                total: state.total - parseInt(itemMauDikurang.price_out_product),
                                total_diskon: state.total_diskon - parseInt(itemMauDikurang.discount_persen) / 100 * parseInt(itemMauDikurang.price_out_product),
                                belanja: a
                            }
                        }
                        else {
                            return {
                                ...state,
                                total: state.total - parseInt(itemMauDikurang.price_out_product),
                                total_diskon: state.total_diskon - parseInt(itemMauDikurang.discount_persen) / 100 * parseInt(itemMauDikurang.price_out_product),
                            }
                        }
                    }

                }
            }
        default:
            return state
    }
}

export default reducerStoreProduct