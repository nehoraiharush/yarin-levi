import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
// import AnchorLink from "react-anchor-link-smooth-scroll";
// import { IoMdMenu, IoMdClose } from "react-icons/io";
import DOMPurify from "dompurify";


import Page from "../PageClass";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/A4Page.css';
import '../style/sidebar.css';
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import LoadingSpinner from "./Loading";
import BackButton from "./BackButton";


const FONTSIZEREGEX = /font-size:\s*(\d+)pt;/g;

const TrainingPage = () => {

    const [trainer, setTrainer] = useState(null);
    const [pages, setPages] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const { state } = useLocation();
    const docId = state?.docId;
    console.log(docId);
    const getData = async () => {
        if (docId) {
            const data = await getDoc(doc(db, 'trainers', docId))
            setTrainer({ ...data.data(), docId });
        }
    }

    useEffect(() => {
        if (trainer) {
            setPages([...pages, new Page(trainer.trainingInfo.trainingPlan, pages.length)])
        }
    }, [trainer])

    useEffect(() => {
        if (docId) {
            getData();
        }
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const addPlainPage = () => {
        setPages([...pages, new Page('', pages.length + 1)]);
    };

    // const handleContentChange = (e, key) => {
    //     const updatedPages = [...pages];
    //     updatedPages[key].setConetnt(e.target.innerHTML);
    //     setPages(updatedPages);
    // };

    const handleDrag = (e) => {
        e.preventDefault();
    };

    const bigPages = () => {
        return pages.map((page, index) => {
            const isLastPage = index === pages.length - 1;
            const marginBottom = isLastPage ? '50px' : '0';
            // Replace font-size styles with dynamically calculated font sizes
            let contentWithCustomTableClass = null;
            if (page.getContent() !== null) {
                const contentWithDynamicFontSize = page.getContent().replace(FONTSIZEREGEX, (match, fontSize) => {
                    const windowWidthInPercent = (windowWidth / 1920) * 100; // Adjust 1920 as needed
                    const dynamicFontSize = (parseInt(fontSize) * windowWidthInPercent) / 100;
                    return `font-size: ${dynamicFontSize}pt;`;
                });

                // Add img-fluid class to all img elements
                const contentWithResponsiveImages = contentWithDynamicFontSize?.replace(/<img/g, '<img class="img-fluid"');

                // Add custom class to each table element
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


    // const smallPages = () => {

    //     return pages.map((page, index) => {
    //         const isLastPage = index === pages.length - 1;
    //         const marginBottom = isLastPage ? '50px' : '0';
    //         let contentWithCustomTableClass = null;
    //         if (page.getContent() !== null) {
    //             // Replace font-size styles with dynamically calculated font sizes
    //             const contentWithDynamicFontSize = page.getContent().replace(FONTSIZEREGEX, (match, fontSize) => {
    //                 const windowWidthInPercent = (170 / 1920) * 100; // Adjust 1920 as needed
    //                 const dynamicFontSize = (parseInt(fontSize) * windowWidthInPercent) / 100;
    //                 return `font-size: ${dynamicFontSize}pt;`;
    //             });

    //             // Add img-fluid class to all img elements
    //             const contentWithResponsiveImages = contentWithDynamicFontSize.replace(/<img/g, '<img class="img-fluid-small"');

    //             // Add custom class to each table element
    //             contentWithCustomTableClass = contentWithResponsiveImages.replace(/<table/g, '<table class="dynamic-table-small"');
    //         }

    //         return (
    //             <Form key={index} className="form-small-page">
    //                 <AnchorLink className="page-anchor" href={`#big-page-${index + 1}`}>
    //                     <Form.Label
    //                         style={{
    //                             ...(windowWidth < 1200 ? { color: 'black' } : { color: 'white' }),
    //                             alignSelf: 'center'
    //                         }}
    //                     >
    //                         {index + 1}
    //                     </Form.Label>
    //                     <Form.Group>
    //                         <div
    //                             className="textarea small"
    //                             style={{ ...(windowWidth < 1200 ? { marginBottom } : {}), fontSize: '12px' }}
    //                             dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(contentWithCustomTableClass) }}
    //                             onDrop={handleDrag}
    //                             draggable="false"
    //                             dir="auto"
    //                         />
    //                     </Form.Group>
    //                 </AnchorLink>
    //             </Form>
    //         );
    //     });
    // };

    // const sideBarPages = () => {
    //     return (
    //         <div>
    //             <Row>
    //                 <Col
    //                     sm={4}
    //                     className={`sidebar ${sidebarOpen}`}
    //                 >
    //                     <div className="sticky-col">
    //                         {smallPages()}
    //                     </div>
    //                 </Col>
    //             </Row>
    //             <div className={`toggle-btn-wrapper ${sidebarOpen}`}>
    //                 {sidebarOpen === 'open' ? (
    //                     <IoMdClose size={26} onClick={toggleSidebar} />
    //                 ) : (
    //                     <IoMdMenu size={26} onClick={toggleSidebar} />
    //                 )}
    //             </div>
    //         </div>);
    // }


    return (
        <Container style={{ height: '100vh' }} >

            {
                trainer && trainer !== undefined && docId ?
                    <>
                        {pages.length > 0 ?
                            <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Col lg={12} md={12} sm={12} xs={12} className='col scrollable-col'    >
                                    {bigPages()}
                                </Col>
                                {/* <Col className="col" lg={2} md={2} sm={2} xs={2} >
                    {windowWidth >= 1200 ?
                    <div className="sticky-col">
                        {smallPages()}
                    </div>
                    :
                        sideBarPages()
                    }

                </Col> */}
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
