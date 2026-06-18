import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    
    // Test the connection by listing collections
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      database: db.databaseName,
      collections: collections.map(c => c.name),
      collectionCount: collections.length
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to connect to MongoDB',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { collection, document } = body;

    if (!collection || !document) {
      return NextResponse.json(
        { success: false, message: 'Collection and document are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection(collection).insertOne(document);

    return NextResponse.json({
      success: true,
      message: 'Document inserted successfully',
      insertedId: result.insertedId
    });
  } catch (error) {
    console.error('Insert error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to insert document',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}