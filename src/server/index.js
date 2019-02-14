import * as http  from './http'


//api 区分请求 地址管理
const api = {
    post:{
        createRole:'/role/createRole', //创建角色
        updateRole:'/role/updateRole', //更新角色
        createUserRole:'/userRole/createUserRole', //设置关联角色
        updateUserRole:'/userRole/updateUserRole', //更新关联角色
        signUp:'/user/signUp',    // 注册
        signIn:'/user/signIn',    // 登录   
        createMenu:'/menu/createMenu', // 创建菜单
        updateMenu:'/menu/updateMenu', // 更新菜单
        createCategory:'/book/createCategory',  // 创建博客分类
        updateCategory:'/book/updateCategory' // 创建博客分类
    },
    get:{
        getRoleList:'/role/getRoleList', //获取角色列表
        deleteRole:'/role/deleteRole', //删除角色
        getUserRoleList:'/userRole/getUserRoleList', //获取已有关联角色
        deletUserRole:'/userRole/deletUserRole', //删除关联角色
        getRole:'/role/getRole',  //获取角色信息
        getUser:'/user/getUser', // 获取用户信息
        logOut:'/user/logOut',    // 注销
        getQiniuToken:'/common/getQiniuToken', // 获取七牛token
        getMyMenuList:'/menu/getMyMenuList', // 获取我创建的菜单
        deleteMenu:'/menu/deleteMenu', // 删除我的菜单
        getCategoryList:'/book/getCategoryList', // 获取博客分类
        deleteCategory:'/book/deleteCategory',// 删除博客分类
        getUserName:'/user/getUserName', // 查询其他用户信息
        getMenuList:'/menu/getMenuList',
        getRolePrev:'/role/getRolePrev' //获取角色菜单
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




