import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import Heading from "@/app/components/Heading";
import ItemsFilter from "@/app/components/ItemsFilter";

import getListings from "@/app/actions/getListings";
import getCurrentUser from "@/app/actions/getCurrentUser";
import ClientOnly from "../components/ClientOnly";
import { FiArrowLeft } from "react-icons/fi";

interface ItemsPageProps {
  searchParams: {
    category?: string;
    query?: string;
    maxPrice?: string;
    location?: string;
  };
}

const ItemsPage = async ({ searchParams }: ItemsPageProps) => {
  const listings = await getListings();
  const currentUser = await getCurrentUser();

  if (!listings || listings.length === 0) {
    return (
      <ClientOnly>
        <Container>
          <div className="pt-16 pb-10">
            <Heading
              title="No items available"
              subtitle="There are currently no items available for rent."
              eyebrow="Browse"
            />
          </div>
          <div className="text-center py-16">
            <p className="text-ink-500 mb-6">Start earning by listing your items.</p>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-full font-semibold hover:bg-brand-600 transition-all"
            >
              List your first item
            </a>
          </div>
        </Container>
      </ClientOnly>
    );
  }

  let filteredItems = listings;

  if (searchParams.category) {
    filteredItems = filteredItems.filter((item: any) => {
      if (Array.isArray(item.category)) return item.category.includes(searchParams.category);
      return item.category === searchParams.category;
    });
  }
  if (searchParams.maxPrice) {
    const maxPrice = parseInt(searchParams.maxPrice);
    filteredItems = filteredItems.filter((item: any) => item.price <= maxPrice);
  }
  if (searchParams.location) {
    filteredItems = filteredItems.filter((item: any) =>
      item.locationValue?.toLowerCase().includes(searchParams.location?.toLowerCase())
    );
  }
  if (searchParams.query) {
    const query = searchParams.query.toLowerCase();
    filteredItems = filteredItems.filter((item: any) => {
      const categoryMatch = Array.isArray(item.category)
        ? item.category.some((cat: string) => cat.toLowerCase().includes(query))
        : item.category?.toLowerCase().includes(query);
      return (
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        categoryMatch ||
        item.locationValue?.toLowerCase().includes(query)
      );
    });
  }

  const locations = [...new Set(listings.map((item: any) => item.locationValue).filter(Boolean))];

  return (
    <ClientOnly>
      <Container>
        <div className="pt-12 pb-6" data-testid="items-page-header">
          <Heading
            title={searchParams.category ? `${searchParams.category}` : "Browse all items"}
            subtitle={
              searchParams.category
                ? `Quality ${searchParams.category.toLowerCase()} from verified owners`
                : "Find the perfect item to rent — verified, instant, and secure."
            }
            eyebrow={searchParams.query ? `Results for "${searchParams.query}"` : "Marketplace"}
          />

          <ItemsFilter locations={locations as string[]} />

          {searchParams.category && (
            <div className="mt-5">
              <a
                href="/items"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-600 transition-colors"
              >
                <FiArrowLeft size={14} />
                Back to all items
              </a>
            </div>
          )}
        </div>

        <div className="pt-2 pb-20">
          {/* Result summary */}
          <p className="text-xs uppercase tracking-wider text-ink-400 font-semibold mb-5">
            {filteredItems.length} {filteredItems.length === 1 ? "result" : "results"}
          </p>

          {filteredItems.length === 0 ? (
            <div className="rounded-3xl border border-ink-100 bg-white p-12 text-center">
              <h3 className="font-display font-semibold text-2xl text-ink mb-2">
                No matches.
              </h3>
              <p className="text-ink-500 mb-6">Try removing some filters or searching for something else.</p>
              <a
                href="/items"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-white rounded-full text-sm font-semibold hover:bg-ink-800 transition-all"
              >
                Clear filters
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6">
              {filteredItems.map((item: any, idx: number) => (
                <div
                  key={item.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(idx, 10) * 30}ms` }}
                >
                  <ListingCard
                    currentUser={currentUser}
                    data={{
                      ...item,
                      imageSrc: item.imageSrc || "/images/placeholder.jpg",
                      locationValue: item.locationValue || "",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </ClientOnly>
  );
};

export default ItemsPage;
