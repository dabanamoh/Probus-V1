import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add performance monitoring
if ('performance' in window) {
  // Measure initial load time
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (perfData) {
      console.log(`Page loaded in ${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`);
    }
  });
}

// Create root with error boundary
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Failed to find the root element');
}