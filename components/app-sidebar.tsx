'use client';

import * as React from 'react';
import {
  BookmarkCheckIcon,
  Cog,
  FileBadge,
  GraduationCap,
  LayoutDashboard,
  UsersIcon,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavCommunity } from '@/components/nav-community';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import Logo from './Logo';
import { NavOffers } from './nav-offers';
import { useEffect, useState } from 'react';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: LayoutDashboard,
      isActive: true,
    },
  ],
  offers: [
    {
      title: 'Find Offers',
      url: '#',
      icon: FileBadge,
    },
    {
      title: 'Saved Offers',
      url: '#',
      icon: BookmarkCheckIcon,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: Cog,
    },
  ],
  community: [
    {
      title: 'Community',
      url: '#',
      icon: UsersIcon,
    },
    {
      title: 'Training',
      url: '#',
      icon: GraduationCap,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState({
    name: 'Loading...',
    email: '',
    avatar: '',
  });

  useEffect(() => {
    // Fetch user session on client side
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((session) => {
        if (session?.user) {
          setUser({
            name: session.user.name || 'User',
            email: session.user.email || '',
            avatar: session.user.image || '',
          });
        }
      })
      .catch(() => {
        setUser({
          name: 'Guest',
          email: '',
          avatar: '',
        });
      });
  }, []);

  return (
    <Sidebar
      variant='inset'
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              asChild
            >
              <Link href='#'>
                {/* Logo */}
                <Logo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavOffers offers={data.offers} />
        <NavCommunity community={data.community} />
        <NavSecondary
          items={data.navSecondary}
          className='mt-auto'
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
