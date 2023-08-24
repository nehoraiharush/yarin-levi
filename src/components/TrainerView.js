import React, { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import Weight from './Weight';
import Procces from './Procces';
import { useTrainerContext, SETLOADING } from './TrainerContexts';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { BsTrash } from 'react-icons/bs'


import '../style/sidebar.css'

import LoadingSpinner from './Loading';
import ScopeTable from './ScopeTable';
import { toast } from 'react-toastify';
import { db } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { MANAGERNAME, USERNAME } from '../screens/Login';

const TrainerView = ({ disable, toggleSidebar, trainer, setTrainer }) => {

    const { state, dispatch } = useTrainerContext();
    const [hasChanged, setChange] = useState(false);
    const navigate = useNavigate();

    const dispatchChanges = async () => {
        try {
            const trainerDoc = doc(db, 'trainers', trainer.id);
            await updateDoc(trainerDoc, {
                ...trainer
            })
        } catch (error) {
            throw new Error();
        }
    }

    const changeTrainerData = (newData) => {
        setChange(true)
        setTrainer(newData);
    }

    const handleDispatchChanges = async () => {
        if (trainer) {
            try {
                dispatch({
                    type: SETLOADING,
                    payload: {
                        isLoading: true
                    }
                });
                await dispatchChanges();
                setChange(false);
                toast.success('השינויים נשמרו בהצלחה')
            } catch (error) {
                toast.error('בעיה בשמירת השינויים אנא - נסה שנית')
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
    }

    const handleDelete = async () => {
        if (window.confirm(`האם למחוק את ${trainer.name}?`)) {
            try {
                await deleteDoc(doc(db, 'trainers', trainer.id))
                toast.success(`${trainer.name} נמחק בהצלחה`)
                navigate('../all-trainers')
            } catch (error) {
                toast.error(error.message);
            }
        }
    }


    return (
        <Container
            onClick={() => toggleSidebar('')}
            style={{
                height: '90vh',
                width: '100%',
            }}
            dir='rtl'
        >
            {
                trainer ?
                    <>
                        {
                            hasChanged ?
                                <Row style={{ top: '0', position: 'sticky', display: 'grid', placeItems: 'center', paddingTop: '20px' }} >
                                    {
                                        !state?.isLoading ?
                                            <Button
                                                onClick={handleDispatchChanges}
                                                className="signup-btn"
                                                variant="btn btn-lg"
                                            >
                                                שמור שינויים
                                            </Button>
                                            :
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <LoadingSpinner />
                                            </div>
                                    }

                                </Row>
                                :
                                null
                        }
                        <Row style={{ marginTop: '40px', gap: '40px' }}>
                            <Col
                                lg={4}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', zIndex: '4' }}>
                                    <h2>{trainer.name}</h2>
                                    {!disable && <BsTrash
                                        onClick={handleDelete}
                                        style={{ marginRight: '5px', cursor: 'pointer' }}
                                        size={30} color='#EF233C'
                                    />}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span
                                        className='circle-status'
                                        style={{
                                            backgroundColor: trainer.status === 'active' ?
                                                'rgb(73, 239, 73)'
                                                :
                                                trainer.status === 'offline' ? 'red' : 'yellow',
                                            marginLeft: '5px',
                                            marginBottom: '5px',
                                        }}
                                    ></span>
                                    <h5 className='trainer-status'>{trainer.status === 'active' ? 'פעיל' : trainer.status === 'offline' ? 'לא פעיל' : 'מושהה'}</h5>
                                    <style>
                                        {`

                                            .form-range::-webkit-slider-runnable-track {
                                                z-index: 4;
                                                background-color: ${trainer.status === 'active' ? 'rgb(73, 239, 73)' : trainer.status === 'pause' ? 'yellow' : 'red'};
                                            }
                                        `}
                                    </style>

                                    {!disable && <div style={{ marginRight: '10px', marginBottom: '3px' }}>
                                        <input
                                            className={`form-range status-range ${trainer.status}`}
                                            onChange={(e) => {
                                                const status = parseInt(e.target.value) === 2 ? 'active' : parseInt(e.target.value) === 1 ? 'pause' : 'offline'
                                                if (trainer.status !== status) {
                                                    changeTrainerData({ ...trainer, status: status });
                                                }
                                            }}
                                            value={trainer.status === 'active' ? 2 : trainer.status === 'pause' ? 1 : 0}
                                            type='range'
                                            min={0}
                                            max={2}
                                        />
                                    </div>}
                                </div>
                                <div style={{ textAlign: 'right', color: 'white' }}>
                                    <h4>גיל:
                                        <input
                                            disabled={disable}
                                            onChange={(e) => changeTrainerData({
                                                ...trainer,
                                                age: parseInt(e.target.value)
                                            })}
                                            style={{
                                                width: '80px',
                                                background: 'none',
                                                border: 'none',
                                                color: 'white',
                                                textAlign: 'right',
                                                paddingRight: '5px'
                                            }}
                                            dir='auto'
                                            value={trainer.age ? trainer.age : 0}
                                        />
                                    </h4>
                                    <h4>מטרה: </h4>
                                    <h5>משהו שהבטחתי לעצמי</h5>
                                </div>
                            </Col>
                            <Col lg={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Weight disable={disable} trainer={trainer} setTrainer={changeTrainerData} />
                            </Col>
                            <Col style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Procces disable={disable} trainer={trainer} setTrainer={changeTrainerData} />
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '40px', padding: '10px' }}>
                            <Col lg={6} style={{ display: 'grid', placeItems: 'center' }} >

                                {
                                    trainer.trainingInfo.hasValues ?
                                        <>
                                            <ScopeTable disable={disable} trainer={trainer} setTrainer={changeTrainerData} />
                                            {!disable && <Button
                                                onClick={
                                                    () => {
                                                        changeTrainerData({
                                                            ...trainer,
                                                            trainingInfo: {
                                                                ...trainer.trainingInfo,
                                                                hasValues: false
                                                            }
                                                        })
                                                    }}
                                                className="signup-btn"
                                                variant="btn btn-lg"
                                                style={{ width: '60%' }}
                                            >
                                                הסר היקפים מהתוכנית
                                            </Button>}
                                        </>
                                        :
                                        !disable && <Button
                                            onClick={
                                                () => {
                                                    changeTrainerData({
                                                        ...trainer,
                                                        trainingInfo: {
                                                            ...trainer.trainingInfo,
                                                            hasValues: true
                                                        }
                                                    });
                                                }}
                                            className="signup-btn"
                                            variant="btn btn-lg"
                                            style={{ width: '60%' }}
                                        >
                                            הוסף היקפים לתוכנית
                                        </Button>
                                }
                            </Col>
                        </Row>
                    </>
                    :
                    <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
                        <LoadingSpinner />
                    </div>

            }

        </Container>
    );
};

export default TrainerView;
