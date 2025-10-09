// Database seeding script for paint project
import { MongoClient } from 'mongodb';
import { hashPassword } from '../features/auth/services/hashPassword';

const MONGODB_URI = 'mongodb://localhost:27017/vncompare';

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('vncompare');
    
    // Create users collection if it doesn't exist
    const usersCollection = db.collection('users');
    
    // Clear existing users
    await usersCollection.deleteMany({});
    
    // Seed test users
    const testUsers = [
      {
        _id: 'admin1',
        email: 'admin@paint.com',
        name: 'Admin User',
        password: hashPassword('admin123'),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'user1',
        email: 'user@paint.com',
        name: 'Regular User',
        password: hashPassword('user123'),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: 'test1',
        email: 'test@example.com',
        name: 'Test User',
        password: hashPassword('test123'),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    await usersCollection.insertMany(testUsers);
    
    console.log('✅ Database seeded successfully!');
    console.log('Test users created:');
    console.log('- admin@paint.com / admin123 (admin)');
    console.log('- user@paint.com / user123 (user)');
    console.log('- test@example.com / test123 (user)');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run the seeding script
seedDatabase();
