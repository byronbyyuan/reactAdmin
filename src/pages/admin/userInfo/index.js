import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Upload, message, Modal, Radio
} from 'antd';
const qiniu = require('qiniu-js')
import { user } from '../../../redux/actions/index'
const AutoCompleteOption = AutoComplete.Option;
const RadioGroup = Radio.Group;
const Option = Select.Option;
import { withRouter } from 'react-router-dom'
import './index.less'
const FormItem = Form.Item;
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
    console.log(reader, '9999999')
}

function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg' || 'image/gif';
    if (!isJPG) {
        message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
}

class userInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: '', previewVisible: false,
            previewImage: '',
            value: 1,
            loading: false,
            imageUrl: '',
            time: {
                year: 1999,
                month: 1,
                day: 1
            }
        }
    }
    componentDidMount() {
        this.get('getUser').then(res => {
            console.log(res)
            if (res&&res.code &&res.code=== 10001) {
              this.props.setUser(res.data)
              let array = []
              if (res.data.birthday) {
                  array = res.data.birthday.split('-')
              }
              this.setState(state=>{
                state.value=res.data.sex
                state.time.year = array[0]||1999
                state.time.month = array[1]||1
                state.time.day = array[2]||1
                state.imageUrl = res.data.headUrl
                return state
              })
            }
          })
        console.log("ttttttt", this.props.userInfo)
    }
    handleChange(info) {
        // getBase64(info.file.originFileObj, imageUrl => this.setState({
        //     imageUrl,
        //     loading: false
        // }));
    }
    onChange(e) {
        console.log('radio checked', e.target.value,);
        this.setState({
            value: e.target.value
        });
    }
    handleSubmit(e) {
        console.log('dddd',this.state)
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log('Received values of form: ', values, err);
            let time = this.state.time
            values.birthday = time.year+'-'+time.month+'-'+time.day
            values.sex = this.state.value
            values.headUrl = this.state.imageUrl
            this.post('updateUser',values).then(res=>{
                console.log(res,'mmmmmmmmmm')
                if(res.code===10001){
                    this.props.history.push('index')
                }
            })
        });
    }
    handChange(value, event) {
        console.log(`selected ${value} ${event}`);
        this.setState((state)=>{
            console.log(state,'zzzzzzz')
            return state.time[value] = event
        })
    }
    async upload(info) {
        console.log(info,'vvvvv')
        // getBase64(info.file, imageUrl => this.setState({
        //     imageUrl,
        //     loading: false
        // }));
        let _self = this
        let tokenDate = await this.get('getQiniuToken')
        var observable = qiniu.upload(info.file, 'icon/' + new Date().getTime()+"_"+info.file.name, tokenDate.data,{},{
          useCdnDomain: true
        })
        var subscription = observable.subscribe({
          next(res) {
            // ...
            console.log('next', res)
          },
          error(err){
            console.log(err)
            message.error('上传失败，请重新上传')
          },
          complete(res) {
            info.onSuccess(res)
            message.success('上传成功')
            _self.setState({
              imageUrl: 'https://image.oa.woatao.cn/' + res.key,
              iconCheck: 0
            })
          }
        })
      }
    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传头像</div>
            </div>
        );
        const date = new Date()

        const dateArray = []
        const monthArray = []
        const dayArray = []
        for (let i = date.getFullYear(); i > date.getFullYear() - 90; i--) {
            dateArray.push(i)
        }
        for (let n = 1; n < 13; n++) {
            monthArray.push(n)
        }
        for (let m = 1; m < 32; m++) {
            dayArray.push(m)
        }
        let YearArray = dateArray.map(year => {
            return <Option value={year} key={year}>{year}</Option>
        })
        let optMonth = monthArray.map(year => {
            return <Option value={year} key={year}>{year}</Option>
        })
        let optday = dayArray.map(year => {
            return <Option value={year} key={year}>{year}</Option>
        })
        const imageUrl = this.state.imageUrl;
        const name = this.props.userInfo.name || ''
        const otherName = this.props.userInfo.nickName || ''
        const age = this.props.userInfo.age || ''
        const email = this.props.userInfo.email || ''
        const phone = this.props.userInfo.phone || ''
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 25 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 25 },
                sm: { span: 8 }
            }
        };
        return (
            <div className='userInfo'>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                <Form.Item {...formItemLayout}>
                    <div className='upLoad'>
                        {/* <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={this.handleChange.bind(this)}
                        >
                            {imageUrl ? <img src={imageUrl} alt="avatar" className='uploadImg' /> : uploadButton}
                        </Upload> */}
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            accept="image/*"
                            customRequest={this.upload.bind(this)}
                        >
                            {imageUrl ? <img src={imageUrl} alt="avatar" className='uploadImg' /> : uploadButton}
                        </Upload>                       
                    </div>
                </Form.Item>
                <Form.Item label="用户名" {...formItemLayout}>
                    {getFieldDecorator('useName', {
                        initialValue: name,
                        rules: [{
                            type: 'string', message: ''
                        }, {
                            required: false, message: ''
                        }]
                    })(
                        <span className='name'>{name}</span>
                    )}
                </Form.Item>
                <Form.Item label="昵称" {...formItemLayout}>
                    {getFieldDecorator('nickName', {
                        initialValue: otherName,
                        rules: [{
                            type: 'string', message: ''
                        }, {
                            required: false, message: ''
                        }]
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label="性别" {...formItemLayout}>
                    <RadioGroup onChange={this.onChange.bind(this)} value={this.state.value}>
                        <Radio value={1}>保密</Radio>
                        <Radio value={2}>男</Radio>
                        <Radio value={3}>女</Radio>
                    </RadioGroup>
                </Form.Item>
                <Form.Item label="生日" {...formItemLayout}>
                    <Select value={this.state.time.year} style={{ width: '36%' }} onChange={this.handChange.bind(this, 'year')}>
                        {YearArray}
                    </Select>
                    <Select value={this.state.time.month} style={{ width: '32%' }} onChange={this.handChange.bind(this, 'month')}>
                        {optMonth}
                    </Select>
                    <Select value={this.state.time.day} style={{ width: '32%' }} onChange={this.handChange.bind(this, 'day')}>
                        {optday}
                    </Select>
                </Form.Item>
                <Form.Item label="邮箱" {...formItemLayout}>
                    {getFieldDecorator('email', {
                        initialValue: email,
                        rules: [{
                            type: 'email', message: ''
                        }, {
                            required: false, message: ''
                        }]
                    })(
                        <Input type='email' />
                    )}
                </Form.Item>
                <Form.Item label="电话号码" {...formItemLayout}>
                    {getFieldDecorator('phone', {
                        initialValue: phone,
                        rules: [{
                            type: 'string', message: ''
                        }, {
                            required: false, message: ''
                        }]
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item wrapperCol={{
                    xs: { span: 25, offset: 11 },
                    sm: { span: 25, offset: 11 }
                }}
                >
                    <Button type="primary" htmlType="submit">提交</Button>
                </Form.Item>
            </Form>
            </div>
        )
    }
}
const WrapForm = Form.create()(userInfo)
const mapState = (state, ownProps) => {
    return {
        userInfo: state.user.user
    }
}
const mapDispatch = (dispatch, ownProps) => {
    return {
        setUser: data => {
            dispatch(user.setUser(data))
        }
    }
}
export default withRouter(connect(mapState, mapDispatch)(WrapForm))