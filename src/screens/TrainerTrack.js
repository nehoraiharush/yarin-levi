import React, { useState, useEffect } from 'react'
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

export const trackInit = {
    months: [
        'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ],
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

const TrainerTrack = () => {

    const [trainer, setTrainer] = useState(null);
    const [hasChanges, setChange] = useState(false);
    const disable = localStorage.getItem(ISMANAGER) === 'true' ? false : true;

    const navigate = useNavigate();

    const { id } = useParams();
    const { isOpen, setOpen, state, dispatch } = useTrainerContext();
    const { trainersList } = state;

    const trainersDB = collection(db, 'trainers');

    const dispatchChanges = async () => {
        try {
            const trainerDoc = doc(db, 'trainers', id);
            await updateDoc(trainerDoc, trainer)
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

    const changeTrainerData = (type, data) => {
        setChange(true);
        if (type === 'init') {
            setTrainer(data);
        } else if (type === 'changeValue') {
            setTrainer({
                ...trainer,
                trackInfo: {
                    ...trainer.trackInfo,
                    monthlyValues: {
                        ...trainer.trackInfo.monthlyValues,
                        [data.month]: data.values
                    }
                }
            });
        } else {
            setTrainer({
                ...trainer,
                trackInfo: {
                    ...trainer.trackInfo,
                    dates: data.values
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
    }, [id])

    return (
        <>
            <div onClick={() => setOpen('')}
                style={{
                    height: '100vh',
                    width: '100%',
                    display: 'grid',
                    placeItems: 'center',
                    overflow: 'hidden',
                    overflowY: 'scroll'
                }}>
                {
                    trainer ?
                        (
                            trainer.trackInfo !== undefined ?

                                <>
                                    {hasChanges &&
                                        <Row style={{ display: 'grid', placeItems: 'center', paddingTop: '20px', width: '50%' }} >
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

                                    <Row style={{ width: '100%', marginTop: '20px', paddingLeft: '15px', overflow: 'scroll' }} >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                width: '100%',
                                                gap: '20px',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    flexWrap: 'wrap',
                                                    position: 'relative',
                                                    width: '85%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    overflow: 'auto'
                                                }}>

                                                <div dir='rtl' style={{ display: 'flex' }}>
                                                    {
                                                        trackInit.dates.map((value, index) =>
                                                            <h3 key={index} style={{ textAlign: 'center', width: '110px' }}>{index + 1}</h3>
                                                        )
                                                    }
                                                </div>

                                                <MonthTrackTable
                                                    month={''}
                                                    setTrainer={changeTrainerData}
                                                    disable={disable}
                                                    values={trackInit.dates}
                                                />

                                                <MonthTrackTable
                                                    month={'january'}
                                                    setTrainer={changeTrainerData}
                                                    disable={disable}
                                                    values={trackInit.monthlyValues.january}
                                                />

                                                <MonthTrackTable
                                                    month={'february'}
                                                    setTrainer={changeTrainerData}
                                                    disable={disable}
                                                    values={trackInit.monthlyValues.february}
                                                />

                                                <MonthTrackTable
                                                    month={'march'}
                                                    setTrainer={changeTrainerData}
                                                    disable={disable}
                                                    values={trackInit.monthlyValues.march}
                                                />

                                                <MonthTrackTable
                                                    month={'april'}
                                                    setTrainer={changeTrainerData}
                                                    disable={disable}
                                                    values={trackInit.monthlyValues.april}
                                                />

                                                <MonthTrackTable
                                                    month={'may'}
                                                    setTrainer={changeTrainerData}
                                                    disable={disable}
                                                    values={trackInit.monthlyValues.may}
                                                />

                                                <MonthTrackTable
                                                    month={'june'}
                                                    setTrainer={changeTrainerData}
                                                    disable={disable}
                                                    values={trackInit.monthlyValues.june}
                                                />

                                                <MonthTrackTable
                                                    month={'july'}
                                                    setTrainer={changeTrainerData}
                                                    disable={disable}
                                                    values={trackInit.monthlyValues.july}
                                                />

                                                <MonthTrackTable
                                                    month={'august'}
                                                    setTrainer={changeTrainerData}
                                                    disable={disable}
                                                    values={trackInit.monthlyValues.august}
                                                />

                                                <MonthTrackTable
                                                    month={'september'}
                                                    setTrainer={changeTrainerData}
                                                    disable={disable}
                                                    values={trackInit.monthlyValues.september}
                                                />

                                                <MonthTrackTable
                                                    month={'october'}
                                                    setTrainer={changeTrainerData}
                                                    disable={disable}
                                                    values={trackInit.monthlyValues.october}
                                                />

                                                <MonthTrackTable
                                                    month={'november'}
                                                    setTrainer={changeTrainerData}
                                                    disable={disable}
                                                    values={trackInit.monthlyValues.november}
                                                />

                                                <MonthTrackTable
                                                    month={'december'}
                                                    setTrainer={changeTrainerData}
                                                    disable={disable}
                                                    values={trackInit.monthlyValues.december}
                                                />


                                            </div>
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
                                                    <h5 style={{ height: '30px' }}>:תאריך</h5>
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
                        <LoadingSpinner />
                }
            </div >
            <Sidebar isOpen={isOpen} setOpen={setOpen} trainer={trainer} />
            {localStorage.getItem(ISMANAGER) && <BackButton />}
        </>
    )
}

export default TrainerTrack