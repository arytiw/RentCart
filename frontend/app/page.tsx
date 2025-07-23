import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import EmptyState from "@/app/components/EmptyState";
import CategoriesSection from "@/app/components/CategoriesSection";

import getListings from "@/app/actions/getListings";
import getCurrentUser from "@/app/actions/getCurrentUser";
import ClientOnly from "./components/ClientOnly";

const Home = async () => {
  const listings = await getListings();
  const currentUser = await getCurrentUser();

  if (!listings || listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Container>
        <div className="pt-24 pb-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to RentCart
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Rent anything you need, or list your items for others to rent
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/items"
                className="
                  bg-rose-500 
                  text-white 
                  px-6 
                  py-3 
                  rounded-lg 
                  font-semibold 
                  hover:bg-rose-600 
                  transition
                "
              >
                Browse All Items
              </a>
            </div>
          </div>
        </div>
        
        {/* Categories Section */}
        <CategoriesSection />

        <div 
          className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-6
            gap-8
            pb-20
          "
        >
          {listings.slice(0, 6).map((listing: any) => (
            <ListingCard
              currentUser={currentUser}
              key={listing.id}
              data={{
                ...listing,
                imageSrc: listing.imageSrc || '/images/placeholder.jpg',
                locationValue: listing.locationValue || '',
              }}
            />
          ))}
        </div>
        {listings.length > 6 && (
          <div className="text-center pb-20">
            <a
              href="/items"
              className="
                bg-white 
                text-rose-500 
                border-2 
                border-rose-500 
                px-6 
                py-3 
                rounded-lg 
                font-semibold 
                hover:bg-rose-50 
                transition
              "
            >
              View All Items
            </a>
          </div>
        )}
      </Container>
    </ClientOnly>
  )
}

export default Home;
