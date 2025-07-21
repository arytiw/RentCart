"use client";

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { SafeUser } from "@/app/types";
import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import Button from "@/app/components/Button";
import useRentModal from "@/app/hooks/useRentModal";

interface DashboardClientProps {
  items: any[];
  currentUser?: SafeUser | null;
}

const DashboardClient: React.FC<DashboardClientProps> = ({
  items,
  currentUser
}) => {
  const router = useRouter();
  const rentModal = useRentModal();
  const [deletingId, setDeletingId] = useState('');

  const onDelete = useCallback((id: string) => {
    setDeletingId(id);

    axios.delete(`/api/items/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
      .then(() => {
        toast.success('Item deleted successfully');
        router.refresh();
      })
      .catch(() => {
        toast.error('Something went wrong.')
      })
      .finally(() => {
        setDeletingId('');
      })
  }, [router]);

  const onEdit = useCallback((id: string) => {
    router.push(`/dashboard/edit/${id}`);
  }, [router]);

  const onToggleAvailability = useCallback((id: string, currentStatus: boolean) => {
    axios.put(`/api/items/${id}`, {
      available: !currentStatus
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
      .then(() => {
        toast.success(`Item ${!currentStatus ? 'made available' : 'made unavailable'}`);
        router.refresh();
      })
      .catch(() => {
        toast.error('Something went wrong.')
      })
  }, [router]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Heading
          title="No items listed yet"
          subtitle="Start by listing your first item!"
        />
        <div className="mt-6">
          <Button
            label="List Your First Item"
            onClick={rentModal.onOpen}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <Heading
          title="My Listed Items"
          subtitle={`You have ${items.length} item${items.length !== 1 ? 's' : ''} listed`}
        />
        <Button
          label="Add New Item"
          onClick={rentModal.onOpen}
        />
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
        {items.map((item: any) => (
          <div key={item.id} className="relative">
            <ListingCard
              data={item}
              currentUser={currentUser}
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Button
                small
                label="Edit"
                onClick={() => onEdit(item.id)}
                outline
              />
              <Button
                small
                label={item.available ? "Make Unavailable" : "Make Available"}
                onClick={() => onToggleAvailability(item.id, item.available)}
                outline
              />
              <Button
                small
                label="Delete"
                onClick={() => onDelete(item.id)}
                disabled={deletingId === item.id}
                outline
              />
            </div>
            <div className="absolute top-4 right-4">
              <div className={`
                px-2 py-1 rounded-full text-xs font-semibold
                ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
              `}>
                {item.available ? 'Available' : 'Unavailable'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardClient; 