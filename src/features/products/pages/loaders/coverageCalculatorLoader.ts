// Coverage calculator page loader
export async function coverageCalculatorLoader() {
  try {
    const response = await fetch('/api/products');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      products: data.products || [],
    };
  } catch (error) {
    console.error('Error loading coverage calculator data:', error);
    return {
      products: [],
    };
  }
}
