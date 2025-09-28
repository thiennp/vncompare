import { MongoClient, Db } from 'mongodb';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// eslint-disable-next-line no-undef
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vncompare';
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// eslint-disable-next-line no-undef
if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  // eslint-disable-next-line no-undef
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('vncompare');
}
