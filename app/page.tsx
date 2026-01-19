// Home page - Store listing

import { getProducts } from '@/lib/products';
import StoreClient from './StoreClient';
import type { PrintfulProduct } from '@/types/printful';

export const revalidate = 3600; // Revalidate every hour

export default async function StorePage() {
  let products: PrintfulProduct[] = [];
  let error: string | null = null;

  try {
    products = await getProducts();
  } catch (err) {
    console.error('Failed to load products:', err);
    error = 'Failed to load products. Please try again later.';
  }

  return <StoreClient products={products} error={error} />;
}
