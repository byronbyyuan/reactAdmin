import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './index.less'
import { Modal, Tree, Button, Popconfirm, Radio, Input, message ,Spin} from 'antd';
const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;
const { TextArea } = Input
const treeData = {
    '0': {
        name: "博客系统",
        id: '1',
        url: "",
        type: 1,
        readOnly: false,
        childMenu: {
            '0': {
                name: "数据",
                id: '11',
                url: "/admin/index",
                type: 2,
                readOnly: false
            },
            "1": {
                name: "列表",
                id: '12',
                url: "/admin/list",
                type: 2,
                readOnly: false
            },
            "2": {
                name: "分类",
                id: '13',
                url: "/admin/category",
                type: 2,
                readOnly: false
            },
            "3": {
                name: "文章",
                id: '14',
                url: "/admin/article",
                type: 2,
                readOnly: false
            }
        }
    },
    '1': {
        name: "菜单配置",
        id: '2',
        url: "/admin/menuConfig",
        type: 1,
        readOnly: true
    },
    '2': {
        name: "我的菜单",
        id: '19',
        url: "/admin/myMenu",
        type: 1,
        readOnly: false
    }
}
localStorage.setItem('tree', JSON.stringify(treeData))
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
            selectedKeys: []
        }
    }

    componentDidMount() {
        let value = { page: 1, size: 10 }
        this.get('getMyMenuList', value).then(res => {
            this.setState({ menulist: res.data })
        }).then(response => {
            if (this.props.location.query) {
                let value = { roleId: this.props.location.query.roleId }
                this.get('getRole', value).then(res => {
                    this.setState({ roleInstruct: res.data.remark })
                    this.setState({ roleName: res.data.roleName })
                    let myData = []
                    if(res.data.roleMenu){
                        myData = res.data.roleMenu.split(";")
                    }
                    this.setState({ checkedKeys: myData })
                    this.setState({
                        setRoleMenu: myData
                    })
                    this.setState({
                        expandedKeys:myData,
                        autoExpandParent: false
                    });
                    console.log("wodedata", myData)
                })
            }
        })
        console.log(this.props.location, '$$$$$$$$$$')

    }
    onSelect(selectedKeys, info){
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
        this.props.history.push('myMenu')
    }
    handSure() {
        let value = {}
        value.roleName = this.state.roleName
        value.remark = this.state.roleInstruct
        value.roleMenu = this.state.setRoleMenu
        console.log(value)
        if (this.props.location.query) {
            value.roleId = this.props.location.query.roleId
            this.post('updateRole', value).then(
                (res) => {
                    console.log(res)
                    message.success('更新角色成功');
                    this.setState({
                        show: true
                    })
                    this.props.history.push('myMenu')
                }
            )
        } else {
            this.post('createRole', value).then(
                (res) => {
                    console.log(res)
                    message.success('创建角色成功');
                    this.setState({
                        show: true
                    })
                    this.props.history.push('myMenu')
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
            <ul className='roleMsg'>
                <li className='li'>
                    <span className='span'>角色名称</span>
                    <Input className='roleName' onChange={this.nameChange.bind(this)} value={this.state.roleName}></Input>
                </li>
                <li className='li'>
                    <span className='span'>角色描述</span>
                    <TextArea className='textarea'
                        onChange={this.instructChange.bind(this)}
                        value={this.state.roleInstruct}
                    ></TextArea>
                </li>
                <li className='li'>
                    <span className='span'>角色菜单</span>
                    <div className='menuConfig'>
                        <div className='menuTree'>
                            <DirectoryTree
                                checkable
                                multiple
                                defaultExpandAll
                                onCheck={this.handChecked.bind(this)}
                                onExpand={this.onExpand.bind(this)}
                                selectedKeys={this.state.selectedKeys}
                                checkedKeys={this.state.checkedKeys}
                                checkable
                                expandedKeys={this.state.expandedKeys}
                                autoExpandParent={this.state.autoExpandParent}
                                onSelect={this.onSelect.bind(this)}
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
                    <Button onClick={this.handCancel.bind(this)}>取消</Button>
                    <Button type="primary" onClick={this.handSure.bind(this)}>确定</Button>
                </li>
            </ul>
        );
    }
}
export default withRouter(roleDetail)