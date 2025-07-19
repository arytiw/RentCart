import { FaHome } from 'react-icons/fa';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-400 via-yellow-200 to-purple-400">
      <div className="bg-white bg-opacity-80 rounded-3xl shadow-2xl p-12 flex flex-col items-center">
        <div className="text-7xl font-extrabold text-pink-500 mb-4 drop-shadow-lg">404</div>
        <div className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">Oops! Page Not Found</div>
        <p className="text-gray-500 mb-8 text-center max-w-xs">The page you are looking for does not exist or has been moved.</p>
        <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white font-semibold rounded-full shadow hover:bg-pink-400 transition">
          <FaHome className="text-xl" /> Go Home
        </a>
      </div>
    </div>
  );
}

export default NotFound;
