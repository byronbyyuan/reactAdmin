import React from 'react'
import './index.less'
const Item = ({ childRen, avatar, name, time, context, onReply}) =>{
  const avatarUrl = require('../../assets/image/' + avatar)
  const reply = item => { onReply(item) }
  return (
    <li className='comments-list-item'>
      <div className='comments-list-item-avartar'>
        <img src={avatarUrl} alt="欧欧~头像丢了" />
      </div>
      <div className='comments-list-item-context'>
        <div className='comments-head'>
          <span className='comments-head-name'>{name}</span>
          <span className='comments-head-time'>{time}</span>
          <span className='comments-head-reply' onClick={reply.bind(this,name)}>回复</span>
        </div>
        <div className='comments-text'>
          <p>{context}</p>
        </div>
      </div>
      <ul className='comments-list-childRen'>
        {
          childRen
            ? childRen.map((item, i) => <Item {...item} onReply={onReply} key={i}/>)
            : ''
        }
      </ul>
    </li>
  )
}
export default (props) => {
  let { onReply, data } = props
  let { total, comments } = data
  const reply = () => { onReply('') }
  return (
    <div className='comments'>
      <div className='comments-title' style={{display:total ? 'block':'none'}}>已有<span>{total}</span>条吐槽</div>
      <ul className='comments-list'>
        {
          total
            ? comments.map((item, i) => <Item {...item} onReply={onReply} key={i}/>)
            : <li className='noComments'>暂无吐槽,<span onClick={reply}>吐槽一下</span></li>
        }
      </ul>
    </div>
  )
}