
// import { Container, Button, Row, Col, Card, Navbar, Nav } from 'react-bootstrap';

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
