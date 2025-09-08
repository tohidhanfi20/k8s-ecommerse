import { NextRequest, NextResponse } from 'next/server';
import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';

// Enable default metrics collection
collectDefaultMetrics();

// Custom metrics for e-commerce application
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'endpoint', 'status']
});

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'endpoint'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const activeUsers = new Gauge({
  name: 'active_users',
  help: 'Number of active users',
  labelNames: ['type']
});

const databaseConnections = new Gauge({
  name: 'database_connections',
  help: 'Number of database connections',
  labelNames: ['state']
});

const cartItems = new Gauge({
  name: 'cart_items_total',
  help: 'Total number of items in carts',
  labelNames: ['status']
});

const ordersTotal = new Counter({
  name: 'orders_total',
  help: 'Total number of orders',
  labelNames: ['status']
});

const revenue = new Counter({
  name: 'revenue_total',
  help: 'Total revenue in USD',
  labelNames: ['currency']
});

// Middleware to collect metrics
export function collectMetrics(req: NextRequest, res: NextResponse) {
  const start = Date.now();
  
  // Increment request counter
  httpRequestsTotal.inc({
    method: req.method,
    endpoint: req.nextUrl.pathname,
    status: res.status.toString()
  });

  // Record request duration
  const duration = (Date.now() - start) / 1000;
  httpRequestDuration.observe(
    { method: req.method, endpoint: req.nextUrl.pathname },
    duration
  );

  return res;
}

// Metrics endpoint
export async function GET() {
  try {
    const metrics = await register.metrics();
    return new NextResponse(metrics, {
      status: 200,
      headers: {
        'Content-Type': register.contentType,
      },
    });
  } catch (error) {
    console.error('Error generating metrics:', error);
    return new NextResponse('Error generating metrics', { status: 500 });
  }
}

// Export metrics for use in other parts of the application
export {
  httpRequestsTotal,
  httpRequestDuration,
  activeUsers,
  databaseConnections,
  cartItems,
  ordersTotal,
  revenue
};