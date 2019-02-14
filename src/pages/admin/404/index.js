import React, { Component } from 'react'
import "./index.less"
import { withRouter } from 'react-router-dom'

class Error404 extends Component {
    constructor(props) {
        super(props)  
        this.state = {
        }
      }
    render() {
        return (
            <div className="error-page">
                <div className="error-page-container">
                    <div className="error-page-main">
                        <h3>
                            <strong>404</strong>无法打开页面
                        </h3>
                        <div className="error-page-actions">
                            <div>
                                <h4>可能原因：</h4>
                                <ol>
                                    <li>网络信号差</li>
                                    <li>找不到请求的页面</li>
                                    <li>没有相应的权限</li>
                                </ol>
                            </div>
                            <div>
                                <h4>可以尝试：</h4>
                                <ul>
                                    <li>选择其他页面</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Error404)
