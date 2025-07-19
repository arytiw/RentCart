function FooterSection() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-12 font-sans">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex gap-6 flex-wrap justify-center md:justify-start mb-2 md:mb-0">
          <a href="#" className="text-gray-600 hover:text-blue-600 transition font-medium">About</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition font-medium">Contact</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition font-medium">Privacy Policy</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition font-medium">Terms & Conditions</a>
        </div>
        <div className="text-gray-400 text-sm text-center md:text-right">
          © {new Date().getFullYear()} RentCart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default FooterSection;
