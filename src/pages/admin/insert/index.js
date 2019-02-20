import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { user } from '../../../redux/actions/index'
import './index.less'

class Insert extends Component {
    constructor(props) {
        super(props)
        this.state = {
            link: "https://www.baidu.com/"
        }
    }
    componentDidMount(){
        console.log(this.props,'99999999999')
        if(this.props.history.location.search){
            let value = this.props.history.location.search.split('=')[1]
            this.props.insertUrl(value)
        }
    }
    loaded(){
        // console.log(document.getElementById("myrame").style,document.getElementById("myrame").contentWindow.document.body.scrollHeight,'88888')
        // document.getElementById("myrame").style.height=document.getElementById("myrame").contentWindow.document.body.scrollHeight;
    }
    render() {
        return (
            <div className='insert'>
                <object name="myiframe"
                    id="myrame"
                    data={this.props.url}
                    type='text/html'
                    width='100%'
                    height="100%"
                    height='500px'
                    frameBorder='0'
                    onLoad={this.loaded.bind(this)}
                >
                    <p>你的浏览器不支持iframe标签</p>
                </object>
            </div>
        )
    }
}
const mapState = (state, ownProps) => {
    return {
        url:state.user.insertUrl
    }
  }
  const mapDispatch = (dispatch, ownProps) => {
    return {
        insertUrl: data => {
            dispatch(user.insertUrl(data))
        }
    }
  }
  
export default withRouter(connect(mapState, mapDispatch)(Insert))
