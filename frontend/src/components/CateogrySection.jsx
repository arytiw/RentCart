import { Container, Row, Col, Card } from 'react-bootstrap';

const categories = [
  { title: 'Cars', icon: '🚗' },
  { title: 'Cameras', icon: '📷' },
  { title: 'Furniture', icon: '🛋️' },
  { title: 'Electronics', icon: '💻' },
  { title: 'Tools', icon: '🔧' },
  { title: 'Dresses', icon: '👗' },
];

function CategorySection() {
  return (
    <Container className="py-5">
      <h2 className="text-center mb-4 fw-bold text-dark">Top Categories</h2>
      <Row className="g-4">
        {categories.map((category, idx) => (
          <Col key={idx} xs={12} sm={6} md={4}>
            <Card className="text-center h-100 shadow-sm border-0">
              <Card.Body>
                <div style={{ fontSize: '3rem' }}>{category.icon}</div>
                <Card.Title className="mt-3 fw-semibold">{category.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CategorySection;