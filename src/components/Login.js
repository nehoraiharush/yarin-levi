import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import YarinLevi from "./YarinLevi";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Login.css';

const Login = () => {

    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        console.log("fff")
        navigate('/home')
    }


    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
            <div className="login-container">
                <Container style={{ marginBottom: '5%' }}>
                    <Row>
                        <Col lg={4}></Col>
                        <Col lg={4} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <YarinLevi color='white' />
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
                                            placeholder="הכנס שם"
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
                                            placeholder="הכנס סיסמא"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col >
                                    <Form.Group>

                                        {userName !== '' && password !== '' ?
                                            <Button className="login-btn" variant="btn btn-lg" type="submit">התחבר</Button>
                                            :
                                            <Button disabled className="login-btn" variant="btn btn-lg ">התחבר</Button>
                                        }
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <h3 style={{ fontSize: '1rem', textAlign: 'center' }}> לא הצטרפתם אלינו עדיין? לפרטים: 0584560107 </h3>
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

export default Login;