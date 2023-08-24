import React, { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import TrainerView from '../components/TrainerView'
import LoadingSpinner from '../components/Loading'
import { MANAGERNAME, USERID } from './Login'
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

    // useEffect(() => {
    //     if (id !== localStorage.getItem(USERID) && localStorage.getItem(ISMANAGER) !== 'true') {
    //         toast.warn('גישה נדחתה')
    //         navigate(-1)
    //     }
    // }, [])

    return (

        <div className='dashboard-container' >
            {
                trainer === null || trainer === undefined || !trainer?.id || !id ?
                    <div onClick={() => setOpen('')} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} >
                        <LoadingSpinner />
                    </div>
                    :
                    <>
                        <TrainerView setTrainer={setTrainer} trainer={trainer} toggleSidebar={setOpen} id={id} />
                        <Sidebar trainer={trainer} isOpen={isOpen} setOpen={setOpen} />
                    </>
            }
            <BackButton />
        </div>
    )
}

export default TrainerDashboard