import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox, Radio, Upload, message } from 'antd';

const FormItem = Form.Item;
const qiniu = require('qiniu-js')
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    xs: { span: 5 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
};
class AddFrom extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      menuName: '',
      type: 1,
      readOnly: false,
      url: '',
      show: true,
      typeCheck: 1,
      iconCheck: 0,
      preview: false, // icon 展示
      icon: ''

    }
  }
  componentDidMount() {
    this.props.setChild(this)
    if (this.props.item) {
      this.setState(Object.assign(this.state, this.props.item))
    }
  }
  handleSubmit(e) {
    this.props.form.validateFields((err, values) => {
      values.id = this.props.item.id
      values.icon = this.state.icon
      values.type = this.state.type
      values.parentId = this.state.parentId
      if (err) {
        this.props.valid(false)
        return
      }
      this.props.valid(values)
    });
  }
  typeChange(e) {
    this.setState({ type: e.target.value })
  }
  typeCheckChange(e) {
    this.setState({ iconCheck: e.target.value })
  }
  iconBlur(e) {
    if (e.target.value.length > 0) {
      let validator = this.Util.validator.isUrl(e.target.value)
      this.setState({ iconValidatorr: validator, icon: validator ? e.target.value : '' })
      return
    }
    this.setState({ iconValidatorr: true })
  }
  preview() {
    this.setState({ preview: !this.state.preview })
  }
  iconChange(e) {
    this.setState({ icon: e.target.value })
  }
  menuChange(e) {
    this.setState({ url: e.target.value })
  }
  async upload(info) {
    let _self = this
    let tokenDate = await this.get('getQiniuToken')
    var observable = qiniu.upload(info.file, 'icon/' + new Date().getTime() + "_" + info.file.name, tokenDate.data, {}, {
      useCdnDomain: true
    })
    var subscription = observable.subscribe({
      next(res) {
        // ...
        console.log('next', res)
      },
      error(err) {
        console.log(err)
        message.error('上传失败，请重新上传')
      },
      complete(res) {
        info.onSuccess(res)
        message.success('上传成功')
        _self.setState({
          icon: 'https://image.oa.woatao.cn/' + res.key,
          iconCheck: 0
        })
      }
    })
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    let { type, menuName, readOnly, url, show, icon, parentId } = this.state
    // if(icon){
    //   this.setState({icon:icon})
    // }
    return (
      <Form onSubmit={this.handleSubmit} className="login-form" ref='addForm'>
        <Form.Item
            label="菜单名称" {...formItemLayout}
        >
          {getFieldDecorator('menuName', {
            initialValue: menuName,
            rules: [{ required: true, message: '请填写菜单名称' }]
          })(
            <Input placeholder="菜单名称" />
          )}
        </Form.Item>
        <Form.Item
            label="菜单目录" {...formItemLayout}
        >
          <RadioGroup value={this.state.type} onChange={this.typeChange.bind(this)}>
            <Radio value={1}>目录</Radio>
            <Radio value={2}>菜单</Radio>
          </RadioGroup>
        </Form.Item>
        {
          this.state.type === 2 ?
            <Form.Item label="菜单地址" {...formItemLayout}>
              {getFieldDecorator('url', {
                initialValue: url,
                rules: [{ required: true, message: '请填写菜单地址' }, {
                  // pattern:/(http|ftp|https|\/):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,message:'请填写正确的菜单地址'
                }]
              })(
                <Input placeholder="菜单地址"
                    onBlur={this.iconBlur.bind(this)}
                    onChange={this.menuChange.bind(this)}
                    suffix={<Icon type={this.state.preview ? 'eye-invisible' : 'eye'}
                        onClick={this.preview.bind(this)}
                            />}
                />
              )}
            </Form.Item>
            : ''
        }
        {
          parentId === 0 ? <Form.Item
              label="icon" {...formItemLayout}
                           >
            <RadioGroup onChange={this.typeCheckChange.bind(this)} value={this.state.iconCheck} >
              <Radio value={0}>链接</Radio>
              <Radio value={1}>上传</Radio>
            </RadioGroup>
          </Form.Item> : null}
        {
          parentId === 0 ?
            <Form.Item label={`icon链接`} {...formItemLayout}>
              {
                this.state.iconCheck ?
                  <Upload name='file'
                      accept="image/*"
                      customRequest={this.upload.bind(this)}
                  >
                    <Button>
                      <Icon type="upload" /> 上传icon
                    </Button>
                  </Upload>
                  :
                  <Input placeholder={this.state.iconValidatorr ? "icon链接" : "请输入正确的url"}
                      className={this.state.iconValidatorr ? "" : 'error'}
                      onBlur={this.iconBlur.bind(this)}
                      value={this.state.icon}
                      onChange={this.iconChange.bind(this)}
                      onClick={this.preview.bind(this)}
                      suffix={<Icon type={this.state.preview ? 'eye-invisible' : 'eye'} />}
                  />
              }
            </Form.Item> : null
        }
        <Form.Item
            label="其他操作" {...formItemLayout}
        >
          <div>
            {/* {getFieldDecorator('readOnly', {
                  valuePropName: 'checked',
                  initialValue: readOnly,
                  rules: [{ required: true, message: '' }]
                })(
                  <Checkbox>是否只读</Checkbox>
                )} */}
            {getFieldDecorator('show', {
              initialValue: show
            })(
              <Checkbox defaultChecked >是否展示</Checkbox>
            )}
            <p className='tips'>温馨提示 : 其他操作修改,对应的子级将会继承该属性</p>
          </div>
        </Form.Item>
        {/* <Form.Item 
            label="icon链接"> 
          {getFieldDecorator('icon',{
              initialValue: icon,
              rules: [{ required: true, message: '' }]
          })(
            <RadioGroup  >
              <Radio value={1}>链接</Radio>
              <Radio value={2}>上传</Radio>
             
          </RadioGroup>
          )
          }
        </Form.Item>
        {
           getFieldValue('icon') == 1 ?
           <Form.Item>
              <Form.Item>
                {getFieldDecorator('iconUrl', {
                  initialValue: url,
                  rules: [{ required: true, message: '请填写菜单路径' },{pattern:/\/[a-zA-Z]/,message:'请填写正确的菜单路径'}]
                })(
                  <Input placeholder="菜单路径" />
                  )}
              </Form.Item>
           </Form.Item>
         : <Form.Item>
           {getFieldDecorator('iconids',{

           })(
               <Upload {...props2}>
                <Button>
                  <Icon type="upload" /> Upload
                </Button>
              </Upload> 
           )

           }
           
          </Form.Item> */}
        {/* }  */}

      </Form>
    );
  }
}

const WrappedNormalAddFrom = Form.create()(AddFrom);
export default WrappedNormalAddFrom 