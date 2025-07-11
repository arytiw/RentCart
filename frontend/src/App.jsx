import { useState } from 'react';
import './App.css'
import Home from './pages/Home';
import ReviewTest from './components/ReviewTest';

import { Container, Button, Row, Col, Card, Navbar, Nav } from 'react-bootstrap';


function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'review-test':
        return <ReviewTest />;
      default:
        return <Home />;
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand href="#home">RentCart</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                href="#home" 
                onClick={() => setCurrentPage('home')}
                className={currentPage === 'home' ? 'active' : ''}
              >
                Home
              </Nav.Link>
              <Nav.Link 
                href="#review-test" 
                onClick={() => setCurrentPage('review-test')}
                className={currentPage === 'review-test' ? 'active' : ''}
              >
                Review Test
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      {renderPage()}
    </>
  );
}

export default App;
