import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Upload, message, Modal, Radio
} from 'antd';
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
function handleChange(value) {
    console.log(`selected ${value}`);
}
class userInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: '', previewVisible: false,
            previewImage: '',
            value: 1,
            loading: false,
            imageUrl: ''
        }
    }
    componentDidMount() {
        console.log("ttttttt", this.props.userInfo)
    }
    handleChange(info) {
        console.log(info, "vvvvvvvv")
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => this.setState({
            imageUrl,
            loading: false
        }));
    }
    onChange(e) {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value
        });
    }
    handleSubmit(e) {
        console.log('dddd')
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            console.log('Received values of form: ', values, err);
        });
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
        for(let i= date.getFullYear();i>date.getFullYear()-90;i--){
            dateArray.push(i)
        }
        let YearArray = dateArray.map(year=>{
            return <Option value={year} key={year}>{year}</Option>
        })
        console.log(date.getFullYear(),date.getMonth(),date.getDate(),'bbbb',dateArray,YearArray)
        const imageUrl = this.state.imageUrl;
        const name = this.props.userInfo.name || ''
        const otherName = this.props.userInfo.otherName || ''
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
            <Form onSubmit={this.handleSubmit.bind(this)}>
                <Form.Item {...formItemLayout}>
                    <div className='upLoad'>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            onChange={this.handleChange.bind(this)}
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
                    {getFieldDecorator('otherName', {
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
                    <Select defaultValue="2000" style={{ width: 120 }} onChange={handleChange}>
                        {YearArray}
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
                }}>
                    <Button type="primary" htmlType="submit">提交</Button>
                </Form.Item>
            </Form>
        )
    }
}
const WrapForm = Form.create()(userInfo)
const mapState = (state, ownProps) => {
    return {
        userInfo: state.user.user,
        menuInfo: state.user.menuInfo,
        url: state.user.insertUrl
    }
}
const mapDispatch = (dispatch, ownProps) => {
    return {
        insertUrl: data => {
            dispatch(user.insertUrl(data))
        }
    }
}
export default withRouter(connect(mapState, mapDispatch)(WrapForm))