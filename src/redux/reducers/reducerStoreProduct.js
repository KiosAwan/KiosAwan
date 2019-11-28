const initialState = {
    data : [],
    isError : false,
    isLoading : true,
    total  : 0,
    belanja : [],
    jumlahitem : 0,
    customer : []
}

const reducerStoreProduct = (state = initialState, actions) => {
    switch(actions.type) {
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
        case "ADD_TO_CART" :
            let newBelanja = actions.payload
            let existeditem = state.belanja.find(item => newBelanja.id_product == item.id_product)
            let itemInProduct = state.data.indexOf(newBelanja)
            if(existeditem) {
                newBelanja.quantity++,
                state.jumlahitem++
                return {
                    ...state,
                    total : state.total + parseInt(newBelanja.price_out_product) 
            }}
            else {                
                newBelanja.quantity = 1
                state.jumlahitem++
                let newTotal = state.total + parseInt(newBelanja.price_out_product)
                return {
                    ...state,
                    total : newTotal,
                    belanja : [...state.belanja, newBelanja],
                }
            }
        case "REMOVE_ALL" :
            return {
                ...state,
                belanja : [],
                total : 0,
                jumlahitem : 0
            }
        case "QUANTITY_INCREMENT" : 
            let itemTambah = actions.payload
            const itemMauDitambah = state.belanja.find(item => itemTambah.id_product === item.id_product)
            if(itemMauDitambah) {
            itemMauDitambah.quantity++
            state.jumlahitem++
            return {
                ...state,
                total : state.total + parseInt(itemMauDitambah.price_out_product),
                belanja : [...state.belanja]
            }
        }
        case "QUANTITY_DECREMENT" : 
            let itemKurang = actions.payload
            const itemMauDikurang = state.belanja.find(item => itemKurang.id_product === item.id_product)
            if(itemMauDikurang) {            
                if(itemMauDikurang.quantity != 0) {
                    itemMauDikurang.quantity--
                    state.jumlahitem--
                    if(itemMauDikurang.quantity == 0) {
                        let a = state.belanja.filter(item => item.id_product != itemMauDikurang.id_product)
                        return {
                            ...state,
                            total : state.total - parseInt(itemMauDikurang.price_out_product),
                            belanja : a
                        } 
                    }
                    else {
                        return {
                            ...state,
                            total : state.total - parseInt(itemMauDikurang.price_out_product),
                            belanja : [...state.belanja]
                        }
                    }                  
                }        
        }
        default : 
            return state            
    }
}

export default reducerStoreProduct