import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowDropleft } from 'react-icons/io'

const BackButton = () => {
    const navigate = useNavigate();
    return (
        <div className="floating-button return-btn" style={{ display: 'flex', flexDirection: 'column', }} onClick={() => navigate('/all-trainers')}>
            <IoIosArrowDropleft size={'lg'} />
            <p style={{ textAlign: 'center' }}>למסך המתאמנים</p>
        </div>
    )
}

export default BackButton