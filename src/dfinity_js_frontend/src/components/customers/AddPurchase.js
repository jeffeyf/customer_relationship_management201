import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddPurchase = ({save}) => {
    const [date, setDate] = useState("");
    const [product, setProduct] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const isFormFilled = () => date && product && quantity && price;
    return (
        <>
            <Button onClick={handleShow} variant="dark" >
                Add Purchase
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>New Purchase</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <FloatingLabel controlId="inputDate" label="Date" className="mb-3">
                            <Form.Control type="date" onChange={(e) => {
                                setDate(e.target.value);
                            }} placeholder="Enter date of purchase" />
                        </FloatingLabel>
                        <FloatingLabel controlId="inputProduct" label="Product" className="mb-3">
                            <Form.Control type="text" onChange={(e) => {
                                setProduct(e.target.value);
                            }} placeholder="Enter product purchased" />
                        </FloatingLabel>
                        <FloatingLabel controlId="inputQuantity" label="Quantity" className="mb-3">
                            <Form.Control type="number" onChange={(e) => {
                                setQuantity(e.target.value);
                            }} placeholder="Enter quantity purchased" />
                        </FloatingLabel>
                        <FloatingLabel controlId="inputPrice" label="Price" className="mb-3">
                            <Form.Control type="number" onChange={(e) => {
                                setPrice(e.target.value);
                            }} placeholder="Enter price of purchase" />
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" 
                        disabled={!isFormFilled()}
                        onClick={() => {
                            save({date, product, quantity, price});
                            handleClose();
                        }}>
                            Save Purchase
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    )
}

export default AddPurchase