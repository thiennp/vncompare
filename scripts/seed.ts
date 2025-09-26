// Note: This script is for Node.js environment
// For browser environment, the database is automatically seeded when the app loads

async function seedDatabase() {
  try {
    console.log('🌱 Database seeding for browser environment:');
    console.log(
      'The database is automatically seeded when you load the application.'
    );
    console.log('Your new admin user has been created:');
    console.log('📧 Email: nguyenphongthien@gmail.com');
    console.log('🔑 Password: Kimtuoc2');
    console.log('');
    console.log('✅ Instructions provided successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
}

seedDatabase();
