import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { IoMdMenu, IoMdClose } from "react-icons/io";

import Page from "../PageClass";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/A4Page.css';
import '../style/sidebar.css';




const A4PageNew = () => {
    const [pages, setPages] = useState([new Page('', 1), new Page('', 2)]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [sidebarOpen, setSidebarOpen] = useState('');

    const toggleSidebar = () => {
        if (sidebarOpen === '') setSidebarOpen('open');
        else setSidebarOpen('');
    };

    useEffect(() => {
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

    const handleContentChange = (e, key) => {
        const updatedPages = [...pages];
        updatedPages[key].setConetnt(e.target.innerHTML);
        setPages(updatedPages);
    };

    const handleDrag = (e) => {
        e.preventDefault();
    };

    const bigPages = () => {
        return pages.map((page, index) => {
            const isLastPage = index === pages.length - 1;
            const marginBottom = isLastPage ? '50px' : '0';

            return (
                <Form key={index} id={`big-page-${index + 1}`} className="form-big-page">
                    <Form.Group>
                        <div
                            className="textarea big"
                            style={{ marginBottom }}
                            contentEditable={true}
                            onBlur={(e) => handleContentChange(e, index)}
                            dangerouslySetInnerHTML={{ __html: page.getContent() }}
                            onDrop={handleDrag}
                            dir="auto"
                        />
                    </Form.Group>
                </Form>
            );
        });
    };

    const smallPages = () => {

        return pages.map((page, index) => {
            const isLastPage = index === pages.length - 1;
            const marginBottom = isLastPage ? '50px' : '0';

            return (
                <Form key={index} className="form-small-page">
                    <AnchorLink className="page-anchor" href={`#big-page-${index + 1}`}>
                        <Form.Label
                            style={{
                                ...(windowWidth < 1200 ? { color: 'black' } : { color: 'white' }),
                                alignSelf: 'center'
                            }}
                        >
                            {index + 1}
                        </Form.Label>
                        <Form.Group>
                            <div
                                className="textarea small"
                                style={{ ...(windowWidth < 1200 ? { marginBottom } : {}) }}
                                dangerouslySetInnerHTML={{ __html: page.getContent() }}
                                onDrop={handleDrag}
                                draggable="false"
                                dir="auto"
                            />
                        </Form.Group>
                    </AnchorLink>
                </Form>
            );
        });
    };

    const sideBarPages = () => {
        return (
            <div>
                <Row>
                    <Col
                        sm={3}
                        className={`sidebar ${sidebarOpen}`}
                    >
                        <div className="sticky-col">
                            {smallPages()}
                        </div>
                    </Col>
                </Row>
                <div className={`toggle-btn-wrapper ${sidebarOpen}`}>
                    {sidebarOpen === 'open' ? (
                        <IoMdClose size={26} onClick={toggleSidebar} />
                    ) : (
                        <IoMdMenu size={26} onClick={toggleSidebar} />
                    )}
                </div>
            </div>);
    }

    return (
        <Container style={{ height: '100vh', }}>
            <Row style={{ marginTop: '20px' }}>
                <Col>
                    <Button className="" onClick={addPlainPage} variant="btn btn-info btn-lg">הוסף דף</Button>
                </Col>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Col className='col scrollable-col' onClick={sidebarOpen === 'open' ? toggleSidebar : () => { }} lg={10} md={10} sm={10} xs={10}  >
                    {bigPages()}
                </Col>
                <Col className="col" lg={2} md={2} sm={2} xs={2} >
                    {windowWidth >= 1200 ?
                        <div className="sticky-col">
                            {smallPages()}
                        </div>
                        :
                        sideBarPages()
                    }

                </Col>
            </Row>
        </Container >
    );
};

export default A4PageNew;
