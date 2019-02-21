import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox, Radio,Upload} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
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
class AddFrom extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
       menuName:'',
       type:1,
       readOnly:false,
       url:'',
       show:true,
       typeCheck:'',
    }
  }
  componentDidMount () {
    this.props.setChild(this)
    if (this.props.item) {
      this.setState(Object.assign(this.state,this.props.item))
    }
  }  
  handleSubmit(e) {
    this.props.form.validateFields((err, values) => {
      values.id = this.props.item.id
      if (err) {
        this.props.valid(false)
        return
      }
      this.props.valid(values)
    });
  }
  typeCheckChange(){

  }
  render() {
    const { getFieldDecorator, getFieldValue} = this.props.form;
    let { type, menuName, readOnly, url,show} = this.state
    return (
      <Form onSubmit={this.handleSubmit} 	className="login-form" ref='addForm'>
        <Form.Item
            label="菜单名称" {...formItemLayout}>
          {getFieldDecorator('menuName', {
            initialValue: menuName,
            rules: [{ required: true, message: '请填写菜单名称' }]
          })(
            <Input  placeholder="菜单名称" />
            )}
        </Form.Item>
        <Form.Item
            label="菜单目录" {...formItemLayout}>
          {getFieldDecorator('type', {
            initialValue: type,
            rules: [{ required: true, message: '' }]
          })(
            <RadioGroup>
              <Radio value={1}>目录</Radio>
              <Radio value={2}>菜单</Radio>
            </RadioGroup>
            )}
        </Form.Item>
          {
            getFieldValue("type") == 2 ?
              <Form.Item label="菜单地址" {...formItemLayout}>
                {getFieldDecorator('url', {
                  initialValue: url,
                  rules: [{ required: true, message: '请填写菜单地址' },{pattern:/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,message:'请填写正确的菜单地址'}]
                })(
                  <Input placeholder="菜单地址" />
                  )}
              </Form.Item>
            : ''
          }
        <Form.Item
            label="其他操作" {...formItemLayout}>
            <div>
                {getFieldDecorator('readOnly', {
                  valuePropName: 'checked',
                  initialValue: readOnly,
                  rules: [{ required: true, message: '' }]
                })(
                  <Checkbox>是否只读</Checkbox>
                )}
                {getFieldDecorator('show', {
                initialValue: show
              })(
                <Checkbox defaultChecked >是否展示</Checkbox>
                )}      
                <p className='tips'>温馨提示 : 其他操作修改,对应的子级将会继承该属性</p>        
            </div> 
        </Form.Item>
        {/* <Form.Item 
            label="icon链接"> 
          {getFieldDecorator('icon',{
              initialValue: icon,
              rules: [{ required: true, message: '' }]
          })(
            <RadioGroup  >
              <Radio value={1}>链接</Radio>
              <Radio value={2}>上传</Radio>
             
          </RadioGroup>
          )
          }
        </Form.Item>
        {
           getFieldValue('icon') == 1 ?
           <Form.Item>
              <Form.Item>
                {getFieldDecorator('iconUrl', {
                  initialValue: url,
                  rules: [{ required: true, message: '请填写菜单路径' },{pattern:/\/[a-zA-Z]/,message:'请填写正确的菜单路径'}]
                })(
                  <Input placeholder="菜单路径" />
                  )}
              </Form.Item>
           </Form.Item>
         : <Form.Item>
           {getFieldDecorator('iconids',{

           })(
               <Upload {...props2}>
                <Button>
                  <Icon type="upload" /> Upload
                </Button>
              </Upload> 
           )

           }
           
          </Form.Item> */}
        {/* }  */}
         
      </Form>
    );
  }
}

const WrappedNormalAddFrom = Form.create()(AddFrom);
export default WrappedNormalAddFrom 