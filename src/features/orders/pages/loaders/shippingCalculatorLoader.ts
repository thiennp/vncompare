// Shipping calculator page loader (client-side)
export async function shippingCalculatorLoader() {
  try {
    // TODO: Fetch from API
    // For now, return empty data
    return {
      suppliers: [],
      provinces: [],
    };
  } catch (error) {
    console.error('Error loading shipping calculator data:', error);
    return {
      suppliers: [],
      provinces: [],
    };
  }
}
