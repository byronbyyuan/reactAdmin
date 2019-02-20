import React, { Component } from 'react'
import './index.less'
import {  Button, Table, Modal, Divider, Input,Radio,Form,Upload,Icon,message} from 'antd';
const qiniu = require('qiniu-js')
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
const Search = Input.Search;
const formItemLayout = {
  labelCol: {
    xs: { span: 5 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
};

export class Category extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addLoading:false, // 创建loading
      listLoading:true, // 表格loading
      preview:false, // icon 展示
      visible:false,  // 弹窗显示
      isAdd:false, // 弹窗是否添加
      changeValue:'', // 分类名称
      typeCheck:false, // icon 上传方式
      changeId:'', // 编辑的id
      icon:'', // icon 链接
      iconValidatorr:true, // icon 链接验证结果
      columns:[ // 表格列
        {
          align: 'name',
          title: '分类名称',
          dataIndex: 'name',
        }, {
          align: 'center',
          title: '创建时间',
          dataIndex: 'createAt',
          render:(text,record)=>{
            return this.Util.getNowFormatDate(text)
          }
        },
        {
          align: 'center',
          title: '文章数量',
          dataIndex: 'articleNum',
          sorter: (a, b) => a.articleNum - b.articleNum
        },{
          align: 'center',
          title: '分类图标',
          dataIndex: 'icon',    
          render:(text, record) => (
            <span>
              <img src={record.icon}/>
            </span>
          )   
        }, {
          align: 'center',
          title: '操作',
          dataIndex: 'tags',          
          render: (text, record) => (
            <span>
              <a href="javascript:;" onClick={this.showModal.bind(this, false,record)}>编辑</a>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={this.deleteCallback.bind(this, record)}>删除</a>
            </span>
          )
        }
      ],
      data: [], // 表格数据
      pagination: {
        total: 0,
        pageSize: 10,
        hideOnSinglePage: true,
        current: 1
      },
    }
  }
  componentDidMount(){
    this.getList()
  }
  async getList(name=''){
    this.setState({listLoading:true})
    let list = await this.get('getCategoryList',{page:this.state.pagination.current,size:this.state.pagination.pageSize,name})
    this.setState({listLoading:false,data:list.data.rows,pagination:{...this.state.pagination,total:list.data.count}})
  }
  deleteCallback(item){
    let _self = this
    confirm({
      title: '确定删除该数据吗?',
      okText:"确认",
      cancelText:'取消',
      onOk() {
        return new Promise(async (resolve, reject) => {
          await _self.get('deleteCategory',{id:item.id})
          _self.getList()
          resolve()
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
  }
  editChange(e){
    this.setState({
      changeValue:e.target.value
    })
  }
  iconChange(e){
    this.setState({icon:e.target.value})
  }
  async edit(item){
    let body = {
        icon:this.state.icon,
        name:this.state.changeValue
    }
    let url = 'createCategory'
    let msg = this.state.isAdd ? '创建' : "编辑"
    if(!body.name){
      message.info('请填写必填项')
      return
    }
    if(!this.state.isAdd){
      body.id = this.state.changeId
      url='updateCategory'
    }
    this.setState({addLoading:true})
    let res = await this.post(url,body)
    if(res.code == 10001){
      message.success(msg + '成功')
      this.hideModal()
      this.getList()
    }else{
      this.setState({addLoading:false})
    }
  }
  showModal(isAdd,item){
    this.setState({
      isAdd:isAdd,
      visible: true,
      changeValue:item.name,
      changeId:item.id,
      icon:item.icon
    });
  }
  hideModal(){
    this.setState({
      visible: false,
      preview:false,
      icon:'',
      iconValidatorr:true,
      typeCheck:false,
      addLoading:false
    });
  }
  handelChange(pagination, filters, sorter) {
    if(pagination.current != this.state.pagination.current){
      this.setState({pagination:pagination},this.getList)
    }
  }
  typeCheckChange(e){
    this.setState({typeCheck:e.target.value})
  }
  iconBlur(e){
    if(e.target.value.length > 0 ){
      let validator = this.Util.validator.isUrl(e.target.value)
      this.setState({iconValidatorr:validator,icon:validator ? e.target.value : ''})
      return
    }
    this.setState({iconValidatorr:true})
  }
  preview(){
    this.setState({preview:!this.state.preview})
  }
  beforeUpload(info){
    // console.log('beforeUpload',info,config.uploadPixfile)
  }
  async upload(info){
    let _self = this
    let tokenDate = await this.get('getQiniuToken')
    var observable = qiniu.upload(info.file, 'icon/' + new Date().getTime()+"_"+info.file.name, tokenDate.data,{},{
      useCdnDomain: true,
    })
    var subscription = observable.subscribe({
      next(res){
        // ...
        console.log('next',res)
      },
      error(err){
        console.log(err)
        message.error('上传失败，请重新上传')
      }, 
      complete(res){
        info.onSuccess(res)
        message.success('上传成功')
        _self.setState({
          icon:'https://image.oa.woatao.cn/' + res.key,
          typeCheck:false
        })
      }      
    })
  }
  render() {
    return (
      <div className='Admin'>
        <div className='he'>
          <div className='seace'>
            <Search
              placeholder="请输入关键字"
              enterButton="查询"
              size="default"
              onSearch={this.getList.bind(this)}
            />          
          </div>
          <div className='addBtn' style={{'textAlign':"right"}}>
            <Button type="primary" onClick={this.showModal.bind(this,true)}>新增分类</Button>
          </div>
        </div>
        <div className='Admin_table'>
          <Table rowKey='id' loading={{
            tip:"数据加载中，请稍后",
            spinning:this.state.listLoading            
          }} columns={this.state.columns} dataSource={this.state.data} bordered  onChange={this.handelChange.bind(this)} pagination={this.state.pagination} />
        </div>
        <Modal
            title={this.state.isAdd ? '编辑' : '新增'}
            visible={this.state.visible}
            onOk={this.edit.bind(this)}
            onCancel={this.hideModal.bind(this)}
            okText='确认'
            cancelText="取消"
            okButtonProps={
              {loading :this.state.addLoading}
            }
        >
          <Form.Item label={`分类名称`} {...formItemLayout} className={this.state.changeValue ? "":'error'}>
            <Input placeholder="分类名称" onChange={this.editChange.bind(this)} value={this.state.changeValue}/>
          </Form.Item>
          <Form.Item label={`分类icon`} {...formItemLayout}> 
            <RadioGroup onChange={this.typeCheckChange.bind(this)} value={this.state.typeCheck}>
              <Radio value={false}>链接</Radio>
              <Radio value={true}>上传</Radio>
            </RadioGroup>            
          </Form.Item>
          <Form.Item label={`icon链接`} {...formItemLayout}>
              {
                this.state.typeCheck ?   
                  <Upload   name='file' beforeUpload={this.beforeUpload.bind(this)} accept="image/*" customRequest={this.upload.bind(this)}>
                    <Button>
                      <Icon type="upload" /> 上传icon
                    </Button>
                  </Upload>                             
                :
                <Input placeholder={this.state.iconValidatorr ? "icon链接" : "请输入正确的url"} className={this.state.iconValidatorr ? "":'error'} onBlur={this.iconBlur.bind(this)} onChange={this.iconChange.bind(this)} value={this.state.icon} suffix={<Icon type={this.state.preview ? 'eye-invisible' :'eye'} onClick={this.preview.bind(this)}/>}/>
              }
          </Form.Item>  
            {
              this.state.preview && this.state.icon ?
              <Form.Item label={`icon预览`} {...formItemLayout}>
                  <div className='preview'>
                    <img src={this.state.icon} />
                  </div>
              </Form.Item>  
              : ""
            }
        </Modal>
      </div>
    )
  }
}
export default Category