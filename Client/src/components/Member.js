import React from 'react'
import Avatar from "react-avatar";
const Member = (props) => {
  return (
    <div className='client'> 
      <Avatar name={props.username} size={40} round="10px" />
      <span>{props.username}</span>
    </div>
  )
}

export default Member