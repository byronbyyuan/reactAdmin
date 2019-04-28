import React, { Component } from 'react';

import { Route, withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';

import { connect } from 'react-redux'

import { user } from '../redux/actions'
import { Spin } from 'antd'
import './noAuth.less'
const menuList = [
    '/admin/index',
    '/admin/menuConfig',
    '/admin/myRole',
    '/admin/userRole',
    '/admin/roleMsg',
    '/admin/userInfo',
    '/admin/insert/',
    '/admin/book/view',
    '/admin/book/category/8'
]
class PrivateRoute extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isAuthenticated: false
        }
    }
    async componentDidMount() {
        let userinfo = await this.get('getUser')
        if (userinfo.data) {
            this.props.setUser(userinfo.data)
            let menulist = await this.get('getMenuList')
            if (!menulist.data) {
                this.redirect()
                return
            }
            this.props.userMenu(menulist.data)
            let data = JSON.stringify(menulist)
            let url = this.props.history.location.pathname
            console.log(url,'c2c2')
            let arr = url.split('/')
            console.log(url,'c2c888')
            let num = (arr[arr.length-1])
            if (!isNaN(Number(num))){
                console.log(!isNaN(Number(num)),'bbbbuuuu')
                url = url.slice(0,url.length-num.length)
            }
            console.log('6',url,'4')
            if (url === '/admin/insert/') {
                url = this.props.history.location.search.split('=')[1]
            }
            let isExist = this.menuExist(data, url)
            // if (url === '/admin/index' ||
            //     url === '/admin/menuConfig' ||
            //     url === '/admin/myRole' ||
            //     url === '/admin/userRole' ||
            //     url === '/admin/roleMsg'
            // ) {
            //     isExist = true
            // }
            menuList.map(res=>{
                if(url.includes(res)){
                    isExist = true
                }
            })

            if (isExist) {
                this.setState({ isAuthenticated: true })
            } else {
                this.redirect()
            }
            // console.log(data, data.length, url, 'ttttttttt', isExist)
        }
    }
    menuExist(data, url) {
        let i = 0
        if (url[0] !== '/' && url.indexOf('http') === -1) {
            return false
        }
        while (i < data.length) {
            i = data.indexOf(url, i)
            if (i === -1) {
                return false
            } else {
                if ((data[i - 1] === '"' && (data[i + url.length] === '"'||data[i + url.length] === '/'))) {
                    return true
                }
                i++
            }
        }
    }
    
    redirect(path = '/404') {
        const { history } = this.props
        this.setState({ isAuthenticated: false })
        history.replace(path)
    }
    isAuth(url) {
        // 拿去 所有的菜单对比当前访问的路径 是否存在 存在返回true 反之false
        //return (!this.props.roles || !this.props.roles.length) ? true : roles.some(item => this.props.roles.includes(item));
    }
    render() {
        let { component: Component, path = "/", exact = false, strict = false } = this.props;
        return this.state.isAuthenticated ? (
            <Route path={path} exact={exact} strict={strict} render={(props) => (<Component {...props} />)} />
        ) : (<div className='errorPage'>
            <Spin className='skin' tip='数据加载中，请稍后'></Spin>
        </div>);
    }
}

PrivateRoute.propTypes = {
    path: PropTypes.string.isRequired,
    exact: PropTypes.bool,
    strict: PropTypes.bool,
    component: PropTypes.func.isRequired,
    roles: PropTypes.array
}

const mapState = (state, ownProps) => {
    return {
        userInfo: state.user.user,
        menuInfo: state.user.menuInfo
    }
}

const mapDispatch = (dispatch, ownProps) => {
    return {
        setUser: data => {
            dispatch(user.setUser(data))
        },
        DelUser: () => {
            dispatch(user.delUser())
        },
        userMenu: (data) => {
            if(JSON.stringify(data)==="{}"){
                data = []
            }
            dispatch(user.userMenu(data))
        }
    }
}

export default connect(mapState, mapDispatch)(withRouter(PrivateRoute))