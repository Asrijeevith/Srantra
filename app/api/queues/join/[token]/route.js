import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper function to calculate estimated wait time
function calculateEstimatedWaitTime(position) {
  // Assuming average service time of 5 minutes per person
  const averageServiceTime = 5;
  return position * averageServiceTime;
}

// POST /api/queues/join/[token] - Join a queue
export async function POST(request, { params }) {
  try {
    const { token } = params;
    const { name, phone } = await request.json();

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    // Find the queue by token
    const queue = await prisma.queue.findUnique({
      where: { token },
      include: {
        participants: {
          orderBy: {
            joinedAt: 'asc'
          }
        }
      }
    });

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
    if (new Date(queue.expiryDate) < new Date()) {
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
    const existingParticipant = await prisma.queueParticipant.findFirst({
      where: {
        queueId: queue.id,
        phone: phone
      }
    });

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
    const participant = await prisma.queueParticipant.create({
      data: {
        name,
        phone,
        queueId: queue.id,
        position: queue.participants.length + 1
      }
    });

    return NextResponse.json(
      {
        message: 'Successfully joined queue',
        position: participant.position,
        estimatedWaitTime: calculateEstimatedWaitTime(queue.participants.length + 1)
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

// GET /api/queues/join/[token] - Get queue details for joining
export async function GET(request, { params }) {
  try {
    const { token } = params;

    const queue = await prisma.queue.findUnique({
      where: { token },
      include: {
        participants: {
          orderBy: {
            joinedAt: 'asc'
          }
        }
      }
    });

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
    if (new Date(queue.expiryDate) < new Date()) {
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
    const isFull = queue.participants.length >= queue.queueSize;

    return NextResponse.json(
      {
        queue: {
          name: queue.name,
          organization: queue.organization,
          description: queue.description,
          currentSize: queue.participants.length,
          maxSize: queue.queueSize,
          isFull,
          estimatedWaitTime: calculateEstimatedWaitTime(queue.participants.length)
        }
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