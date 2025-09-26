// Note: This script is for Node.js environment
// For browser environment, use the resetDatabase method from the database service
// or simply refresh the browser to clear localStorage

async function resetDatabase() {
  try {
    console.log('🗑️ Database reset for browser environment:');
    console.log('1. Open browser developer tools (F12)');
    console.log('2. Go to Application/Storage tab');
    console.log('3. Clear Local Storage');
    console.log('4. Refresh the page');
    console.log('5. Run "pnpm run db:seed" to populate with sample data');
    console.log('');
    console.log('✅ Instructions provided successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
}

resetDatabase();
