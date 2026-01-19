// Product detail page

import { getProduct } from '@/lib/products';
import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';

export const revalidate = 3600; // Revalidate every hour

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  try {
    const product = await getProduct(id);
    return <ProductClient product={product} />;
  } catch (error) {
    console.error(`Failed to load product ${id}:`, error);
    notFound();
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;

  try {
    const product = await getProduct(id);
    return {
      title: `${product.sync_product.name} - Simple Clothing Store`,
      description: product.description || `Buy ${product.sync_product.name}`,
    };
  } catch {
    return {
      title: 'Product Not Found',
    };
  }
}
