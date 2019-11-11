import { createStore, applyMiddleware} from 'redux'
// import thunkMiddleware from 'redux-thunk'

import appReducer from './reducers'
import middlewares from './middlewares'

const store = createStore(appReducer , applyMiddleware(...middlewares))

export default store