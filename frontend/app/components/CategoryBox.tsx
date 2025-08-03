'use client';

import qs from 'query-string';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { IconType } from 'react-icons';

interface CategoryBoxProps {
  icon: IconType,
  label: string;
  selected?: boolean;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({
  icon: Icon,
  label,
  selected,
}) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    let currentQuery = {};
    
    if (params) {
      currentQuery = qs.parse(params.toString())
    }

    const updatedQuery: any = {
      ...currentQuery,
      category: label
    }

    if (params?.get('category') === label) {
      delete updatedQuery.category;
    }

    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery
    }, { skipNull: true });

    router.push(url);
  }, [label, router, params]);

  return ( 
    <div
      onClick={handleClick}
      className={`
        flex 
        flex-col 
        items-center 
        justify-center 
        gap-3
        p-4
        border-b-2
        hover:text-alibaba-orange
        hover:border-b-alibaba-orange
        transition-all
        duration-200
        cursor-pointer
        transform
        hover:scale-105
        ${selected ? 'border-b-alibaba-orange text-alibaba-orange' : 'border-transparent text-alibaba-gray-500'}
      `}
    >
      <Icon size={28} className={`${selected ? 'text-alibaba-orange' : 'text-alibaba-gray-500'}`} />
      <div className="font-semibold text-sm">
        {label}
      </div>
    </div>
   );
}
 
export default CategoryBox;