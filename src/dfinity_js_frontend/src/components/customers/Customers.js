import React, { useCallback, useEffect, useState } from 'react'
import { toast } from "react-toastify";
import { createCustomer, filterCustomers, getCustomers as getCustomersList, searchCustomerByName } from '../../utils/crm';
import { NotificationError, NotificationSuccess } from '../utils/Notifications';
import { Row, Button,InputGroup, Form } from "react-bootstrap";
import Loader from '../utils/Loader';
import AddCustomer from './AddCustomer';
import Customer from './Customer';

const Customers = () => {

    const [customersList, setCustomersList] = useState([]);
    const [searchCustomer, setSearchCustomer] = useState("");
    const [loading, setLoading] = useState(false);

    const search = async (searchTerm) => {
        try {
            setLoading(true);
            setCustomersList(await searchCustomerByName(searchTerm));
        } catch (error) {
            console.log({ error });
        } finally {
            setLoading(false);
        }
    }

    const getCustomers = useCallback(async () => {
        try {
            setLoading(true);
            setCustomersList(await getCustomersList());
        } catch (error) {
            console.log({ error });
        } finally {
            setLoading(false);
        }
    }, []);

    const addCustomer = async (customer) => {
        try {
            createCustomer(customer).then
            ((resp) => {
                console.log({ resp });
            });
            window.location.reload();
            toast(<NotificationSuccess text="Customer added successfully." />);
        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="Failed to create a Customer." />);
        } 
    };

    useEffect(() => {
        getCustomers();
    } , [getCustomers]);
  return (
    <>
        {!loading ? (
            <>
                <Row className="mb-3 mt-4 " >
                    <InputGroup>
                        <Form.Control
                            placeholder="Search by name"
                            value={searchCustomer}
                            onChange={(e) => setSearchCustomer(e.target.value)}
                        />
                        <Button
                            variant="outline-secondary"
                            onClick={() => search(searchCustomer)}
                        >
                            Search
                        </Button>
                    </InputGroup>
                </Row>
                <Row className="mb-3" style={{display:"flex"}} >
                                    <h3>Add Customers</h3>
                    <AddCustomer save={addCustomer} />
                </Row>
                {/* Add row if needed */}
                {customersList.map((customer) => (
                    <Customer key={customer.id} customer={customer} />
                ))}
            </>
        ) : (
            <Loader />
        )
            }
    </>

  )
}

export default Customers