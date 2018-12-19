import React from 'react'
import { GoCalendar, GoComment, GoEye } from "react-icons/go";
import { Link } from 'react-router-dom'
import './index.less'
export default (item)=> {
  const path = {
    pathname: '/home/view',
    query: { id: 3, name: 25, age: 36 }
  }
  return (
    <div  className='item'>
        <div className='item_img'>
          <Link to={path}>
            <img src={require('../../assets/image/Nipic_18003253_20140215180014733125-1140x600.jpg')} />
          </Link>
        </div>
      <div className='item_main'>
        <div className='item_tag'>
          <span>javascript</span>
        </div>
        <div className='item_content'>
          <div className='item_content_title'>
            <h1>
              <Link to={path}>
                Polymer 初体验
              </Link>
            </h1>
            <ul className='item_meta'>
              <li className='meta_time'>
                <i><GoCalendar/></i>发表于2018年08月10日</li>
              <li className='meta-divider'>•</li>
              <li className='meta_time'><i><GoEye/></i><span>1768次围观</span></li>
              <li className='meta-divider'>•</li>
              <li className='meta_time'><i><GoComment/></i>15条评论</li>
            </ul>
          </div>
          <div className='item_content_text'>
            <p>C94 和 CP2018SP 不是同一天，但都是同人展，时间又很近，就写在一起了</p>
            <h1><a href=''>C94</a></h1>
            <p>Comic Market，全球最大的同人展，8 月 10 日在东京举办，我当然没钱去，三天都在 Twitter 云参展，口水流了一地</p>
            <p>托朋友到 Aniplex 展台买了矢吹健太朗的 darling 本子，毕竟官方画师质量超级棒，舔爆！</p>
          </div>
        </div>
      </div>
    </div>
  )
}