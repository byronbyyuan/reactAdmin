import { INCREMENT_COUNTER,DECREMENT_COUNTER } from '../type'

export default function test(state = 0, action) {
    switch (action.type) {
        case INCREMENT_COUNTER:
            return state +1
            break;
        case DECREMENT_COUNTER:
            return state -1
            break;            
        default:
            return state
    }
}