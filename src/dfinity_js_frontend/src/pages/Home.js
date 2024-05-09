import React from 'react'
import { login } from '../utils/auth';
import { Container } from 'react-bootstrap';
import Cover from '../components/utils/Cover';
import { Notification } from '../components/utils/Notifications';
import coverImg from '../assets/img/sandwich.jpg';
import Customers from '../components/customers/Customers';

const Home = () => {
    const isAuthenticated = window.auth.isAuthenticated;

    return (
        <>
        <Notification />
        {isAuthenticated ? (
          <Container fluid="md">
            <main>
              <Customers />
            </main>
          </Container>
        ) : (
          <Cover name="Street Food" login={login} coverImg={coverImg} />
        )}
      </>
    )
}

export default Home