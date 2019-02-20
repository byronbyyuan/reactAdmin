import React, { Component } from 'react'
import { Modal, Tree, Button, Popconfirm, Table, Divider, message, Input } from 'antd';
import { connect } from 'react-redux'
import { user } from '../../../../redux/actions/index'
import { Link, withRouter } from 'react-router-dom'
const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
import './index.less'
const roleList = [
    {
        roleName: '绩效',
        id: 1
    },
    {
        roleName: '生产',
        id: 2
    },
    {
        roleName: '品控',
        id: 3
    },
    {
        roleName: '销售',
        id: 4
    }
]
const confirm = Modal.confirm;

class role extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            roleList: [],
            tableLoading: false,
            current: 1,
            pageSize: 10,
            columns: [
                {
                    align: 'center',
                    title: '角色id',
                    dataIndex: 'id',
                    key: 'id',
                    render: text => <a href="javascript:;">{text}</a>
                },
                {
                    align: 'center',
                    title: '详情',
                    dataIndex: 'remark',
                    key: 'remark'
                }, {
                    align: 'center',
                    title: '角色名称',
                    dataIndex: 'roleName',
                    key: 'roleName'
                }, {
                    align: 'center',
                    title: '发布时间',
                    dataIndex: 'updatedAt',
                    key: 'updatedAt',
                    sorter: (a, b) => a.age - b.age
                }, {
                    align: 'center',
                    title: '操作',
                    dataIndex: 'control',
                    key: 'control',
                    render: (text, record) => (
                        <span>
                            <a href="javascript:;" onClick={this.onEdit.bind(this, record)}>编辑 {record.lastName}</a>
                            <Divider type="vertical" />
                            <a onClick={this.showConfirm.bind(this, record)} href="javascript:;">
                                删除
                            </a>
                        </span>
                    )
                }
            ]
        }
    }
    componentDidMount() {
        this.getRoleList(1, 10)
    }
    getRoleList(page, pageSize, roleName) {
        let value = {}
        this.setState({ tableLoading: true })
        value.page = page
        value.size = pageSize
        value.roleName = ''
        if (roleName) {
            value.roleName = roleName
        }
        this.get('getRoleList', value).then(res => {
            if (res.code === 10001) {
                this.setState({ roleList: res.data, tableLoading: false })
            } else {
                this.setState({ tableLoading: false })
                message.error('获取角色列表失败，请重试')
            }
        })
    }
    showModal() {
        this.props.history.push('role')
    }
    showConfirm(key) {
        const that = this
        confirm({
            title: '你确定要删除当前角色吗?',
            content: '',
            onOk() {
                that.confirm(key)
            },
            onCancel() { }
        });
    }
    handleOk(e) {
        console.log(e);
        this.setState({
            visible: false
        });
    }

    handleCancel(e) {
        console.log(e);
        this.setState({
            visible: false
        });
    }
    onEdit(item, event) {
        console.log(item, event, '88888888888')
        this.props.history.push({ pathname: 'role', query: { roleId: item.id } })
    }
    onDetail(item, event) {
        console.log(item, event)
    }
    onDelete(item, event) {
        console.log(item, event)
    }

    handleDelete(key) {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    }
    confirm(key) {
        console.log(2, key)
        this.setState({ tableLoading: true })
        let value = {}
        value.roleId = key.id
        this.get('deleteRole', value).then(res => {
            let value = { page: this.state.current, size: this.state.pageSize }
            this.get('getRoleList', value).then(res => {
                if (res.code === 10001) {
                    this.setState({ roleList: res.data })
                    this.setState({ tableLoading: false })
                    message.success('删除角色成功');
                    this.setState({
                        show: true
                    })
                } else {
                    message.success('删除角色失败，请重试');
                }
            })
        })
    }
    cancel() {
        console.log(1)
    }

    render() {
        return (
            <div className='roleConfig'>
                <div>
                    <Search
                        className='search'
                        placeholder="请输入关键字"
                        enterButton="查询"
                        onSearch={value => this.getRoleList(1, 10, value)}
                    />
                    <Button type="primary" onClick={this.showModal.bind(this)} className='creatRole'>
                        创建角色
                    </Button>
                </div>
                <div className='roleName'>
                    <div className='Admin_table'>
                        <Table
                            columns={this.state.columns}
                            dataSource={this.state.roleList.rows}
                            bordered
                            rowKey={record => record.id}
                            loading={this.state.tableLoading}
                            pagination={{
                                total: this.state.roleList.count,
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
                        >
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    data: state.user
})

const mapDispatchToProps = {
    ...user
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(role))