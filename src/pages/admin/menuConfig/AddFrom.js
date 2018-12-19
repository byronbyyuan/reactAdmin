import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox, Radio} from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
class AddFrom extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
       name:'',
       type:1,
       readOnly:false,
       url:''
    }
  }
  static getDerivedStateFromProps(props,state){
    if(props.item){
      return props.item
    }else{
      return {
        name: '',
        type: 1,
        readOnly: false,
        url: ''
      }
    }
  }
  componentDidMount () {
    this.props.setChild(this)
    console.log(this.props.item)
    if (this.props.item) {
      this.setState(Object.assign(this.state,this.props.item))
    }
  }  
  handleSubmit(e) {
    this.props.form.validateFields((err, values) => {
      if (err) {
        this.props.valid(false)
        return
      }
      this.props.valid(values)
    });
  }
  render() {
    const { getFieldDecorator, getFieldValue} = this.props.form;
    let { type, name, readOnly, url} = this.state
    return (
      <Form onSubmit={this.handleSubmit} 	className="login-form" ref='addForm'>
        <FormItem>
          {getFieldDecorator('name', {
            initialValue: name,
            rules: [{ required: true, message: '请填写菜单名称' }]
          })(
            <Input  placeholder="菜单名称" />
            )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('type', {
            initialValue: type,
            rules: [{ required: true, message: '' }]
          })(
            <RadioGroup>
              <Radio value={1}>目录</Radio>
              <Radio value={2}>菜单</Radio>
            </RadioGroup>
            )}
        </FormItem>
          {
            getFieldValue("type") == 2 ?
              <FormItem>
                {getFieldDecorator('url', {
                  initialValue: url,
                  rules: [{ required: true, message: '请填写菜单路径' }]
                })(
                  <Input placeholder="菜单路径" />
                  )}
              </FormItem>
            : ''
          }
        <FormItem>
          {getFieldDecorator('readOnly', {
            initialValue: readOnly
          })(
            <Checkbox>是否只读</Checkbox>
            )}
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalAddFrom = Form.create()(AddFrom);
export default WrappedNormalAddFrom 