import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "react-responsive-modal/styles.css";
import "react-tooltip/dist/react-tooltip.css";
import 'react-slideshow-image/dist/styles.css'
import ReactQueryProvider from "./lib/providers/ReactQueryProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ReactQueryProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ReactQueryProvider>
);
