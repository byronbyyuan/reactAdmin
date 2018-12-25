import React, { Component } from 'react'
import './index.less'
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker, Radio, Table, Divider } from 'antd';
import {user} from '../../../redux/actions/index'
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option;


const columns = [
  {
    align:'center',
    title: '文章名称',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="javascript:;">{text}</a>
  }, {
    align: 'center',
    title: '状态',
    dataIndex: 'address',
    key: 'address'
  }, {
    align:'center',
    title: '分类',
    dataIndex: 'age',
    key: 'type'
  }, {
    align: 'center',
    title: '类型',
    dataIndex: 'age',
    key: 'style'
  }, {
    align: 'center',
    title: '发布时间',
    dataIndex: 'age',
    key: 'time',
    sorter: (a, b) => a.age - b.age
  },{
    align: 'center',
    title: '浏览量',
    dataIndex: 'age',
    key: 'num',
    sorter: (a, b) => a.age - b.age
  }, {
    align: 'center',
    title: '操作',
    dataIndex: 'age',
    key: 'control',
    render:(text, record) => (
      <span>
        <a href="javascript:;">编辑 {record.lastName}</a>
        <Divider type="vertical" />
        <a href="javascript:;">删除</a>
      </span>
    )
  }
]
const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park'
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park'
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park'
}];
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
const FormItem = Form.Item;
export class AdminList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      category:"0",
      name:'',
      time:"",
      state:1,
      type:1,
      pagination:{
        total:30,
        pageSize:15,
        hideOnSinglePage:true,
        current:1
      },
      loading:false
    }
  }
  componentDidMount() {

  }
  handelChange(pagination, filters, sorter){

  }
  handleSearch(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log('Received values of form: ', values);
      this.get().then(
        res=>{
          
        }
      )
    });
  }
  disabledDate(moment){
    return new Date(moment).getTime() > new Date().getTime()
  }
  handleReset(){
    this.props.form.resetFields();
  }
  render() {
    let { category, name, time, state , type} = this.state
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='Admin'>
          <div className='Admin_seace'>
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch.bind(this)}
            >
              <Row gutter={24}>{
                <div>
                  <Col span={8}>
                    <FormItem
                        {...formItemLayout}
                        label="名称"
                    >
                      {getFieldDecorator('name', { initialValue:name })(
                        <Input placeholder="请输入名称" />
                      )}
                    </FormItem>
                  </Col>
                  <Row style={{float:'left',marginTop:'4px'}}>
                      <Col span={24} style={{ textAlign: 'right' }}>
                          <Button type="primary" htmlType="submit">搜索</Button>
                          <Button style={{ marginLeft: 18 }} onClick={this.handleReset.bind(this)}>
                            重置
                          </Button>
                      </Col>
                  </Row>

                  {/* <Col span={8}>
                    <FormItem
                        {...formItemLayout}
                        label="分类"
                    >
                      {getFieldDecorator('category', {
                        initialValue: category
                      })(
                        <Select placeholder='请选择分类'>
                          <Option value="0">全部</Option>
                          <Option value="1">javascript</Option>
                          <Option value="2">node.js</Option>
                          <Option value="3">nginx</Option>
                        </Select>
                        )}
                    </FormItem>
                  </Col> */}
                  {/* <Col span={8}>
                    <FormItem
                        {...formItemLayout}
                        label="类型"
                    >
                      {getFieldDecorator('type', {  initialValue: type })(
                        <RadioGroup name="type" >
                          <Radio value={1}>全部</Radio>
                          <Radio value={2}>公开</Radio>
                          <Radio value={3}>隐私</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col> */}
                  {/* <Col span={8}>
                    <FormItem
                        {...formItemLayout}
                        label="状态"
                    >
                    {getFieldDecorator('state', { initialValue: state })(
                      <RadioGroup name="state">
                        <Radio value={1}>全部</Radio>
                        <Radio value={2}>已发布</Radio>
                        <Radio value={3}>草稿</Radio>
                      </RadioGroup>
                    )}
                    </FormItem>
                  </Col> */}
                </div>
              }</Row>
            </Form>
          </div>
          {/* <div className='Admin_chat'>
            <div className='main' style={{ width: 400, height: 400 }} ref="chatMain"></div>
          </div> */}
          <div className='Admin_table'>
            <Table columns={columns} dataSource={data} bordered pagination={this.state.pagination} loading={this.state.loading}/>
          </div>
      </div>
    )
  }
}
const WrappedAdminList = Form.create()(AdminList);
const mapStateToProps = (state) => ({
  data:state.data
})

const mapDispatchToProps = {
  ...user
}
export default WrappedAdminList