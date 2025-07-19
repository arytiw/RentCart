import { FiCpu, FiTool, FiTruck, FiHome } from 'react-icons/fi';

const categories = [
  { icon: <FiCpu className="text-sky-500 text-3xl" />, label: 'Electronics' },
  { icon: <FiTool className="text-sky-500 text-3xl" />, label: 'Tools' },
  { icon: <FiTruck className="text-sky-500 text-3xl" />, label: 'Vehicles' },
  { icon: <FiHome className="text-sky-500 text-3xl" />, label: 'Furniture' },
];

function CategoriesSection() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-8 font-sans text-center">Top Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-[#F5F7FA] rounded-2xl shadow hover:shadow-lg transition p-6 flex flex-col items-center text-center border border-gray-100 hover:-translate-y-1 cursor-pointer"
            >
              <div className="mb-3">{cat.icon}</div>
              <div className="font-semibold text-lg text-gray-900 font-sans">{cat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
