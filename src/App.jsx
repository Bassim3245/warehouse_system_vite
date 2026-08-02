import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import useAppInitialization from "./hooks/useAppInitialization";

export default function App() {
  // Use custom hook for app initialization
  useAppInitialization();

  return <RouterProvider router={router} />;
}
