import React, { Component } from 'react'
import './index.less'
import { Form, Row, Col, Input, Button, Select, DatePicker, Radio, Table, Divider, Modal, LocaleProvider } from 'antd';
import { Link } from 'react-router-dom'
import { user } from '../../../redux/actions/index'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const confirm = Modal.confirm;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
};
let timeout
const FormItem = Form.Item;

import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn')

export class AdminList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      CategoryList: [],
      name: '',
      time: [moment(new Date, 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')],
      pagination: {
        total: 0,
        pageSize: 15,
        hideOnSinglePage: true,
        current: 1
      },
      data: [],
      loading: false,
      columns: [
        {
          align: 'center',
          title: '文章名称',
          dataIndex: 'name',
          key: 'name',
          render: text => <a href="javascript:;">{text}</a>
        }, {
          align: 'center',
          title: '分类',
          dataIndex: 'bookCategory',
          render: (text, record) => {
            return text.name
          }
        }, {
          align: 'center',
          title: '创建时间',
          dataIndex: 'createAt',
          render: (text, record) => {
            return this.Util.getNowFormatDate(text)
          }
        }, {
          align: 'center',
          title: '类型',
          dataIndex: 'privacy',
          render: (text, record) => { return text ? "隐私" : '公开' }
        }, {
          align: 'center',
          title: '状态',
          dataIndex: 'state',
          render: (text, record) => { return text ? "已发布" : '草稿' }
        }, {
          align: 'center',
          title: '浏览量',
          dataIndex: 'pv',
          sorter: (a, b) => a.pv - b.pv
        }, {
          align: 'center',
          title: '评论数',
          dataIndex: 'commentsNum',
          key: 'commentsNum',
          render: (text, record) => (
            <span>
              {
                text > 0 ?
                  <Link to={'/admin/comments/' + record.id}>{text}</Link>
                  : text
              }
            </span>
          )
        }, {
          align: 'center',
          title: '操作',
          dataIndex: 'age',
          key: 'control',
          render: (text, record) => (
            <span>
              <a href="javascript:;" onClick={this.to.bind(this, record.id)}>编辑</a>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={this.deleteCallback.bind(this, record)}>删除</a>
            </span>
          )
        }
      ]
    }
  }
  componentDidMount() {
    this.getList()
    this.getCategoryList()
  }
  async getList({ bookCategoryId = '', name = '', state = true, privacy = false, time = [] } = {}) {
    !time.length ? time = this.state.time : ''
    time = [this.Util.getNowFormatDate(time[0]), this.Util.getNowFormatDate(time[1])]
    this.setState({ loading: true })
    let list = await this.post('getArticleList', { page: this.state.pagination.current, size: this.state.pagination.pageSize, name, bookCategoryId, state, privacy, time })
    this.setState({ loading: false, data: list.data.rows, pagination: { ...this.state.pagination, total: list.data.count } })
  }
  deleteCallback(item) {
    let _self = this
    confirm({
      title: '确定删除该数据吗?',
      okText: "确认",
      cancelText: '取消',
      onOk() {
        return new Promise(async (resolve, reject) => {
          await _self.get('deleteArticle', { id: item.id })
          _self.getList()
          resolve()
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() { }
    });
  }
  to(id) {
    this.props.history.push({
      pathname: '/admin/book/article/' + id,
      query: {
        id
      }
    })
  }
  handelChange(pagination, filters, sorter) {
    if (pagination.current != this.state.pagination.current) {
      this.setState({ pagination: pagination }, this.getList)
    }
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
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.time = this.state.time
        this.getList(values)
      }
    })
  }
  disabledDate(moment) {
    return new Date(moment).getTime() > new Date().getTime()
  }
  handleReset() {
    this.props.form.resetFields();
  }
  setTime(value) {
    this.setState({ time: value })
  }
  handleReturn(state) {
      this.props.history.push('/admin/book/article')
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
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
