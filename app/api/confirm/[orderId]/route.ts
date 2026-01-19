// POST /api/confirm/[orderId] - Confirm PayPal payment

import { NextRequest, NextResponse } from 'next/server';
import { getOrder, getCustomOrderId } from '@/lib/paypal';
import { printful } from '@/lib/printful';
import { database } from '@/lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId: paypalOrderId } = await params;

    // Step 1: Get PayPal order details
    const paypalOrder = await getOrder(paypalOrderId);

    if (!paypalOrder) {
      return NextResponse.json(
        { error: 'PayPal order not found' },
        { status: 404 }
      );
    }

    // Step 2: Extract Printful order ID from custom_id
    const printfulOrderId = getCustomOrderId(paypalOrder);

    if (!printfulOrderId) {
      return NextResponse.json(
        { error: 'Printful order ID not found in PayPal order' },
        { status: 400 }
      );
    }

    // Step 3: Get Printful order
    const printfulOrder = await printful.getOrder(printfulOrderId);

    // Step 4: Verify order status and amount match
    const paypalAmount = paypalOrder.purchase_units?.[0]?.amount?.value;
    const printfulAmount = printfulOrder.retail_costs.total;

    if (printfulOrder.status !== 'draft') {
      return NextResponse.json(
        { error: 'Order is not in draft status' },
        { status: 400 }
      );
    }

    if (paypalAmount !== printfulAmount) {
      console.error('Amount mismatch:', { paypalAmount, printfulAmount });
      return NextResponse.json(
        { error: 'Order amount mismatch' },
        { status: 400 }
      );
    }

    // Step 5: Confirm order (or mark as confirmed in demo mode)
    if (process.env.DEMO === 'true') {
      // Demo mode: Just mark as confirmed
      await database.addConfirmedOrder(printfulOrderId.toString());
      return NextResponse.json({ success: true, demo: true });
    } else {
      // Production: Actually confirm with Printful
      await printful.confirmOrder(printfulOrderId);
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Failed to confirm order:', error);
    return NextResponse.json(
      {
        error: 'Failed to confirm order',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
