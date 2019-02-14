import { SETUSER,DELUSER,USERDATA,USERMENU,ROLELIST,MENULIST ,INSERTURL,ROLEMSG,ROLESATUS,ROLEDETATIL,SEARCHUSERNAME} from '../type'

const setUser = data => {
    console.log('data111111',data)
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
    console.log('data1112222',data)
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
const insertUrl = data =>{
    return {
        type : INSERTURL,
        data
    }
}
const roleMsg = data =>{
    return {
        type : ROLEMSG,
        data
    }
}
const roleStatus = data =>{
    return{
        type:ROLESATUS,
        data
    }
}
const roleDetail = data =>{
    return{
        type:ROLEDETATIL,
        data
    }
}
const searchName = data =>{
    console.log(data,'88888888888GGGGGGGG')
    return {
        type:SEARCHUSERNAME,
        data
    }
}
module.exports = {
    setUser,
    delUser,
    userData,
    userMenu,
    roleList,
    menuList,
    insertUrl,
    roleMsg,
    roleStatus,
    roleDetail,
    searchName
}