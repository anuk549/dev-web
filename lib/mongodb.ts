import { MongoClient, Db } from 'mongodb';

const uri: string | undefined = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
};

let clientPromise: Promise<MongoClient> | undefined;

function getMongoClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error('MONGODB_URI is not configured. Please add it to your environment variables.');
  }

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads.
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }

    return globalWithMongo._mongoClientPromise;
  }

  if (!clientPromise) {
    const client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  return clientPromise;
}

// Helper function to get the database instance
export async function getDatabase(dbName?: string): Promise<Db> {
  const client = await getMongoClientPromise();
  // Use provided dbName, or env variable, or extract from connection string
  const databaseName = dbName || process.env.MONGODB_DB_NAME || 'cluster0';
  return client.db(databaseName);
}
