import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToMongo } from '@/lib/mongodb';
import Queue from '@/lib/models/Queue';

// PATCH /api/queues/[token]/participants - Update participant status
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { token } = params;
    const { action, participantId } = await request.json();

    await connectToMongo();

    const queue = await Queue.findOne({ token, userId: session.user.id });
    if (!queue) {
      return NextResponse.json(
        { error: 'Queue not found' },
        { status: 404 }
      );
    }

    const participant = queue.participants.id(participantId);
    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'current':
        // Mark participant as current
        participant.status = 'current';
        participant.processedAt = new Date();
        break;
      
      case 'skip':
        // Skip participant
        participant.status = 'skipped';
        participant.skippedAt = new Date();
        break;
      
      case 'served':
        // Mark participant as served
        participant.status = 'served';
        participant.servedAt = new Date();
        break;
      
      case 'remove':
        // Remove participant from queue
        queue.participants = queue.participants.filter(p => p._id.toString() !== participantId);
        break;
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    await queue.save();

    return NextResponse.json({ 
      message: 'Participant status updated successfully',
      queue 
    });
  } catch (error) {
    console.error('Error updating participant:', error);
    return NextResponse.json(
      { error: 'Failed to update participant' },
      { status: 500 }
    );
  }
} 