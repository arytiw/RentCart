// src/components/TopNavbar.jsx
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useState } from 'react';


import AuthModal from '../pages/Auth/AuthModel';

function TopNavbar() {
    const [showModal, setShowModal] = useState(false);

  return (
    <>
     <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#" className="fw-bold text-danger">RentCart</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="#">Orders</Nav.Link>
              <Nav.Link href="#">Cart</Nav.Link>
              <Nav.Link onClick={() => setShowModal(true)}>Login</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AuthModal show={showModal} handleClose={() => setShowModal(false)} />
    </>
  );
}

export default TopNavbar;