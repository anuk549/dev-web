import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// POST - Insert a new document into a collection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { collection, document } = body;

    if (!collection) {
      return NextResponse.json(
        { success: false, message: 'Collection name is required' },
        { status: 400 }
      );
    }

    if (!document) {
      return NextResponse.json(
        { success: false, message: 'Document data is required' },
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
    console.error('POST error:', error);
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

// GET - Retrieve documents from a collection
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection');
    const id = searchParams.get('id');

    if (!collection) {
      return NextResponse.json(
        { success: false, message: 'Collection name is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const coll = db.collection(collection);

    let result;
    if (id) {
      // Get single document by ID
      result = await coll.findOne({ _id: new ObjectId(id) });
    } else {
      // Get all documents from collection
      const limit = parseInt(searchParams.get('limit') || '100');
      const skip = parseInt(searchParams.get('skip') || '0');
      result = await coll.find().limit(limit).skip(skip).toArray();
    }

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to retrieve data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - Update a document
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { collection, id, document } = body;

    if (!collection || !id || !document) {
      return NextResponse.json(
        { success: false, message: 'Collection, id, and document are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection(collection).updateOne(
      { _id: new ObjectId(id) },
      { $set: document }
    );

    return NextResponse.json({
      success: true,
      message: 'Document updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update document',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Remove a document
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection');
    const id = searchParams.get('id');

    if (!collection || !id) {
      return NextResponse.json(
        { success: false, message: 'Collection and id are required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection(collection).deleteOne({
      _id: new ObjectId(id)
    });

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete document',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}