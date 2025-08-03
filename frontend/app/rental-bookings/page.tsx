import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getMyListedItems from "@/app/actions/getMyListedItems";
import { SafeUser } from "@/app/types";

import RentalBookingsClient from "./RentalBookingsClient";

const RentalBookingsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login" />
      </ClientOnly>
    );
  }

  const myListedItems = await getMyListedItems({ userId: currentUser.emailId });

  if (myListedItems.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No listed items found"
          subtitle="You haven't listed any items yet. Start by listing your first item!"
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <RentalBookingsClient 
        items={myListedItems} 
        currentUser={currentUser as unknown as SafeUser} 
      />
    </ClientOnly>
  );
};

export default RentalBookingsPage; 