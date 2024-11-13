import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDropleft } from 'react-icons/io';

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <div
      className='floating-button return-btn'
      style={{ display: 'flex', flexDirection: 'column' }}
      onClick={() => navigate(-1)}
    >
      <IoIosArrowDropleft size={30} />
      <p style={{ textAlign: 'center' }}>חזור</p>
    </div>
  );
};

export default BackButton;
