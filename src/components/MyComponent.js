import React, { useRef, useState, useEffect } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import ContentEditable from 'react-contenteditable';

const MyComponent = () => {
    const contentEditable = useRef();
    const [html, setHtml] = useState('<b>Hello <i>World</i></b>');
    const [isBold, setIsBold] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [selectedFontSize, setSelectedFontSize] = useState('16');
    const [selectedFontColor, setSelectedFontColor] = useState('#000000');

    const handleBoldClick = () => {
        setIsBold(!isBold);
        document.execCommand('bold', false, null);
    };

    const handleUnderlineClick = () => {
        setIsUnderline(!isUnderline);
        document.execCommand('underline', false, null);
    };

    const handleChange = (evt) => {
        setHtml(evt.target.value);
    };

    // const handleFontSizeChange = (evt) => {
    //     const newFontSize = `${evt.target.value}px`; // Include unit "px"
    //     setSelectedFontSize(newFontSize);

    //     const selection = window.getSelection();
    //     if (selection.rangeCount > 0) {
    //         const range = selection.getRangeAt(0);
    //         const selectedText = range.extractContents();
    //         const span = document.createElement('span');
    //         span.style.fontSize = newFontSize;
    //         span.appendChild(selectedText);
    //         range.insertNode(span);
    //     }
    // };

    const handleFontColorChange = (evt) => {
        const newFontColor = evt.target.value;
        setSelectedFontColor(newFontColor);
        document.execCommand('foreColor', false, newFontColor);
    };

    const handleFontSizeChange = (e) => {
        const newFontSize = e.target.value;
        setSelectedFontSize(newFontSize);
        document.execCommand('fontSize', false, newFontSize);
    }

    const updateButtonStates = () => {
        setIsBold(document.queryCommandState('bold'));
        setIsUnderline(document.queryCommandState('underline'));
    };

    useEffect(() => {
        document.addEventListener('selectionchange', updateButtonStates);
        document.execCommand('fontSize', false, selectedFontSize);
        return () => {
            document.removeEventListener('selectionchange', updateButtonStates);
        };
    }, [selectedFontSize]);

    useEffect(() => {
        document.addEventListener('selectionchange', updateButtonStates);
        document.execCommand('foreColor', false, selectedFontColor);
        return () => {
            document.removeEventListener('selectionchange', updateButtonStates);
        };
    }, [selectedFontColor]);

    return (
        <Container>
            <Row style={{ marginTop: '20px' }}>
                <Col style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px' }}>
                    <Button variant='lg-btn btn-info' onClick={handleBoldClick} style={{ fontWeight: isBold ? 'bold' : 'normal' }}>
                        B
                    </Button>
                    <Button variant='lg-btn btn-info' onClick={handleUnderlineClick} style={{ fontWeight: isUnderline ? 'bold' : 'normal' }}>
                        <u>U</u>
                    </Button>
                    <input type="number" min="8" max="96" value={selectedFontSize} onChange={handleFontSizeChange} />
                    <input type="color" value={selectedFontColor} onChange={handleFontColorChange} />
                </Col>
            </Row>
            <Row>
                <ContentEditable
                    className="textarea big"
                    style={{ marginTop: '50px', height: '500px' }}
                    innerRef={contentEditable}
                    html={html}
                    disabled={false}
                    onChange={handleChange}
                    tagName='article'
                    dir='auto'
                />
            </Row>
        </Container>
    );
};

export default MyComponent;
