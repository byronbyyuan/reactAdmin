import React from 'react'
import {
  Form, Icon, Input, Button,message
} from 'antd';
import {connect} from 'react-redux'
import {user} from '../../../redux/actions/index'
import { Link ,withRouter} from 'react-router-dom'
import './index.less'
const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props),
    this.state = {
      show: true,
      formData:{
        pass:null,
        repass:null
      }
    }
  } 
  componentDidMount(){
    this.get('getUser').then(res=>{
      if(res){
        this.props.history.push('admin/index')
        this.props.setUser(res.data)
      }
    })
  }
  handLogin(){
    this.setState({
      show: true
    })
    this.props.form.resetFields()
  }
  handRegist(){
    this.setState({
      show: false
    })
    this.props.form.resetFields()

  }
  checkAccount(rule, value, callback) {
    console.log(this.state,this.props.form.getFieldValue('password'))
    if(!/^[\w+]{6,11}$/.test(value)){
      callback('密码为6-11位数字或字母');
    }
    if (value&&value!== this.props.form.getFieldValue('password') &&!this.state.show) {
      callback('两次密码输入不一致！');
      }else{
        callback()
      }
  }
  handleGetInputValue(val,event){
    console.log("wwwwww",val,event.target.value)
    if(val === 'pass'){
      this.setState({pass:event.target.value})
    }else{
      this.setState({passA:event.target.value})
      console.log(this.state.passA)
    }
  }
  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(this.state.show){
          this.post('signUp',values).then(res=>{
            this.props.history.push('admin/index')
          })
        }else{
          this.post('signIn',values).then(res=>{
              message.success('注册成功');
              this.setState({
                show: true
              })
          })
        }
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <div className='login'>
          <div>{this.props.data.name}</div>
          <div className='login_body'>
            <div className = 'login_tab'>
                <ul>
                    <li onClick={this.handLogin.bind(this)} className={this.state.show === true?'active':null}>登录</li>
                    <li onClick={this.handRegist.bind(this)} className={this.state.show === false?'active':null}>注册</li>
                </ul>
            </div>
            <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
              <FormItem>
                {getFieldDecorator('userName', {
                  rules: [{ required: true, message: '请输入用户名' },
                  {pattern:/^[A-Za-z0-9\_\-]{6,11}$/,message: '用户名为6-11位数字或字母'}
                ]
                })(
                  <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" max='11' min = '6'/>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码' },
                  {pattern:/^[\w+]{6,11}$/,message: '密码为6-11位数字或字母'}
                ]
                })(
                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                )}
              </FormItem>
              {
                this.state.show 
                ? 
                ''
                :
                <FormItem>
                {getFieldDecorator('passwordAgain', {
                  rules: [{ required: true, message: '请再次输入密码' },
                  {validator: this.checkAccount.bind(this)}
                ]
                })(
                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>} type="password" placeholder="Password" />
                )}
              </FormItem>
            }
              <FormItem>
                  <div className='btn-body'>
                      <Button type="primary" htmlType="submit" className="login-form-button">
                      {this.state.show?'登录':'注册'}
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
const mapStateToProps = (state) => ({
  data:state.user
})

const mapDispatchToProps = {
  ...user
}
export default  withRouter(connect(mapStateToProps,mapDispatchToProps)(WrappedNormalLoginForm))