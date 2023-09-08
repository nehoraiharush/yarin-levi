import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";


import Page from "../PageClass";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/A4Page.css';
import '../style/sidebar.css';
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import LoadingSpinner from "./Loading";
import BackButton from "./BackButton";
import { MANAGERNAME, USERNAME } from "../screens/Login";
import Sidebar from "./Sidebar";


const FONTSIZEREGEX = /font-size:\s*(\d+)pt;/g;

const TrainingPage = () => {

    const [trainer, setTrainer] = useState(null);
    const [page, setPages] = useState(null);
    const [isOpen, setOpen] = useState('')

    const { id, type } = useParams();

    const managerConeected = localStorage.getItem(USERNAME) === MANAGERNAME ? true : false;


    const getData = async () => {
        if (id) {
            const data = await getDoc(doc(db, 'trainers', id))
            setTrainer({ ...data.data() });
        }
    }

    useEffect(() => {
        if (trainer) {
            if (type === 'trainingPlan')
                setPages(new Page(trainer.trainingInfo.trainingPlan, 1));
            else if (type === 'nutrition')
                setPages(new Page(trainer.trainingInfo.nutrition, 1));
        }
    }, [trainer, type])

    useEffect(() => {
        if (id) {
            getData();
        }
    }, []);

    const handleDrag = (e) => {
        e.preventDefault();
    };

    const bigPages = () => {
        let contentWithCustomTableClass = null;
        if (page.getContent() !== null) {
            const contentWithDynamicFontSize = page.getContent().replace(FONTSIZEREGEX, (match, fontSize) => {
                const dynamicFontSize = parseInt(fontSize) / 16;

                return `font-size: ${dynamicFontSize}rem;`;
            });

            const contentWithResponsiveImages = contentWithDynamicFontSize?.replace(/<img/g, '<img class="img-fluid"');

            contentWithCustomTableClass = contentWithResponsiveImages.replace(/<table/g, '<table class="dynamic-table"');
        }
        return (
            <div
                className="textarea box-shadow-container"
                style={{
                    overflow: 'auto'
                }}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(contentWithCustomTableClass) }}
                onDrop={handleDrag}
            />
        );
        ;
    };

    return (
        <div >
            <Container onClick={() => setOpen('')} style={{ height: '100vh' }} >

                {
                    trainer && trainer !== undefined && id ?
                        <>
                            {page ?
                                <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Col lg={12} md={12} sm={12} xs={12} className='col'    >
                                        {bigPages()}
                                    </Col>
                                </Row>
                                :
                                <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
                                    <LoadingSpinner />
                                </div>
                            }
                        </>
                        :
                        <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
                            <LoadingSpinner />
                        </div>
                }

                {managerConeected && <BackButton />}
            </Container >
            <Sidebar trainer={trainer} isOpen={isOpen} setOpen={setOpen} />
        </div>
    );
};

export default TrainingPage;
