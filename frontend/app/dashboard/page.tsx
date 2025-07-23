import Container from "@/app/components/Container";
import EmptyState from "@/app/components/EmptyState";
import Heading from "@/app/components/Heading";
import ClientOnly from "@/app/components/ClientOnly";
import DashboardClient from "./DashboardClient";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getUserItems from "@/app/actions/getUserItems";

const DashboardPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Please login to access your dashboard" />
      </ClientOnly>
    );
  }

  const userItems = await getUserItems(currentUser.email!);

  return (
    <ClientOnly>
      <Container>
        <div className="pt-24 pb-10">
          <Heading
            title="My Dashboard"
            subtitle="Manage your listed items"
          />
        </div>
        <DashboardClient 
          items={userItems} 
          currentUser={currentUser} 
        />
      </Container>
    </ClientOnly>
  );
};

export default DashboardPage; 