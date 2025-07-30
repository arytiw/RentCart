import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import { SafeUser } from "@/app/types";

interface IUseFavorite {
  listingId: string;
  currentUser?: SafeUser | null
}

const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  const router = useRouter();
  const [localFavorites, setLocalFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('favorites');
      if (stored) {
        try {
          setLocalFavorites(JSON.parse(stored));
        } catch (error) {
          console.error('Error parsing favorites from localStorage:', error);
          setLocalFavorites([]);
        }
      }
    }
  }, []);

  const hasFavorited = useMemo(() => {
    // Check both user's favoriteIds and localStorage
    const userFavorites = currentUser?.favoriteIds || [];
    return userFavorites.includes(listingId) || localFavorites.includes(listingId);
  }, [currentUser, listingId, localFavorites]);

  const toggleFavorite = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    try {
      // Update localStorage immediately for instant feedback
      const newLocalFavorites = hasFavorited 
        ? localFavorites.filter(id => id !== listingId)
        : [...localFavorites, listingId];
      
      setLocalFavorites(newLocalFavorites);
      localStorage.setItem('favorites', JSON.stringify(newLocalFavorites));

      // Make API call in background
      let request;
      if (hasFavorited) {
        request = () => axios.delete(`/api/favorites/${listingId}`);
        toast.success('Removed from favorites');
      } else {
        request = () => axios.post(`/api/favorites/${listingId}`);
        toast.success('Added to favorites');
      }

      await request();
      
    } catch (error) {
      // Revert localStorage on API error
      setLocalFavorites(localFavorites);
      localStorage.setItem('favorites', JSON.stringify(localFavorites));
      toast.error('Something went wrong.');
      console.error('Favorite toggle error:', error);
    }
  }, 
  [
    currentUser, 
    hasFavorited, 
    listingId, 
    router,
    localFavorites
  ]);

  return {
    hasFavorited,
    toggleFavorite,
  }
}

export default useFavorite;
