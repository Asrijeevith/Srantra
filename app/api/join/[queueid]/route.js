import { NextResponse } from 'next/server';
import { connectToMongo } from '../../../../lib/mongodb'; // Adjust the path if needed
import Queue from '../../../../lib/models/Queue';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    // Connect to MongoDB
    await connectToMongo();

    // Get the queue ID from the request params
    const { queueid } = params;

    // Find the queue by ID
    const queue = await Queue.findById(new ObjectId(queueid));
    if (!queue) {
      return NextResponse.json({ error: 'Queue not found' }, { status: 404 });
    }

    // Return the queue data
    return NextResponse.json({
      queue: {
        id: queueid,
        name: queue.name,
        description: queue.description,
        organization: queue.organization,
        queueSize: queue.queueSize,
        expiryDate: queue.expiryDate
      }
    });
  } catch (error) {
    console.error('Error fetching queue:', error);
    return NextResponse.json({ error: 'Failed to fetch queue' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    // Connect to MongoDB
    await connectToMongo();

    // Get the queue ID from the request params
    const { queueid } = params;

    // Find the queue by ID
    const queue = await Queue.findById(new ObjectId(queueid));
    if (!queue) {
      return NextResponse.json({ error: 'Queue not found' }, { status: 404 });
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
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error joining queue:', error);
    return NextResponse.json({ error: 'Failed to join queue' }, { status: 500 });
  }
}
