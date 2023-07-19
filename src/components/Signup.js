import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Login.css';
import YarinLevi from "./YarinLevi";

const Signup = () => {

    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        console.log("fff")
        navigate('/home')
    }


    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="signup-container">
                <Container style={{ marginBottom: '3%' }}>
                    <Row>
                        <Col lg={4}></Col>
                        <Col lg={4} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <YarinLevi color='white' />
                            <h2 style={{ textAlign: 'center' }} >רישום</h2>
                        </Col>
                        <Col lg={4}></Col>
                    </Row>
                </Container>


                <Container fluid>
                    <Form onSubmit={handleSubmit}>
                        <Row>

                            <Col lg={4}></Col>

                            <Col lg={4} style={{ display: 'grid', rowGap: '10%' }}>
                                <Col>
                                    <Form.Group className="form-group">
                                        <Form.Control
                                            type="text"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            name="userName"
                                            className="transparent-input"
                                            placeholder=" שם מלא"
                                            style={{ color: 'white' }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="form-group">
                                        <Form.Control
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            name="password"
                                            className="transparent-input"
                                            style={{ color: 'white' }}
                                            placeholder="בחר סיסמא"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col >
                                    <Form.Group>

                                        {userName !== '' && password !== '' ?
                                            <Button className="signup-btn" variant="btn btn-lg" type="submit">התחבר</Button>
                                            :
                                            <Button disabled className="signup-btn" variant="btn btn-lg ">התחבר</Button>
                                        }
                                    </Form.Group>
                                </Col>
                            </Col>

                            <Col lg={4}></Col>

                        </Row>
                    </Form>

                </Container>
            </div>
        </div>
    );
}

export default Signup;