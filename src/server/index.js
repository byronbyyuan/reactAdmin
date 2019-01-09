import * as http  from './http'


//api 区分请求 地址管理
const api = {
    post:{
        signUp:'/user/signUp',
        signIn:'/user/signIn',
        createRole:'/role/createRole',
        updateRole:'/role/updateRole',
        createUserRole:'/userRole/createUserRole', //设置关联角色
        updateUserRole:'/userRole/updateUserRole', //更新关联角色
        getStaff:config.getStaffUrl,//获取用户信息
        getStaffRoles:config.getStaffRolesUrl//获取用户角色
    },
    get:{
        getUser:'/user/getUser',
        logOut:'/user/logOut',
        getRoleList:'/role/getRoleList',
        deleteRole:'/role/deleteRole',
        getUserRoleList:'/userRole/getUserRoleList', //获取已有关联角色
        deletUserRole:'/userRole/deletUserRole', //删除关联角色
        getMyMenuList:'/menu/getMyMenuList',//获取用户名下菜单
        getRole:'/role/getRole'  //获取角色信息
    }
}


export const post = (name,params)=>{
    return http['post'](api['post'][name],params)
}

export const get = (name,params)=>{
    return http['get'](api['get'][name],params)
}

export default (name,params = {},methods = false) => {
    if(!methods){
        for(let key in api){
            if(name in api[key])methods=key
        }
    }
    return http[methods](api[methods][name],params)
}




