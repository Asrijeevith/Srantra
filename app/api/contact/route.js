import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function POST(request) {
  let connection;
  try {
    const data = await request.json();
    console.log('Received data:', data);

    // Connect to MongoDB
    connection = await client.connect();
    console.log('Connected to MongoDB successfully');

    // Verify connection
    const adminDb = client.db('admin');
    await adminDb.command({ ping: 1 });
    console.log('MongoDB connection verified');

    // Use the second database
    const database = client.db('second');
    console.log('Using database: second');

    // Create or get the contact collection
    const collection = database.collection('contact');
    console.log('Using collection: contact');

    // Insert the document
    const result = await collection.insertOne({
      ...data,
      createdAt: new Date(),
    });
    
    console.log('Document inserted successfully:', result);
    
    return NextResponse.json({ 
      message: 'Data saved successfully',
      id: result.insertedId 
    }, { status: 200 });
  } catch (error) {
    console.error('Detailed MongoDB Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return NextResponse.json({ 
      error: 'Failed to save data',
      details: error.message 
    }, { status: 500 });
  } finally {
    if (connection) {
      try {
        await client.close();
        console.log('MongoDB connection closed');
      } catch (closeError) {
        console.error('Error closing MongoDB connection:', closeError);
      }
    }
  }
}