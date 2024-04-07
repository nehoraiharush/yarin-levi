import React, { useRef } from 'react'
import { Image } from 'react-bootstrap';
import '../style/TrainerCard.css';
import { useNavigate } from 'react-router-dom';

import LoadingSpinner from './Loading';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const TrainerCard = ({ trainer }) => {
    const navigate = useNavigate();
    const paymentCheckboxRef = useRef();

    const toTrainerDash = () => {
        navigate(`../trainer-dashboard/${trainer.id}`);
    }

    const dispatchChanges = async () => {
        try {
            const trainerDoc = doc(db, 'trainers', trainer.id);
            await updateDoc(trainerDoc, {
                ...trainer,
                hasPaid: paymentCheckboxRef.current.checked
            })
        } catch (error) {
            throw new Error();
        }
    }

    const handlePaymentChange = (e) => {
        paymentCheckboxRef.current.checked = !paymentCheckboxRef.current.checked
        e.stopPropagation();
        dispatchChanges();
    }

    return (
        <div>
            {
                trainer === null || trainer === undefined ?
                    <LoadingSpinner />
                    :
                    <div className='card-container'
                        style={{
                            backgroundColor: trainer.status === 'active' ? 'rgba(74, 214, 109, 0.6)' : trainer.status === 'offline' ? 'rgba(219, 40, 40, 0.4)' : 'rgba(255,238,112,0.6)',
                            color: trainer.status === 'active' || trainer.status === 'pause' ? 'white' : '#bbb',
                        }}
                        onClick={toTrainerDash}
                        dir='rtl'
                    >
                        <Image
                            src={require('../assets/avatar.png')}
                            alt='profile image'
                            style={{
                                height: '12vw',
                                width: '13vw',
                                borderRadius: '50%',
                                zIndex: '2'
                            }}
                        />

                        <div style={{ textAlign: 'center' }}>

                            <h2 className='trainer-name'>{trainer.name}</h2>
                            <div className='status-row'>
                                <span className='circle-status'
                                    style={{
                                        backgroundColor: trainer.status === 'active' ? 'rgb(73, 239, 73)' : trainer.status === 'offline' ? 'red' : 'yellow'
                                    }}></span>
                                <h5 className='trainer-status'>{trainer.status === 'active' ? 'פעיל' : trainer.status === 'offline' ? 'לא פעיל' : 'מושהה'}</h5>

                            </div>
                            <h5 className='age'>גיל: {trainer.age}</h5>
                            <div onClick={handlePaymentChange} style={{ display: 'flex', justifyContent: 'center', gap: '5px', alignItems: 'baseline' }}>
                                <input ref={paymentCheckboxRef} onChange={handlePaymentChange} checked={trainer.hasPaid ? true : false} type='checkbox' style={{ height: '100%', zIndex: '3' }} />
                                <h5 style={{ userSelect: 'none' }} >שילם</h5>
                            </div>
                        </div>
                    </div>
            }
        </div>
    );


}

export default TrainerCard;