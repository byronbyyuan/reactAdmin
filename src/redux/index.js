import reducers from './reducers'
import { combineReducers ,createStore} from 'redux'

const rootReducer = combineReducers({...reducers});

const store = createStore(rootReducer)

export default store