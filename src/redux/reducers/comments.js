import { CLOSECOMMENTS,OPENCOMMENTS } from '../type'

const defaultState = {
    show:false,
    toUser:''
}

export default function comments(state = defaultState, action) {
    switch(action.type) {
        case CLOSECOMMENTS:
        return state = defaultState
        break;
        case OPENCOMMENTS:
        return {
            show:true,
            toUser:action.data
        }
        break;
        default:
        return state
    }
}