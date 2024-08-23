import React, { useState, useEffect, useRef } from 'react';
import './Editor.css'
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
        const code = {
            code: editorRef.current.getValue(),
            input: document.getElementById('input').value,
            lang: document.getElementById("option").value,
        };
        const resp = await axios.post("http://localhost:5000/api/Collaborate", code);
        setOutputData(resp.data.output);
    };
    return (
        <>
            <Row className="editor-container">
                <Col md={8} className="editor-col">
                    <textarea id="realtimeEditor"></textarea>
                </Col>
                <Col md={4} className="control-panel p-3">
                    <Form.Group className="mb-3">
                        <Form.Label>Language</Form.Label>
                        <Form.Control as="select" id="option" onChange={options}>
                            <option value="Python">Python</option>
                            <option value="Java">Java</option>
                            <option value="Cpp">Cpp</option>
                            <option value="C">C</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Input</Form.Label>
                        <Form.Control as="textarea" id="input" rows={5} />
                    </Form.Group>
                    <Button variant="primary" onClick={getData} className="run-button">
                        <FaPlay /> Run
                    </Button>
                    <Form.Group className="mt-3">
                        <Form.Label>Output</Form.Label>
                        <Form.Control as="textarea" value={outputData} readOnly rows={5} className="output-field" />
                    </Form.Group>
                </Col>
            </Row>
        </>
    );
};
export default Editor;





