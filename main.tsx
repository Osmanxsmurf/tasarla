import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set up service worker if needed later
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

createRoot(document.getElementById("root")!).render(<App />);
