import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import EmptyState from "@/app/components/EmptyState";
import CategoriesSection from "@/app/components/CategoriesSection";

import getListings from "@/app/actions/getListings";
import getCurrentUser from "@/app/actions/getCurrentUser";
import ClientOnly from "./components/ClientOnly";

const Home = async () => {
  console.log("Home page: Starting to fetch data...");
  const listings = await getListings();
  console.log("Home page: Fetched listings:", listings?.length || 0);
  const currentUser = await getCurrentUser();
  console.log("Home page: Fetched current user:", currentUser?.email);

  if (!listings || listings.length === 0) {
    console.log("Home page: No listings found, showing empty state");
    return (
      <ClientOnly>
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-alibaba-black mb-4">No Items Available</h1>
            <p className="text-alibaba-gray-600 mb-8">There are currently no items available for rent.</p>
            <a
              href="/dashboard"
              className="bg-alibaba-orange text-white px-8 py-3 rounded-xl font-semibold hover:bg-alibaba-orange-dark transition-colors"
            >
              List Your First Item
            </a>
          </div>
        </div>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      {/* Enhanced Background with Cream Background */}
      <div className="relative min-h-screen">
        {/* Main Cream Background */}
        <div className="absolute inset-0 bg-[#FDFBF7]"></div>
        

        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,106,0,0.03)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        
        <Container>
          {/* Enhanced Hero Section - Fixed navbar overlap issue */}
          <div className="pt-10 pb-16 relative z-0">
            <div className="text-center relative">
              {/* Decorative Background Elements */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-10 w-32 h-32 bg-alibaba-orange/10 rounded-full blur-3xl"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-alibaba-orange/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-alibaba-orange/8 rounded-full blur-3xl"></div>
              </div>
              
              {/* Main Content */}
              <div className="relative z-0">
                {/* Enhanced Title with Decorative Elements */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 h-1 bg-gradient-to-r from-transparent to-alibaba-orange rounded-full"></div>
                  <h1 className="text-5xl font-bold text-alibaba-black">
                    Welcome to RentCart
                  </h1>
                  <div className="w-16 h-1 bg-gradient-to-l from-transparent to-alibaba-orange rounded-full"></div>
                </div>
                
                {/* Enhanced Subtitle */}
                <p className="text-xl text-alibaba-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Discover a world of possibilities. Rent anything you need, or list your items for others to rent. 
                  <span className="text-alibaba-orange font-semibold"> Quality guaranteed, instant booking.</span>
                </p>
                
                {/* Enhanced Call to Action Section */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                  <a
                    href="/items"
                    className="
                      bg-alibaba-orange 
                      text-white 
                      px-10 
                      py-4 
                      rounded-xl 
                      font-semibold 
                      text-lg
                      hover:bg-alibaba-orange-dark 
                      hover:shadow-xl
                      transform
                      hover:scale-105
                      transition-all
                      duration-300
                      border-2
                      border-alibaba-orange
                      shadow-lg
                      relative
                      overflow-hidden
                      group
                    "
                  >
                    <span className="relative z-10">Browse All Items</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-alibaba-orange-dark to-alibaba-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                  
                  <a
                    href="/dashboard"
                    className="
                      bg-alibaba-black 
                      text-alibaba-white
                      px-10 
                      py-4 
                      rounded-xl 
                      font-semibold 
                      text-lg
                      hover:bg-alibaba-black-50 
                      hover:shadow-xl
                      transform
                      hover:scale-105
                      transition-all
                      duration-300
                      border-2
                      border-alibaba-gray-300
                      shadow-lg
                    "
                  >
                    List Your Items
                  </a>
                </div>
                
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-alibaba-gray-100">
                    <div className="text-3xl font-bold text-alibaba-orange mb-2">{listings.length}+</div>
                    <div className="text-alibaba-gray-600 font-medium">Items Available</div>
                  </div>
                  <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-alibaba-gray-100">
                    <div className="text-3xl font-bold text-alibaba-orange mb-2">24/7</div>
                    <div className="text-alibaba-gray-600 font-medium">Instant Booking</div>
                  </div>
                  <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-alibaba-gray-100">
                    <div className="text-3xl font-bold text-alibaba-orange mb-2">100%</div>
                    <div className="text-alibaba-gray-600 font-medium">Verified Items</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Categories Section */}
          <div className="py-16 bg-white/60 backdrop-blur-sm rounded-3xl mb-16 relative z-0 shadow-xl border border-white/50">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-1 bg-alibaba-orange rounded-full"></div>
                <h2 className="text-3xl font-bold text-alibaba-black">
                  Browse by Category
                </h2>
                <div className="w-12 h-1 bg-alibaba-orange rounded-full"></div>
              </div>
              <p className="text-lg text-alibaba-gray-600 max-w-2xl mx-auto">
                Find exactly what you're looking for in our carefully curated categories
              </p>
            </div>
            <CategoriesSection />
          </div>

          <div className="pt-8 pb-20 relative z-0">
            {/* Enhanced Featured Items Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-1 bg-alibaba-orange rounded-full"></div>
                <h2 className="text-3xl font-bold text-alibaba-black">
                  Featured Items
                </h2>
                <div className="w-12 h-1 bg-alibaba-orange rounded-full"></div>
              </div>
              <p className="text-lg text-alibaba-gray-600 max-w-2xl mx-auto">
                Discover amazing items available for rent. Premium quality, instant booking, and exceptional service.
              </p>
            </div>
            
            {/* Gray Box Container for Featured Items */}
            <div className="
              bg-white/80 backdrop-blur-sm
              rounded-3xl
              p-8
              shadow-xl
              border
              border-white/50
            ">
              {/* Container Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-alibaba-orange rounded-full"></div>
                  <h3 className="text-xl font-bold text-alibaba-black">
                    Available Items
                  </h3>
                  <span className="text-sm text-alibaba-gray-600 bg-white/80 px-3 py-1 rounded-full border border-alibaba-gray-200">
                    {listings.length} items
                  </span>
                </div>
                <div className="text-sm text-alibaba-gray-600">
                  Premium Selection
                </div>
              </div>
              
              {/* Enhanced Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {listings.map((listing: any) => (
                  <ListingCard
                    currentUser={currentUser}
                    key={listing.id}
                    data={listing}
                  />
                ))}
              </div>
              
              {/* Container Footer */}
              <div className="mt-8 pt-6 border-t border-alibaba-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-alibaba-gray-600">
                    All items are verified and ready for instant booking
                  </div>
                  <a
                    href="/items"
                    className="
                      text-alibaba-orange 
                      font-semibold 
                      hover:text-alibaba-orange-dark 
                      transition-colors 
                      duration-200
                      flex items-center gap-2
                    "
                  >
                    View All Items
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </ClientOnly>
  );
}

export default Home;
