// Database abstraction layer for store configuration

import { db } from './redis';
import type { StoreConfig } from '@/types/database';

const CONFIG_KEY = 'store:config';
const DEMO_CONFIRMED_KEY = 'demo:confirmed';

// Default configuration
export const DEFAULT_CONFIG: StoreConfig = {
  discounts: {
    TEST: 80, // 80% discount (legacy demo code)
  },
  vat: 24, // 24% VAT
  descriptions: {},
  currency: 'USD',
  storeName: 'Simple Clothing Store',
  storeDescription: 'Quality clothing with print-on-demand fulfillment',
};

/**
 * Database service for store configuration and state
 */
export class Database {
  /**
   * Get complete store configuration
   */
  async getConfig(): Promise<StoreConfig> {
    try {
      const config = await db.get<StoreConfig>(CONFIG_KEY);
      return config || DEFAULT_CONFIG;
    } catch (error) {
      console.error('Failed to get config from database:', error);
      return DEFAULT_CONFIG;
    }
  }

  /**
   * Update store configuration
   */
  async updateConfig(config: Partial<StoreConfig>): Promise<void> {
    try {
      const current = await this.getConfig();
      const updated = { ...current, ...config };
      await db.set(CONFIG_KEY, updated);
    } catch (error) {
      console.error('Failed to update config:', error);
      throw error;
    }
  }

  /**
   * Get discount percentage for a code
   */
  async getDiscount(code: string): Promise<number | null> {
    try {
      const config = await this.getConfig();
      const discount = config.discounts[code.toUpperCase()];
      return discount !== undefined ? discount : null;
    } catch (error) {
      console.error('Failed to get discount:', error);
      return null;
    }
  }

  /**
   * Add or update a discount code
   */
  async setDiscount(code: string, percentage: number): Promise<void> {
    try {
      const config = await this.getConfig();
      config.discounts[code.toUpperCase()] = percentage;
      await this.updateConfig(config);
    } catch (error) {
      console.error('Failed to set discount:', error);
      throw error;
    }
  }

  /**
   * Get product description
   */
  async getProductDescription(productId: number | string): Promise<string | null> {
    try {
      const config = await this.getConfig();
      return config.descriptions[productId.toString()] || null;
    } catch (error) {
      console.error('Failed to get product description:', error);
      return null;
    }
  }

  /**
   * Set product description
   */
  async setProductDescription(productId: number | string, description: string): Promise<void> {
    try {
      const config = await this.getConfig();
      config.descriptions[productId.toString()] = description;
      await this.updateConfig(config);
    } catch (error) {
      console.error('Failed to set product description:', error);
      throw error;
    }
  }

  /**
   * Get VAT rate
   */
  async getVAT(): Promise<number> {
    try {
      const config = await this.getConfig();
      return config.vat;
    } catch (error) {
      console.error('Failed to get VAT:', error);
      return DEFAULT_CONFIG.vat;
    }
  }

  /**
   * Set VAT rate
   */
  async setVAT(vat: number): Promise<void> {
    try {
      await this.updateConfig({ vat });
    } catch (error) {
      console.error('Failed to set VAT:', error);
      throw error;
    }
  }

  /**
   * Demo mode: Mark order as confirmed
   */
  async addConfirmedOrder(orderId: string): Promise<void> {
    try {
      await db.sadd(DEMO_CONFIRMED_KEY, orderId.toString());
    } catch (error) {
      console.error('Failed to add confirmed order:', error);
    }
  }

  /**
   * Demo mode: Check if order is confirmed
   */
  async isOrderConfirmed(orderId: string): Promise<boolean> {
    try {
      const result = await db.sismember(DEMO_CONFIRMED_KEY, orderId.toString());
      return result === 1;
    } catch (error) {
      console.error('Failed to check order confirmation:', error);
      return false;
    }
  }

  /**
   * Initialize database with default configuration
   */
  async initialize(): Promise<void> {
    try {
      const existing = await db.get<StoreConfig>(CONFIG_KEY);
      if (!existing) {
        await db.set(CONFIG_KEY, DEFAULT_CONFIG);
        console.log('Database initialized with default configuration');
      }
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }
}

// Export singleton instance
export const database = new Database();

export default database;
