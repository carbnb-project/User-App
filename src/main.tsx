
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { LocationProvider } from "./app/context/LocationContext";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <LocationProvider>
    <App />
  </LocationProvider>
);
