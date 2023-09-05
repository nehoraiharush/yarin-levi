import React from 'react'
import '../style/PlanInfoCard.css'
import { useNavigate } from 'react-router-dom'

const PlanInfoCard = ({ type, id }) => {
    const text = type === 'nutrition' ? 'תפריט תזונה' : 'תוכנית אימונים'
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`../training-info/${id}/${type}`)
    }
    return (
        <div onClick={handleClick} className='cardInfo-container'>
            <div className='littlePage' >
                <h1 style={{ textAlign: 'center', color: 'black' }}>{text}</h1>
            </div>
        </div>
    )
}

export default PlanInfoCard