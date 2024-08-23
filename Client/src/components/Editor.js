import React, { useState, useEffect, useRef } from 'react';
import './Editor.css';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/theme/ambiance.css';
import { FaPlay } from "react-icons/fa";
import axios from 'axios';
import { Row, Col, Button, Form } from "react-bootstrap";

const Editor = ({ socketref, roomId, onCode }) => {
    const [outputData, setOutputData] = useState("");
    const editorRef = useRef(null);
    const controlPanelRef = useRef(null);
    const isResizing = useRef(false);
    const startY = useRef(0);
    const startHeight = useRef(0);

    useEffect(() => {
        editorRef.current = Codemirror.fromTextArea(
            document.getElementById('realtimeEditor'),
            {
                mode: { name: 'python', json: true },
                theme: 'ambiance',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
            }
        );
        editorRef.current.on('change', (instance, changes) => {
            const { origin } = changes;
            const myCode = instance.getValue();
            onCode(myCode);
            if (origin !== 'setValue') {
                socketref.current.emit('code-change', { roomId, myCode });
            }
        });

        // Adjust editor size on load
        adjustEditorHeight();
        window.addEventListener('resize', adjustEditorHeight);

        return () => {
            window.removeEventListener('resize', adjustEditorHeight);
        };
    }, []);

    useEffect(() => {
        if (socketref.current) {
            socketref.current.on('code-change', ({ myCode }) => {
                if (myCode !== null) {
                    editorRef.current.setValue(myCode);
                }
            });
        }
        return () => {
            socketref.current.off('code-change');
        };
    }, [socketref.current]);

    const options = () => {
        const option = document.getElementById("option").value;
        const mode = option === "Java" ? "text/x-java" :
            option === "Python" ? "python" :
            option === "Cpp" || option === "C" ? "text/x-c++src" : "javascript";
        editorRef.current.setOption("mode", mode);
    };

    const getData = async () => {
        try {
            const code = {
                code: editorRef.current.getValue(),
                input: document.getElementById('input').value,
                lang: document.getElementById("option").value,
            };
            const resp = await axios.post("http://localhost:5000/api/Collaborate", code);
    
            if (resp.data.error) {
                setOutputData(resp.data.error);  // Display error if present
            } else {
                setOutputData(resp.data.output); // Display output on successful compilation
            }
        } catch (error) {
            console.error('Error during compilation:', error);
            setOutputData('Error during compilation. Please check your code and try again.');
        }
    };
    

    const handleMouseDown = (e) => {
        isResizing.current = true;
        startY.current = e.clientY;
        startHeight.current = controlPanelRef.current.offsetHeight;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (isResizing.current) {
            const offsetBottom = startY.current - e.clientY;
            const newHeight = startHeight.current + offsetBottom;
            controlPanelRef.current.style.height = `${newHeight}px`;
            adjustEditorHeight();
        }
    };

    const handleMouseUp = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const adjustEditorHeight = () => {
        const editorContainerHeight = document.querySelector('.editor-container').clientHeight;
        const controlPanelHeight = controlPanelRef.current ? controlPanelRef.current.clientHeight : 0;
        const newEditorHeight = editorContainerHeight - controlPanelHeight - 20; // Adjust for margins/padding
        editorRef.current.setSize(null, `${newEditorHeight}px`);
    };

    return (
        <div className="editor-container">
            <div className="editor-header">
                <Form.Control as="select" id="option" onChange={options} className="language-select">
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="Cpp">Cpp</option>
                    <option value="C">C</option>
                </Form.Control>
                <Button variant="primary" onClick={getData} className="run-button">
                    <FaPlay />
                </Button>
            </div>
            <textarea id="realtimeEditor"></textarea>
            <div ref={controlPanelRef} className="control-panel">
                <div className="resizer" onMouseDown={handleMouseDown}></div>
                <Row className="flex-grow-1">
                    <Col md={6}>
                        <Form.Group className="mt-3">
                            <Form.Label>Input</Form.Label>
                            <Form.Control as="textarea" id="input" rows={5} />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mt-3">
                            <Form.Label>Output</Form.Label>
                            <Form.Control as="textarea" value={outputData} readOnly rows={5} className="output-field" />
                        </Form.Group>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Editor;
