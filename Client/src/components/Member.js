import React from 'react'
import Avatar from "react-avatar";
const Member = (props) => {
  return (
    <div className='client' style={{marginBottom: "0.8rem"}}> 
      <Avatar name={props.username} size={40} round="10px" />
      <span style={{marginLeft: "0.5rem"}}>{props.username}</span>
    </div>
  )
}

export default Member