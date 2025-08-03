'use client';

import Image from "next/image";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";

import Heading from "../Heading";


interface ListingHeadProps {
  title: string;
  locationValue: string;
  imageSrc: string;
  id: string;
  currentUser?: SafeUser | null
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  locationValue,
  imageSrc,
  id,
  currentUser
}) => {
  const { getByValue } = useCountries();

  // Handle location display - use direct location string if available
  const locationDisplay = locationValue || "Location not specified";

  return ( 
    <>
      <Heading
        title={title}
        subtitle={locationDisplay}
      />
      <div className="
          w-full
          h-[60vh]
          overflow-hidden 
          rounded-xl
          relative
        "
      >
        <Image
          src={imageSrc}
          fill
          alt="Image"
          className="object-contain h-auto w-full"
        />

      </div>
    </>
   );
}
 
export default ListingHead;