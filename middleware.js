// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
  const res = NextResponse.next();

  // Set CORS headers
  res.headers.set('Access-Control-Allow-Origin', '*'); // Change '*' to your specific origin if needed
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: res.headers,
    });
  }

  return res;
}