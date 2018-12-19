import { Component } from 'react'

class Bundle extends Component {
  constructor(props){
    super(props);
    this.state = {
      // 默认为空
      mod: null
    }
  }
  componentDidMount() {
    // 加载初始状态
    this.load(this.props);
  }
  componentDidUpdate(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps);
    }
  }
  load(props) {
    // 重置状态
    this.setState({
      mod: null
    });
    // 传入组件的组件
    props.load((mod) => {
      this.setState({
        mod: mod.default ? mod.default : mod
      });
    });
  }
  render() {
    // 不为空，则渲染传入的子组件函数
    return this.state.mod ? this.props.children(this.state.mod) : null;
  }
}


export default Bundle;