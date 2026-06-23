/**
 * main.jsx
 *
 * Kyu exist karta hai?
 * - React app ka ENTRY POINT hai (backend ka server.js jaisa)
 * - App component ko HTML ke #root div me mount karta hai
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // Tailwind styles

// React 18 ka createRoot API use karo
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
