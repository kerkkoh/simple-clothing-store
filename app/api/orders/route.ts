// POST /api/orders - Create new order

import { NextRequest, NextResponse } from 'next/server';
import { printful } from '@/lib/printful';
import { database } from '@/lib/database';
import { getProducts } from '@/lib/products';
import currency from 'currency.js';
import type { OrderCreationRequest } from '@/types/api';
import type { PrintfulVariant } from '@/types/printful';

export async function POST(request: NextRequest) {
  try {
    const body: OrderCreationRequest = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      address2,
      city,
      state,
      country,
      zip,
      cart,
    } = body;

    // Build recipient object
    const recipient = {
      name: `${firstName} ${lastName}`,
      email,
      phone,
      address1: address,
      city,
      state_code: state,
      country_code: country,
      zip,
      ...(address2 && { address2 }),
    };

    // Get products to find variants
    const products = await getProducts();

    // Find variants by ID
    const variantById = (id: number): PrintfulVariant | undefined => {
      for (const product of products) {
        const variant = product.sync_variants?.find((v) => v.id === id);
        if (variant) return variant;
      }
      return undefined;
    };

    // Map cart items to Printful format
    const items = cart.items.map((item) => {
      const variant = variantById(item.id);
      if (!variant) {
        throw new Error(`Variant ${item.id} not found`);
      }
      return {
        sync_variant_id: variant.id,
        quantity: item.quantity || 1,
        retail_price: variant.retail_price,
      };
    });

    // Calculate subtotal
    const subtotal = items.reduce(
      (acc, item) => acc.add(item.retail_price),
      currency(0)
    );

    // Get discount if code provided
    const discountPercentage = cart.discountCode
      ? await database.getDiscount(cart.discountCode)
      : null;

    // Step 1: Estimate costs to get shipping
    const estimate = await printful.estimateCosts({
      recipient,
      items,
    });

    // Step 2: Calculate discount and VAT
    const discountAmount = discountPercentage
      ? subtotal.multiply((100 - discountPercentage) / 100)
      : currency(0);

    const vat = await database.getVAT();
    const vatAmount = subtotal
      .add(estimate.costs?.shipping || 0)
      .subtract(discountAmount.value)
      .multiply(vat / 100);

    // Step 3: Create order
    const order = await printful.createOrder({
      recipient,
      items,
      retail_costs: {
        discount: discountAmount.format(),
        tax: vatAmount.format(), // Using tax field for VAT as per original code
        currency: estimate.costs?.currency || 'USD',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      total: order.retail_costs.total,
      currency: order.retail_costs.currency,
    });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      {
        error: 'Failed to create order',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
