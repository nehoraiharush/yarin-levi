import React, { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BsPencilSquare } from 'react-icons/bs'

import Sidebar from '../components/Sidebar'
import TrainerView from '../components/TrainerView'
import LoadingSpinner from '../components/Loading'
import { MANAGERNAME, USERID, USERNAME } from './Login'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { db } from '../firebase/firebaseConfig'
import { collection, getDocs, limit, query, where } from 'firebase/firestore'

import '../style/TrainerCard.css';
import BackButton from '../components/BackButton'

const TrainerDashboard = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const trainersDB = collection(db, 'trainers');

    const [isOpen, setOpen] = useState('')
    const [trainer, setTrainer] = useState(null);
    const disable = localStorage.getItem(USERNAME) === MANAGERNAME ? false : true;

    // useEffect(() => {
    //     if (id !== localStorage.getItem(USERID) && localStorage.getItem(ISMANAGER) !== 'true') {
    //         toast.warn('גישה נדחתה')
    //         navigate(-1)
    //     }
    // }, [])

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
        getData();
    }, [])

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
                                <BsPencilSquare color='black' size={44} />
                            </div>}

                    </>
            }
            {!disable && <BackButton />}
        </div>
    )
}

export default TrainerDashboard