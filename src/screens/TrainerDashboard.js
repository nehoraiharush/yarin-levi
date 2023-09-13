import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BsPencilSquare } from 'react-icons/bs'

import Sidebar from '../components/Sidebar'
import TrainerView from '../components/TrainerView'
import LoadingSpinner from '../components/Loading'
import { ISMANAGER, MANAGERNAME, USERID, USERNAME } from './Login'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { db } from '../firebase/firebaseConfig'
import { collection, getDocs, limit, query, where } from 'firebase/firestore'

import '../style/TrainerCard.css';
import BackButton from '../components/BackButton'
import { useTrainerContext } from '../components/TrainerContexts'
import CustomeModal from '../components/CustomeModal'

const TrainerDashboard = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const trainersDB = collection(db, 'trainers');
    const [trainer, setTrainer] = useState(null);
    const disable = localStorage.getItem(USERNAME) === MANAGERNAME ? false : true;

    const [modalShown, invokeModal] = useState(false);

    const { isOpen, setOpen } = useTrainerContext();

    useEffect(() => {
        console.log(localStorage.getItem(USERID));

    }, [id])

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

        <div className='dashboard-container' >
            {
                trainer === null || trainer === undefined || !trainer?.id || !id ?
                    <div onClick={() => setOpen('')} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} >
                        <LoadingSpinner />
                    </div>
                    :
                    <>
                        <TrainerView disable={disable} setTrainer={setTrainer} trainer={trainer} toggleSidebar={setOpen} id={id} />
                        <Sidebar trainer={trainer} isOpen={isOpen} setOpen={setOpen} />
                        {disable &&
                            <div className='comment-btn'>
                                <BsPencilSquare onClick={() => invokeModal(true)} color='black' size={44} />
                            </div>
                            &&
                            <CustomeModal
                                isShown={modalShown}
                                invokeModal={invokeModal}
                                title={'פגישות קרובות: '}
                                bodyTitle={<h4>פגישות ב - 7 ימים הבאים: </h4>}
                                body={<h1>כלום</h1>}
                            />
                        }

                    </>
            }
            {!disable && <BackButton />}
        </div>
    )
}

export default TrainerDashboard