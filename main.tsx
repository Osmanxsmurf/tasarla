import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MusicProvider } from "./contexts/MusicContext";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <MusicProvider>
      <App />
    </MusicProvider>
  </ThemeProvider>
);
