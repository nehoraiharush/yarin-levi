import React, { useState } from 'react'
import TrainerCard from '../components/TrainerCard';
import { Container, Row, Col, Form } from 'react-bootstrap';

import { SETLOADING, SETTRAINERS, useTrainerContext } from '../components/TrainerContexts';
import { useEffect } from 'react';
import { ISMANAGER } from './Login';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/Loading';
import FloatingAddButton from '../components/FloatingAddButton';
import CustomeModal from '../components/CustomeModal';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const trainersCardsStyle = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    padding: '20px',
};
const trainersDB = collection(db, 'trainers');

export const getTrainersFromFirebase = async () => {
    try {
        const trainers = await getDocs(trainersDB);
        const trainersFiltered = trainers.docs.map((doc) => (
            {
                ...doc.data()
            }
        ));
        if (trainers?.docs) {
            return [...trainersFiltered];
        }

    } catch (error) {
        throw new Error(error.message);
    }
}

const today = new Date();
const first = today.getDate() - today.getDay();
const last = first + 6;

const firstday = new Date(new Date().setDate(first));
const lastday = new Date(new Date().setDate(last));

export default function TrainersCards() {

    const [searchQuery, setSearchQuery] = useState('');
    const [modalShown, invokeModal] = useState(false);
    const [showAllMeetings, setShowAllMeetings] = useState(false);
    const navigate = useNavigate();

    const { state, dispatch, isOpen, setOpen } = useTrainerContext();
    const { trainersList, meetingsDict } = state;

    const filteredActiveTrainers = trainersList?.filter((trainer) => trainer.status === 'active' && !trainer.isManager).filter((trainer) =>
        trainer.name.includes(searchQuery)
    );

    const filteredPauseTrainers = trainersList?.filter((trainer) => trainer.status === 'pause').filter((trainer) =>
        trainer.name.includes(searchQuery)
    );

    const filteredOfflineTrainers = trainersList?.filter((trainer) => trainer.status === 'offline').filter((trainer) =>
        trainer.name.includes(searchQuery)
    );

    const getWeeklyMeetings = () => {
        const buildModalBody = () => {
            return Object.entries(meetingsDict).map(([date, names], index) => {
                const date2 = date.split('-');
                const newDate = new Date(parseInt(date2[0]), parseInt(date2[1]) - 1, parseInt(date2[2]));
                // console.log(newDate, today);
                if (newDate.getDate() <= lastday.getDate() && newDate.getDate() >= firstday.getDate()) {
                    return (
                        <div key={index}>
                            <h4><u>{newDate.getDate() === today.getDate() ? 'היום' : date}:</u></h4>
                            {names.map((name, innerIndex) => (
                                <h4 key={innerIndex}>{`${innerIndex + 1}. ${name}`}</h4>
                            ))}
                        </div>);
                } else return null;
            })
        }
        if (meetingsDict) {
            const modalBody = buildModalBody()
            return (<>{modalBody}</>);
        } else return null;
    }

    const getAllMeetings = () => {
        const buildModalBody = () => {
            return Object.entries(meetingsDict).map(([date, names], index) => {
                return (
                    <div dir='rtl' key={index}>
                        <h4><u>{date}:</u></h4>
                        {names.map((name, innerIndex) => (
                            <h4 key={innerIndex}>{`${innerIndex + 1}. ${name}`}</h4>
                        ))}
                    </div>
                );
            })
        }

        if (meetingsDict) {
            const modalBody = buildModalBody()
            return (<>{modalBody}</>);
        } else return null;
    }

    const TitleAndBody = {
        title: showAllMeetings ? 'כל הפגישות:' : 'פגישות קרובות: ',
        bodyTitle: showAllMeetings ? '' : <h4> פגישות בשבוע הקרוב:</h4>,
        body: showAllMeetings ? getAllMeetings() : getWeeklyMeetings()
    }

    const getTrainersFromDB = async () => {
        try {
            const trainers = await getTrainersFromFirebase();
            dispatch({
                type: SETTRAINERS,
                payload: {
                    trainersList: [...trainers]
                }
            })
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
        if (localStorage.getItem(ISMANAGER) !== 'true') {
            navigate(-1)
            toast.warn('גישה נדחתה')
        }

        if (isOpen === 'open') setOpen('');
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


    const Cards = () => {
        return (
            <>
                {filteredActiveTrainers.length > 0 &&
                    <Row>
                        <Col>
                            <div style={{ ...trainersCardsStyle }}>
                                {/* Display filtered active trainers */}
                                {filteredActiveTrainers.map((trainer, index) => (
                                    <TrainerCard key={index} trainer={trainer} />
                                ))}
                            </div>
                        </Col>
                    </Row>
                }
                {filteredPauseTrainers.length > 0 &&
                    <Row>
                        <Col>
                            <div style={{ ...trainersCardsStyle }}>
                                {filteredPauseTrainers.map((trainer, index) => (
                                    <TrainerCard key={index} trainer={trainer} />
                                ))}
                            </div>
                        </Col>
                    </Row>}
                {filteredOfflineTrainers.length > 0 &&
                    <Row>
                        <Col>
                            <div style={{ ...trainersCardsStyle }}>
                                {filteredOfflineTrainers.map((trainer, index) => (
                                    <TrainerCard key={index} trainer={trainer} />
                                ))}
                            </div>
                        </Col>
                    </Row>
                }
            </>
        );
    }

    return (
        <>
            <div onClick={() => setOpen('')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <header style={{ width: '80%', position: 'sticky', top: '0', zIndex: '3' }}>
                    <Row style={{ padding: '10px' }} >
                        <Col lg={12} style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', gap: '30px' }} >
                            <h2>{trainersList?.length > 0 ? trainersList?.length - 1 : 0}</h2>
                            <Form.Control
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="...חפש מתאמנים"
                                dir='auto'
                                style={{ width: '40%', textAlign: 'right', height: '40px' }}
                            />
                            <h3 onClick={() => invokeModal(true)} className='nearestMeetings'>פגישות קרובות</h3>
                        </Col>
                    </Row>
                </header>

                <Container fluid>

                    {
                        !state?.isLoading ?
                            trainersList?.length > 1
                                &&
                                (filteredActiveTrainers.length > 0
                                    || filteredPauseTrainers.length > 0
                                    || filteredOfflineTrainers.length > 0) ?
                                <>
                                    <CustomeModal
                                        isShown={modalShown}
                                        invokeModal={invokeModal}
                                        setShowAllMeetings={setShowAllMeetings}
                                        showAllMeetings={showAllMeetings}
                                        {...TitleAndBody}
                                    />
                                    {Cards()}
                                </>
                                :

                                !(trainersList?.length > 1) ?
                                    <Row>
                                        <Col>
                                            <h1 style={{ marginTop: '50px', textAlign: 'center' }}>....אין עדיין מתאמנים</h1>
                                        </Col>
                                    </Row>
                                    :
                                    <Row>
                                        <Col>
                                            <h1 style={{ marginTop: '50px', textAlign: 'center' }}>...מתאמן לא קיים</h1>
                                        </Col>
                                    </Row>
                            :
                            <div style={{ display: 'grid', height: '100vh', placeItems: 'center' }}>
                                <LoadingSpinner />
                            </div>
                    }
                    <FloatingAddButton path={'../signup'} text={'+'} />

                </Container>
            </div>
            <Sidebar isOpen={isOpen} setOpen={setOpen} />
        </>
    );
}
