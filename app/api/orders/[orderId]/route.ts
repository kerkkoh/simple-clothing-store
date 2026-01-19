// GET /api/orders/[orderId] - Get order details

import { NextRequest, NextResponse } from 'next/server';
import { printful } from '@/lib/printful';
import { database } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const order = await printful.getOrder(orderId);

    // For demo mode: Override status if order is confirmed
    if (process.env.DEMO === 'true') {
      const isConfirmed = await database.isOrderConfirmed(orderId);
      if (isConfirmed) {
        return NextResponse.json({
          ...order,
          status: 'pending',
        });
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    );
  }
}
