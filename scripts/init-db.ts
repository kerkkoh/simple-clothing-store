#!/usr/bin/env ts-node
/**
 * Database Initialization Script
 *
 * Initializes the Redis database with default configuration
 * Run with: npm run init-db (or tsx scripts/init-db.ts)
 */

import { database, DEFAULT_CONFIG } from '../lib/database';

async function initializeDatabase() {
  console.log('🚀 Initializing database...');

  try {
    // Initialize with default config
    await database.initialize();

    // Optionally add some sample data
    console.log('📝 Adding sample discount codes...');
    await database.setDiscount('WELCOME10', 10); // 10% off
    await database.setDiscount('SAVE20', 20);    // 20% off
    await database.setDiscount('TEST', 80);       // 80% off (for testing)

    console.log('📝 Adding sample product descriptions...');
    // Add your product descriptions here as you get product IDs
    // await database.setProductDescription(YOUR_PRODUCT_ID, 'Product description here');

    console.log('✅ Database initialized successfully!');
    console.log('\nCurrent configuration:');
    const config = await database.getConfig();
    console.log(JSON.stringify(config, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }
}

initializeDatabase();
