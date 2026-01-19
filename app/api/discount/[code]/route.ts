// GET /api/discount/[code] - Validate discount code

import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const discount = await database.getDiscount(code);

    if (discount !== null) {
      return NextResponse.json({
        valid: true,
        percentage: discount,
        message: `${discount}% discount applied`,
      });
    } else {
      return NextResponse.json({
        valid: false,
        message: 'Invalid discount code',
      });
    }
  } catch (error) {
    console.error('Failed to validate discount:', error);
    return NextResponse.json(
      { valid: false, message: 'Failed to validate discount code' },
      { status: 500 }
    );
  }
}
