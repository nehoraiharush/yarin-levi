import React, { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import TrainerView from '../components/TrainerView'
import LoadingSpinner from '../components/Loading'
import { ISMANAGER, USERID } from './Login'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { db } from '../firebase/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'

import '../style/TrainerCard.css';

const TrainerDashboard = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const { docId } = useLocation().state;

    const [isOpen, setOpen] = useState('')
    const [trainer, setTrainer] = useState(null)

    const getData = async () => {
        const data = await getDoc(doc(db, 'trainers', docId))
        setTrainer({ ...data.data(), docId });
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
                trainer === null || trainer === undefined || !trainer?.id ?
                    <div onClick={() => setOpen('')} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} >
                        <LoadingSpinner />
                    </div>
                    :
                    <>
                        <TrainerView setTrainer={setTrainer} trainer={trainer} toggleSidebar={setOpen} id={id} />
                        <Sidebar trainer={trainer} isOpen={isOpen} setOpen={setOpen} />
                    </>
            }
        </div>
    )
}

export default TrainerDashboard