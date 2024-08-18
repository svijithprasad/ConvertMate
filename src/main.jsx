import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider.jsx";
import About from "./_components/About.jsx";
import { Toaster } from "sonner";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/about",
    element: <About />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
    <Toaster richColors />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
