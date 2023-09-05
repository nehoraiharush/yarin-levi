import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import YarinLevi from "../components/YarinLevi";
import Loading from '../components/Loading.js';

//FIREBASE
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/Login.css';
import { toast } from "react-toastify";
import { SETLOADING, useTrainerContext } from "../components/TrainerContexts";
import { MANAGERNAME, MANAGERPASS } from "./Login";

const initValues = [
    {
        firstValue: '',
        secondValue: '',
    },
    {
        firstValue: '',
        secondValue: '',
    },
    {
        firstValue: '',
        secondValue: '',
    },
    {
        firstValue: '',
        secondValue: '',
    },
    {
        firstValue: '',
        secondValue: '',
    },
    {
        firstValue: '',
        secondValue: '',
    }
]

const date = new Date();
const yesterday = new Date(date.setDate(date.getDate() - 1));

export const getDate = date => {
    const currentDay = String(date.getDate()).padStart(2, '0');
    const currentMonth = String(date.getMonth() + 1).padStart(2, "0");
    const currentYear = date.getFullYear();
    return `${currentYear}-${currentMonth}-${currentDay}`;
}

const Signup = () => {

    const navigate = useNavigate();

    const userNameRef = useRef();
    const passwordRef = useRef();

    const { state, dispatch } = useTrainerContext();

    const trainersDB = collection(db, 'trainers');

    const createTrainerData = async (trainer) => {
        addDoc(trainersDB, trainer)
            .then(async document => {
                console.log(document.id);
                await updateDoc(doc(db, 'trainers', document.id), {
                    id: document.id,
                    ...trainer

                })
                toast.success(`${trainer.name} נרשם בהצלחה`);
                navigate(`../trainer-dashboard/${document.id}`);
            })
            .catch(err => {
                toast.error(err.message)
            })


    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userNameRef.current.value.includes('%')) {
            toast.warn("שם משתמש לא יכול להכיל '%'")
        } else {
            if (userNameRef.current.value.match(/[a-zA-Zא-ת]/g) && passwordRef.current.value.match(/[a-zA-Zא-ת]/g)) {
                dispatch({
                    type: SETLOADING,
                    payload: {
                        isLoading: true
                    }
                });
                try {
                    const name = userNameRef.current.value;
                    const data = await getDocs(trainersDB);
                    if (!data.empty) {
                        let flag = false;
                        if (data.docs.length > 1) {
                            for (const doc of data.docs) {
                                console.log(doc.data().name.replace(' ', ''));
                                if (doc.data().name.replace(' ', '') === name.replace(' ', '')) {
                                    toast.error('משתמש קיים')
                                    flag = true;
                                    break;
                                }
                            }
                        }
                        if (!flag) {
                            const docData = {
                                name,
                                password: passwordRef.current.value,
                                status: 'active',
                                age: 0,
                                isManager: false,
                                nextMeeting: getDate(yesterday),
                                trainingInfo: {
                                    hasValues: false,
                                    dates: [getDate(date), getDate(date)],
                                    values: initValues,
                                    process: '',
                                    weight: '',
                                    trend: '',
                                    trainingPlan: `${name} תכנית אימון`,
                                    nutrition: `${name} תוכנית תזונה`
                                }
                            }
                            await createTrainerData(docData);
                        }
                    } else {
                        toast.warn('מתאמנים לא נמצאו')
                    }
                } catch (error) {
                    toast.error(error.message);
                } finally {
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
    }

    return (
        <div className="signup-page" style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
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
                        <Row style={{ display: 'flex', justifyContent: 'center' }}>

                            <Col lg={4} style={{ display: 'grid', rowGap: '10%' }}>
                                <Col>
                                    <Form.Group className="form-group">
                                        <Form.Control
                                            type="text"
                                            ref={userNameRef}
                                            name="userName"
                                            className="transparent-input"
                                            placeholder=" שם מלא"
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
                                            placeholder="בחר סיסמא"
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
                                                <Button className="signup-btn" variant="btn btn-lg" type="submit">הירשם</Button>

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

export default Signup;