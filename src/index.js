import React, { Component } from 'react'
import ReactDom from 'react-dom'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import lazyLoad from './plugins/lazyLoad'
import * as Util from './gloab/util'
import PrivateRoute from './plugins/PrivateRoute'

//后台
import Article from './pages/admin/article'
import List from './pages/admin/list'
import Index from './pages/admin/chat'
import AdminCategory from './pages/admin/category'
import menuConfig from './pages/admin/menuConfig'
import Login from './pages/admin/Login'
import Role from './pages/myRole/role'
import RoleDetail from './pages/myRole/roleDetails'
import userRole from './pages/myRole/userLinkRole'

import Admin from './pages/admin'
import {Provider} from 'react-redux'
import store from './redux'
import ajax,{post,get} from './server'
import './index.less'
Component.prototype.ajax = ajax
Component.prototype.post = post
Component.prototype.get = get
Component.prototype.Util = Util

const AdminComponent = ({ match }) => {
    return (
        <Admin>
            <Route path={match.path + "/index"} exact component={Index}></Route>
            <Route path={match.path + "/article"} exact component={Article}></Route>
            <Route path={match.path + "/list"} exact component={List}></Route>
            <Route path={match.path + '/category'} component={AdminCategory}></Route>
            <Route path={match.path + '/menuConfig'} component={menuConfig}></Route>
            <Route path={match.path + '/myRole'} component={Role}></Route>
            <Route path={match.path + '/role'} component={RoleDetail}></Route>
            <Route path={match.path + '/UserRole'} component={userRole}></Route>
        </Admin>
    )
}

ReactDom.render(
    <Provider store={store}>
        <Router>
            <Switch>
                <PrivateRoute path="/admin" component={AdminComponent} roles={['admin']} />
                <Route path="/" exact component={Login}></Route>
            </Switch>
        </Router>
    </Provider>
,document.getElementById("app"))