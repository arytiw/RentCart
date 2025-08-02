import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import EmptyState from "@/app/components/EmptyState";
import Heading from "@/app/components/Heading";

import getListings from "@/app/actions/getListings";
import getCurrentUser from "@/app/actions/getCurrentUser";
import ClientOnly from "../components/ClientOnly";

interface ItemsPageProps {
  searchParams: {
    category?: string;
    query?: string;
  };
}

const ItemsPage = async ({ searchParams }: ItemsPageProps) => {
  const listings = await getListings();
  const currentUser = await getCurrentUser();

  if (!listings || listings.length === 0) {
    return (
      <ClientOnly>
        <Container>
          <div className="pt-24 pb-10">
            <Heading
              title="No Items Available"
              subtitle="There are currently no items available for rent."
            />
          </div>
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Be the first to list an item!</h3>
              <p className="text-gray-500 mb-8">Start earning by listing your items for rent.</p>
              <a
                href="/dashboard"
                className="bg-alibaba-orange text-white px-8 py-3 rounded-xl font-semibold hover:bg-alibaba-orange-dark transition-colors"
              >
                List Your First Item
              </a>
            </div>
          </div>
        </Container>
      </ClientOnly>
    );
  }

  // Filter items based on search params
  let filteredItems = listings;

  if (searchParams.category) {
    filteredItems = listings.filter((item: any) => 
      item.category === searchParams.category
    );
  }

  if (searchParams.query) {
    const query = searchParams.query.toLowerCase();
    filteredItems = filteredItems.filter((item: any) =>
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query) ||
      item.locationValue?.toLowerCase().includes(query)
    );
  }

  return (
    <ClientOnly>
      <Container>
        <div className="pt-24 pb-10">
          <Heading
            title={searchParams.category ? `${searchParams.category} Items` : "All Available Items"}
            subtitle={searchParams.category ? `Find ${searchParams.category.toLowerCase()} items to rent` : "Find the perfect item to rent for your needs"}
          />
          {searchParams.category && (
            <div className="mt-4">
              <a
                href="/items"
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-alibaba-orange 
                  hover:text-alibaba-orange-dark 
                  font-semibold
                  px-4
                  py-2
                  rounded-lg
                  hover:bg-alibaba-orange/10
                  transition-all
                  duration-200
                  border-2
                  border-transparent
                  hover:border-alibaba-orange/20
                "
              >
                ← Back to all items
              </a>
            </div>
          )}
        </div>
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
          {filteredItems.map((item: any) => (
            <ListingCard
              currentUser={currentUser}
              key={item.id}
              data={{
                ...item,
                imageSrc: item.imageSrc || '/images/placeholder.jpg',
                locationValue: item.locationValue || '',
              }}
            />
          ))}
        </div>
      </Container>
    </ClientOnly>
  )
}

export default ItemsPage; 