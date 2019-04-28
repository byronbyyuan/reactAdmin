import React, { Component } from 'react'
import "./index.less"
import { Input, Card, Modal, Icon, Table, message, Spin } from 'antd'
import { withRouter } from 'react-router-dom'
import { user } from '../../../../redux/actions/index'
import { connect } from 'react-redux'

const Search = Input.Search
class useRole extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: '',
            visible: false,
            userData: [
            ],
            data: [],
            roleId: [],
            status: false,
            nameOfUser: '',
            noRepeat: false,
            repeatList: [],
            returnRole: [],
            roleListMsg: [],
            current: 1,
            layout: true,
            loading: false,
            tableLoading: false,
            deletaBox: false
        }
    }
    componentDidMount() {
        console.log('bsdfjdsfdsbfdsvdsv1!!!!!',this.props)
    }
    componentWillUnmount() {
        this.props.roleStatus(false)
    }
    searchName(name){
        if (!name.userName) return message.warning('用户名不能为空')
        this.getUserName(name)
    }
    getUserName(name) {
        this.props.searchName(name.userName)       
        this.setState({ loading: true })
        this.get('getUserName', name).then(res => {
            this.setState({ loading: false })
            if (res.code === 10001) {
                this.setState({ nameOfUser: name })
                // this.setState({ userName: res.data.userInfo })
                // this.setState({ userData: res.data.userRole })
                //this.setState({ status: true })
                console.log(res.data,'55555555')
                this.props.roleMsg(res.data)
                this.props.roleStatus(true)
                console.log('area111',this.props)
            } else {
                //this.setState({ status: false })
                this.props.roleStatus(false)
            }
        })
    }
    showModal() {
        if (this.state.layout) {
            this.setState({ layout: false })
            setTimeout(() => {
                this.setState({ layout: true })
            }, 2000)
            console.log(this.props,'props')
            if (this.props.roleInfo.userRole.length >= 5) {
                return message.warning('该用户已关联五个角色，请先删除角色再重新关联')
            }
            this.setState({
                visible: true
            });
        }
    }
    handleOk(e) {
        let value = {}
        value.userId = this.props.roleInfo.userInfo.id
        value.roleId = this.state.roleId
        let data = []
        let bool = false
        let newValue = this.state.roleId.slice()
        console.log('wwww',newValue,this.props.roleInfo.userRole)
        for (let key in this.props.roleInfo.userRole) {
            if (value.roleId.indexOf(this.props.roleInfo.userRole[key].role.id) !== -1) {
                data.push(this.props.roleInfo.userRole[key])
                bool = true
                newValue.splice(value.roleId.indexOf(this.props.roleInfo.userRole[key].role.id), 1)
            }
        }
        if (newValue.length + this.props.roleInfo.userRole.length > 5) {
            return message.warning('每个用户最多关联五个角色，请重新关联')
        }
        if (bool) {
            this.setState({ noRepeat: true })
            this.setState({
                visible: false
            });
            this.setState({ repeatList: data })
        } else {
            this.post('createUserRole', value).then(res => {
                if (res.code === 10001) {
                    this.getUserName(this.state.nameOfUser)
                }
            })
            this.setState({
                visible: false
            });
        }
        this.setState({ returnRole: newValue })
    }
    handOk(e) {
        this.setState({
            noRepeat: false
        });
        let value = {}
        value.userId = this.props.roleInfo.userInfo.id
        value.roleId = this.state.returnRole
        this.setState({
            visible: false
        });
        if (!value.roleId) return
        console.log(value,this.props.roleInfo.userInfo.id)
        this.post('createUserRole', value).then(res => {
            if (res.code === 10001) {
                this.getUserName(this.state.nameOfUser)
            }
        })
    }
    getRoleList(page, pageSize, roleName) {
        let value = {}
        //this.setState({ tableLoading: true })
        value.page = page
        value.size = pageSize
        value.roleName = ''
        if (roleName) {
            value.roleName = roleName
        }
        this.setState({ tableLoading: true })
        this.get('getRoleList', value).then(res => {
            if (res.code === 10001) {
                this.setState({ data: res.data })
            }
            this.setState({ tableLoading: false })
        })
    }
    handleCancel(e) {
        console.log(e);
        this.setState({
            visible: false
        });
    }
    onThisClick(){
        console.log(this.props,this.state)
    }
    handCancel(e) {
        console.log(e);
        this.setState({
            noRepeat: false
        });
    }
    onDelete(data) {
        this.setState({ deletaBox: true })
    }
    onDetail(data) {
        this.get('getRole',{roleId:data.role.id}).then(res=>{
            res.data.roleMenu = res.data.roleMenu.split(';')
            this.props.roleDetail(res.data)
        })
        this.props.history.push('roleMsg')
    }
    handleClickOk(data) {
        this.setState({ deletaBox: false })
        this.setState({ loading: true })
        this.get('deletUserRole', { id: data.id }).then(res => {
            if (res.code === 10001) {
                this.getUserName(this.state.nameOfUser)
            }
        })
    }
    handleClickCancel() {
        this.setState({ deletaBox: false })
    }
    render() {
        let user = this.props.roleInfo.userRole.map((data) => {
            return <Card title="角色信息"
                className='card'
                key={data.id}
                extra={
                    <div className='iconStyle'>
                        <Icon type="eye" className='detailRole'
                            onClick={this.onDetail.bind(this, data)}
                        />
                        <Icon type="delete" className='deleteRole'
                            onClick={this.onDelete.bind(this, data)}
                        />
                    </div>
                }
                   >
                <p>角色名：{data.role.roleName}</p>
                <p>角色详情：{data.role.remark}</p>
                <Modal
                    title="温馨提示"
                    visible={this.state.deletaBox}
                    onOk={this.handleClickOk.bind(this, data)}
                    onCancel={this.handleClickCancel.bind(this)}
                    okText="确认"
                    cancelText="取消"
                >
                    <p>
                        确认删除关联角色？
                    </p>
                </Modal>
            </Card>
        })
        const columns = [{
            title: '角色名称',
            dataIndex: 'roleName',
            width: 150,
            render: text => <a href="javascript:;">{text}</a>
        }, {
            title: '角色详情',
            width: 150,
            dataIndex: 'remark'
        }]
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows, record) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                let dataId = selectedRowKeys
                this.setState({ roleId: dataId })
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name
            })
        }
        const repeatTip = this.props.roleInfo.userRole.map(item => {
            console.log("item",item.role.roleName)
            return < li key={item.id}><span>{item.role.roleName}</span></li >
        })
        return (
            <div className='userRole' >
                <div className='userSearch'>
                    <Search
                        placeholder="请输入查询的用户名"
                        enterButton="查询"
                        onSearch={value => this.searchName({ userName: value })}
                    ></Search>
                    {/* <div onClick={this.onThisClick.bind(this)}>
                        点击 
                    </div> */}
                </div>
                {
                    this.props.roleStatusInfo ?
                        <Spin spinning={this.state.loading}>
                            <div className='userMsg'>
                                <ul className='ul'>
                                    <li className='roleText' onClick={this.onThisClick.bind(this)}>用户详细信息</li>
                                    <li className='userName'>用户名：{this.props.roleInfo.userInfo.name}</li>
                                </ul>
                            </div>
                            <div className='roleDetail'>
                                <p className='roleText'>角色权限</p>
                                {this.props.user.name===this.props.searchValue&&this.props.roleInfo.userRole.length==0?
                                <div className='noData'>您当前没有角色配置</div>:null
                            }
                                
                                {user}
                                {this.props.user.name===this.props.searchValue?null:
                                <div className='addUser' onClick={this.showModal.bind(this)}>
                                    <div className='addRole'>
                                        <span>+</span>添加角色
                                     </div>
                                </div>}
                                <Modal
                                    title="用户角色配置"
                                    visible={this.state.visible}
                                    onOk={this.handleOk.bind(this)}
                                    onCancel={this.handleCancel.bind(this)}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Search
                                        placeholder="请输入查询的角色名"
                                        enterButton="查询"
                                        onSearch={value => this.getRoleList(1, 10, value)}
                                        className='roleSearch'
                                    ></Search>
                                    <Table
                                        bordered
                                        rowSelection={rowSelection}
                                        columns={columns}
                                        dataSource={this.state.data.rows}
                                        rowKey={record => record.id}
                                        scroll={{ y: 260 }}
                                        loading={this.state.tableLoading}
                                        pagination={{
                                            total: this.state.data.count,
                                            defaultPageSize: 10,
                                            defaultCurrent: 1,
                                            current: this.state.current,
                                            onChange: (page, pageSize) => {
                                                console.log('current page: ', page, pageSize)
                                                this.setState({
                                                    current: page,
                                                    pageSize: pageSize
                                                })
                                                this.getRoleList(page, pageSize)
                                            },
                                            onShowSizeChange: (page, pageSize) => {
                                                console.log('current page: ', page, pageSize)
                                                this.setState({
                                                    current: page,
                                                    pageSize: pageSize
                                                })
                                                this.getRoleList(page, pageSize)
                                            }
                                        }}
                                    />
                                </Modal>
                                <Modal
                                    title='温馨提示'
                                    visible={this.state.noRepeat}
                                    onOk={this.handOk.bind(this)}
                                    onCancel={this.handCancel.bind(this)}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <ul>
                                        {repeatTip}
                                    </ul>
                                    <p>
                                        已经关联该用户，不能重复关联
                                        </p>
                                </Modal>
                            </div>
                        </Spin> : null
                }
            </div >
        )
    }
}
const mapState = (state, ownProps) => {
    return {
        roleInfo: state.user.roleMsg,
        roleStatusInfo: state.user.roleStatus,
        roleDetailMsg:state.user.roleDetail,
        user:state.user.user,
        searchValue:state.user.searchName
    }
}

const mapDispatch = (dispatch, ownProps) => {
    return {
        roleMsg: data => {
            dispatch(user.roleMsg(data))
        },
        roleStatus: (data) => {
            dispatch(user.roleStatus(data))
        },
        roleDetail:(data)=>{
            dispatch(user.roleDetail(data))
        },
        searchName:(data)=>{
            dispatch(user.searchName(data))
        }

    }
}

export default connect(mapState, mapDispatch)(withRouter(useRole))