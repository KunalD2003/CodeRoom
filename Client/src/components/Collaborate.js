import React, { useState, useRef, useEffect } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import Member from "./Member";
import Editor from "./Editor";
import { socketIo } from "./socket";
import toast from 'react-hot-toast';
import './Collaborate.css';
import logo from '../assets/images/icon.png';

const Collaborate = () => {
    const [members, setMembers] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    useEffect(() => {
        const initSocket = async () => {
            socketRef.current = await socketIo();
            socketRef.current.on('connect_error', handleErrors);
            socketRef.current.on('connect_failed', handleErrors);
            socketRef.current.emit('join', {
                username: location.state?.userName,
                roomId: location.state?.roomId,
            });
            socketRef.current.on('joined', ({ users, username, socketId }) => {
                if (username !== location.state?.userName) {
                    toast.success(`${username} has joined`);
                }
                setMembers(users);
                socketRef.current.emit('sync-code', {
                    myCode: codeRef.current,
                    socketId,
                });
            });
            socketRef.current.on('disconnected', ({ socketId, username }) => {
                toast.success(`${username} has left the room`);
                setMembers(prev => prev.filter(member => member.socketId !== socketId));
            });
        };
        const handleErrors = (err) => {
            console.log('Socket error:', err);
            toast.error('Socket connection failed, try again later.');
            navigate('/');
        };
        initSocket();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off('joined');
            socketRef.current.off('disconnected');
        };
    }, [location, navigate]);
    if (!location.state) {
        return <Navigate to="/" />;
    }
    const copyId = () => {
        navigator.clipboard.writeText(location.state.roomId);
        toast.success("Room ID copied");
    };
    const leaveRoom = () => {
        if (window.confirm("Do you want to leave the room?")) {
            navigate('/');
        }
    };
    return (
        <Container fluid className="collaborate-container">
            <Row className="collaborate-row">
                <Col md={3} className="left-side p-4">
                    <img src={logo} alt="Code Syncronix Logo" className='collborate-logo' />
                    <h4 className="text-light">Connected Users</h4>
                    <div className="members-list">
                        {members.map((member) => (
                            <Member key={member.socketId} username={member.username} />
                        ))}
                    </div>
                    <div className="d-flex flex-column mt-4">
                        <Button variant="outline-light" onClick={copyId} className="mb-2">Copy Room ID</Button>
                        <Button variant="danger" onClick={leaveRoom}>Leave Room</Button>
                    </div>
                </Col>
                <Col md={9} className="right-side">
                    <Editor
                        socketref={socketRef}
                        roomId={location.state?.roomId}
                        onCode={(myCode) => codeRef.current = myCode}
                    />
                </Col>
            </Row>
        </Container>
    );
};
export default Collaborate;





