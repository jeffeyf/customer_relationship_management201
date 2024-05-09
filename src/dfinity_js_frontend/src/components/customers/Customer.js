import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Button, Col, Stack, Row, Modal, Form, InputGroup} from "react-bootstrap";
import { toast } from "react-toastify";
import UpdateCustomer from "./UpdateCustomer";
import DeleteCustomer from "./DeleteCustomer";
import { addInteraction, addPurchase } from "../../utils/crm";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";
import AddPurchase from "./AddPurchase";
import AddInteraction from "./AddInteraction";


const Customer = ({customer}) => {
    const {id, name, email, phone, address, purchases, interactions} = customer;

  

    const insertInteraction = async (interaction) => {
        try {
            addInteraction(id, interaction).then
            ((resp) => {
                console.log({ resp });
            });
            window.location.reload();
            toast(<NotificationSuccess text="Interaction added successfully." />);
        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="Failed to create an Interaction." />);
        } 
    };

    const insertPurchase = async (purchase) => {
        try {
            addPurchase(id, purchase).then
            ((resp) => {
                console.log({ resp });
            });
            window.location.reload();
            toast(<NotificationSuccess text="Purchase added successfully." />);
        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="Failed to create a Purchase." />);
        } 
    };


  return (
    <Card className="mb-3">
        <Card.Body>
            <Row>
                <Col>
                    <Card.Title>{name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{email}</Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">{phone}</Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">{address}</Card.Subtitle>
                </Col>
                <Col className="text-end">
                    <Stack direction="horizontal" gap={2}>
                        <UpdateCustomer customerId={id} />
                        <DeleteCustomer customerId={id} />
                    </Stack>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card.Title>Interactions</Card.Title>
                    <ul>
                        {interactions.map((interaction, index) => (
                            <li key={index}>
                                {interaction.date} - {interaction.interaction_type} - {interaction.description} - {interaction.status} - {interaction.comments} 
                            </li>
                        ))}
                    </ul>
                   <AddInteraction save={insertInteraction} />
                </Col>
                <Col>
                    <Card.Title>Purchases</Card.Title>
                    <ul>
                        {purchases.map((purchase, index) => (
                            <li key={index}>
                                {purchase.date} - {purchase.product} - {purchase.quantity} - {purchase.price}
                            </li>
                        ))}
                    </ul>
                   <AddPurchase save={insertPurchase} />
                </Col>
            </Row>
        </Card.Body>
    </Card>

  )
}

export default Customer