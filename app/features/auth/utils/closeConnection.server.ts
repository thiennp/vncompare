// Close MongoDB connection
import { MongoClient } from 'mongodb';

let client: MongoClient | null = null;

export async function closeConnection(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
  }
}
