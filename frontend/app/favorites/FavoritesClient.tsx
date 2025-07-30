"use client";

import { useState, useEffect } from "react";
import { SafeListing, SafeUser } from "@/app/types";

import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import { useUser } from '@/app/providers/UserProvider';

interface FavoritesClientProps {
  listings: SafeListing[],
  currentUser?: SafeUser | null,
}

const FavoritesClient: React.FC<FavoritesClientProps> = ({
  listings: initialListings
}) => {
  const { user: currentUser } = useUser();
  const [filteredListings, setFilteredListings] = useState<SafeListing[]>(initialListings);

  useEffect(() => {
    // Filter listings based on localStorage favorites
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        try {
          const favoriteIds = JSON.parse(storedFavorites);
          const userFavoriteIds = currentUser?.favoriteIds || [];
          const allFavoriteIds = Array.from(new Set([...userFavoriteIds, ...favoriteIds]));
          
          const filtered = initialListings.filter((listing: SafeListing) => 
            allFavoriteIds.includes(listing.id)
          );
          setFilteredListings(filtered);
        } catch (error) {
          console.error('Error parsing favorites from localStorage:', error);
          setFilteredListings(initialListings);
        }
      } else {
        // Fall back to user's favoriteIds
        const userFavoriteIds = currentUser?.favoriteIds || [];
        const filtered = initialListings.filter((listing: SafeListing) => 
          userFavoriteIds.includes(listing.id)
        );
        setFilteredListings(filtered);
      }
    }
  }, [initialListings, currentUser]);

  return (
    <Container>
      <Heading
        title="Favorites"
        subtitle="List of places you favorited!"
      />
      <div 
        className="
          mt-10
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {filteredListings.map((listing: SafeListing) => (
          <ListingCard
            currentUser={currentUser as SafeUser}
            key={listing.id}
            data={listing}
          />
        ))}
      </div>
    </Container>
   );
}
 
export default FavoritesClient;