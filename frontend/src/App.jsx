import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// pages & components
import Home from "./pages/HomePage";
import AddPropertyPage from "./pages/AddPropertyPage";
import EditPropertyPage from "./pages/EditPropertyPage";
import PropertyPage from "./pages/PropertyPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import NotFoundPage from "./pages/NotFoundPage";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/properties/:propertyId" element={<PropertyPage />} />
            {/* Protected routes */}
            <Route
              path="/add-property"
              element={
                <ProtectedRoute>
                  <AddPropertyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/properties/:propertyId/edit"
              element={
                <ProtectedRoute>
                  <EditPropertyPage />
                </ProtectedRoute>
              }
            />
            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>

      </BrowserRouter>
    </div>
  );
};

export default App;