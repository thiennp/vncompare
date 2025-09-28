import CoverageCalculatorPage from '../features/products/pages/CoverageCalculatorPage';
import { coverageCalculatorLoader } from '../features/products/pages/loaders/coverageCalculatorLoader';

export const loader = coverageCalculatorLoader;

export default function CoverageCalculator() {
  return <CoverageCalculatorPage />;
}
