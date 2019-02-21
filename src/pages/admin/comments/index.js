import React, { Component } from 'react'
import './index.less'
import { Select,Table,Modal,Button,Input } from 'antd';
import { Link } from 'react-router-dom'
const Option = Select.Option;
const confirm = Modal.confirm;
let timeout;
export default class Comments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text:'',
      value:'',
      pagination:{
        total:0,
        pageSize:10,
        hideOnSinglePage:true,
        current:1
      },
      articleId:'',
      articleList:[],
      data:[],
      loading:false,
      columns : [
        {
          align:'center',
          title: '用户名称',
          dataIndex: 'name',
          key: 'name',
        },{
            align: 'center',
            title: '评论内容',
            dataIndex: 'text',
          }, {
          align:'center',
          title: '创建时间',
          dataIndex: 'createAt',
          render:(text,record)=>{
            return this.Util.getNowFormatDate(text)
          }
        }, {
          align: 'center',
          title: '网址',
          dataIndex: 'url',
        }, {
          align: 'center',
          title: '邮箱',
          dataIndex: 'email',
        },{
          align: 'center',
          title: '操作',
          dataIndex: 'age',
          key: 'control',
          render:(text, record) => (
            <span>
              <a href="javascript:;" onClick={this.deleteCallback.bind(this,record)}>删除</a>
            </span>
          )
        }
      ]      
    }
  }
  componentDidMount(){
    if(this.props.match.params && this.props.match.params.articleId){
        this.setState({
            articleId:this.props.match.params.articleId,
        },()=>{
            this.getArticleList('', list =>{
                this.setState({
                    value:list.find(item=>item.id == this.state.articleId).name
                })
                console.log(this.state)
            })
            this.getList()
        })
    }else{
        this.getList()
    }
  }
  async getList(){
    this.setState({loading:true})
    let res = await this.get('getCommentsList',{page:this.state.pagination.current,size:this.state.pagination.pageSize,bookArticleId:this.state.articleId,text:this.state.text})
    this.setState({
        data:res.data.rows,
        loading:false,
        pagination:{...this.state.pagination,total:res.data.count}
    })
  }
  async getArticleList(name,callback){
    let list = await this.post('getArticleList',{page:1,size:10,name})
    list.data.rows && this.setState({articleList:list.data.rows})
    list.data.rows && callback && callback(list.data.rows)
  }
  tableChange(p){
      this.setState({
        pagination:{...this.state.pagination,current:p.current}
      },this.getList)
  }
  deleteCallback(item){
    let _self = this
    confirm({
      title: '确定删除该评论吗?',
      okText:"确认",
      cancelText:'取消',
      onOk() {
        return new Promise(async (resolve, reject) => {
          await _self.get('deleteComments',{id:item.id})
          _self.getList()
          resolve()
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
  }  
  handelChange(e){
    this.setState({
        text:e.target.value
    })
  }
  seaceChange(id){
    this.setState({
        articleId:id,
        value:this.state.articleList.find(item=>item.id == this.state.articleId).name
    })      
  }
  handleSearch(v){
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(()=>{this.getArticleList(v)}, 300);    
  }
  render() {
    return (
        <div className='Comments'>
            <div className='Comments_seace'>
                <div className='Comments_seace_select'>
                    <div className='Comments_seace_select_item'>
                        <span className='label'>文章名称</span>    
                        <div className='label_content'>
                            <Select defaultActiveFirstOption={false} value={this.state.value}
                                showArrow={false} allowClear filterOption={false} showSearch onSearch={this.handleSearch.bind(this)} onChange={this.seaceChange.bind(this)}>
                                    {
                                        this.state.articleList.map((item)=>{
                                            return <Option value={item.id} key={item.id}>{item.name}</Option>
                                        })
                                    }
                            </Select>                     
                        </div>                     
                    </div>    
                    <div className='Comments_seace_select_item'>
                        <span className='label'>评论内容</span>    
                        <div className='label_content'>
                            <Input  onChange={this.handelChange.bind(this)} />                  
                        </div>                     
                    </div>                               
                </div>
                <div className='Comments_seace_button'>
                    <Button type="primary" block onClick={this.getList.bind(this)}>查询</Button>
                </div>
            </div>
            <div className='Comments_table'>
              <Table rowKey='id' pagination={this.state.pagination} columns={this.state.columns} dataSource={this.state.data} bordered  onChange={this.tableChange.bind(this)} loading={{tip:"数据加载中，请稍后",spinning:this.state.loading}}/>
            </div>
        </div>
    )
  }
}

