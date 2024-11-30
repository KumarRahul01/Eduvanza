import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./contexts/AuthContext";
// import { Provider } from "react-redux";
// import { appStore } from "./store/store";

createRoot(document.getElementById("root")).render(
  // <Provider store={appStore}>
  <BrowserRouter>
    <AuthContextProvider>
      <App />
      <Toaster />
    </AuthContextProvider>
  </BrowserRouter>
  // </Provider>
);
