import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Spinner } from "react-bootstrap";

import Page from "../PageClass";

import '../style/Login.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const TinyMceEditor = () => {
    const [page, setPage] = useState(new Page("", 1));
    const [content, setContent] = useState('');
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (isLoading) setLoading(false)
    }, [isLoading]);

    const onChange = (content) => {
        setContent(content);
    };

    const handleSavingBtn = () => {
        setLoading(true);
        setPage(new Page(content, page.getIndex()));
    }

    console.log(content);

    return (
        <Container style={{ height: "100vh" }}>
            <Row style={{ ...(isLoading ? { marginTop: '20px' } : {}) }}>
                <Col style={{ display: 'flex', justifyContent: 'center' }}>
                    {
                        !isLoading ?
                            <Button
                                onClick={handleSavingBtn}
                                className="signup-btn"
                                variant="btn btn-lg"
                            >
                                שמור שינויים
                            </Button>
                            :
                            <Spinner style={{ alignSelf: 'center' }} animation="border" />
                    }
                </Col>
            </Row>
            <Row style={{ height: "100%", marginTop: "50px" }}>
                <Col style={{ height: "100%" }}>
                    <Editor
                        apiKey="6yn9o7h95pny6znn5j7a0fijprxkz19cd4mla2zidi5teecp"
                        initialValue={page.getContent()}
                        init={{
                            branding: false,
                            height: 1000,
                            menubar: true,
                            resize: false,
                            plugins:
                                "preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount",
                            toolbar:
                                "formatselect | bold italic underline strikethrough | forecolor backcolor blockquote | link image media | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat",
                            image_advtab: true,
                            directionality: "auto",
                            deprecation_warnings: false,
                        }}

                        onEditorChange={onChange}
                    />
                </Col>
            </Row>
        </Container >
    );
};

export default TinyMceEditor;
