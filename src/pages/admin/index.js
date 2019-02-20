import React, { Component } from 'react'
import { Layout, Menu, Breadcrumb, Icon, Dropdown, message } from 'antd';
const { SubMenu, Item } = Menu;
const { Header, Content, Sider } = Layout;
import { connect } from 'react-redux'
import { user } from '../../redux/actions/index'
import { Link, withRouter } from 'react-router-dom'
import './index.less'

// const menu = (logOut) => {
//   return (
//     <Menu onClick={logOut}>
//       {/* <Menu.Item>
//       <Icon type="lock" theme="outlined" />
//       <span className='setting_label'>锁屏</span>
//     </Menu.Item> */}
//     <Menu.Item key='1'>
//         <Icon type="user" theme="outlined" />
//         <span className='setting_label'>个人中心</span>
//       </Menu.Item>
//       <Menu.Item key ='2'>
//         <Icon type="poweroff" theme="outlined" />
//         <span className='setting_label'>注销</span>
//       </Menu.Item>
//     </Menu>
//   )
// };
class Admin extends Component {
  constructor(props) {
    super(props)

    this.state = {
      treeData: [
        { menuName: "菜单配置", url: "/admin/menuConfig", id: '-1', type: 2 },
        { menuName: "我的角色", url: "/admin/myRole", id: '-2', type: 2 },
        { menuName: "用户角色", url: "/admin/userRole", id: '-3', type: 2 }
      ]
    }

  };
  componentDidMount() {
  }
  handClick(value) {
    console.log(value, this.props,'ppppppp******')
    if (value&&value.indexOf('http') > -1) {
      this.props.insertUrl(value)
      this.props.history.push({ pathname: '/admin/insert/',search:'src='+value})
    } else {
      this.props.history.push({ pathname: value })
    }
  }
  logOut(e) {
    console.log(e,'tttttttttt')
    if(e.key==='1'){
      this.props.history.push('userInfo')
    }
    if(e.key==='2'){
      this.get('logOut').then(
        res => {
          if (res.code &&res.code === 10001) {
            this.props.history.push('/')
          }
        }
      )
    }
  }
  goToUserInfo(){
    this.props.history.push('userInfo')
  }
  render() {
    const menu = (
        <Menu onClick={this.logOut.bind(this)}>
          {/* <Menu.Item>
          <Icon type="lock" theme="outlined" />
          <span className='setting_label'>锁屏</span>
        </Menu.Item> */}
        <Menu.Item key='1'>
            <Icon type="user" theme="outlined" />
            <span className='setting_label'>个人中心</span>
          </Menu.Item>
          <Menu.Item key ='2'>
            <Icon type="poweroff" theme="outlined" />
            <span className='setting_label'>注销</span>
          </Menu.Item>
        </Menu>
      )

    let treeData = this.props.menuInfo.concat(this.state.treeData)
    console.log(this.props, '787787889999')
    return (
      <div className='admin'>
        <Layout>
          <Header className="header">
            <div className='adminHead'>
              <div className='adminHead_logo'>
                <i></i>
                <h2>后台管理</h2>
              </div>
              <div className='adminHead_userInfo'>
                <div className='userInfo'>
                  <span className='name'>{this.props.userInfo.name}</span>
                  
                  <Dropdown overlay={menu} placement='bottomCenter'>
                    <a className="ant-dropdown-link" href="#">
                        <img src={require('../../assets/image/header1.png')} alt='' />
                    </a>
                  </Dropdown>
                </div>
              </div>
            </div>
          </Header>
          <Layout>
            <Sider width={150} style={{ background: '#fff' }}>
              <Menu mode="inline" style={{ height: '100%', borderRight: 0 }}
              >
                {
                  Object.keys(treeData).map(item => {
                    if (treeData[item].childMenu) {
                      let child = treeData[item].childMenu
                      return (
                        <SubMenu key={treeData[item].id} title={<span><Icon type="user" />{treeData[item].menuName}</span>}>
                          {
                            Object.keys(child).map(item => {
                              return <Menu.Item key={child[item].id}>
                                <span onClick={this.handClick.bind(this, child[item].url)}>{child[item].menuName}</span>
                              </Menu.Item>
                            })
                          }
                        </SubMenu>
                      )
                    }
                    return <Menu.Item key={treeData[item].id}>
                      <Icon type="inbox" />
                      <span>
                        <span onClick={this.handClick.bind(this, treeData[item].url)}>
                          {treeData[item].menuName}
                        </span>
                      </span>
                    </Menu.Item>
                  })
                }
              </Menu>
            </Sider>
            <Layout style={{ padding: '0 24px 24px', minWidth: '860px' }}>
              <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb>
              <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280, minWidth: 810 }}>
                {this.props.children.length ? this.props.children : '欢迎登陆后台管理页'}
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    )
  }
}


const mapState = (state, ownProps) => {
  return {
      userInfo: state.user.user,
      menuInfo: state.user.menuInfo,
      url:state.user.insertUrl
  }
}
const mapDispatch = (dispatch, ownProps) => {
  return {
      insertUrl: data => {
          dispatch(user.insertUrl(data))
      }
  }
}

export default withRouter(connect(mapState, mapDispatch)(Admin))