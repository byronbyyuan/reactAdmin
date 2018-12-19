import React,{ Component } from 'react';

import {Route,withRouter} from 'react-router-dom';

import PropTypes from 'prop-types';

import  {connect} from 'react-redux'

import { user } from '../redux/actions'

class PrivateRoute extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isAuthenticated:true
        }
    }
    async componentDidMount (){
      if(this.props.userInfo && this.props.userInfo.staffname && this.isAuth(this.props.userInfo.roles)){
        return;
      }else{
        // let staff = await this.ajax('getStaff')
        // let staffRoles = await this.ajax('getStaffRoles')
        let staff = {
            staffname:'yby',
            staffid:10779
        }
        let staffRoles = ['admin']
        this.props.setUser({
            staffname:staff.StaffName,
            staffid:staff.StaffID,
            roles:staffRoles
        })
        if(this.isAuth(staffRoles))return
      }
      this.redirect();
    }
    redirect() {
        const { history } = this.props
        this.setState({ isAuthenticated: false })
        history.replace('/')
    }
    isAuth(roles) {
        return (!this.props.roles || !this.props.roles.length) ? true : roles.some(item => this.props.roles.includes(item));
    }
    render() {
        let { component: Component,path="/",exact=false,strict=false} = this.props;
        return this.state.isAuthenticated ?  (
            <Route  path={path} exact={exact}  strict={strict}  render={(props)=>( <Component {...props} /> )} />
        ) : ("无权限");
    }
}

PrivateRoute.propTypes  = {
    path:PropTypes.string.isRequired,
    exact:PropTypes.bool,
    strict:PropTypes.bool,
    component:PropTypes.func.isRequired,
    roles:PropTypes.array
}

const mapState = (state,ownProps) => {
    return {
        userInfo:state.user
    }
}

const mapDispatch = (dispatch,ownProps) =>{
    return {
        setUser:data =>{
            dispatch(user.setUser(data))
        },
        DelUser:()=>{
            dispatch(user.delUser())
        }
    }
}

export default connect(mapState,mapDispatch)(withRouter(PrivateRoute))