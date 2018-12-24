import React from 'react'
import {
  Form, Icon, Input, Button,
} from 'antd';
import './index.less'
const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props)
  }  
  handleSubmit(e){
    console.log("9999999999")
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <div className='login'>
          <div className='login_body'>
            <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
              <FormItem>
                {getFieldDecorator('userName', {
                  rules: [{ required: true, message: '请输入用户名' }],
                })(
                  <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码' }],
                })(
                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                )}
              </FormItem>
              <FormItem>
                  <div className='btn-body'>
                      <Button type="primary" htmlType="submit" className="login-form-button">
                      登录
                    </Button>
                  </div>
              </FormItem>
            </Form>          
          </div>
        </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm