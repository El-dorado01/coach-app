import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const nichesParam = searchParams.get('niche') || '';
        const niches = nichesParam ? nichesParam.split(',').filter(Boolean) : [];
        const minFollowers = parseInt(searchParams.get('minFollowers') || '0');
        const maxFollowers = parseInt(searchParams.get('maxFollowers') || '0');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '100');

        const skip = (page - 1) * limit;

        const where: any = {
            AND: [
                search ? {
                    OR: [
                        { username: { contains: search, mode: 'insensitive' } },
                        { fullName: { contains: search, mode: 'insensitive' } },
                    ],
                } : {},
                niches.length > 0 ? { niche: { in: niches } } : {},
                minFollowers > 0 ? { followersCount: { gte: minFollowers } } : {},
                maxFollowers > 0 ? { followersCount: { lte: maxFollowers } } : {},
            ],
        };

        const [coaches, totalFiltered, globalTotal] = await Promise.all([
            prisma.coachProfile.findMany({
                where,
                skip,
                take: limit,
                orderBy: { followersCount: 'desc' },
            }),
            prisma.coachProfile.count({ where }),
            prisma.coachProfile.count(),
        ]);

        return NextResponse.json({
            coaches,
            pagination: {
                page,
                limit,
                total: totalFiltered,
                globalTotal,
                totalPages: Math.ceil(totalFiltered / limit),
            },
        });
    } catch (error) {
        console.error('Error in public coaches API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch coaches' },
            { status: 500 }
        );
    }
}
