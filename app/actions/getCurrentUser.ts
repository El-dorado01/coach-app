// app/actions/getUser.ts
'use server';

import { apiFetch } from '@/lib/api';
import { cookies } from 'next/headers';

export async function getCurrentUserFromServer() {
  const res = await apiFetch('/user', {}, true); // server: true
  if (!res.ok) return null;
  return res.json();
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('auth_user')?.value;

  if (!userCookie) {
    return null;
  }

  try {
    const user = JSON.parse(userCookie);
    // Return only what we need
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  } catch (error) {
    console.error('Failed to parse auth_user cookie:', error);
    return null;
  }
}
