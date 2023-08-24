import React from 'react';
import { Row, Col, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/sidebar.css';
import { IoMdMenu, IoMdClose } from "react-icons/io";
import YarinLevi from './YarinLevi.js'
import { Link, useNavigate } from 'react-router-dom';
import { USERID, USERNAME } from '../screens/Login';


const MESSAGE = 'אני גם רוצה להתחיל את השינוי שלי💪'

const Sidebar = ({ isOpen, setOpen, trainer }) => {
    const navigate = useNavigate();

    const toggleSidebar = () => {
        if (isOpen === '') setOpen('open');
        else setOpen('');
    };

    const userConnected = trainer ? true : false;

    const handleLogout = (e) => {
        localStorage.removeItem(USERID);
        localStorage.removeItem(USERNAME);
        if (localStorage.getItem(USERID) && localStorage.getItem(USERNAME))
            e.preventDefault();

    }

    return (
        <div>
            <header className={`toggle-btn-wrapper ${isOpen}`}>
                {isOpen === 'open' ? (
                    <IoMdClose size={26} onClick={toggleSidebar} />
                ) : (
                    <IoMdMenu size={26} onClick={toggleSidebar} />
                )}
            </header>
            <Row>
                <Col
                    sm={3}
                    className={`sidebar ${isOpen}`}
                >

                    <div onClick={() => navigate(`../home`)}><YarinLevi color='black' /></div>
                    <Nav defaultActiveKey={`../home`} className='nav'>
                        {
                            userConnected ?
                                <div>
                                    <Link color='red' className='nav-link'
                                        to={`../trainer-dashboard/${trainer.id}`}
                                    >
                                        שלום {trainer.name}
                                    </Link>
                                    <Link className='nav-link'
                                        to={`../editor/${trainer.id}`}
                                        state={{ type: 'trainingPlan' }}
                                    >
                                        תכנית אימונים
                                    </Link>
                                    <Link className='nav-link'
                                        to={`../editor/${trainer.id}`}
                                        state={{ type: 'nutrition' }}
                                    >תפריט תזונה</Link>
                                    <Link onClick={handleLogout} to={'../login'} className='nav-link'
                                    >התנתק</Link>
                                </div>
                                :
                                <div>
                                    <Link className='nav-link' href={`../login`} >התחבר</Link>
                                    <Nav.Link href={`https://wa.me/972584560107/?text=${encodeURIComponent(MESSAGE)}`} target='_blank'>התחל את השינוי <strong>שלך</strong></Nav.Link>
                                </div>
                        }
                    </Nav>
                </Col>
            </Row>

        </div>
    );
};

export default Sidebar;
