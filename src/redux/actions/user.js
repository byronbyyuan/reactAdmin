import { SETUSER,DELUSER,USERDATA,USERMENU,ROLELIST,MENULIST } from '../type'

const setUser = data => {
    return {
        type:SETUSER,
        data
    }
}

const delUser = data => {
    return {
        type:DELUSER,
        data
    }
}

const userData = data => {
    return {
        type:USERDATA,
        data
    }
}
const userMenu = data => {
    return {
        type:USERMENU,
        data
    }
}
const roleList = data =>{
    return {
        type : ROLELIST,
        data
    }
}
const menuList = data =>{
    return {
        type : MENULIST,
        data
    }
}
module.exports = {
    setUser,
    delUser,
    userData,
    userMenu,
    roleList,
    menuList
}