import { NextResponse } from 'next/server';
import { connectToMongo } from '../../../../lib/mongodb'; // Adjust the path if needed
import Queue from '../../../../lib/models/Queue';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }
  try {
    // Connect to MongoDB
    await connectToMongo();

    // Get the queue ID from the request params
    const { queueid } = params;

    // Find the queue by ID
    const queue = await Queue.findById(new ObjectId(queueid));
    if (!queue) {
      return new NextResponse(JSON.stringify({ error: 'Queue not found' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
    }

    // Return the queue data
    return new NextResponse(JSON.stringify({
      queue: {
        id: queueid,
        name: queue.name,
        description: queue.description,
        organization: queue.organization,
        queueSize: queue.queueSize,
        expiryDate: queue.expiryDate
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Error fetching queue:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch queue' }), { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }
}

export async function POST(request, { params }) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }
  try {
    // Connect to MongoDB
    await connectToMongo();

    // Get the queue ID from the request params
    const { queueid } = params;

    // Find the queue by ID
    const queue = await Queue.findById(new ObjectId(queueid));
    if (!queue) {
      return new NextResponse(JSON.stringify({ error: 'Queue not found' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
    }

    // Generate token for the user joining the queue
    const token = uuidv4();

    // Store the user's join information in your database
    // This is a placeholder - implement your actual database storage
    const joinData = {
      queueId: new ObjectId(queueid),
      userId: "anonymous", // You might want to store actual user ID if authenticated
      token: token,
      joinedAt: new Date().toISOString()
    };

    // Add user to the queue (increment people in the queue)
    queue.queueSize += 1;
    await queue.save();

    // Return response with token
    return new NextResponse(JSON.stringify({ token }), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  } catch (error) {
    console.error('Error joining queue:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to join queue' }), { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }
}
