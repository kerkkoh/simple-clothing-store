// GET /api/health - Health check endpoint

import { NextResponse } from 'next/server';
import { db } from '@/lib/redis';

export async function GET() {
  try {
    // Check Redis connection
    await db.ping();

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        redis: 'connected',
        api: 'operational',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
