import { Container, Row, Col } from 'react-bootstrap';

function FooterSection() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={3}>
            <h5>Company</h5>
            <ul className="list-unstyled">
              <li>About Us</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </Col>
          <Col md={3}>
            <h5>Help</h5>
            <ul className="list-unstyled">
              <li>Contact</li>
              <li>FAQs</li>
              <li>Return Policy</li>
            </ul>
          </Col>
          <Col md={3}>
            <h5>Legal</h5>
            <ul className="list-unstyled">
              <li>Privacy Policy</li>
              <li>Terms of Use</li>
            </ul>
          </Col>
          <Col md={3}>
            <h5>Follow Us</h5>
            <div>🔵 🟣 🔴 🟢</div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default FooterSection;