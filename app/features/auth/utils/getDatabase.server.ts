// Get MongoDB database connection
import { MongoClient, Db } from 'mongodb';
import { MONGODB_URI } from '../constants/mongodb';

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
