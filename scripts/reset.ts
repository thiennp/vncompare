import { getDatabase } from '../src/lib/mongodb';

async function resetDatabase() {
  try {
    const db = await getDatabase();

    console.log('🗑️ Starting database reset...');

    // Clear all collections
    await db.collection('users').deleteMany({});
    await db.collection('products').deleteMany({});
    await db.collection('suppliers').deleteMany({});
    await db.collection('provinces').deleteMany({});
    await db.collection('districts').deleteMany({});
    await db.collection('wards').deleteMany({});
    await db.collection('orders').deleteMany({});
    await db.collection('orderItems').deleteMany({});
    await db.collection('addresses').deleteMany({});
    await db.collection('reviews').deleteMany({});
    await db.collection('productCoverage').deleteMany({});
    await db.collection('shippingZones').deleteMany({});
    await db.collection('serviceAreas').deleteMany({});

    console.log('✅ Database reset completed successfully!');
    console.log('💡 Run "npm run db:seed" to populate with sample data');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase();
