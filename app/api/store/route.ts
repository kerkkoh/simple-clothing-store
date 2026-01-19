// GET /api/store - Get store information

import { NextResponse } from 'next/server';
import { printful } from '@/lib/printful';
import { database } from '@/lib/database';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const [storeInfo, config] = await Promise.all([
      printful.getStoreInfo(),
      database.getConfig(),
    ]);

    const response = {
      name: config.storeName || storeInfo.name,
      currency: storeInfo.currency || config.currency,
      vat: config.vat,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Failed to fetch store info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch store information' },
      { status: 500 }
    );
  }
}
