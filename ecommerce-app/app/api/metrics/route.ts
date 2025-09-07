import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic metrics for Prometheus
    const metrics = [
      '# HELP http_requests_total Total number of HTTP requests',
      '# TYPE http_requests_total counter',
      'http_requests_total{method="GET",endpoint="/",status="200"} 0',
      'http_requests_total{method="GET",endpoint="/api/health",status="200"} 0',
      'http_requests_total{method="GET",endpoint="/api/metrics",status="200"} 0',
      '',
      '# HELP http_request_duration_seconds HTTP request duration in seconds',
      '# TYPE http_request_duration_seconds histogram',
      'http_request_duration_seconds_bucket{le="0.1"} 0',
      'http_request_duration_seconds_bucket{le="0.5"} 0',
      'http_request_duration_seconds_bucket{le="1"} 0',
      'http_request_duration_seconds_bucket{le="+Inf"} 0',
      'http_request_duration_seconds_sum 0',
      'http_request_duration_seconds_count 0',
      '',
      '# HELP app_uptime_seconds Application uptime in seconds',
      '# TYPE app_uptime_seconds gauge',
      'app_uptime_seconds 0',
      '',
      '# HELP app_memory_usage_bytes Application memory usage in bytes',
      '# TYPE app_memory_usage_bytes gauge',
      'app_memory_usage_bytes 0',
    ].join('\n');

    return new NextResponse(metrics, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
      },
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
