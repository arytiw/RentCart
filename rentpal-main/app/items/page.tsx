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
  };
}

const ItemsPage = async ({ searchParams }: ItemsPageProps) => {
  const items = await getListings();
  const currentUser = await getCurrentUser();
  
  // Filter items by category if specified
  const filteredItems = searchParams.category 
    ? items.filter((item: any) => item.category === searchParams.category)
    : items;

  if (!filteredItems || filteredItems.length === 0) {
    return (
      <ClientOnly>
        <EmptyState 
          title={searchParams.category ? `No items found in ${searchParams.category}` : "No items found"}
          subtitle={searchParams.category ? "Try browsing other categories" : "Be the first to list an item!"}
          showReset 
        />
      </ClientOnly>
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
                className="text-rose-500 hover:text-rose-600 font-medium"
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