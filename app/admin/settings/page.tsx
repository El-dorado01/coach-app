import { isAdmin } from '@/lib/admin/auth';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function SettingsPage() {
    const admin = await isAdmin();
    if (!admin) {
        redirect('/');
    }

    return (
        <AdminLayout>
            <div className='space-y-6'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-900'>Settings</h1>
                    <p className='mt-2 text-gray-600'>Manage your admin preferences</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Coming Soon</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-gray-500'>
                            Advanced admin settings and configuration options will be available here soon.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
