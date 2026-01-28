'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import ProfileCard from '@/components/ProfileCard';
import FilterSidebar from '@/components/FilterSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import Pagination from '@/components/Pagination';
import { Badge } from '@/components/ui/badge';
import { filterCoaches } from '@/lib/utils';
import { FilterOptions, CoachProfile } from '@/lib/types';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 50;

interface CoachFinderProps {
  className?: string;
}

export default function CoachFinder({ className }: CoachFinderProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    niches: [],
    minFollowers: 0,
    maxFollowers: 0,
    searchQuery: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [coaches, setCoaches] = useState<CoachProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalFiltered, setTotalFiltered] = useState(0);
  const [globalTotal, setGlobalTotal] = useState(0);

  // Initial load and filter-based fetch
  useEffect(() => {
    fetchCoaches();
  }, [filters, currentPage]);

  const fetchCoaches = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search: filters.searchQuery,
        niche: filters.niches.join(','),
        minFollowers: filters.minFollowers.toString(),
        maxFollowers: filters.maxFollowers.toString(),
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      const response = await fetch(`/api/coaches?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch coaches');
      }

      const data = await response.json();
      setCoaches(data.coaches || []);
      setTotalFiltered(data.pagination?.total || 0);
      setGlobalTotal(data.pagination?.globalTotal || 0);
    } catch (err) {
      console.error('Error fetching coaches:', err);
      setError('Failed to load coaches from the database.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      niches: [],
      minFollowers: 0,
      maxFollowers: 0,
      searchQuery: '',
    });
    setCurrentPage(1);
  };

  // Calculate pagination locally based on the total results from API
  const totalPages = Math.ceil(totalFiltered / ITEMS_PER_PAGE);

  return (
    <div className={cn('max-w-7xl py-10', className)}>
      <DashboardHeader
        totalResults={globalTotal}
        totalFiltered={totalFiltered}
        filteredResults={coaches}
      />

      <div className='grid grid-cols-1 gap-5'>
        {/* Sidebar */}
        <aside>
          <FilterSidebar
            selectedNiches={filters.niches}
            minFollowers={filters.minFollowers}
            maxFollowers={filters.maxFollowers}
            searchQuery={filters.searchQuery}
            onNicheChange={(niches) => setFilters({ ...filters, niches })}
            onMinFollowersChange={(min) =>
              setFilters({ ...filters, minFollowers: min })
            }
            onMaxFollowersChange={(max) =>
              setFilters({ ...filters, maxFollowers: max })
            }
            onSearchChange={(query) =>
              setFilters({ ...filters, searchQuery: query })
            }
            onClearFilters={handleClearFilters}
            resultCount={totalFiltered}
          />
        </aside>

        {/* Main Content */}
        <main>
          {loading ? (
            <div className='bg-card rounded-xl shadow-sm border border-border p-16 text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
              <h3 className='text-xl font-bold text-card-foreground mb-2'>
                Loading Coaches...
              </h3>
              <p className='text-muted-foreground'>
                Accessing profiles from Supabase database
              </p>
            </div>
          ) : error ? (
            <div className='bg-card rounded-xl shadow-sm border border-border p-16 text-center'>
              <svg
                className='mx-auto h-16 w-16 text-destructive/60 mb-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <h3 className='text-xl font-bold text-card-foreground mb-2'>
                Error loading profiles
              </h3>
              <p className='text-muted-foreground mb-4'>{error}</p>
              <button
                onClick={fetchCoaches}
                className='mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors'
              >
                Try Again
              </button>
            </div>
          ) : coaches.length === 0 ? (
            <div className='bg-card rounded-xl shadow-sm border border-border p-16 text-center'>
              <svg
                className='mx-auto h-16 w-16 text-muted-foreground mb-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <h3 className='text-xl font-bold text-card-foreground mb-2'>
                No coaches found
              </h3>
              <p className='text-muted-foreground'>
                Try adjusting your filters or search terms. Profiles must be added by an admin first.
              </p>
              <button
                onClick={handleClearFilters}
                className='mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors'
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 gap-6'>
                {coaches.map((coach) => (
                  <ProfileCard
                    key={coach.id}
                    profile={coach}
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
