// Custom types for our microservices architecture
export interface User {
  id: string;
  email: string;
  emailId: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  emailVerified?: string;
  favoriteIds: string[];
  hashedPassword?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  createdAt: string;
  category: string;
  itemCount: number;
  locationValue: string;
  userId: string;
  price: number;
  type?: string;
  available?: boolean;
  rating?: number;
  securityDeposit?: number;
  usagePolicy?: string;
  features?: string[];
  quantity?: number;
  images?: string[];
  location?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  listingId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  createdAt: string;
  listing?: Listing;
  user?: User;
}

export type SafeListing = Omit<Listing, "createdAt"> & {
  createdAt: string;
};

export type SafeReservation = Omit<
  Reservation, 
  "createdAt" | "startDate" | "endDate" | "listing" | "user"
> & {
  createdAt: string;
  startDate: string;
  endDate: string;
  listing: SafeListing;
  user: SafeUser;
};

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export interface Review {
  id: string;
  itemId: string;
  userId: string;
  comment: string;
  rating: number;
  timestamp: number;
  userName?: string; // Optional field for display purposes
}
