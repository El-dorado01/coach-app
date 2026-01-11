'use client';

import Logo from './Logo';
import { BookmarkCheckIcon, FileBadge, HeadphonesIcon } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

export default function TopBar() {
  return (
    <header className='fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50 shadow-lg'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16 md:h-20'>
          {/* Logo */}
          <Logo />

          <div className='flex items-center gap-2'>
            {/* Find Offers */}
            <Button
              asChild
              variant='outline'
              size='sm'
              className='flex items-center gap-2 bg-card/50 backdrop-blur-sm hover:bg-primary/10 border-border/50'
            >
              <Link
                href={'/'}
                className='flex items-center gap-2'
              >
                <FileBadge className='h-4 w-4' />
                <span className='hidden md:inline'>Find Offers</span>
              </Link>
            </Button>

            {/* Saved Offers Button */}
            <Button
              variant='outline'
              size='sm'
              className='flex items-center gap-2 bg-card/50 backdrop-blur-sm hover:bg-primary/10 border-border/50'
            >
              <Link
                href={'/saved'}
                className='flex items-center gap-2'
              >
                <BookmarkCheckIcon className='h-4 w-4' />
                <span className='hidden md:inline'>Saved Offers</span>
              </Link>
            </Button>

            {/* Support Button */}
            <Button
              variant='outline'
              size='sm'
              className='flex items-center gap-2 bg-card/50 backdrop-blur-sm hover:bg-primary/10 border-border/50'
            >
              <Link
                href={'#'}
                className='flex items-center gap-2'
              >
                <HeadphonesIcon className='h-4 w-4' />
                <span className='hidden md:inline'>Support</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
