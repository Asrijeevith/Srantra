import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToMongo } from '@/lib/mongodb';
import Queue from '@/lib/models/Queue';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await connectToMongo();

    const queue = await Queue.findOne({ token: params.token });
    if (!queue) {
      return NextResponse.json(
        { error: 'Queue not found' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if the user is the owner of the queue
    if (queue.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return NextResponse.json(
      { queue },
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching queue:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await connectToMongo();

    const queue = await Queue.findOne({ token: params.token });
    if (!queue) {
      return NextResponse.json(
        { error: 'Queue not found' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if the user is the owner of the queue
    if (queue.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await queue.deleteOne();

    return NextResponse.json(
      { message: 'Queue deleted successfully' },
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error deleting queue:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { name, organization, queueSize, expiryDate, description } = body;

    // Validate required fields
    if (!name || !organization || !queueSize || !expiryDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate queue size
    if (queueSize < 1) {
      return NextResponse.json(
        { error: 'Queue size must be at least 1' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate expiry date
    const expiry = new Date(expiryDate);
    if (isNaN(expiry.getTime())) {
      return NextResponse.json(
        { error: 'Invalid expiry date format' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await connectToMongo();

    const queue = await Queue.findOne({ token: params.token });
    if (!queue) {
      return NextResponse.json(
        { error: 'Queue not found' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if the user is the owner of the queue
    if (queue.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update queue fields
    queue.name = name;
    queue.organization = organization;
    queue.queueSize = queueSize;
    queue.expiryDate = expiry;
    queue.description = description;

    await queue.save();

    return NextResponse.json(
      { queue },
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error updating queue:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 