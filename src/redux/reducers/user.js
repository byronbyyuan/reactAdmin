import { SETUSER,DELUSER, USERDATA } from '../type'

export default function user(state = {}, action) {
    switch (action.type) {
        case SETUSER:
            return state = action.data
            break;            
        case DELUSER:
            return state = {}
            break;
        case USERDATA:
            return state = {name:'wodename'}            
        default:
            return state
    }
}