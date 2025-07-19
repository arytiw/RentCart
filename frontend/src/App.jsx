import TopNavBar from './components/TopNavBar';
import HeroSection from './components/HeroSection';
import FeaturedItems from './components/FeaturedItems';
import CategoriesSection from './components/CategoriesSection';
import TestimonialsSection from './components/TestimonialsSection';
import FooterSection from './components/FooterSection';

function App() {
  return (
    <div className="bg-[#F5F7FA] min-h-screen font-sans">
      <TopNavBar />
      <HeroSection />
      <FeaturedItems />
      <CategoriesSection />
      <TestimonialsSection />
      <FooterSection />
    </div>
  );
}

export default App;
