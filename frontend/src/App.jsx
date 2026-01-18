import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StoresList from "./pages/StoresList";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminStores from "./pages/AdminStores";
import OwnerDashboard from "./pages/OwnerDashboard";

function ProtectedRoute({ children, allowedRoles }) {
  const { auth, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!auth) return <Navigate to="/login" />;
  if (!allowedRoles.includes(auth.user.role)) return <Navigate to="/login" />;

  return children;
}

function AppRoutes() {
  const { auth, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Normal User */}
      <Route
        path="/stores"
        element={
          <ProtectedRoute allowedRoles={["normal_user"]}>
            <StoresList />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stores"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminStores />
          </ProtectedRoute>
        }
      />

      {/* Store Owner */}
      <Route
        path="/store-owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={["store_owner"]}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Default */}
      <Route
        path="/"
        element={
          auth ? (
            auth.user.role === "admin" ? (
              <Navigate to="/admin/dashboard" />
            ) : auth.user.role === "store_owner" ? (
              <Navigate to="/store-owner/dashboard" />
            ) : (
              <Navigate to="/stores" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
