import React, { Component } from 'react'
import './index.less'
import { Form, Input, Col, Select, Button, Switch, Upload, Icon, message } from 'antd';
import SimpleMDE from 'simplemde'
import marked from 'marked'
import highlight from 'highlight.js'
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  pedantic: false,
  sanitize: false,
  tables: true,
  breaks: true,
  smartLists: true,
  smartypants: true,
  highlight: function (code) {
    return highlight.highlightAuto(code).value;
  }
})
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 }
  }
};
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
function customRequest(file){
  console.log(file)
}
function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return true;
}
class Article extends Component {
  constructor(props) {
    super(props)
    this.state = {
        title:"新增文章",
        loading:false,
        isEdit:false,
        imageUrl:require('../../../assets/image/Nipic_18003253_20140215180014733125-1140x600.jpg'),
        category:'',
        type:true,
        content:"",
        name:""

    }
  }
  componentDidMount() {
    this.smde = new SimpleMDE({
      element: document.getElementById('editor').childElementCount,
      autofocus: true,
      autosave: true,
      previewRender: function (plainText) {
        return marked(plainText);
      }
    })
    const data = JSON.parse(localStorage.getItem('data'))
    if (data){
      this.setState(Object.assign(this.state, data[0],{title:'编辑文章'}))
      this.smde.value(this.state.content)
    }

    console.log(this.state)
  }
  handleSubmit(e) {
    e.preventDefault();
    let data = localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : [];
    let content = this.smde.value()
    this.props.form.validateFields((err, values) => {
      if (!err && content.length > 0) {
        data.push({ content, ...values})
        console.log(data)
        localStorage.setItem('data', JSON.stringify(data))
      }else{
        !content.length && this.setState({content:''})
        // console.log()
        console.log('...............',this.state.content)
      }
    });
  }
  handleChange(info){
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false
      }));
    }
  }
  normFile(e){
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl, type, category, name, content} = this.state;
    return (
      <div className='Article'>
        <div className='Article_body'>
          <div className='Article_body_title'><h2>{this.state.title}</h2></div>
          <div className='Article_body_content'>
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <FormItem
                  {...formItemLayout}
                  label="名称"
              >
                {getFieldDecorator('name', {
                  initialValue: name,
                  rules: [
                    { required: true, message: '请选择文章名称'}
                  ]
                })(
                  <Input placeholder="请输入名称" />
                  )}
              </FormItem>
              <FormItem
                  {...formItemLayout}
                  label="分类"
              >
                {getFieldDecorator('category', {
                  initialValue: category,
                  rules: [
                    { required: true, message: '请选择分类'}
                  ]
                })(
                  <Select placeholder='请选择分类'>
                    <Option value="1">javascript</Option>
                    <Option value="2">node.js</Option>
                    <Option value="3">nginx</Option>
                  </Select>
                  )}
              </FormItem>
              <FormItem
                  {...formItemLayout}
                  label="公开"
              >
                {getFieldDecorator('type', { valuePropName: 'checked', initialValue:type})(
                  <Switch />
                )}
              </FormItem>
              <FormItem
                  {...formItemLayout}
                  label="封面"
              >
                <div className="dropbox">
                  {getFieldDecorator('imgUrl', {
                    valuePropName: 'fileList',
                    getValueFromEvent: this.normFile
                  })(
                    <Upload.Dragger
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        customRequest={customRequest}
                        beforeUpload={beforeUpload}
                        onChange={this.handleChange.bind(this)}
                    >
                      {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                    </Upload.Dragger>
                    )}
                </div>
              </FormItem>
              <FormItem
                  className='placeError'
                  {...formItemLayout}
                  label="内容"
              >
                <textarea id="editor"></textarea>
                {getFieldDecorator('name1', {
                  initialValue: content,
                  rules: [
                    { required: true, message: '请填写内容' }
                  ]
                })(
                  <Input className='hidden'/>
                  )}
              </FormItem>
              <div className='btn_center'>
                <FormItem
                    wrapperCol={{ span: 12, offset: 5 }}
                >
                <Button type="primary" htmlType="submit">发布</Button>
                <Button>取消</Button>
                </FormItem>
              </div>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

const WrappedArticle= Form.create()(Article);

export default WrappedArticle