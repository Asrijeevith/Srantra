import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectToMongo } from '@/lib/mongodb';
import Queue from '@/lib/models/Queue';

// GET /api/queues - Get all queues for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    await connectToMongo();

    const queues = await Queue.find({ userId: session.user.id })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { queues },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('Error fetching queues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queues' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}

// POST /api/queues - Create a new queue
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    const body = await request.json();
    const { name, organization, queueSize, expiryDate, description } = body;

    // Validate required fields
    if (!name || !organization || !queueSize || !expiryDate || !description) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Validate queue size
    if (isNaN(queueSize) || parseInt(queueSize) < 1) {
      return NextResponse.json(
        { error: 'Queue size must be a positive number' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Validate expiry date
    const expiryDateObj = new Date(expiryDate);
    if (isNaN(expiryDateObj.getTime())) {
      return NextResponse.json(
        { error: 'Invalid expiry date' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    await connectToMongo();

    // Generate a unique token for the queue
    const token = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);

    const queue = await Queue.create({
      name,
      organization,
      queueSize: parseInt(queueSize),
      expiryDate: expiryDateObj,
      description,
      token,
      userId: session.user.id,
      qrCode: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/join/${token}`,
      participants: []
    });

    return NextResponse.json(
      { queue },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('Error creating queue:', error);
    return NextResponse.json(
      { error: 'Failed to create queue' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}
