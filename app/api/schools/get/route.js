import { NextResponse } from 'next/server';
import prisma from "../../../lib/prisma"


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const state = searchParams.get('state');

    let whereCondition = {};

    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (state && state !== 'All') {
      whereCondition.state = state;
    }

    const schools = await prisma.school.findMany({
      where: whereCondition,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        state: true,
        image: true,
        createdAt: true
      }
    });

    return NextResponse.json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { message: 'Failed to fetch schools' },
      { status: 500 }
    );
  }
}
