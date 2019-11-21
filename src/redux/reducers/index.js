import { combineReducers } from 'redux';

// Reducer List
import reducerRegistration from './reducerRegistration'
import reducerUser from './reducerUser';
import reducerNewProduct from './reducerNewProduct';
import reducerStoreCategory from './reducerStoreCategory';
import reducerStoreProduct from './reducerStoreProduct';

const appReducer = combineReducers({
    Registration : reducerRegistration,
    User : reducerUser,
    NewProduct : reducerNewProduct,
    Category : reducerStoreCategory,
    Product : reducerStoreProduct
})

export default appReducer