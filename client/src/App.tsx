import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthProvider";

import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "12px",
            padding: "14px",
          },
        }}
      />
    </AuthProvider>
  );
}
