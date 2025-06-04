import { NextResponse } from 'next/server';
import { connectToMongo } from '@/lib/mongodb';
import Queue from '@/lib/models/Queue';

// Helper function to calculate estimated wait time
function calculateEstimatedWaitTime(position) {
  const averageServiceTimePerPerson = 5; // minutes
  return position * averageServiceTimePerPerson;
}

// POST /api/join/[token] - Join a queue
export async function POST(request, { params }) {
  try {
    const { token } = params;
    const body = await request.json();
    const { name, phone } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    await connectToMongo();

    const queue = await Queue.findOne({ token });
    if (!queue) {
      return NextResponse.json(
        { error: 'Queue not found' },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Check if queue is expired
    const now = new Date();
    const queueExpiryDate = new Date(queue.expiryDate);
    if (now.getTime() > queueExpiryDate.getTime()) {
      return NextResponse.json(
        { error: 'Queue has expired' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Check if queue is full
    if (queue.participants.length >= queue.queueSize) {
      return NextResponse.json(
        { error: 'Queue is full' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Check if user is already in queue
    const existingParticipant = queue.participants.find(p => p.phone === phone);
    if (existingParticipant) {
      return NextResponse.json(
        { error: 'You are already in this queue' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Add participant to queue
    const position = queue.participants.length + 1;
    const estimatedWaitTime = calculateEstimatedWaitTime(position);

    queue.participants.push({
      name,
      phone,
      position,
      joinedAt: new Date(),
      estimatedWaitTime
    });

    await queue.save();

    return NextResponse.json(
      { 
        message: 'Successfully joined queue',
        position,
        estimatedWaitTime,
        queueSize: queue.queueSize,
        currentSize: queue.participants.length
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('Error joining queue:', error);
    return NextResponse.json(
      { error: 'Failed to join queue' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}

// GET /api/join/[token] - Get queue details for joining
export async function GET(request, { params }) {
  try {
    const { token } = params;
    await connectToMongo();

    const queue = await Queue.findOne({ token });
    if (!queue) {
      return NextResponse.json(
        { error: 'Queue not found' },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Check if queue is expired
    const now = new Date();
    const queueExpiryDate = new Date(queue.expiryDate);
    if (now.getTime() > queueExpiryDate.getTime()) {
      return NextResponse.json(
        { error: 'Queue has expired' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Check if queue is full
    if (queue.participants.length >= queue.queueSize) {
      return NextResponse.json(
        { error: 'Queue is full' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Get the phone number from the request query parameters
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    let isInQueue = false;
    let position = null;
    let estimatedWaitTime = null;

    // If phone number is provided, check if user is already in queue
    if (phone) {
      const existingParticipant = queue.participants.find(p => p.phone === phone);
      if (existingParticipant) {
        isInQueue = true;
        position = existingParticipant.position;
        estimatedWaitTime = calculateEstimatedWaitTime(position);
      }
    }

    return NextResponse.json(
      { 
        queue: {
          name: queue.name,
          organization: queue.organization,
          description: queue.description,
          queueSize: queue.queueSize,
          currentSize: queue.participants.length,
          expiryDate: queue.expiryDate
        },
        isInQueue,
        position,
        estimatedWaitTime
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('Error fetching queue details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue details' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
} 