import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddCustomer = ({save}) => {
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const isFormFilled = () => name && company && email && phone;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Button onClick={handleShow} variant="dark">
               Add New Customer
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>New Customer</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <FloatingLabel controlId="inputName" label="Customer name" className="mb-3">
                            <Form.Control type="text" onChange={(e) => {
                                setName(e.target.value);
                            }} placeholder="Enter name of customer" />
                        </FloatingLabel>
                        <FloatingLabel controlId="inputCompany" label="Company" className="mb-3">
                            <Form.Control type="text" onChange={(e) => {
                                setCompany(e.target.value);
                            }} placeholder="Enter company of customer" />
                        </FloatingLabel>
                        <FloatingLabel controlId="inputEmail" label="Email" className="mb-3">
                            <Form.Control type="email" onChange={(e) => {
                                setEmail(e.target.value);
                            }} placeholder="Enter email of customer" />
                        </FloatingLabel>
                        <FloatingLabel controlId="inputPhone" label="Phone" className="mb-3">
                            <Form.Control type="text" onChange={(e) => {
                                setPhone(e.target.value);
                            }} placeholder="Enter phone of customer" />
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" 
                        disabled={!isFormFilled()}
                        onClick={() => {
                            save({name, company, email, phone});
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

export default AddCustomer