import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import YarinLevi from "../components/YarinLevi";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Loading from '../components/Loading.js';
import { toast } from "react-toastify";
// import { SETUSER, useUserContext } from "../components/UserContext";

//FIREBASE
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Login.css';
import { SETLOADING, useTrainerContext } from "../components/TrainerContexts";

export const USERID = 'userId';
export const USERNAME = 'username';
export const ISMANAGER = 'isManager';

const Login = () => {

    // const navigate = useNavigate();

    const userNameRef = useRef();
    const passwordRef = useRef();

    // const { user, dispatchUser } = useUserContext();

    const { state, dispatch } = useTrainerContext();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (userNameRef.current.value.match(/[a-zA-Zא-ת]/g) && passwordRef.current.value.match(/[a-zA-Zא-ת]/g)) {
            dispatch({
                type: SETLOADING,
                payload: {
                    isLoading: true
                }
            });
            try {
                const userResponse = await signInWithEmailAndPassword(auth, `${userNameRef.current.value.replace(' ', '%')}@gmail.com`, passwordRef.current.value);
                // dispatchUser({
                //     type: SETUSER,
                //     payload: {
                //         user: {
                //             id: userResponse.user.uid,
                //             name: userResponse.user.email.split('@')[0].replace('%', ' ')
                //         }
                //     }
                // });
                localStorage.setItem(USERID, userResponse.user.uid);
                localStorage.setItem(USERNAME, userResponse.user.email.split('@')[0].replace('%', ' '))
                // localStorage.setItem(ISMANAGER, false);
                toast.success('שלום ' + userResponse.user.email.split('@')[0].replace('%', ' '));
            } catch (error) {
                toast.error('משתמש לא נמצא');
            }
            finally {
                dispatch({
                    type: SETLOADING,
                    payload: {
                        isLoading: false
                    }
                });
            }
        }
        else {
            toast.warn("שם וסיסמא חייבים להכיל אותיות א-ב או A-Z")
        }
    }

    return (
        <div className="login-page" style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
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
                        <Row style={{ display: 'flex', justifyContent: 'center' }}>

                            <Col lg={4} style={{ display: 'grid', rowGap: '10%' }}>
                                <Col>
                                    <Form.Group className="form-group">
                                        <Form.Control
                                            type="text"
                                            ref={userNameRef}
                                            name="userName"
                                            className="transparent-input"
                                            placeholder="הכנס שם"
                                            style={{ color: 'white' }}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="form-group">
                                        <Form.Control
                                            type="password"
                                            ref={passwordRef}
                                            name="password"
                                            className="transparent-input"
                                            style={{ color: 'white' }}
                                            placeholder="הכנס סיסמא"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col >
                                    <Form.Group style={{ display: 'grid', placeItems: 'center' }}>
                                        {
                                            state?.isLoading ?
                                                <Loading />
                                                :
                                                <div>
                                                    <Button className="signup-btn" variant="btn btn-lg" type="submit">התחבר</Button>
                                                    <Button
                                                        className="signup-btn"
                                                        variant="btn btn-lg"
                                                        onClick={async () => {
                                                            localStorage.removeItem(USERID);
                                                            localStorage.removeItem(USERNAME)
                                                            localStorage.removeItem(ISMANAGER);
                                                            await signOut(auth)
                                                            toast.success('התנתקת בהצלחה')
                                                        }} >התנתק</Button>
                                                </div>
                                        }
                                    </Form.Group>
                                </Col>
                            </Col>

                        </Row>
                    </Form>

                </Container>
            </div>
        </div>
    );
}

export default Login;