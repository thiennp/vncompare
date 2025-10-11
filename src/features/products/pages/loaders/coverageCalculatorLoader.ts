// Coverage calculator page loader (client-side)
export async function coverageCalculatorLoader() {
  try {
    // TODO: Fetch from API
    // For now, return empty products
    return {
      products: [],
    };
  } catch (error) {
    console.error('Error loading coverage calculator data:', error);
    return {
      products: [],
    };
  }
}
