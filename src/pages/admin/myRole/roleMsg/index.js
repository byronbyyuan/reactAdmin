import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './index.less'
import { user } from '../../../../redux/actions/index'
import { connect } from 'react-redux'
import { Modal, Tree, Button, message, Spin } from 'antd';
const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
class roleDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            title: '添加',
            item: "",
            value: 1,
            roleName: '',
            roleInstruct: '',
            menulist: '',
            setRoleMenu: '',
            expandedKeys: [],
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            loading: true
        }
    }

    componentDidMount() {
        let value = { page: 1, size: 10 }
        this.get('getRolePrev',{roleId:14}).then(res => {
            if (res.code === 10001) {
                this.setState({ menulist: res.data.roleMenu })
            }
            if (this.props.location.query) {
                let value = { roleId: this.props.location.query.roleId }
                this.get('getRole', value).then(res => {
                    if (res.code === 10001) {
                        this.setState({ loading: false })
                        this.setState({ roleInstruct: res.data.remark })
                        this.setState({ roleName: res.data.roleName })
                        let myData = []
                        if (res.data.roleMenu) {
                            myData = res.data.roleMenu.split(";")
                        }
                        this.setState({ checkedKeys: myData })
                        this.setState({
                            setRoleMenu: myData
                        })
                        this.setState({
                            expandedKeys: myData,
                            autoExpandParent: false
                        });
                    } else {
                        this.setState({ loading: false })
                    }
                })
            } else {
                this.setState({ loading: false })
            }
        })
    }
    onSelect(selectedKeys, info) {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
    }
    handChecked(checkedKeys, e) {
        this.setState({ checkedKeys });
        let value = checkedKeys
        let data = []
        for (let i = 0; i < value.length; i++) {
            if (data.indexOf(value[i]) === -1) {
                data.push(value[i])
            }
        }
        this.setState({
            setRoleMenu: data
        })
    }
    handSelect(selectedKeys, e) {
        console.log('1', selectedKeys, e)
    }
    onExpand(expandedKeys) {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false
        });
    }
    onChange(e) {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value
        });
    }
    nameChange(e) {
        console.log('radio checked', e.target.value);
        this.setState({ roleName: e.target.value })
    }
    instructChange(e) {
        this.setState({ roleInstruct: e.target.value })
    }
    addSubmit(data) {
        console.log(this.state.item, data)
    }
    onAdd(item, event) {
        console.log('add', item)
        event.stopPropagation();
        this.showModal('添加', item)
        return false
    }
    onDelete(item, event) {
        console.log('onDelete', item)
        event.stopPropagation();
        return false
    }
    setFormChild(child) {
        this.child = child
    }
    valid(data) {
        console.log(data)
        if (data) {
            this.onHide()
            this.state.title == '添加' ? this.addSubmit(data) : this.editSubmit(data)
        }
    }
    handleOk() {
        this.child.handleSubmit()
    }
    editSubmit(data) {
        console.log(data)
    }
    onEdit(item, event) {
        this.showModal('编辑', item)
        event.stopPropagation();
    }
    showModal(title, item) {
        this.setState({
            visible: true,
            title: title,
            item: item
        })
    }
    onHide() {
        this.setState({
            visible: false
        })
    }
    handCancel() {
        window.history.back()
    }
    handSure() {
        let value = {}
        value.roleName = this.state.roleName
        value.remark = this.state.roleInstruct
        value.roleMenu = this.state.setRoleMenu
        if (!value.roleName) return message.warning('角色名不能为空');
        console.log(value)
        if (this.props.location.query) {
            value.roleId = this.props.location.query.roleId
            this.post('updateRole', value).then(
                res => {
                    if (res.code === 10001) {
                        message.success('更新角色成功');
                        this.setState({
                            show: true
                        })
                        this.props.history.push('myRole')
                    }
                }
            )
        } else {
            this.post('createRole', value).then(
                (res) => {
                    if (res.code === 10001) {
                        message.success('创建角色成功');
                        this.setState({
                            show: true
                        })
                        this.props.history.push('myRole')
                    }
                }
            )
        }
    }
    renderTreeNodes(data) {
        return Object.keys(data).map((key, index) => {
            let item = data[key]
            let titleNode = item.readOnly ? item.menuName : item.menuName;
            if (item.childMenu) {
                return (
                    <TreeNode title={titleNode} dataRef={item} key={item.id} isLeaf={item.type == 2}>
                        {this.renderTreeNodes(item.childMenu)}
                    </TreeNode>
                );
            }
            return <TreeNode title={titleNode} key={item.id} isLeaf={item.type == 2} />;
        });
    }
    render() {
        return (
            <div>
                <Spin spinning={this.state.loading}>
                    <ul className='roleMsg'>
                        <li className='li'>
                            <span className='span'>角色名称</span>
                            <div className='roleName'>{this.props.roleDetailMsg.roleName}</div>
                        </li>
                        <li className='li'>
                            <span className='span'>角色创建人</span>
                            <div className='roleName'>{this.props.roleDetailMsg.creator}</div>
                        </li>
                        <li className='li'>
                            <span className='span'>角色描述</span>
                            <div className='textarea'>
                                {this.props.roleDetailMsg.remark}
                            </div>
                        </li>
                        <li className='li'>
                            <span className='span'>角色菜单</span>
                            <div className='menuConfig'>
                                <div className='menuTree'>
                                    <DirectoryTree
                                        multiple
                                        defaultExpandAll
                                    >
                                        {this.renderTreeNodes(this.state.menulist)}
                                    </DirectoryTree>
                                </div>
                                <Modal
                                    title={this.state.title}
                                    visible={this.state.visible}
                                    onOk={this.handleOk.bind(this)}
                                    onCancel={this.onHide.bind(this)}
                                >
                                </Modal>
                            </div>
                        </li>
                        <li className='li liBtn'>
                            <Button onClick={this.handCancel.bind(this)}>返回</Button>
                        </li>
                    </ul>
                </Spin>
            </div>
        );
    }
}
const mapState = (state, ownProps) => {
    return {
        roleInfo: state.user.roleMsg,
        roleStatusInfo: state.user.roleStatus,
        roleDetailMsg:state.user.roleDetail
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
        }
    }
}

export default connect(mapState, mapDispatch)(withRouter(roleDetail))