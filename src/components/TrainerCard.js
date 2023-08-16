import React from 'react'
import { Image } from 'react-bootstrap';
import '../style/TrainerCard.css';
import { useNavigate } from 'react-router-dom';

import LoadingSpinner from './Loading';
const TrainerCard = ({ trainer, id }) => {
    const navigate = useNavigate();

    const toTrainerDash = () => {
        console.log("CARD", id)
        navigate(`../trainer-dashboard/${id}`, { state: { docId: trainer.docId } });
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
                                width: '12vw',
                                borderRadius: '50%'
                            }}
                        />
                        <div className='info' style={{ textAlign: 'center' }}>
                            <h2 className='trainer-name'>{trainer.name}</h2>
                            <div className='status-row'>
                                <span className='circle-status'
                                    style={{
                                        backgroundColor: trainer.status === 'active' ? 'rgb(73, 239, 73)' : trainer.status === 'offline' ? 'red' : 'yellow'
                                    }}></span>
                                <h5 className='trainer-status'>{trainer.status === 'active' ? 'פעיל' : trainer.status === 'offline' ? 'לא פעיל' : 'מושהה'}</h5>

                            </div>
                            <h5 className='age'>גיל: {trainer.age}</h5>
                        </div>
                    </div>
            }
        </div>
    );


}

export default TrainerCard;