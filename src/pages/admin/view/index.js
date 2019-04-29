import React, { Component } from 'react'
import './index.less'
import { Form, Row, Col, Input, Button, Select, DatePicker, Radio, Table, Divider, Modal, LocaleProvider } from 'antd';
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
import { user } from '../../../redux/actions/index'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn')

export class AdminList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      data: [],
      loading: false,
      content: ''
    }
  }
  componentDidMount() {
    if (this.props.match.params && this.props.match.params.articleId) {
      this.setState({ title: '编辑文章', isAdd: false })
      this.getArticle(this.props.match.params.articleId)
    }
  }
  async getArticle(id) {
    let data = await this.get('getArticle', { id })
    if (data.code == 10001) {
      this.setState(Object.assign(this.state, data.data))
    }
  }
  handleReturn(state) {
      this.props.history.push('/admin/book/list')
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='articleView'>
        <div>
            <h3 className='title'>{this.state.name}</h3>
            <div className='content' dangerouslySetInnerHTML={{ __html: marked(this.state.content)}}>
            </div>
        </div>
        <div className='View'>
          <Button type="primary" onClick={this.handleReturn.bind(this, 'article')}>返回</Button>
        </div>
      </div>
    )
  }
}
const WrappedAdminList = Form.create()(AdminList);
const mapStateToProps = (state) => ({
  data: state.data
})

const mapDispatchToProps = {
  ...user
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WrappedAdminList))
