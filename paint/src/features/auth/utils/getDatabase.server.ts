// Get MongoDB database connection
import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = 'mongodb://localhost:27017/vncompare';

let client: MongoClient;
let db: Db;

export async function getDatabase(): Promise<Db> {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('vncompare');
  }
  return db;
}
