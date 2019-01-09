import { SETUSER, DELUSER, USERDATA, USERMENU, ROLELIST, MENULIST } from '../type'

export default function user(state = {}, action) {
    console.log("$$$$$$$$$$$$$$", action, state)
    switch (action.type) {
        case SETUSER:
            return state = action.data
            break;
        case DELUSER:
            return state = {}
            break;
        case USERDATA:
            return state = action.data
        case USERMENU:
            return state = action.data
        case ROLELIST:
            return state = action.data
        case MENULIST:
            return state = action.data
        default:
            return state
    }
}