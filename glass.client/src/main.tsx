import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"
import App from "./App.tsx";

import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Theme>
                <App />
            </Theme>
        </BrowserRouter>
    </StrictMode>
);
