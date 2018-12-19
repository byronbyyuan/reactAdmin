import './index.less'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { comments } from '../../redux/actions/index'
export class CommentsInput extends Component {
  constructor() {
    super()
    this.state = {
       name:"",
       email:'',
       url:'',
       context:'',
       err_msg:''
    }
  }
  handleChange(e){
    this.setState({ [e.target.name]: e.target.value})
  }
  close(){
    this.setState({
      name: "",
      email: '',
      url: '',
      context: '',
      err_msg: ''
    })
    this.props.close()
  }
  validation(){
    let { name, email, url, context} = this.state
    let { isRequired, isEmail, isUrl } = this.Util.validator
    let msg
    if (!isRequired(name)){
        msg = '闯荡江湖岂能没有响亮的大名?'
    } else if (!isRequired(context)){
      msg = '要不还是说点什么?'
    } else if (isRequired(email) && !isEmail(email)){
        msg = '少侠，你的地址荒无人烟,飞鸽都不想去'
    } else if (isRequired(url) && !isUrl(email)){
       msg = '少侠，路途遥远，还是给个传送阵吧'
    }
    this.setState({err_msg:msg})
    if(!msg){
      console.log("吐槽成功发出请求")
      this.close()
    }
  }
  render() {
    let { comments } = this.props
    let { name, email, url, context } = this.state
    return (
      <div className='CommentsInput' style={{ 'display': comments.show ? 'block' : 'none' }}>
        <div className='CommentsInputBox'>
          <div className='CommentsInputBox-lable'>
            <span className='required'>名称</span>
            <input placeholder='江湖人称' name='name' value={name} onChange={this.handleChange.bind(this)}></input>
          </div>
          <div className='CommentsInputBox-lable'>
            <span>邮箱</span>
            <input placeholder='飞鸽传信' title='邮箱' name='email' value={email} onChange={this.handleChange.bind(this)}></input>
          </div>
          <div className='CommentsInputBox-lable'>
            <span>网址</span>
            <input placeholder='传送阵' name='url' value={url} onChange={this.handleChange.bind(this)}></input>
          </div>
          <div className='CommentsInputBox-lable'>
            <span className='textarea_span required'>内容</span>
            <textarea name='Comments' name='context' value={context} placeholder={comments.toUser ? `回复：${comments.toUser}` : '放狠话~~'} onChange={this.handleChange.bind(this)}></textarea>
          </div>
          <div className='err_msg' style={{display:this.state.err_msg ? 'block':'none'}}>
            <p>{this.state.err_msg}</p>
          </div>
          <div className='CommentsInputBox-button'>
            <span className='button' onClick={this.validation.bind(this)}>吐槽</span>
            <span className='button' onClick={this.close.bind(this)}>取消</span>
          </div>
          {/* <div className='CommentsInputBox-lable'>
            <span className='CommentsInput-emje'>表情</span>
          </div> */}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  comments: state.comments
})

const mapDispatchToProps = {
  ...comments
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentsInput)