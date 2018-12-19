import React, { Component } from 'react'
import './index.less'
import { Row, Col, Button, Icon, Table, Modal, Popconfirm, Divider, Input ,button} from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

export class Category extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible:false,
      changeValue:'',
      columns:[
        {
          align: 'center',
          title: '分类名称',
          dataIndex: 'categoryName',
          render: text => <a href="javascript:;">{text}</a>
        }, {
          align: 'center',
          title: '文章数',
          dataIndex: 'articleNum',
          sorter: (a, b) => a.articleNum - b.articleNum
        }, {
          align: 'center',
          title: '创建时间',
          dataIndex: 'createDt',
          sorter: (a, b) => a.createDt - b.createDt
        }, {
          align: 'center',
          title: '操作',
          dataIndex: 'tags',
          render: (text, record) => (
            <span>
              <a href="javascript:;" onClick={this.showModal.bind(this, record)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm placement="topLeft" title={'确定删除此分类吗?'} onConfirm={this.deleteCallback.bind(this, record)} okText="Yes" cancelText="No">
                <a href="javascript:;" >删除</a>
              </Popconfirm>
            </span>
          )
        }
      ],
      data: [{
        categoryName: 'categoryName',
        articleNum: 42,
        createDt: '2017-00-01'
      }, {
        categoryName: 'articleNum',
        articleNum: 40,
        createDt: '2017-00-01'
      }, {
        categoryName: 'createDt',
        articleNum: 40,
        createDt: '2017-00-01'

      }],
      pagination: {
        total: 30,
        pageSize: 15,
        hideOnSinglePage: true,
        current: 1
      },
      loading: false
    }
  }
  deleteCallback(item){
    console.log(item)
  }
  editChange(e){
    this.setState({
      changeValue:e.target.value
    })
  }
  edit(item){
    console.log('确定修改了。。。。。。。。',this.state.changeValue)
    this.hideModal()
  }
  showModal(item){
    this.setState({
      visible: true,
      changeValue: item.categoryName
    });
  }
  hideModal(){
    this.setState({
      visible: false
    });
  }
  handelChange(pagination, filters, sorter) {
    console.log('saddddddddddd')
  }
  render() {
    let { category, name, time, state, type } = this.state
    return (
      <div className='Admin'>
        <div className='addBtn' style={{'textAlign':"right"}}>
          <Button type="primary" icon="download"  onClick={this.showModal.bind(this)}>Download</Button>
        </div>
        <div className='Admin_table'>
          <Table columns={this.state.columns} dataSource={this.state.data} bordered  onChange={this.handelChange.bind(this)} pagination={this.state.pagination} loading={this.state.loading} />
        </div>
        <Modal
            title="Modal"
            visible={this.state.visible}
            onOk={this.edit.bind(this)}
            onCancel={this.hideModal.bind(this)}
            okText="确认"
            cancelText="取消"
        >
          <Input placeholder="default size" onChange={this.editChange.bind(this)} value={this.state.changeValue}/>
        </Modal>
      </div>
    )
  }
}
export default Category