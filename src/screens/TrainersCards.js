import React, { useState } from 'react'
import TrainerCard from '../components/TrainerCard';
import { Container, Row, Col, Form } from 'react-bootstrap';

import { SETLOADING, useTrainerContext } from '../components/TrainerContexts';
// import { useUserContext } from '../components/UserContext';
import { useEffect } from 'react';
import { ISMANAGER, USERID, USERNAME } from './Login';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/Loading';

const trainersCardsStyle = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    padding: '20px'
}

export default function TrainersCards() {

    const [searchQuery, setSearchQuery] = useState('');
    const [trainersList, setTrainers] = useState([]);

    const trainersDB = collection(db, 'trainers');

    const { state, dispatch } = useTrainerContext();

    const getTrainersFromDB = async () => {
        try {
            const trainers = await getDocs(trainersDB);
            const trainersFiltered = trainers.docs.map((doc) => (
                {
                    ...doc.data(),
                    docId: doc.id
                }
            ));
            if (trainers?.docs) setTrainers(trainersFiltered);

        } catch (error) {
            toast.error(error.message);
        } finally {
            dispatch({
                type: SETLOADING,
                payload: {
                    isLoading: false
                }
            })
        }

    }

    useEffect(() => {
        dispatch({
            type: SETLOADING,
            payload: {
                isLoading: true
            }
        })
        getTrainersFromDB()
    }, [])

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };


    const filteredActiveTrainers = trainersList.filter((trainer) => trainer.status === 'active').filter((trainer) =>
        trainer.name.includes(searchQuery)
    );

    const filteredPauseTrainers = trainersList.filter((trainer) => trainer.status === 'pause').filter((trainer) =>
        trainer.name.includes(searchQuery)
    );

    const filteredOfflineTrainers = trainersList.filter((trainer) => trainer.status === 'offline').filter((trainer) =>
        trainer.name.includes(searchQuery)
    );

    const Cards = () => {
        return (
            <>
                <Row>
                    <Col>
                        <div style={{ ...trainersCardsStyle, alignItems: 'center' }}>
                            {/* Display filtered active trainers */}
                            {filteredActiveTrainers.map((trainer, index) => (
                                <TrainerCard key={index} id={trainer.id} trainer={trainer} />
                            ))}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div style={{ ...trainersCardsStyle, alignItems: 'flex-start' }}>
                            {filteredPauseTrainers.map((trainer, index) => (
                                <TrainerCard key={index} id={trainer.id} trainer={trainer} />
                            ))}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div style={{ ...trainersCardsStyle, alignItems: 'flex-start' }}>
                            {filteredOfflineTrainers.map((trainer, index) => (
                                <TrainerCard key={index} id={trainer.id} trainer={trainer} />
                            ))}
                        </div>
                    </Col>
                </Row>
            </>
        );
    }

    return (
        <Container dir='ltr'>
            <header style={{ position: 'sticky', top: '0', zIndex: '3' }}>
                <Row style={{ display: 'flex', justifyContent: 'center', padding: '10px' }} >
                    <Col lg={4}>
                        <Form.Control
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="...חפש מתאמנים"
                            dir='auto'
                            style={{ textAlign: 'right' }}
                        />
                    </Col>
                </Row>
            </header>
            {
                !state?.isLoading ?
                    trainersList.length > 0 ?
                        Cards()
                        :
                        <Row>
                            <Col>
                                <h1 style={{ marginTop: '50px', textAlign: 'center' }}>....אין עדיין מתאמנים</h1>
                            </Col>
                        </Row>
                    :
                    <div style={{ display: 'grid', height: '100vh', placeItems: 'center' }}>
                        <LoadingSpinner />
                    </div>
            }

        </Container>
    );
}
