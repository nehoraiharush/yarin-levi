import React from 'react';
import '../style/FloatingAddButton.css';
import { useNavigate } from 'react-router-dom';


const FloatingAddButton = ({ path, text }) => {
    const navigate = useNavigate();
    return (
        <div className="floating-button plus-btn"
            onClick={() =>
                navigate(path)}>
            <span className="plus-icon" >{text}</span>
        </div>
    );
};

export default FloatingAddButton;
