
// import { Container, Button, Row, Col, Card, Navbar, Nav } from 'react-bootstrap';


// function Home(){
//     return (
//         <>
//              {/* 🧢 Navbar */}
//       <Navbar bg="dark" variant="dark" expand="lg">
//         <Container>
//           <Navbar.Brand href="#">RentCart</Navbar.Brand>
//           <Navbar.Toggle />
//           <Navbar.Collapse className="justify-content-end">
//             <Nav>
//               <Nav.Link href="#">Home</Nav.Link>
//               <Nav.Link href="#">Browse</Nav.Link>
//               <Nav.Link href="#">Login</Nav.Link>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       {/* 🔝 Hero Section */}
//       <div style={{ backgroundColor: '#FFF3E0', padding: '4rem 0' }}>
//         <Container className="text-center">
//           <h1 className="display-4 fw-bold" style={{ color: '#FF5722' }}>
//             Rent Anything. Anytime.
//           </h1>
//           <p className="lead" style={{ color: '#212121' }}>
//             Cars, Cameras, Furniture & more — all at your fingertips.
//           </p>
//           <div className="mt-4">
//             <Button variant="primary" size="lg" style={{ backgroundColor: '#FF5722', border: 'none' }}>
//               Browse Rentals
//             </Button>{' '}
//             <Button variant="outline-dark" size="lg">
//               List Your Item
//             </Button>
//           </div>
//         </Container>
//       </div>

//       {/* 📦 Category Section */}
//       <Container className="py-5">
//         <h2 className="text-center mb-4 fw-bold" style={{ color: '#212121' }}>Top Categories</h2>
//         <Row className="g-4">
//           {[
//             { title: 'Cars', icon: '🚗' },
//             { title: 'Cameras', icon: '📷' },
//             { title: 'Furniture', icon: '🛋️' },
//             { title: 'Electronics', icon: '💻' },
//             { title: 'Tools', icon: '🔧' },
//             { title: 'Dresses', icon: '👗' },
//           ].map((category, idx) => (
//             <Col key={idx} xs={12} sm={6} md={4}>
//               <Card className="text-center h-100 shadow-sm">
//                 <Card.Body>
//                   <div style={{ fontSize: '3rem' }}>{category.icon}</div>
//                   <Card.Title className="mt-3 fw-semibold">{category.title}</Card.Title>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </Container>
//         </>
//     );
// }

// export default Home;



import TopNavbar from '../components/TopNavBar';
import MainMenu from '../components/MainMenu';
import HeroBanner from '../components/HeroBanner';
import CategorySection from '../components/CateogrySection';
import DealsSection from '../components/DealsSection';
import FooterSection from '../components/FooterSection';

function Home() {
  return (
    <>
      <TopNavbar />
      <MainMenu />
      <HeroBanner />
      <CategorySection />
      <DealsSection />
      <FooterSection />
    </>
  );
}

export default Home;
