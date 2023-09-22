import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BsPencilSquare } from 'react-icons/bs'

import Sidebar from '../components/Sidebar'
import TrainerView from '../components/TrainerView'
import LoadingSpinner from '../components/Loading'
import { ISMANAGER, USERID } from './Login'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { db } from '../firebase/firebaseConfig'
import { addDoc, collection, doc, getDocs, limit, query, updateDoc, where } from 'firebase/firestore'

import '../style/TrainerCard.css';
import BackButton from '../components/BackButton'
import { useTrainerContext } from '../components/TrainerContexts'
import CustomeModal from '../components/CustomeModal'
import { useRef } from 'react'
import TrainerComment from '../Comment'

const TrainerDashboard = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const trainersDB = collection(db, 'trainers');
    const commentsDB = collection(db, "comments");

    const [trainer, setTrainer] = useState(null);
    const disable = localStorage.getItem(ISMANAGER) === 'true' ? false : true;
    const textareaCommentRef = useRef();

    const [modalShown, invokeModal] = useState(false);

    const { isOpen, setOpen } = useTrainerContext();

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

    const AddComment = () => {
        if (textareaCommentRef && textareaCommentRef.current.value !== '') {
            const comment = new TrainerComment(trainer.name, textareaCommentRef.current.value);
            const commentObject = {
                name: comment.getName(),
                content: comment.getContent(),
                approved: comment.isApproved()
            }

            addDoc(commentsDB, commentObject)
                .then(async document => {
                    await updateDoc(doc(db, 'comments', document.id), {
                        id: document.id,
                        ...commentObject
                    })
                    toast.success(`התגובה נוספה בהצלחה`);
                })
                .catch(err => {
                    toast.error(err.message)
                });
        } else toast.warning('תוכן התגובה לא יכול להיות ריק')
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
                        {disable ?
                            <>
                                <CustomeModal
                                    isShown={modalShown}
                                    invokeModal={invokeModal}
                                    title={'הוסף תגובה:'}
                                    bodyTitle={''}
                                    body={
                                        <>
                                            <label>תוכן התגובה:</label>
                                            <br />
                                            <textarea ref={textareaCommentRef} placeholder='רשום כאן...' style={{ resize: 'none', minHeight: '150px', width: '100%' }} />
                                        </>
                                    }
                                    addComment={AddComment}
                                    setShowAllMeetings={undefined}
                                    showAllMeetings={undefined}
                                />
                                <div className='comment-btn'>
                                    <BsPencilSquare onClick={() => invokeModal(true)} color='black' size={44} />
                                </div>
                            </>
                            : null
                        }

                    </>
            }
            {!disable && <BackButton />}
        </div>
    )
}

export default TrainerDashboard