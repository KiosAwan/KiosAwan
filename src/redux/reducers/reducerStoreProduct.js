const initialState = {
    data: [],
    isError: false,
    isLoading: true,
    total: 0,
    total_diskon: 0,
    discount_transaction: 0,
    belanja: [],
    ppob_cart: [],
    jumlahitem: 0,
    cash_payment: 0,
    due_debt_date: null,
    customer: null,
    discount_total_persen: 0,
    discount_total_rupiah: 0,
    discount_name: '',
    catatan_pembelian: '',
    discount_on: false,
    note: ''
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
        case "CHANGE_DISCOUNT_ON":
            return {
                ...state,
                discount_on: !state.discount_on
            };
        case "RESET_ALL_DISCOUNT":
            return {
                ...state,
                total_diskon: 0
            };
        case "ADD_BY_BAROCDE":
            let barcode = actions.payload.barcode
            let barcodeQty = actions.payload.quantity
            let barcodeProduct = state.data.find(item => barcode == item.barcode_product)
            let barcodeExistedItem = state.belanja.find(item => barcode == item.barcode_product)
            if (barcodeExistedItem) {
                barcodeProduct.quantity += barcodeQty,
                    barcodeProduct.total += barcodeProduct.price_out_product * barcodeQty
                state.jumlahitem += barcodeQty
                if (!barcodeProduct.discount_rupiah) {
                    barcodeProduct.discount_total += parseInt(barcodeProduct.discount_persen) / 100 * parseInt(barcodeProduct.price_out_product)
                    return {
                        ...state,
                        total: state.total + parseInt(barcodeProduct.price_out_product) * parseInt(barcodeQty),
                        total_diskon: state.total_diskon + parseInt(barcodeProduct.discount_persen) / 100 * parseInt(barcodeProduct.price_out_product) * parseInt(barcodeQty),
                        belanja: [...state.belanja]
                    }
                }
                else {
                    return {
                        ...state,
                        total: state.total + parseInt(barcodeProduct.price_out_product) * parseInt(barcodeQty)
                    }
                }
            }
            else {
                barcodeProduct.quantity = barcodeQty
                state.jumlahitem += barcodeQty
                barcodeProduct.discount_rupiah = false
                barcodeProduct.discount_persen = 0
                barcodeProduct.discount_total = 0
                barcodeProduct.total = barcodeProduct.price_out_product * barcodeQty
                let newTotal = state.total + parseInt(barcodeProduct.price_out_product) * parseInt(barcodeQty)
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
        case "CHANGE_QUANTITY_MANUAL":
            let product_data = actions.payload
            const itemDimaksud = state.belanja.find(item => product_data.id_product === item.id_product)
            const temp_item_quantity = itemDimaksud.quantity
            const temp_discount_total = itemDimaksud.discount_total
            let manual_trx_discount = 0
            if (state.discount_total_persen > 0) {
                manual_trx_discount = (parseInt(state.discount_total_persen) / 100) * parseInt(itemDimaksud.price_out_product) * parseInt(product_data.quantity - temp_item_quantity)
                state.discount_transaction += manual_trx_discount
            }
            itemDimaksud.quantity = product_data.quantity

            if (!itemDimaksud.discount_rupiah) {
                itemDimaksud.total = itemDimaksud.price_out_product * parseInt(itemDimaksud.quantity)
                let newTotalBaru = state.total + itemDimaksud.total - (temp_item_quantity * itemDimaksud.price_out_product)
                itemDimaksud.discount_total = parseInt(itemDimaksud.discount_persen) / 100 * parseInt(itemDimaksud.price_out_product) * parseInt(itemDimaksud.quantity)
                return {
                    ...state,
                    total: newTotalBaru,
                    total_diskon: state.total_diskon + parseInt(itemDimaksud.discount_persen) / 100 * parseInt(itemDimaksud.quantity) * parseInt(itemDimaksud.price_out_product) - parseInt(temp_discount_total) + parseInt(manual_trx_discount),
                    belanja: [...state.belanja]
                }
            }
            else {
                itemDimaksud.discount_rupiah = true
                itemDimaksud.discount_persen = 0
                itemDimaksud.total = itemDimaksud.price_out_product * parseInt(itemDimaksud.quantity)
                return {
                    ...state,
                    total: state.total + itemDimaksud.total - parseInt(itemDimaksud.price_out_product) * parseInt(temp_item_quantity),
                    belanja: [...state.belanja],
                    total_diskon: state.total_diskon + parseInt(manual_trx_discount),
                    jumlahitem: state.jumlahitem + parseInt(itemDimaksud.quantity) - temp_item_quantity
                }
            }
        case "REMOVE_SELECTED_PRODUCT":
            let removedProduct = actions.payload
            const removedItem = state.belanja.find(item => removedProduct.id_product === item.id_product)
            const temp_rmvitem_quantity = removedItem.quantity
            const temp_rmvitem_price = removedItem.price_out_product
            let newTotalRemove = state.total - (parseInt(temp_rmvitem_quantity) * parseInt(temp_rmvitem_price))
            let notRemoveBelanja = state.belanja.filter(item => item.id_product != removedItem.id_product)
            removedItem.quantity = 0
            return {
                ...state,
                total: newTotalRemove,
                jumlahitem: state.jumlahitem - temp_rmvitem_quantity,
                belanja: notRemoveBelanja
            }
        case "REMOVE_ALL":
            return {
                ...state,
                total: 0,
                total_diskon: 0,
                discount_transaction: 0,
                belanja: [],
                jumlahitem: 0,
                cash_payment: 0,
                due_debt_date: null,
                customer: null,
                discount_total_persen: 0,
                discount_total_rupiah: 0,
                discount_name: '',
                catatan_pembelian: '',
                discount_on: false,
                ppob_cart: [],
                note: ''
            }
        case "ADD_PAYMENT_CASH":
            const payment = actions.payload
            return {
                ...state,
                cash_payment: payment
            }
        case "ADD_NOTE":
            const note_text = actions.payload
            return {
                ...state,
                note: note_text
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
            const temp_tex_persen_disc = state.discount_transaction
            return {
                ...state,
                discount_transaction: parseInt(persenDisc == "" ? 0 : persenDisc / 100 * state.total),
                total_diskon: state.total_diskon + (persenDisc == "" ? 0 : persenDisc / 100 * state.total) - parseInt(temp_tex_persen_disc),
                discount_total_persen: persenDisc == "" ? 0 : persenDisc,
                discount_total_rupiah: 0
            }
        case "ADD_DISCOUNT_RUPIAH":
            const rupiahDisc = actions.payload
            const temp_trx_disc = state.discount_transaction
            return {
                ...state,
                discount_transaction: rupiahDisc == "" ? 0 : rupiahDisc,
                discount_total_persen: 0,
                discount_total_rupiah: rupiahDisc == "" ? 0 : rupiahDisc,
                total_diskon: state.total_diskon + (parseInt(rupiahDisc == "" ? 0 : rupiahDisc)) - parseInt(temp_trx_disc)
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
                state.jumlahitem++
                let plus_trx_discount = 0
                if (state.discount_total_persen > 0) {
                    plus_trx_discount = (parseInt(state.discount_total_persen) / 100) * parseInt(itemTambah.price_out_product)
                    state.discount_transaction += plus_trx_discount
                }
                if (!itemMauDitambah.discount_rupiah) {
                    itemMauDitambah.discount_total += parseInt(itemMauDitambah.discount_persen) / 100 * parseInt(itemMauDitambah.price_out_product)
                    return {
                        ...state,
                        total: state.total + parseInt(itemMauDitambah.price_out_product),
                        total_diskon: state.total_diskon + plus_trx_discount + parseInt(itemMauDitambah.discount_persen) / 100 * parseInt(itemMauDitambah.price_out_product),
                        belanja: [...state.belanja]
                    }
                }
                else {
                    itemTambah.discount_rupiah = true
                    itemTambah.discount_persen = 0
                    itemMauDitambah.total += itemMauDitambah.price_out_product
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
                let plus_trx_discount = 0
                if (state.discount_total_persen > 0) {
                    plus_trx_discount = (parseInt(state.discount_total_persen) / 100) * parseInt(itemTambah.price_out_product)
                    state.discount_transaction += plus_trx_discount
                }
                let newTotal = state.total + parseInt(itemTambah.price_out_product)
                return {
                    ...state,
                    total: newTotal,
                    belanja: [...state.belanja, itemTambah],
                    total_diskon: state.total_diskon + plus_trx_discount
                }
            }
        case "ADD_DISCOUNT_PRODUCT_RUPIAH":
            let itemDiskonRupiah = actions.payload.item
            let besar_diskon = actions.payload.besar_diskon
            const discountItemRupiah = state.belanja.find(item => itemDiskonRupiah.id_product === item.id_product)
            if (discountItemRupiah) {
                let log_diskon = itemDiskonRupiah.discount_total
                itemDiskonRupiah.discount_total = 0
                itemDiskonRupiah.discount_persen = 0
                itemDiskonRupiah.discount_rupiah = true
                itemDiskonRupiah.discount_total = besar_diskon == "" ? 0 : besar_diskon
                return {
                    ...state,
                    total_diskon: state.total_diskon - log_diskon + parseInt(itemDiskonRupiah.discount_total),
                }
            }
        case "ADD_DISCOUNT_PRODUCT_PERSEN":
            let itemDiskonPersen = actions.payload.item
            let persen_diskon = actions.payload.besar_diskon
            const discountItemPersen = state.belanja.find(item => itemDiskonPersen.id_product === item.id_product)
            if (discountItemPersen) {
                let diskon_sebelum = itemDiskonPersen.discount_total == "" ? 0 : itemDiskonPersen.discount_total
                itemDiskonPersen.discount_total = 0
                itemDiskonPersen.discount_rupiah = false
                itemDiskonPersen.discount_persen = persen_diskon
                persen_diskon !== "" ? itemDiskonPersen.discount_total = parseInt(persen_diskon) / 100 * parseInt(itemDiskonPersen.price_out_product) * itemDiskonPersen.quantity : null
                return {
                    ...state,
                    total_diskon: parseInt(state.total_diskon) - parseInt(diskon_sebelum) + parseInt(itemDiskonPersen.discount_total)
                }
            }
        case "ADD_PRODUCT_PPOB":
            let ppob_item = actions.payload
            ppob_item.quantity = 1
            console.debug("PPOB")
            state.jumlahitem++
            let c = 0
            if (state.discount_total_persen > 0) {
                c = (parseInt(state.discount_total_persen) / 100) * parseInt(ppob_item.price)
            }
            let totalWithPPOB = state.total + parseInt(ppob_item.price)
            return {
                ...state,
                total: totalWithPPOB,
                ppob_cart: [...state.ppob_cart, ppob_item],
                total_diskon: state.total_diskon + c
            }
        case "QUANTITY_DECREMENT":
            let itemKurang = actions.payload
            const itemMauDikurang = state.belanja.find(item => itemKurang.id_product === item.id_product)
            if (itemMauDikurang) {
                if (itemMauDikurang.quantity != 0) {
                    itemMauDikurang.total -= itemMauDikurang.price_out_product
                    itemMauDikurang.quantity--
                    state.jumlahitem--
                    let minus_trx_discount = 0
                    if (state.discount_total_persen > 0) {
                        minus_trx_discount = (parseInt(state.discount_total_persen) / 100) * parseInt(itemMauDikurang.price_out_product)
                        state.discount_transaction -= minus_trx_discount
                    }
                    if (!itemMauDikurang.discount_rupiah) {
                        itemMauDikurang.discount_total -= parseInt(itemMauDikurang.discount_persen) / 100 * parseInt(itemMauDikurang.price_out_product)
                        if (itemMauDikurang.quantity == 0) {
                            let a = state.belanja.filter(item => item.id_product != itemMauDikurang.id_product)
                            return {
                                ...state,
                                total: state.total - parseInt(itemMauDikurang.price_out_product),
                                total_diskon: state.total_diskon - parseInt(itemMauDikurang.discount_persen) / 100 * parseInt(itemMauDikurang.price_out_product) - minus_trx_discount,
                                belanja: a
                            }
                        }
                        else {
                            return {
                                ...state,
                                total: state.total - parseInt(itemMauDikurang.price_out_product),
                                total_diskon: state.total_diskon - parseInt(itemMauDikurang.discount_persen) / 100 * parseInt(itemMauDikurang.price_out_product) - minus_trx_discount,
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