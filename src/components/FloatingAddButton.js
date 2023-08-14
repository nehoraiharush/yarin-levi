import React from 'react';
import '../style/FloatingAddButton.css';
import { useNavigate } from 'react-router-dom';


const FloatingAddButton = ({ color, path, text }) => {
    const navigate = useNavigate();
    return (
        <div className="floating-button" style={{ backgroundColor: color }} onClick={() => navigate(path)}>
            <span className="plus-icon" >{text}</span>
        </div>
    );
};

export default FloatingAddButton;
