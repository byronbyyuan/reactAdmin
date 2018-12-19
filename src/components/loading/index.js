import React, { Component } from 'react'
import './index.less'
export default class Loading extends Component {
  render() {
    return (
      <div id="loadingView" className={{'folding':!this.props.show}}>
        <div className="loader">
          <div className="loader1"></div>
          <div className="loader2"></div>
          <div className="loader3"></div>
          <div className="loader4"></div>
          <div className="loader5"></div>
        </div>
        <div className="loaderText noSelect">Loading...</div>
      </div>
    )
  }
}