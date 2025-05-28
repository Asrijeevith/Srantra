import { NextResponse } from 'next/server';
import { connectToMongo } from '../../../../lib/mongodb';
import Queue from '../../../../lib/models/Queue';

export async function GET(request, { params }) {
  try {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    await connectToMongo();
    const { id } = params;
    const queue = await Queue.findById(id);
    
    if (!queue) {
      return new NextResponse(JSON.stringify({ error: 'Queue not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    // Convert MongoDB document to plain object
    const plainQueue = {
      id: queue._id.toString(),
      name: queue.name,
      organization: queue.organization,
      queueSize: queue.queueSize,
      expiryDate: queue.expiryDate.toISOString(),
      description: queue.description,
      qrCode: queue.qrCode,
      token: queue.token,
      createdAt: queue.createdAt.toISOString(),
      updatedAt: queue.updatedAt.toISOString(),
    };

    return new NextResponse(JSON.stringify({ queue: plainQueue }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Error in GET:', error);
    return new NextResponse(JSON.stringify({ error: error.message || 'Failed to fetch queue' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }
}
