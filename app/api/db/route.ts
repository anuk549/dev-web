export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Rate limiting using in-memory store (for production, use Redis)
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimit.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  record.count++;
  return true;
}

function getClientIdentifier(request: NextRequest): string {
  // Use IP address for rate limiting
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

// Allowed collections for security (prevent collection name injection)
const ALLOWED_COLLECTIONS = ['quotes', 'test'];

function sanitizeCollectionName(collection: string): boolean {
  return ALLOWED_COLLECTIONS.includes(collection);
}

function getDatabaseErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : undefined;

  if (code === 'ENOTFOUND' || message.includes('querySrv ENOTFOUND')) {
    return {
      status: 503,
      body: {
        success: false,
        message: 'MongoDB host could not be resolved. Check MONGODB_URI and DNS/network access.',
        error: message,
      },
    };
  }

  if (code === 'ETIMEDOUT' || code === 'ECONNREFUSED' || message.includes('Server selection timed out')) {
    return {
      status: 503,
      body: {
        success: false,
        message: 'MongoDB is unreachable. Check Atlas network access and your connection string.',
        error: message,
      },
    };
  }

  return {
    status: 500,
    body: {
      success: false,
      message: 'Database request failed',
      error: message,
    },
  };
}

// POST - Insert a new document into a collection
export async function POST(request: NextRequest) {
  // Rate limiting check
  const clientId = getClientIdentifier(request);
  if (!checkRateLimit(clientId)) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

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

    // Security: Validate collection name
    if (!sanitizeCollectionName(collection)) {
      return NextResponse.json(
        { success: false, message: 'Invalid collection name' },
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
    const response = getDatabaseErrorResponse(error);
    return NextResponse.json(response.body, { status: response.status });
  }
}

// GET - Retrieve documents from a collection
export async function GET(request: NextRequest) {
  // Rate limiting check
  const clientId = getClientIdentifier(request);
  if (!checkRateLimit(clientId)) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

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

    // Security: Validate collection name
    if (!sanitizeCollectionName(collection)) {
      return NextResponse.json(
        { success: false, message: 'Invalid collection name' },
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
      const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000); // Cap at 1000
      const skip = parseInt(searchParams.get('skip') || '0');
      result = await coll.find().limit(limit).skip(skip).toArray();
    }

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('GET error:', error);
    const response = getDatabaseErrorResponse(error);
    return NextResponse.json(response.body, { status: response.status });
  }
}

// PUT - Update a document
export async function PUT(request: NextRequest) {
  // Rate limiting check
  const clientId = getClientIdentifier(request);
  if (!checkRateLimit(clientId)) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { collection, id, document } = body;

    if (!collection || !id || !document) {
      return NextResponse.json(
        { success: false, message: 'Collection, id, and document are required' },
        { status: 400 }
      );
    }

    // Security: Validate collection name
    if (!sanitizeCollectionName(collection)) {
      return NextResponse.json(
        { success: false, message: 'Invalid collection name' },
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
    const response = getDatabaseErrorResponse(error);
    return NextResponse.json(response.body, { status: response.status });
  }
}

// DELETE - Remove a document
export async function DELETE(request: NextRequest) {
  // Rate limiting check
  const clientId = getClientIdentifier(request);
  if (!checkRateLimit(clientId)) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

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

    // Security: Validate collection name
    if (!sanitizeCollectionName(collection)) {
      return NextResponse.json(
        { success: false, message: 'Invalid collection name' },
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
    const response = getDatabaseErrorResponse(error);
    return NextResponse.json(response.body, { status: response.status });
  }
}
