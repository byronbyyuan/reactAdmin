import React, { Component } from 'react'

import './index.less'
import { Modal, Tree, Button, Icon,Spin } from 'antd';
import AddFrom from './AddFrom'
const confirm = Modal.confirm;

const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
class menuConfig extends Component {
  constructor(props) {
    super(props)
    this.state = {
      treeData: [],
      visible: false,
      title: '添加',
      item: "",
      loading:false,
      addLoading:false,
      treeData1: [
        { menuName: "菜单配置", url: "/admin/menuConfig/", id: '-1', type: 2 },
        { menuName: "我的角色", url: "/admin/myRole/", id: '-2', type: 2 },
        { menuName: "用户角色", url: "/admin/userRole/", id: '-3', type: 2 }
      ]
    }
  }
   componentDidMount() { //初始化
      this.getMyMenuList()
  }
  async getMyMenuList(){ //获取list
    this.setState({
      loading:true
    })
    let treeDataList = await this.get('getMyMenuList')
    let treeData = this.state.treeData1.concat(treeDataList.data)
    let result = [
      {
        parentId:null,
        id:0,
        menuName:'后台管理',
        type:1,
        readOnly:true,
        childMenu:treeData
      }
    ]
    this.setState({
      treeData : result,
      loading:false
    })
    return treeDataList
  }

  onAdd(item, event) {
    event.stopPropagation();
    this.showModal('添加', item)
    return false
  }
  onEdit(item, event) {
    event.stopPropagation();
    this.showModal('编辑', item)
    // return false
  }
  async onDelete(item, event) { //删除
    event.stopPropagation();
    let _self = this
    confirm({
      title: '确定删除该数据吗?',
      okText:"确认",
      cancelText:'取消',
      onOk() {
        return new Promise(async (resolve, reject) => {
          await _self.get('deleteMenu',{id:item.id})
          _self.getMyMenuList()
          resolve()
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {}
    });
    return false
  }
  setFormChild(child) {
    this.child = child
  }
  valid(data) {
    if (data) {
      this.setState({addLoading:true})
      this.state.title == '添加' ? this.addSubmit(data) : this.editSubmit(data)
    }
  }
  handleOk() {
    this.child.handleSubmit()
  }
  async editSubmit(data) { //编辑发请求
    if(data.type == 1)data.url=''
    let result = await this.post('updateMenu', data)
    if(result.code == 10001){
      this.setState({addLoading:false})
      this.onHide()
      this.getMyMenuList()
    }
    this.setState({addLoading:false})
  }
  async addSubmit(data) { //添加目录
    if (this.state.item) {
      data.parentId = this.state.item.id
    }
    let result = await this.post('createMenu', data)
    if(result.code == 10001){
      this.setState({addLoading:false})
      this.onHide()
      this.getMyMenuList()
    }
    this.setState({addLoading:false})
  }
  setVisible(){
    console.log(this)
    // this.setState({visible:true})
  }
  showModal(title, item) {
    // this.setState({visible:true})
    this.setState({
      title: title,
      item: item,
      visible:true
    })
    let result = item
    if(title=="添加"){
      result = {
        type:1, menuName:'', readOnly:false, url:'',show:true
      }
    }
    this.child && this.child.setState({...result})
  }
  onHide() {
    this.setState({
      visible: false
    })
    this.child.props.form.resetFields()
  }
  onDragEnter(){//dragenter  触发时调用

  }
  async onDrop(info){ //drop 触发时调用
        const dropKey = info.node.props.eventKey; //目标元素
        const dragKey = info.dragNode.props.eventKey; //拖动的元素
        let dataquery = {
            id:dragKey,
            parentId:dropKey
        }
      this.setState({
        loading:true
      })
      let newList  = await this.post('moveMenu',dataquery)
      this.getMyMenuList()
  }
  renderTreeNodes(data) {
    const items = item => {
      return (
        <div className='menuConfigItem'>
          <span style={{lineHeight:'24px'}}>{item.menuName}</span>
          <p className={['action', item.type == 1 && 'actionType'].join(' ')}>
            {item.id > 0?<span onClick={this.onEdit.bind(this, item)}>编辑</span>:''}
            {
              item.type == 1 && item.id > 0?
                <span onClick={this.onAdd.bind(this, item)}>添加</span>
                : ''
            }
            {
              item.childMenu || item.id < 0? '' :
              <span onClick={this.onDelete.bind(this, item)}>删除</span>
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
          <TreeNode title={titleNode} icon={<Icon type={item.type == 2 ? "link":'folder-open'} />} dataRef={item} key={item.id}>
            {this.renderTreeNodes(item.childMenu)}
          </TreeNode>
        );
      }
      return <TreeNode title={titleNode}  icon={<Icon type={item.type == 2 ? "link":'folder-open'} />} key={item.id} />;
    });
  }
  render() {
    return (
      <div className='menuConfigire'>
        <Modal okButtonProps={{loading :this.state.addLoading}} title={this.state.title} visible={this.state.visible} onOk={this.handleOk.bind(this)} okText='确认'
            cancelText="取消" onCancel={this.onHide.bind(this)} item={this.state.item}
        >
          <AddFrom  setChild={this.setFormChild.bind(this)} valid={this.valid.bind(this)} item={this.state.title == '编辑' ? this.state.item : ''}></AddFrom>
        </Modal>
        <Spin tip="数据加载中，请稍后" spinning={this.state.loading} wrapperClassName='skin'>
          <div className='addMenu'>
            <Button type="primary" onClick={this.showModal.bind(this, '添加', false)}>添加菜单</Button>
          </div>
          <div className='menuTree'>
            <DirectoryTree 
                showIcon
                switcherIcon={<Icon type="down" />}
                onSelect={this.onSelect} 
                onExpand={this.onExpand} 
                draggable
                onDragEnter={this.onDragEnter.bind(this)} 
                onDrop={this.onDrop.bind(this)}
            >
              {this.renderTreeNodes(this.state.treeData)}
            </DirectoryTree>
          </div>        
        </Spin>
      </div>
    );
  }
}

export default menuConfig

