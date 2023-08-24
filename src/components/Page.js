import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import DOMPurify from "dompurify";


import Page from "../PageClass";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/A4Page.css';
import '../style/sidebar.css';
import { useLocation, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import LoadingSpinner from "./Loading";
import BackButton from "./BackButton";


const FONTSIZEREGEX = /font-size:\s*(\d+)pt;/g;

const TrainingPage = () => {

    const [trainer, setTrainer] = useState(null);
    const [pages, setPages] = useState([]);

    const stateLoc = useLocation().state;
    const type = stateLoc?.type
    const { id } = useParams();

    const getData = async () => {
        if (id) {
            const data = await getDoc(doc(db, 'trainers', id))
            setTrainer({ ...data.data() });
        }
    }

    useEffect(() => {
        if (trainer) {
            if (type === 'trainingPlan')
                setPages([new Page(trainer.trainingInfo.trainingPlan, 1)]);
            else if (type === 'nutrition')
                setPages([new Page(trainer.trainingInfo.nutrition, 1)]);
        }
    }, [trainer])

    useEffect(() => {
        if (id) {
            getData();
        }
    }, []);

    const handleDrag = (e) => {
        e.preventDefault();
    };

    const bigPages = () => {
        return pages.map((page, index) => {
            const isLastPage = index === pages.length - 1;
            const marginBottom = isLastPage ? '50px' : '0';
            let contentWithCustomTableClass = null;
            if (page.getContent() !== null) {
                const contentWithDynamicFontSize = page.getContent().replace(FONTSIZEREGEX, (match, fontSize) => {
                    const dynamicFontSize = parseInt(fontSize) / 16;

                    console.log(fontSize);
                    return `font-size: ${dynamicFontSize}rem;`;
                });

                const contentWithResponsiveImages = contentWithDynamicFontSize?.replace(/<img/g, '<img class="img-fluid"');

                contentWithCustomTableClass = contentWithResponsiveImages.replace(/<table/g, '<table class="dynamic-table"');
            }
            return (
                <Form key={index} id={`big-page-${index + 1}`} className="form-big-page">
                    <Form.Group>
                        <div
                            className="textarea big"
                            style={{ marginBottom }}
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(contentWithCustomTableClass) }}
                            onDrop={handleDrag}
                            dir="auto"
                        />
                    </Form.Group>
                </Form>
            );
        });
    };

    return (
        <Container style={{ height: '100vh' }} >

            {
                trainer && trainer !== undefined && id ?
                    <>
                        {pages.length > 0 ?
                            <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Col lg={12} md={12} sm={12} xs={12} className='col'    >
                                    {bigPages()}
                                </Col>
                            </Row> : null}
                    </>
                    :
                    <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
                        <LoadingSpinner />
                    </div>
            }

            <BackButton />
        </Container >
    );
};

export default TrainingPage;
