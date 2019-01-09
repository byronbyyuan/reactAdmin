import * as http  from './http'


//api 区分请求 地址管理
const api = {
    post:{ 
        signUp:'/user/signUp',    // 注册
        signIn:'/user/signIn',    // 登录   
        createMenu:'/menu/createMenu', // 创建菜单
        updateMenu:'/menu/updateMenu', // 更新菜单
        createCategory:'/book/createCategory',  // 创建博客分类
        updateCategory:'/book/updateCategory', // 创建博客分类
    },
    get:{
        getUser:'/user/getUser', // 获取用户信息
        logOut:'/user/logOut',    // 注销
        getQiniuToken:'/common/getQiniuToken', // 获取七牛token
        getMyMenuList:'/menu/getMyMenuList', // 获取我创建的菜单
        deleteMenu:'/menu/deleteMenu', // 删除我的菜单
        getCategoryList:'/book/getCategoryList', // 获取博客分类
        deleteCategory:'/book/deleteCategory', // 删除博客分类
    }
}


export const post = (name,data)=>{
    return http['post'](api['post'][name],data)
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




