import React, { Component } from 'react'
import { Layout, Menu, Breadcrumb, Icon, Dropdown } from 'antd';
const { SubMenu, Item } = Menu;
const { Header, Content, Sider } = Layout;
import { connect } from 'react-redux'
import { user } from '../../redux/actions/index'
import { Link, withRouter } from 'react-router-dom'
import './index.less'

const menu = (logOut) => {
  return (
    <Menu>
      {/* <Menu.Item>
      <Icon type="lock" theme="outlined" />
      <span className='setting_label'>锁屏</span>
    </Menu.Item> */}
      <Menu.Item onClick={logOut}>
        <Icon type="poweroff" theme="outlined" />
        <span className='setting_label'>注销</span>
      </Menu.Item>
    </Menu>
  )
};
class Admin extends Component {
  constructor(props) {
    super(props)

    this.state = {
      treeData: [
        { menuName: "菜单配置", url: "/admin/menuConfig" ,id:'-1',type:2},
        { menuName: "我的角色", url: "/admin/myRole" ,id:'-2',type:2},
        { menuName: "用户角色", url: "/admin/userRole" ,id:'-3',type:2}
      ]
    }

  };
  componentDidMount() {
    this.get('getUser').then(res => {
      this.props.setUser(res.data)
    })
    this.get('getMenuList').then(res => {
      console.log(res.data.concat(this.state.treeData),'???????///////')
      this.setState({
        treeData: res.data.concat(this.state.treeData)
      },()=>{
        console.log()
      })
    })

  }
  logOut(p) {
    this.get('logOut').then(
      res => {
        this.props.history.push('/')
      }
    )
  }
  render() {
    let treeData = this.state.treeData
    console.log(this.props.children)
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
                  <span className='name'>{this.props.user.name}</span>
                  <img src={require('../../assets/image/header1.png')} alt='' />
                  <Dropdown overlay={menu(this.logOut.bind(this, this.props))} placement='bottomCenter'>
                    <a className="ant-dropdown-link" href="#">
                      <Icon type="setting" theme="outlined" />
                    </a>
                  </Dropdown>
                </div>
              </div>
            </div>
          </Header>
          <Layout>
            <Sider width={200} style={{ background: '#fff' }}>
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
                                <Link to={child[item].url}>{child[item].menuName}</Link>
                              </Menu.Item>
                            })
                          }
                        </SubMenu>
                      )
                    }
                    return <Menu.Item key={treeData[item].id}>
                      <Icon type="inbox" />
                      <span>

                        <Link to={treeData[item].url}>
                          {treeData[item].menuName}
                        </Link>
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

const mapStateToProps = (state) => ({
  user: state.user
})

const mapDispatchToProps = {
  ...user
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Admin))