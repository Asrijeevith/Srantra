import { NextResponse } from 'next/server';
import { connectToMongo } from '../../../lib/mongodb';
import Queue from '../../../lib/models/Queue';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    await connectToMongo();

    const { name, organization, queueSize, expiryDate, description } = await request.json();

    if (!name || !organization || !queueSize || !expiryDate || !description) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Generate token for queue owner
    const token = uuidv4();

    // Create a new queue object with all required fields
    const newQueue = new Queue({
      name,
      organization,
      queueSize: parseInt(queueSize),
      expiryDate: new Date(expiryDate),
      description,
      token,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Generate QR code URL using the app domain
    const qrCodeDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'http://192.168.29.135:3000';
    newQueue.qrCode = `${qrCodeDomain}/join/${newQueue._id}`;

    // Save the queue with the QR code already set
    await newQueue.save();

    return NextResponse.json({
      queue: {
        id: newQueue._id.toString(),
        name: newQueue.name,
        organization: newQueue.organization,
        queueSize: newQueue.queueSize,
        expiryDate: newQueue.expiryDate.toISOString(),
        description: newQueue.description,
        qrCode: newQueue.qrCode,
        token: newQueue.token,
        createdAt: newQueue.createdAt.toISOString(),
        updatedAt: newQueue.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json({ error: error.message || 'Failed to create queue' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToMongo();

    const queues = await Queue.find().sort({ createdAt: -1 });
    
    // Convert MongoDB documents to plain objects
    const plainQueues = queues.map(queue => ({
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
    }));

    return NextResponse.json({ queues: plainQueues });
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch queues' }, { status: 500 });
  }
}
