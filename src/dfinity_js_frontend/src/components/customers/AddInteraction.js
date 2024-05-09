import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddInteraction = ({save}) => {
    const [date, setDate] = useState("");
    const [interaction_type, setInteractionType] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [comments, setComments] = useState("");

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const isFormFilled = () => date && interaction_type && description && status && comments;
  return (
    <>
        <Button onClick={handleShow} variant="dark" >
            Add Interaction
        </Button>
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>New Interaction</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    <FloatingLabel controlId="inputDate" label="Date" className="mb-3">
                        <Form.Control type="date" onChange={(e) => {
                            setDate(e.target.value);
                        }} placeholder="Enter date of interaction" />
                    </FloatingLabel>
                    <FloatingLabel controlId="inputInteractionType" label="Interaction Type" className="mb-3">
                        <Form.Control type="text" onChange={(e) => {
                            setInteractionType(e.target.value);
                        }} placeholder="Enter interaction type" />
                    </FloatingLabel>
                    <FloatingLabel controlId="inputDescription" label="Description" className="mb-3">
                        <Form.Control type="text" onChange={(e) => {
                            setDescription(e.target.value);
                        }} placeholder="Enter description of interaction" />
                    </FloatingLabel>
                    <FloatingLabel controlId="inputStatus" label="Status" className="mb-3">
                        <Form.Control type="text" onChange={(e) => {
                            setStatus(e.target.value);
                        }} placeholder="Enter status of interaction" />
                    </FloatingLabel>
                    <FloatingLabel controlId="inputComments" label="Comments" className="mb-3">
                        <Form.Control type="text" onChange={(e) => {
                            setComments(e.target.value);
                        }} placeholder="Enter comments of interaction" />
                    </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" 
                    disabled={!isFormFilled()}
                    onClick={() => {
                        save({date, interaction_type, description, status, comments});
                        handleClose();
                    }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </>
  )
}

export default AddInteraction