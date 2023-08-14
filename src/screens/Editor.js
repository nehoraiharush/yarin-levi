import React, { useRef, useState, useEffect } from "react";
import { Editor as TinyMce } from "@tinymce/tinymce-react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Spinner } from "react-bootstrap";

import Page from "../PageClass";

import '../style/Login.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from "react-toastify";
import { SETLOADING, useTrainerContext } from "../components/TrainerContexts";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Link, useLocation } from "react-router-dom";
import { APPNAME } from "../App";

const Editor = () => {
    const [page, setPage] = useState(new Page("", 1));
    const [trainer, setTrainer] = useState(null);
    const [hasChanged, setChange] = useState(false);
    const tinymce = useRef(null);

    const { state, dispatch } = useTrainerContext();
    const stateLoc = useLocation().state;
    const docId = stateLoc?.docId;
    const type = stateLoc?.type

    const getData = async () => {
        const data = await getDoc(doc(db, 'trainers', docId))
        setTrainer({ ...data.data(), docId });
    }

    //Getting the trainer info
    useEffect(() => {
        if (docId) getData();
    }, []);

    //setting the page first value after finding the trainer info
    useEffect(() => {
        if (trainer) {
            if (type === 'trainingPlan')
                setPage(new Page(trainer.trainingInfo.trainingPlan, 1));
            else if (type === 'nutrition')
                setPage(new Page(trainer.trainingInfo.nutrition, 1));
        }
    }, [trainer])

    const dispatchChanges = async () => {
        try {
            dispatch({
                type: SETLOADING,
                payload: {
                    isLoading: true
                }
            });
            const trainerDoc = doc(db, 'trainers', trainer.docId);
            const { docId, ...updatedData } = trainer
            await updateDoc(trainerDoc, {
                ...updatedData
            })
            setChange(false);

            toast.success('השינויים נשמרו בהצלחה')
        } catch (error) {
            toast.error('אירעה שגיאה בשמירת השינויים');
        } finally {
            dispatch({
                type: SETLOADING,
                payload: {
                    isLoading: false
                }
            });
        }
    }

    const handleDispatch = async () => {
        await dispatchChanges();
    }

    useEffect(() => {
        if (hasChanged) {
            console.log("BEFORE handleDispatch");
            handleDispatch();
        }
    }, [hasChanged])

    const handleSavingBtn = async () => {
        if (trainer) {
            if (type === 'trainingPlan') {
                setTrainer({
                    ...trainer,
                    trainingInfo: {
                        ...trainer.trainingInfo,
                        trainingPlan: tinymce.current.getContent()
                    }
                })
            } else if (type === 'nutrition') {
                setTrainer({
                    ...trainer,
                    trainingInfo: {
                        ...trainer.trainingInfo,
                        nutrition: tinymce.current.getContent()
                    }
                })
            }
            setChange(true);
        }
    }

    return (
        <Container style={{ height: "100vh" }}>
            {
                trainer === null || trainer === undefined ?
                    <div style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
                        <Spinner style={{ alignSelf: 'center' }} animation="border" />
                    </div>
                    :
                    <div style={{}}>
                        <Row style={{ ...(state.isLoading ? { marginTop: '20px' } : {}) }}>
                            <Col style={{ display: 'flex', justifyContent: 'center' }}>
                                {
                                    !state.isLoading ?
                                        <div style={{ width: '100%' }}>
                                            <Button
                                                onClick={handleSavingBtn}
                                                className="signup-btn"
                                                variant="btn btn-lg"
                                            >
                                                שמור שינויים
                                            </Button>
                                            <Link className='nav-link'
                                                to={`${APPNAME}/training-info/${trainer.id}`}
                                                state={{ docId: trainer.docId }}
                                            >
                                                תכנית אימונים
                                            </Link>
                                        </div>

                                        :
                                        <Spinner style={{ alignSelf: 'center' }} animation="border" />
                                }

                            </Col>
                        </Row>
                        <Row style={{ height: "100%", marginTop: "50px" }}>
                            <Col style={{ height: "100%" }}>
                                <TinyMce
                                    onInit={(evt, editor) => tinymce.current = editor}
                                    apiKey="6yn9o7h95pny6znn5j7a0fijprxkz19cd4mla2zidi5teecp"
                                    initialValue={page.getContent()}
                                    init={{
                                        branding: false,
                                        height: 1500,
                                        menubar: true,
                                        resize: false,
                                        plugins:
                                            "preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount",
                                        toolbar:
                                            "formatselect | bold italic underline strikethrough | forecolor backcolor blockquote | link image media | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat",

                                        directionality: "auto",
                                        deprecation_warnings: false,
                                        image_title: true,
                                        automatic_uploads: true,
                                        file_picker_types: 'image media',
                                        file_picker_callback: (cb, value, meta) => {
                                            var input = document.createElement('input');
                                            input.setAttribute('type', 'file');
                                            input.setAttribute('accept', 'image/*, video/*'); // Allow both image and video files

                                            input.onchange = function () {
                                                var file = this.files[0];
                                                if (tinymce.current) {
                                                    var reader = new FileReader();
                                                    reader.onload = function () {
                                                        var id = 'blobid' + (new Date()).getTime();
                                                        var blobCache = tinymce.current.editorUpload.blobCache;
                                                        var base64 = reader.result.split(',')[1];
                                                        var blobInfo = blobCache.create(id, file, base64);
                                                        blobCache.add(blobInfo);

                                                        /* call the callback and populate the Title field with the file name */
                                                        cb(blobInfo.blobUri(), { title: file.name });
                                                    };
                                                    reader.readAsDataURL(file);
                                                } else toast.error("ERROR: cannot ref tinymce editor")
                                            };

                                            input.click();
                                        },
                                        content_style: `
                            body { 
                                font-family:Helvetica,Arial,sans-serif; f
                                ont-size:14px;
                            }
                            `
                                    }}
                                />
                            </Col>
                        </Row>
                    </div>
            }

        </Container >
    );
};

export default Editor;
