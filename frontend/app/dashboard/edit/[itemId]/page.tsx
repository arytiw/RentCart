import Container from "@/app/components/Container";
import EmptyState from "@/app/components/EmptyState";
import Heading from "@/app/components/Heading";
import ClientOnly from "@/app/components/ClientOnly";
import EditItemClient from "./EditItemClient";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getItemById from "@/app/actions/getItemById";

interface IParams {
  itemId?: string;
}

const EditItemPage = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login to edit items" />
      </ClientOnly>
    );
  }

  const item = await getItemById(params.itemId!);

  if (!item) {
    return (
      <ClientOnly>
        <EmptyState title="Item not found" subtitle="The item you're looking for doesn't exist" />
      </ClientOnly>
    );
  }

  // Check if user owns the item
  if (item.userId !== currentUser.email) {
    return (
      <ClientOnly>
        <EmptyState title="Not authorized" subtitle="You can only edit your own items" />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Container>
        <div className="pt-24 pb-10">
          <Heading
            title="Edit Item"
            subtitle="Update your item details"
          />
        </div>
        <EditItemClient 
          item={item} 
          currentUser={currentUser} 
        />
      </Container>
    </ClientOnly>
  );
};

export default EditItemPage; 