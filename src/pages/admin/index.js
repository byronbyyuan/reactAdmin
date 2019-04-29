import React, { Component } from 'react'
import { Layout, Menu, Breadcrumb, Icon, Dropdown, message } from 'antd';
const { SubMenu, Item } = Menu;
const { Header, Content, Sider } = Layout;
import { connect } from 'react-redux'
import { user } from '../../redux/actions/index'
import { Link, withRouter, BrowserRouter as Router, Route } from 'react-router-dom'
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
const treeData1 =
{
  menuName: "博客系统",
  id: '1',
  url: "",
  type: 1,
  readOnly: false,
  childMenu: [
    {
      menuName: "数据",
      id: '11',
      url: "/yby/admin/index/",
      type: 2,
      readOnly: false
    },
    {
      menuName: "列表",
      id: '12',
      url: "/yby/admin/list/",
      type: 2,
      readOnly: false
    },
    {
      menuName: "分类",
      id: '13',
      url: "/yby/admin/category/",
      type: 2,
      readOnly: false
    },
    {
      menuName: "文章",
      id: '14',
      url: "/yby/admin/article/",
      type: 2,
      readOnly: false
    }
  ]
}
class Admin extends Component {
  constructor(props) {
    super(props)

    this.state = {
      treeData: [
        { menuName: "菜单配置", url: "/admin/menuConfig/", id: '-1', type: 2 },
        { menuName: "我的角色", url: "/admin/myRole/", id: '-2', type: 2 },
        { menuName: "用户角色", url: "/admin/userRole/", id: '-3', type: 2 }
      ],
      lightMenu: [],
      openMenu:[],
      showMenu: ''
    }

  }
  componentDidMount() {
    console.log(this.props.location.pathname,'zzzz')
    let arr = this.props.location.pathname.split('/')
    let num = arr[arr.length-1]
    let url = this.props.location.pathname
    console.log(num,'num')
    if (num === '-1' || num === '-2' || num === '-3') {
      let name = this.state.treeData[Math.abs(num)-1].menuName
      this.setState({showMenu:name})
    } else {
      if (isNaN(Number(num))||num === '') {
        this.setState({showMenu:''})
        return false
      }
      this.get('getMenuId', { id: num}).then(res=>{
        console.log(res,'gggg',res.data.url)
        if (!res.data||(url.includes(res.data.url)===-1||res.data.url.includes(url)===-1)) {
          this.props.history.replace('/404')   
          return
        }
        let light = []
        light.push(res.data.id + '')
        let open = []
        open.push(res.data.parentId + '')
        console.log(light,open,'fff')
        this.setState({lightMenu:light})
        this.setState({openMenu:open})
        let theNmae = res.data.fullName || ''
        this.setState({showMenu:theNmae})
      })
    }
    // let treeData = this.state.treeData.concat(this.props.menuInfo)
    // this.setState({ newTreeData: treeData })
  }
  handClick(value) {
    let name = value.fullName || value.menuName
    console.log(name,value.fullname,value)
    this.setState({showMenu:name})
    if (value.url && value.url.indexOf('http') > -1) {
      this.props.insertUrl(value.url)
      this.props.history.push({ pathname: '/admin/insert/', search: 'src=' + value.url })
    } else {
      if (value.url === '/admin/book/article/') {
        this.props.history.push({ pathname: value.url })
      } else {
        console.log(value.url,'v8v8')
        this.props.history.push({ pathname: value.url + value.id,query:value.id})
      }
    }
  }
  logOut(e) {
    if (e.key === '1') {
      this.props.history.push('userInfo')
    }
    if (e.key === '2') {
      this.get('logOut').then(
        res => {
          if (res.code && res.code === 10001) {
            this.props.history.push('/')
          }
        }
      )
    }
  }
  goToUserInfo() {
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
        <Menu.Item key='2'>
          <Icon type="poweroff" theme="outlined" />
          <span className='setting_label'>注销</span>
        </Menu.Item>
      </Menu>
    )
    console.log(this.state.showMenu)
    const topShow = this.state.showMenu.split('.').map(res=>{
        return <Breadcrumb.Item key={res}>{res}</Breadcrumb.Item>
    })
    //if(JSON.stringify(this.props.menuInfo) === "{}"){this.props.menuInfo=[]}
    //let treeData = this.props.menuInfo.concat(treeData1)
    let treeData = this.state.treeData.concat(this.props.menuInfo)
    console.log(treeData,'lllll')
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
                  defaultSelectedKeys={this.state.lightMenu}
                  defaultOpenKeys={this.state.openMenu}
              >
                {
                  Object.keys(treeData).map(item => {
                    if (treeData[item].childMenu) {
                      let child = treeData[item].childMenu
                      return (
                        <SubMenu key={treeData[item].id} title={<span>{treeData[item].icon?<img src={treeData[item].icon} className='imgIcon'/> : <Icon type="inbox" />}{treeData[item].menuName}</span>}>
                          {
                            Object.keys(child).map(item => {
                              return <Menu.Item key={child[item].id}>
                                <span onClick={this.handClick.bind(this, child[item])}>{child[item].menuName}</span>
                              </Menu.Item>
                            })
                          }
                        </SubMenu>
                      )
                    }
                    return <Menu.Item key={treeData[item].id}>
                      {treeData[item].icon?<img src={treeData[item].icon} className='imgIcon'/> : <Icon type="inbox" />}
                      <span>
                        <span onClick={this.handClick.bind(this, treeData[item])}>
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
                {topShow}
                {/* <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item> */}
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
    url: state.user.insertUrl
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