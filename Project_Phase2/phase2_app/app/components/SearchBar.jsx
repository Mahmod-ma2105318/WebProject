'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filterType, setFilterType] = useState(searchParams.get('filterType') || 'all');

  // Debounce search input
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search) {
        params.set('search', search);
        params.set('filterType', filterType);
      } else {
        params.delete('search');
        params.delete('filterType');
      }

      router.replace(`?${params.toString()}`);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, filterType]);

  return (
    <>
      <main>
        <div className="search-container">
          <input
            type="text"
            id="searchInput"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
          />

          <select
            id="filterType"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="name">By Name</option>
            <option value="category">By Category</option>
          </select>
        </div>

      </main>
    </>


  );
}