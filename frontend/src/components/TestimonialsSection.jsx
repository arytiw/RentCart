import { FiStar } from 'react-icons/fi';

const testimonials = [
  {
    name: 'Amit S.',
    text: 'RentCart made it so easy to rent out my camera. Super fast and safe! Highly recommended.',
    rating: 5,
  },
  {
    name: 'Priya D.',
    text: 'I found a laptop for my project at half the price. The process was smooth and secure.',
    rating: 5,
  },
  {
    name: 'Rahul K.',
    text: 'Great platform for both owners and renters. The support team is very responsive.',
    rating: 4,
  },
];

function TestimonialsSection() {
  return (
    <section className="py-12 md:py-16 bg-[#F5F7FA]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-8 font-sans text-center">What Users Say</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 flex flex-col items-center text-center border border-gray-100 hover:-translate-y-1 max-w-xs"
            >
              <div className="flex gap-1 mb-2">
                {[...Array(t.rating)].map((_, i) => (
                  <FiStar key={i} className="text-yellow-400 text-lg" />
                ))}
              </div>
              <div className="text-gray-700 italic mb-3 font-sans">“{t.text}”</div>
              <div className="font-semibold text-blue-700 font-sans">{t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
