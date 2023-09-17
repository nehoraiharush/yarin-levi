import React from 'react'
import { Button, Modal } from 'react-bootstrap'

const CustomeModal = ({
    title, bodyTitle, body, isShown, invokeModal,
    setShowAllMeetings, showAllMeetings, addComment
}) => {
    const missingBody = body.props.children !== undefined && (typeof body.props.children === 'string' || body.props.children.every((e) => e === null))
    return (
        <Modal style={{ color: 'black' }} show={isShown}>
            <Modal.Header dir='auto' >
                <Modal.Title> {title}</Modal.Title>
            </Modal.Header>
            <Modal.Body dir='auto'>
                {
                    !missingBody ?
                        <>
                            {bodyTitle}
                            {body}
                        </>
                        :
                        <h3>אין פגישות</h3>
                }

            </Modal.Body>
            <Modal.Footer style={{
                ...(
                    setShowAllMeetings !== undefined || addComment !== undefined ?
                        {
                            display: 'flex',
                            justifyContent: 'space-between'
                        } : ''
                )
            }}>
                {setShowAllMeetings !== undefined ?

                    (!showAllMeetings ?
                        <Button variant="primary" onClick={() => setShowAllMeetings(true)}>
                            כל הפגישות
                        </Button>
                        :
                        <Button variant="primary" onClick={() => setShowAllMeetings(false)}>
                            פגישות בשבוע הקרוב
                        </Button>
                    )
                    :
                    (
                        addComment !== undefined ?
                            <Button variant="primary" onClick={(e) => addComment(e.target)}>
                                הוסף תגובה
                            </Button>
                            :
                            null
                    )
                }

                <Button variant="danger"
                    onClick={() => {
                        invokeModal(false);
                        if (showAllMeetings) setShowAllMeetings(false);
                    }}>
                    סגור
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CustomeModal