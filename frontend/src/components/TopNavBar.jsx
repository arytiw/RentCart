import { useState } from 'react';
import { FiMenu, FiX, FiShoppingCart } from 'react-icons/fi';

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Categories', href: '#' },
  { label: 'Orders', href: '#' },
  { label: 'Cart', href: '#' },
  { label: 'Reviews', href: '#' },
];

function TopNavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-100 font-sans">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 text-2xl font-extrabold text-blue-600">
          <FiShoppingCart className="text-3xl text-blue-500" /> RentCart
        </a>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <a key={link.label} href={link.href} className="text-gray-700 font-medium hover:text-blue-600 transition px-2 py-1 rounded">
              {link.label}
            </a>
          ))}
          <button
            className="ml-2 px-5 py-2 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition"
          >
            Login / Signup
          </button>
        </div>
        {/* Mobile menu button */}
        <button className="md:hidden text-3xl text-blue-600" onClick={() => setMobileOpen(o => !o)}>
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 flex flex-col gap-3">
          {navLinks.map(link => (
            <a key={link.label} href={link.href} className="text-gray-700 font-medium hover:text-blue-600 transition px-2 py-1 rounded">
              {link.label}
            </a>
          ))}
          <button
            className="mt-2 px-5 py-2 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition"
          >
            Login / Signup
          </button>
        </div>
      )}
    </nav>
  );
}

export default TopNavBar;