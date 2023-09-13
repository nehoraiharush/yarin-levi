import React, { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'

const CustomeModal = ({ title, bodyTitle, body, isShown, invokeModal }) => {
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
            <Modal.Footer>
                <Button variant="info" onClick={() => invokeModal(false)}>
                    סגור
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CustomeModal