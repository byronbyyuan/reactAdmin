import { SETUSER,DELUSER } from '../type'

export default function user(state = {}, action) {
    switch (action.type) {
        case SETUSER:
            return state = action.data
            break;            
        case DELUSER:
            return state = {}
            break;            
        default:
            return state
    }
}