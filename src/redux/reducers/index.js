import { combineReducers } from 'redux';

// Reducer List
import reducerRegistration from './reducerRegistration'


const appReducer = combineReducers({
    Registration : reducerRegistration
})

export default appReducer