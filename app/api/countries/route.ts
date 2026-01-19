// GET /api/countries - Get countries and states for checkout

import { NextResponse } from 'next/server';
import { printful } from '@/lib/printful';

export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  try {
    const countries = await printful.getCountries();

    return NextResponse.json(countries, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
      },
    });
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}
