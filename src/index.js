import React, { Component } from 'react'
import ReactDom from 'react-dom'
import {BrowserRouter as Router, Route, Switch,Redirect} from 'react-router-dom'
import * as Util from './gloab/util'
import PrivateRoute from './plugins/PrivateRoute'

//后台
import Article from './pages/admin/article'
import List from './pages/admin/list'
import Index from './pages/admin/chat'
import AdminCategory from './pages/admin/category'
import menuConfig from './pages/admin/menuConfig'
import Login from './pages/admin/Login'
import Role from './pages/admin/myRole/role'
import RoleDetail from './pages/admin/myRole/roleDetails'
import userRole from './pages/admin/myRole/userLinkRole'
import errorPage from './pages/admin/404'
import insert from './pages/admin/insert'
import roleMsg from './pages/admin/myRole/roleMsg'
import userInfo from './pages/admin/userInfo/index.js'
import Comments from './pages/admin/comments'
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
            <Route path={match.path + "/book/article/:articleId?"} exact component={Article}></Route>
            <Route path={match.path + "/book/list"} exact component={List}></Route>
            <Route path={match.path + '/book/category'} component={AdminCategory}></Route>
            <Route path={match.path + '/menuConfig'} component={menuConfig}></Route>
            <Route path={match.path + '/myRole'} component={Role}></Route>
            <Route path={match.path + '/role'} component={RoleDetail}></Route>
            <Route path={match.path + '/book/comments/:articleId?'} component={Comments}></Route>
            <Route path={match.path + '/UserRole'} component={userRole}></Route>
            <Route path={match.path + '/insert/'} component={insert}></Route>
            <Route path={match.path + '/roleMsg/'} component={roleMsg}></Route>
            <Route path={match.path + '/userInfo/'} component={userInfo}></Route>
        </Admin>
    )
}

ReactDom.render(
    <Provider store={store}>
        <Router>
            <Switch>
                <PrivateRoute path="/admin" component={AdminComponent} />
                <Route path={'/404'} component={errorPage}></Route>
                <Route path="/" exact component={Login}></Route>
                <Redirect to="/404"></Redirect>                
            </Switch>
        </Router>
    </Provider>
,document.getElementById("app"))