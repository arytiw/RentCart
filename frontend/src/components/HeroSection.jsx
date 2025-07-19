import { FiArrowRight } from 'react-icons/fi';

function HeroSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24 flex flex-col items-center text-center shadow-sm">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4 font-sans">Rent. Earn. Explore.</h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto font-sans">
        List your items or rent from others – easy, fast, secure.
      </p>
      <a
        href="#featured"
        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full shadow hover:bg-blue-700 transition font-sans"
      >
        Start Exploring <FiArrowRight className="text-2xl" />
      </a>
    </section>
  );
}

export default HeroSection;
