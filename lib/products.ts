// Product caching and management utilities

import { db } from './redis';
import { printful } from './printful';
import { database } from './database';
import type { PrintfulProduct } from '@/types/printful';

const PRODUCTS_CACHE_KEY = 'products:all';
const PRODUCT_CACHE_KEY_PREFIX = 'product:';
const CACHE_TTL = 3600; // 1 hour in seconds

/**
 * Get all products with caching
 */
export async function getProducts(): Promise<PrintfulProduct[]> {
  try {
    // Try cache first
    const cached = await db.get<PrintfulProduct[]>(PRODUCTS_CACHE_KEY);
    if (cached) {
      console.log('Products cache hit');
      return cached;
    }

    console.log('Products cache miss, fetching from Printful');

    // Fetch from Printful
    const products = await printful.getProducts();

    // Enrich with descriptions from database
    const enrichedProducts = await Promise.all(
      products.map(async (product) => {
        const description = await database.getProductDescription(product.sync_product.id);
        return {
          ...product,
          description: description || `Product ${product.sync_product.name}`,
        };
      })
    );

    // Cache for 1 hour
    await db.setex(PRODUCTS_CACHE_KEY, CACHE_TTL, enrichedProducts);

    return enrichedProducts;
  } catch (error) {
    console.error('Failed to get products:', error);
    throw error;
  }
}

/**
 * Get single product with caching
 */
export async function getProduct(id: string | number): Promise<PrintfulProduct> {
  try {
    const cacheKey = `${PRODUCT_CACHE_KEY_PREFIX}${id}`;

    // Try cache first
    const cached = await db.get<PrintfulProduct>(cacheKey);
    if (cached) {
      console.log(`Product ${id} cache hit`);
      return cached;
    }

    console.log(`Product ${id} cache miss, fetching from Printful`);

    // Fetch from Printful
    const product = await printful.getProduct(id);

    // Enrich with description from database
    const description = await database.getProductDescription(product.sync_product.id);
    const enrichedProduct = {
      ...product,
      description: description || `Product ${product.sync_product.name}`,
    };

    // Cache for 1 hour
    await db.setex(cacheKey, CACHE_TTL, enrichedProduct);

    return enrichedProduct;
  } catch (error) {
    console.error(`Failed to get product ${id}:`, error);
    throw error;
  }
}

/**
 * Invalidate products cache
 */
export async function invalidateProductsCache(): Promise<void> {
  try {
    await db.del(PRODUCTS_CACHE_KEY);
    console.log('Products cache invalidated');
  } catch (error) {
    console.error('Failed to invalidate products cache:', error);
  }
}

/**
 * Invalidate single product cache
 */
export async function invalidateProductCache(id: string | number): Promise<void> {
  try {
    const cacheKey = `${PRODUCT_CACHE_KEY_PREFIX}${id}`;
    await db.del(cacheKey);
    console.log(`Product ${id} cache invalidated`);
  } catch (error) {
    console.error(`Failed to invalidate product ${id} cache:`, error);
  }
}

/**
 * Preload products into cache
 */
export async function preloadProductsCache(): Promise<void> {
  try {
    console.log('Preloading products cache...');
    await getProducts();
    console.log('Products cache preloaded successfully');
  } catch (error) {
    console.error('Failed to preload products cache:', error);
  }
}
