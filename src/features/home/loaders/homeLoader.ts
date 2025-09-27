// Home page loader
export async function homeLoader() {
  try {
    // Fetch data from API endpoint
    const response = await fetch('/api/home');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading home page data:', error);
    // Return empty arrays as fallback
    return {
      featuredProducts: [],
      suppliers: [],
      reviews: [],
    };
  }
}
