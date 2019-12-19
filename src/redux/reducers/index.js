import { combineReducers } from 'redux';

// Reducer List
import reducerRegistration from './reducerRegistration'
import reducerUser from './reducerUser';
import reducerNewProduct from './reducerNewProduct';
import reducerStoreCategory from './reducerStoreCategory';
import reducerStoreProduct from './reducerStoreProduct';
import reducerTransactionList from './reducerTransactionList';
import reducerCustomer from './reducerCustomer';
import reducerStoreDiscount from './reducerDiscount';

const appReducer = combineReducers({
    Registration : reducerRegistration,
    User : reducerUser,
    NewProduct : reducerNewProduct,
    Category : reducerStoreCategory,
    Product : reducerStoreProduct,
    Discount : reducerStoreDiscount,
    Transaction : reducerTransactionList,
    Customer : reducerCustomer,
})

export default appReducer