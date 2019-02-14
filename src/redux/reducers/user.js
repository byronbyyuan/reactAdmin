import { SETUSER, DELUSER, USERDATA, USERMENU, ROLELIST, MENULIST, INSERTURL, ROLEMSG, ROLESATUS ,ROLEDETATIL,SEARCHUSERNAME} from '../type'

let defaultState = {
    user: {
        name: ''
    },
    menuInfo: [
    ],
    roleList: {},
    userData: {},
    menuList: {},
    insertUrl: '',
    roleMsg: {
        userRole:[],
        roleInfo:{
            name:''
        }
    },
    roleStatus: '',
    roleDetail:{
        roleName:'',
        remark:'',
        roleMenu:[]
    },
    searchName:''
}
export default function user(state = defaultState, action) {
    switch (action.type) {
        case SETUSER:
            console.log('data111111state??', action.data)
            return {
                ...state,
                user: action.data
            }
            break;
        case DELUSER:
            return state = {}
            break;
        case USERDATA:
            return {
                ...state,
                userData: action.data
            }
        case USERMENU:
            return {
                ...state,
                menuInfo: action.data
            }
        case ROLELIST:
            return {
                ...state,
                roleList: action.data
            }
        case MENULIST:
            return {
                ...state,
                menuList: action.data
            }
        case INSERTURL:
            return {
                ...state,
                insertUrl: action.data
            }
        case ROLEMSG:
            return {
                ...state,
                roleMsg: action.data
            }
        case ROLESATUS:
            return {
                ...state,
                roleStatus: action.data
            }
        case ROLEDETATIL:
            return {
                ...state,
                roleDetail:action.data
            }
        case SEARCHUSERNAME:
            return{
                ...state,
                searchName:action.data
            }
        default:
            return state
    }
}