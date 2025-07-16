import { MongoClient, MongoClientOptions, Db, Collection, Document } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 5,
  retryWrites: true,
  w: 'majority' as const,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(process.env.MONGODB_URI, options);
    globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
      throw err;
    });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(process.env.MONGODB_URI, options);
  clientPromise = client.connect().catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  });
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// Helper functions
export async function getDb(dbName = 'main'): Promise<Db> {
  try {
    const client = await clientPromise;
    return client.db(dbName);
  } catch (error) {
    console.error('Failed to get database:', error);
    throw error;
  }
}

export async function getCollection<T extends Document>(collectionName: string, dbName = 'main'): Promise<Collection<T>> {
  try {
    const db = await getDb(dbName);
    return db.collection<T>(collectionName);
  } catch (error) {
    console.error('Failed to get collection:', error);
    throw error;
  }
}

export async function handleMongoError<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error('MongoDB operation failed:', error);
    throw error;
  }
}

export async function validateConnection(): Promise<boolean> {
  try {
    const client = await clientPromise;
    await client.db().admin().ping();
    return true;
  } catch (error) {
    console.error('MongoDB connection validation failed:', error);
    return false;
  }
}

// Export the connectToDatabase function for backward compatibility
export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db();
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}
