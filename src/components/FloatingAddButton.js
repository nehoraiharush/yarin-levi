import React from 'react';
import '../style/FloatingAddButton.css';
import { useNavigate } from 'react-router-dom';


const FloatingAddButton = () => {
    const navigate = useNavigate();
    return (
        <div className="floating-button" onClick={() => navigate('/signup')}>
            <span className="plus-icon" >+</span>
        </div>
    );
};

export default FloatingAddButton;
