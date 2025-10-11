// Database seeding script for paint project
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

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

    // Seed test users with hashed passwords
    const testUsers = [
      {
        _id: new ObjectId(),
        email: 'admin@paint.com',
        name: 'Admin User',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        email: 'user@paint.com',
        name: 'Regular User',
        password: bcrypt.hashSync('user123', 10),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        email: 'test@example.com',
        name: 'Test User',
        password: bcrypt.hashSync('test123', 10),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        email: 'nguyenphongthien@gmail.com',
        name: 'Nguyen Phong Thien',
        password: bcrypt.hashSync('Kimtuoc2', 10),
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
    console.log('- nguyenphongthien@gmail.com / Kimtuoc2 (user)');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run the seeding script
seedDatabase();
