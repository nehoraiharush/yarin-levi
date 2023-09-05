import React from 'react';
import { Row, Col, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/sidebar.css';
import { IoMdMenu, IoMdClose } from "react-icons/io";
import YarinLevi from './YarinLevi.js'
import { Link, useNavigate } from 'react-router-dom';
import { MANAGERNAME, USERID, USERNAME } from '../screens/Login';
import { toast } from 'react-toastify';


const MESSAGE = 'אני גם רוצה להתחיל את השינוי שלי💪'

const Sidebar = ({ isOpen, setOpen, trainer }) => {
    const navigate = useNavigate();

    const toggleSidebar = () => {
        if (isOpen === '') setOpen('open');
        else setOpen('');
    };

    const userConnected = trainer ? true : false;
    const managerConeected = localStorage.getItem(USERNAME) === MANAGERNAME ? true : false;

    const handleLogout = (e) => {
        const name = localStorage.getItem(USERNAME)
        localStorage.removeItem(USERID);
        localStorage.removeItem(USERNAME);
        if (localStorage.getItem(USERID) && localStorage.getItem(USERNAME))
            e.preventDefault();
        toast.success(`${name} התנתק בהצלחה`)

    }

    return (
        <div >
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
                    className={`sidebar side-bar-box-shadow-container ${isOpen}`}
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
                                        to={`../${managerConeected ? 'editor' : 'training-info'}/${trainer.id}/trainingPlan`}
                                    >
                                        תכנית אימונים
                                    </Link>
                                    <Link className='nav-link'
                                        to={`../${managerConeected ? 'editor' : 'training-info'}/${trainer.id}/nutrition`}
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
