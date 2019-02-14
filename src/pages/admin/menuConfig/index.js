import React, { Component } from 'react'

import './index.less'
import { Modal, Tree, Button, Popconfirm, message } from 'antd';
import AddFrom from './AddFrom'
const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
class menuConfig extends Component {
  constructor(props) {
    super(props)

    this.state = {
      treeData: [],
      visible: false,
      title: '添加',
      item: ""
    }
  }
  async componentDidMount() {
    this.get('getMyMenuList').then(res=>{
      if(res.code === 10001){
        this.setState({ treeData:res.data })
      }else{
        message.error('获取数据失败，请重试')
      }
    })
  }
  async addSubmit(data) {
    if (this.state.item) {
      data.parentId = this.state.item.id
    }
    this.post('createMenu', data).then(res=>{
      if(res.code === 10001){
        let result = res.data
      }else{
        message.error('创建菜单失败，请重试')
      }
    })

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
    this.child.props.form.resetFields()
  }
  renderTreeNodes(data) {
    const items = item => {
      return (
        <div className='menuConfigItem'>
          <span>{item.menuName}</span>
          <p className={['action', item.type == 1 && 'actionType'].join(' ')}>
            <span onClick={this.onEdit.bind(this, item)}>编辑</span>
            {
              item.type == 1 ?
                <span onClick={this.onAdd.bind(this, item)}>添加</span>
                : item.childMenu ? '' :
                  <Popconfirm title="确定删除吗?" onConfirm={this.onDelete.bind(this, item)} okText="确定" cancelText="取消">
                    <span onClick={this.onDelete.bind(this, item)}>删除</span>
                  </Popconfirm>
            }
          </p>
        </div>
      )
    }
    return Object.keys(data).map((key, index) => {
      let item = data[key]
      let titleNode = item.readOnly ? item.menuName : items(item);
      if (item.childMenu) {
        return (
          <TreeNode title={titleNode} isLeaf={item.type == 2} dataRef={item} key={item.id}>
            {this.renderTreeNodes(item.childMenu)}
          </TreeNode>
        );
      }
      return <TreeNode title={titleNode} isLeaf={item.type == 2} key={item.id} />;
    });
  }
  render() {
    return (
      <div className='menuConfig'>
        <div className='addMenu'>
          <Button type="primary" onClick={this.showModal.bind(this, '添加', false)}>添加菜单</Button>
        </div>
        <div className='menuTree'>
          <DirectoryTree multiple defaultExpandAll onSelect={this.onSelect} onExpand={this.onExpand}
          >
            {this.renderTreeNodes(this.state.treeData)}
          </DirectoryTree>
        </div>
        <Modal title={this.state.title} visible={this.state.visible} onOk={this.handleOk.bind(this)} onCancel={this.onHide.bind(this)}
        >
          <AddFrom setChild={this.setFormChild.bind(this)} valid={this.valid.bind(this)} item={this.state.title == '编辑' ? this.state.item : ''}></AddFrom>
        </Modal>
      </div>
    );
  }
}

export default menuConfig