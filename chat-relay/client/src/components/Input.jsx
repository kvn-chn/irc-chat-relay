import React from 'react'
import Img from '../assets/img.png';
import Attach from '../assets/attach.png';

const Input = () => {
  return (
    <div>
        <input type='text' className='msgbox' placeholder='type here'></input>
        <button className='sendbtn'>Send</button>
    </div>
  )
}

export default Input