import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { v4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import './Entry.css';
import logo from '../assets/images/icon.png';

function Entry() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [showRoomIdInput, setShowRoomIdInput] = useState(false);

  const CreateRoom = (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      toast.error("UserName is required!");
      return;
    }
    const id = v4();
    setRoomId(id);
    navigate(`/Collaborate/${id}`, {
      state: {
        userName, roomId: id,
      },
    });
    toast.success("New Room Created ");
  }

  const JoinRoom = (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      toast.error("UserName is required!");
      return;
    }
    setShowRoomIdInput(true);
  }

  const EnterRoom = (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      toast.error("UserName is required!");
      return;
    }
    if (!roomId.trim()) {
      toast.error("Room Id is required!");
      return;
    }
    navigate(`/Collaborate/${roomId}`, {
      state: {
        userName, roomId,
      },
    });
  }

  const ForEnter = (e) => {
    if (e.code === "Enter") {
      showRoomIdInput ? EnterRoom(e) : JoinRoom(e);
    }
  }

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID Copied!");
  };

  return (
    <div className='entry-div'>
      <div className='fill-entry-info'>
        <img src={logo} alt="Code Syncronix Logo" className='logo' />
        <form className='input-form'>
          <div className='input-container'>
            <input
              className='entry-input'
              placeholder='Username'
              value={userName}
              onChange={(e) => { setUserName(e.target.value) }}
              onKeyUp={ForEnter}
            />
            <i className='bx bx-user input-icon'></i>
          </div>
          {showRoomIdInput && (
            <div className='input-container'>
              <input
                className='entry-input'
                placeholder='Room Id'
                value={roomId}
                onChange={(e) => { setRoomId(e.target.value) }}
                onKeyUp={ForEnter}
              />
              <i className='bx bx-copy input-icon' onClick={handleCopyRoomId}></i>
            </div>
          )}
          <div className='entry-btn-class'>
            {!showRoomIdInput && (
              <>
                <Button variant="light" className='mt-3 entry-btn' onClick={JoinRoom}>Join Room</Button>
                <Button variant="light" className='mt-3 entry-btn' onClick={CreateRoom}>Create Room</Button>
              </>
            )}
            {showRoomIdInput && (
              <Button variant="light" className='mt-3 entry-btn' onClick={EnterRoom}>Join Room</Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Entry;