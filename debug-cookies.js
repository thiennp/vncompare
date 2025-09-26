// Cookie debugging script - run this in browser console
console.log('🍪 Debugging Cookie Authentication...');

// Check if auth cookie exists
const authCookie = document.cookie
  .split('; ')
  .find(row => row.startsWith('auth_token='));

console.log('Auth cookie exists:', !!authCookie);
if (authCookie) {
  const token = authCookie.split('=')[1];
  console.log('Token preview:', token.substring(0, 50) + '...');
}

// Check all cookies
console.log('All cookies:', document.cookie);

// Clear auth cookie if needed
function clearAuthCookie() {
  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  console.log('✅ Auth cookie cleared');
}

console.log('Run clearAuthCookie() to clear the auth cookie');
