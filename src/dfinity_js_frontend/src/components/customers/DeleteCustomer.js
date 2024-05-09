import React from 'react'
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { NotificationError, NotificationSuccess } from '../utils/Notifications';
import { deleteCustomer } from '../../utils/crm';

const DeleteCustomer = ({customerId}) => {
    const removeCustomer =  () => {
        try {
          deleteCustomer(customerId);
          toast(<NotificationSuccess text="Customer removed successfully." />);
            window.location.reload()
        } catch (error) {
          console.log({error});
          toast(<NotificationError text="Failed to Remove a Customer" />);
        }
      }
  return (
    <Button variant="danger" className="rounded-pill px-0" style={{ width: "38px" }}
        onClick={() => { 
            removeCustomer()
        }}
    >
        <i className="bi bi-trash"></i>
    </Button>
  )
}

export default DeleteCustomer