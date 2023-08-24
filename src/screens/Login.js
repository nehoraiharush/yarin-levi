import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import YarinLevi from "../components/YarinLevi";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Loading from '../components/Loading.js';
import { toast } from "react-toastify";

//FIREBASE
import { auth, db } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Login.css';
import { SETLOADING, useTrainerContext } from "../components/TrainerContexts";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

export const USERID = 'userId';
export const USERNAME = 'username';
export const MANAGERNAME = 'ירין לוי'
export const MANAGERPASS = 'yarin0584560107'

const Login = () => {

    const navigate = useNavigate();

    const userNameRef = useRef();
    const passwordRef = useRef();
    const trainersDB = collection(db, 'trainers');

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
                const name = userNameRef.current.value
                const q = query(trainersDB, where('name', '==', name), limit(1))
                const data = await getDocs(q);

                if (!data.empty) {
                    localStorage.removeItem(USERID);
                    localStorage.removeItem(USERNAME);
                    localStorage.setItem(USERID, data.docs[0].id);
                    localStorage.setItem(USERNAME, name)
                    if (name === MANAGERNAME) navigate(`../all-trainers`);
                    else navigate(`../trainer-dashboard/${data.docs[0].id}`);
                    toast.success('שלום ' + name);
                } else {
                    toast.error('משתמש לא נמצא');
                }
            } catch (error) {
                toast.error(error.message);
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