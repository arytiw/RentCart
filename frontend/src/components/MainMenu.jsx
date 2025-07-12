import { Nav } from 'react-bootstrap';

function MainMenu() {
  return (
    <Nav fill variant="tabs" className="bg-white border-top border-bottom py-2">
      {["Cars", "Cameras", "Electronics", "Furniture", "Tools", "Dresses"].map((item, idx) => (
        <Nav.Item key={idx}>
          <Nav.Link href="#">{item}</Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}

export default MainMenu;