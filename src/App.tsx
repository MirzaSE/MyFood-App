import { BrowserRouter, Routes, Route } from "react-router-dom";
import FoodPage from "./components/FoodPage";
import LoginPage from "./components/LoginPage";

import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem("accessToken");

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <FoodPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;