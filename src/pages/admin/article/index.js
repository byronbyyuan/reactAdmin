import React, { Component } from 'react'
import './index.less'
import { Form, Input, Select, Button, Upload, Switch, Icon, message, Spin } from 'antd';
import SimpleMDE from 'simplemde'
import marked from 'marked'
import highlight from 'highlight.js'
const qiniu = require('qiniu-js')
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
let timeout
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
function beforeUpload(file) {
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
      isAdd: true,
      percent: 0,
      CategoryList: [],
      title: "新增文章",
      loading: false,
      isEdit: false,
      bookImg: '',
      bookCategoryId: '',
      privacy: false,
      content: "",
      name: "",
      ajaxLoading: false,
      type: 'Article'
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
    this.getCategoryList()
    if (this.props.match.params && this.props.match.params.articleId) {
      this.setState({ title: '编辑文章', isAdd: false })
      this.getArticle(this.props.match.params.articleId)
    }
  }
  async getArticle(id) {
    let data = await this.get('getArticle', { id })
    if (data.code == 10001) {
      this.setState(Object.assign(this.state, data.data))
      console.log(marked(data.data.content),'jjjjj')
      this.smde.value(data.data.content)
    }
  }
  handleSubmit(state) {
    let content = this.smde.value()
    let submitUrl = 'createArticle'
    if (state === 'view') {
      this.props.history.push('/admin/book/view')
      return false
    }
    if (state === 'article') {
      this.props.history.push('/admin/book/article')
      return
    }
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let body = {
          ...values,
          content,
          bookImg: this.state.bookImg,
          state
        }
        if (!this.state.isAdd) {
          submitUrl = 'updateArticle'
          body.id = this.props.location.query.id
        }
        this.setState({ ajaxLoading: true })
        // console.log(marked(content))
        let list = await this.post(submitUrl, body)
        if (list.code == 10001) {
          message.success((this.state.isAdd ? '创建' : '编辑') + '成功')
          this.props.history.push('/admin/book/list')
        }
        this.setState({ ajaxLoading: false })
      }
    });
  }
  async upload(info) {
    let _self = this
    let tokenDate = await this.get('getQiniuToken')
    if (!tokenDate.data) return
    this.setState({ bookImg: '' })
    var observable = qiniu.upload(info.file, 'article/' + new Date().getTime() + "_" + info.file.name, tokenDate.data, {}, {
      useCdnDomain: true
    })
    var subscription = observable.subscribe({
      next(res) {
        _self.setState({ loading: true, percent: res.total.percent });
        console.log('next', res)
      },
      error(err) {
        console.log(err)
        message.error('上传失败，请重新上传')
        _self.setState({ loading: false, percent: 0 });
      },
      complete(res) {
        info.onSuccess(res)
        message.success('上传成功')
        _self.setState({
          bookImg: 'https://image.oa.woatao.cn/' + res.key,
          loading: false,
          percent: 0
        })
      }
    })
  }
  handleSearch(v) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => { this.getCategoryList(v) }, 300);
  }
  async getCategoryList(name = '') {
    let list = await this.get('getCategoryList', { page: 1, size: 5, name })
    if (list.code == 10001) {
      this.setState({ CategoryList: list.data.rows })
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">{this.state.loading ? parseInt(this.state.percent) + '%' : "上传"}</div>
      </div>
    );
    const { bookImg, privacy, bookCategoryId, name } = this.state;
    return (
      <div>
        {this.state.type === 'Article' ?
          <div className='Article'>
            <Spin tip="数据加载中，请稍后" spinning={this.state.ajaxLoading} wrapperClassName='skin'>
              <div className='Article_body'>
                <div className='Article_body_title'><h2>{this.state.title}</h2></div>
                <div className='Article_body_content'>
                  <Form>
                    <FormItem
                        {...formItemLayout}
                        label="名称"
                    >
                      {getFieldDecorator('name', {
                        initialValue: name,
                        rules: [
                          { required: true, message: '请选择文章名称' }
                        ]
                      })(
                        <Input placeholder="请输入名称" />
                      )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="分类"
                    >
                      {getFieldDecorator('bookCategoryId', {
                        initialValue: bookCategoryId,
                        rules: [
                          { required: true, message: '请选择分类' }
                        ]
                      })(
                        <Select placeholder='请选择分类' defaultActiveFirstOption={false}
                            showArrow={false} filterOption={false} showSearch onSearch={this.handleSearch.bind(this)}
                        >
                          {
                            this.state.CategoryList.map((item) => {
                              return <Option value={item.id} key={item.id}>{item.name}</Option>
                            })
                          }
                        </Select>
                      )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="设为隐私"
                    >
                      {getFieldDecorator('privacy', { initialValue: privacy })(
                        <Switch />
                      )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="封面"
                    >
                      <div className="dropbox">
                        <Upload.Dragger
                            name="avatar"
                            accept="image/*"
                            customRequest={this.upload.bind(this)}
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                        >
                          {bookImg ? <img src={bookImg} alt="avatar" /> : uploadButton}
                        </Upload.Dragger>
                      </div>
                    </FormItem>
                    <FormItem
                        className='placeError'
                        {...formItemLayout}
                        label="内容"
                    >
                      <textarea id="editor"></textarea>
                    </FormItem>
                    <div className='btn_center'>
                      <FormItem
                          wrapperCol={{ span: 12, offset: 5 }}
                      >
                        <Button type="primary" onClick={this.handleSubmit.bind(this, false)}>草稿</Button>
                        <Button type="primary" onClick={this.handleSubmit.bind(this, true)}>发布</Button>
                        <Button>取消</Button>
                      </FormItem>
                    </div>
                  </Form>
                </div>
              </div>
            </Spin>
          </div> :
          <div className='View'>
            {marked(this.state.content)}
            <Button type="primary" onClick={this.handleSubmit.bind(this, 'article')}>返回</Button>
          </div>
        }
      </div>
    )
  }
}

const WrappedArticle = Form.create()(Article);

export default WrappedArticle