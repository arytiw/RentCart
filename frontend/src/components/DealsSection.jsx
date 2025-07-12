import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const products = [
  { title: 'Canon DSLR', price: '$20/day', img: '/images/product1.jpg' },
  { title: 'Electric Drill', price: '$10/day', img: '/images/product2.jpg' },
  { title: 'Sofa Set', price: '$25/day', img: '/images/product3.jpg' },
];

function DealsSection() {
  return (
    <Container className="py-5">
      <h2 className="text-center mb-4 fw-bold text-dark">Hot Deals</h2>
      <Row className="g-4">
        {products.map((product, idx) => (
          <Col key={idx} xs={12} md={4}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Img variant="top" src={product.img} style={{ height: '200px', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>{product.price}</Card.Text>
                <Button variant="warning">Rent Now</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default DealsSection;