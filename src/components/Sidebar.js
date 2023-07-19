import React, { useState } from 'react';
import { Row, Col, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/sidebar.css';
import { IoMdMenu, IoMdClose } from "react-icons/io";
import YarinLevi from './YarinLevi.js'
import { useNavigate } from 'react-router-dom';


const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState('');
    const navigate = useNavigate();

    const toggleSidebar = () => {
        if (sidebarOpen === '') setSidebarOpen('open');
        else setSidebarOpen('');
    };

    return (
        <div>
            <Row>
                <Col
                    sm={3}
                    className={`sidebar ${sidebarOpen}`}
                >

                    <div onClick={() => navigate('/home')}><YarinLevi color='black' /></div>
                    <Nav defaultActiveKey="/home" className='nav'>
                        <Nav.Link href="/home">תכנית אימונים</Nav.Link>
                        <Nav.Link href="/about">תפריט תזונה</Nav.Link>
                        <Nav.Link href="/contact">Contact</Nav.Link>
                    </Nav>
                </Col>
            </Row>
            <div className={`toggle-btn-wrapper ${sidebarOpen}`}>
                {sidebarOpen === 'open' ? (
                    <IoMdClose size={26} onClick={toggleSidebar} />
                ) : (
                    <IoMdMenu size={26} onClick={toggleSidebar} />
                )}
            </div>
        </div>
    );
};

export default Sidebar;
