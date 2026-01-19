// GET /api/products - Get all products

import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/products';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const products = await getProducts();

    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
