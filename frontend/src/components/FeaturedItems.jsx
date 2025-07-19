import { FiCamera, FiBicycle, FiCpu, FiMonitor, FiGamepad, FiTool, FiTent } from 'react-icons/fi';

const items = [
  { icon: <FiCamera className="text-blue-500 text-3xl" />, title: 'DSLR Camera', price: '₹400/day' },
  { icon: <FiBicycle className="text-blue-500 text-3xl" />, title: 'Bicycle', price: '₹120/day' },
  { icon: <FiTool className="text-blue-500 text-3xl" />, title: 'Power Drill', price: '₹90/day' },
  { icon: <FiTent className="text-blue-500 text-3xl" />, title: 'Tent', price: '₹250/day' },
  { icon: <FiCpu className="text-blue-500 text-3xl" />, title: 'Laptop', price: '₹600/day' },
  { icon: <FiGamepad className="text-blue-500 text-3xl" />, title: 'Gaming Console', price: '₹350/day' },
  { icon: <FiMonitor className="text-blue-500 text-3xl" />, title: 'Monitor', price: '₹180/day' },
];

function FeaturedItems() {
  return (
    <section id="featured" className="py-12 md:py-16 bg-[#F5F7FA]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-8 font-sans text-center">Trending Rentals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition p-6 flex flex-col items-center text-center border border-gray-100 hover:-translate-y-1 cursor-pointer"
            >
              <div className="mb-4">{item.icon}</div>
              <div className="font-semibold text-lg text-gray-900 mb-1 font-sans">{item.title}</div>
              <div className="text-blue-600 font-bold text-base font-sans">{item.price}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedItems;
