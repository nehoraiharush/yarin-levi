import React, { useState, useEffect, useRef } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { ISMANAGER, USERID } from './Login';
import { collection, doc, getDocs, limit, query, updateDoc, where } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig';
import { toast } from 'react-toastify';
import { SETLOADING, SETTRAINERS, useTrainerContext } from '../components/TrainerContexts';
import LoadingSpinner from '../components/Loading';
import MonthTrackTable from '../components/MonthTrackTable';
import Sidebar from '../components/Sidebar';
import BackButton from '../components/BackButton';

import '../style/TrainerCard.css';

const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

export const trackInit = {
    months: [
        'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ],
    [new Date().getFullYear()]: {
        dates: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        monthlyValues: {
            january: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            february: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            march: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            april: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            may: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            june: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            july: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            august: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            september: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            october: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            november: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            december: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        }
    },
    '2024': {
        dates: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        monthlyValues: {
            january: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            february: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            march: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            april: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            may: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            june: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            july: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            august: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            september: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            october: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            november: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            december: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
        }
    }
}

const TrainerTrack = () => {

    const [trainer, setTrainer] = useState(null);
    const [hasChanges, setChange] = useState(false);
    const [yearTrack, setYear] = useState(new Date().getFullYear());
    const disable = localStorage.getItem(ISMANAGER) === 'true' ? false : true;

    const navigate = useNavigate();

    const { id } = useParams();
    const { isOpen, setOpen, state, dispatch } = useTrainerContext();
    const { trainersList } = state;

    const trainersDB = collection(db, 'trainers');

    const handleSelectionChange = (e) => {
        setYear(e.target.value);
    }

    const dispatchChanges = async (data) => {
        try {
            const trainerDoc = doc(db, 'trainers', id);

            if (data !== undefined) {
                await updateDoc(trainerDoc, data);
            }
            else await updateDoc(trainerDoc, trainer);
        } catch (error) {
            throw new Error();
        }
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
                dispatch({
                    type: SETTRAINERS,
                    payload: {
                        trainersList: [...trainersList.filter(trainerA => trainerA.name !== trainer.name), trainer]
                    }
                })
                setChange(false);
                toast.success('השינויים נשמרו בהצלחה')
            } catch (error) {
                console.log(error.message);
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

    const getData = async () => {
        if (id) {
            try {
                const q = query(trainersDB, where('id', '==', id), limit(1))
                const data = await getDocs(q);
                if (!data.empty) {
                    const trainerData = data.docs[0].data()
                    if (trainerData.isManager) {
                        setTrainer({ ...trainerData });
                    } else {
                        const { password, ...restOfData } = trainerData;
                        setTrainer({ ...restOfData });
                    }
                }
                else toast.error("מתאמן לא נמצא");
            } catch (error) {
                toast.error(error.message);
            }

        } else toast.error("מתאמן לא נמצא");
    }

    const changeTrainerData = async (type, data) => {
        setChange(true);
        if (type === 'init') {
            setTrainer(data);
            dispatchChanges(data);
        } else if (type === 'changeValue') {
            setTrainer({
                ...trainer,
                trackInfo: {
                    ...trainer.trackInfo,
                    [yearTrack]: {
                        ...trainer.trackInfo[yearTrack],
                        monthlyValues: {
                            ...trainer.trackInfo[yearTrack].monthlyValues,
                            [data.month]: data.values
                        }
                    }
                }
            });
        } else if (type === 'changeDate') {
            setTrainer({
                ...trainer,
                trackInfo: {
                    ...trainer.trackInfo,
                    [yearTrack]: {
                        ...trainer.trackInfo[yearTrack],
                        dates: data.values
                    }
                }
            });
        }
    }

    useEffect(() => {
        if (id !== localStorage.getItem(USERID) && localStorage.getItem(ISMANAGER) !== 'true') {
            navigate(-1)
            toast.warn('גישה נדחתה')
        }
        if (isOpen === 'open') setOpen('');
        if (id)
            getData();
    }, [id]);

    return (
        <>
            <div onClick={() => setOpen('')}
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'grid',
                    placeItems: 'center',
                }}>
                {
                    trainer ?
                        (
                            trainer.trackInfo !== undefined ?

                                <>
                                    {hasChanges &&
                                        <Row style={{ display: 'grid', placeItems: 'center', paddingTop: '5px', width: '50%' }} >
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
                                    }


                                    <Row style={{
                                        width: '100%',
                                        marginTop: '10px',
                                        padding: '0px 15px 0px 15px',
                                        overflow: 'scroll'
                                    }} >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                width: '100%',
                                                gap: '20px',
                                            }}
                                        >
                                            {
                                                trainer.trackInfo[yearTrack] ?
                                                    <div
                                                        dir='rtl'
                                                        style={{
                                                            flexWrap: 'wrap',
                                                            width: '85%',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            overflow: 'auto'
                                                        }}>

                                                        <div style={{ display: 'flex' }}>
                                                            {
                                                                new Array(15).fill(0).map((value, index) =>
                                                                    <h3 key={index} style={{ textAlign: 'center', width: '110px' }}>{index + 1}</h3>
                                                                )
                                                            }
                                                        </div>
                                                        <MonthTrackTable
                                                            month={''}
                                                            setTrainer={changeTrainerData}
                                                            disable={disable}
                                                            values={trainer.trackInfo[yearTrack].dates}
                                                        />

                                                        {
                                                            months.map((month, index) => (
                                                                <MonthTrackTable
                                                                    key={index}
                                                                    month={month}
                                                                    setTrainer={changeTrainerData}
                                                                    disable={disable}
                                                                    values={trainer.trackInfo[yearTrack].monthlyValues[month]}
                                                                />
                                                            ))
                                                        }

                                                    </div>
                                                    :
                                                    <h1 style={{ width: '85%', display: 'grid', placeItems: 'center' }}>אין מעקב עבור שנה זאת</h1>

                                            }
                                            <div
                                                style={{
                                                    width: '15%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    gap: '13px',
                                                    marginTop: '45px'
                                                }}
                                            >
                                                <>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <h5 style={{ height: '30px' }}>:תאריך</h5>
                                                        <select onChange={handleSelectionChange}>
                                                            {
                                                                Object.keys(trainer.trackInfo).map((title, index) => {
                                                                    if (title !== 'months') {
                                                                        return <option key={index} value={title}>{title}</option>
                                                                    } else return null;
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                    {
                                                        trainer.trackInfo.months
                                                            .map((month, index) => <h5 style={{ height: '30px' }} key={index} >{month}</h5>)
                                                    }
                                                </>
                                            </div>
                                        </div>

                                    </Row>
                                </>
                                :
                                localStorage.getItem(ISMANAGER) ?
                                    <Button
                                        onClick={
                                            () => {
                                                changeTrainerData('init', {
                                                    ...trainer,
                                                    trackInfo: {
                                                        ...trackInit
                                                    }
                                                })
                                            }}
                                        className="signup-btn"
                                        variant="btn-md"
                                        style={{ width: '35%', margin: '0', height: '50px', padding: '0', alignSelf: 'center' }}
                                    >
                                        הוסף מעקב
                                    </Button>
                                    :
                                    <h1 dir='rtl'>אין עדיין מעקב פנה לירין.</h1>
                        )
                        :
                        <div style={{
                            height: '100vh',
                            width: '100%',
                            display: 'grid',
                            placeItems: 'center',
                        }}>
                            <LoadingSpinner />
                        </div>
                }
            </div >
            <Sidebar isOpen={isOpen} setOpen={setOpen} trainer={trainer} />
            {localStorage.getItem(ISMANAGER) && <BackButton />}
        </>
    )
}

export default TrainerTrack