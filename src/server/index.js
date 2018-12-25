import * as http  from './http'


//api 区分请求 地址管理
const api = {
    post:{
        signUp:'/user/signUp',
        signIn:'/user/signIn',
        getStaff:config.getStaffUrl,//获取用户信息
        getStaffRoles:config.getStaffRolesUrl//获取用户角色        
    },
    get:{
        getUser:'/user/getUser',
        logOut:'/user/logOut'
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




