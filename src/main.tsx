import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeResizeObserverFix } from "./lib/resize-observer-fix";

// Initialize ResizeObserver error suppression
initializeResizeObserverFix();

createRoot(document.getElementById("root")!).render(<App />);
