import React, { useEffect, useState } from 'react'
import { getCustomer, updateCustomer } from '../../utils/crm';
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { toast } from 'react-toastify';
import { NotificationError, NotificationSuccess } from '../utils/Notifications';

const UpdateCustomer = ({customerId}) => {
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [interactions, setInteractions] = useState([]);
    const [purchases, setPurchases] = useState([]);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // console.log("first", name)
    // console.log("second", interactions)

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const customer = await getCustomer(customerId);
                console.log("customer", customer)
                setName(customer.Ok.name);
                setCompany(customer.Ok.company);
                setEmail(customer.Ok.email);
                setPhone(customer.Ok.phone);
                setInteractions(customer?.Ok.interactions);
                setPurchases(customer?.Ok.purchases);
            } catch (error) {
                console.error(error);
            }
        };
  
        fetchCustomer();
    }, [customerId]);

    const Update = async () => {
        try {
            await updateCustomer({ id: customerId, name, company, email, phone, interactions, purchases });
            toast(<NotificationSuccess text="Customer updated successfully." />);
        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="Failed to update a Customer." />);
        }
    }

  return (
    <>
        <Button variant="primary" className="rounded-pill px-0" style={{ width: "38px" }}
            onClick={handleShow}
        >
            <i className="bi bi-pencil"></i>
        </Button>
    
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Update Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <FloatingLabel controlId="floatingInput" label="Name">
                <Form.Control type="text" placeholder="Name" defaultValue={name} onChange={(e) => setName(e.target.value)} />
                </FloatingLabel>
                <FloatingLabel controlId="floatingInput" label="Company">
                <Form.Control type="text" placeholder="Company" defaultValue={company} onChange={(e) => setCompany(e.target.value)} />
                </FloatingLabel>
                <FloatingLabel controlId="floatingInput" label="Email">
                <Form.Control type="email" placeholder="Email" defaultValue={email} onChange={(e) => setEmail(e.target.value)} />
                </FloatingLabel>
                <FloatingLabel controlId="floatingInput" label="Phone">
                <Form.Control type="text" placeholder="Phone" defaultValue={phone} onChange={(e) => setPhone(e.target.value)} />
                </FloatingLabel>
                {/* <FloatingLabel controlId="floatingInput" label="Interactions">
                <Form.Control type="text" placeholder="Interactions" value={interactions} onChange={(e) => setInteractions(e.target.value)} />
                </FloatingLabel>
                <FloatingLabel controlId="floatingInput" label="Purchases">
                <Form.Control type="text" placeholder="Purchases" value={purchases} onChange={(e) => setPurchases(e.target.value)} />
                </FloatingLabel> */}
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={() => {
                Update();
                handleClose();
            }}>
                Update
            </Button>
            </Modal.Footer>
        </Modal>
    </>
  )
}

export default UpdateCustomer