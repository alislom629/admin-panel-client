import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Pages
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CardsPage from "./pages/CardsPage";
import PlatformsPage from "./pages/PlatformsPage";
import TransactionsPage from "./pages/TransactionsPage";
import LotteryPage from "./pages/LotteryPage";
import LoginDevicesPage from "./pages/LoginDevicesPage"; // <-- Import the new page

// Components
import PrivateRoute from "./components/Auth/PrivateRoute";
import Navbar from "./components/layout/Navbar";
import AdminManagementPage from "./pages/AdminManagementPage";
import CurrencyPage from "./pages/CurrencyPage";
import OsonConfigsListPage from "./pages/OsonConfigPage";
import OsonConfigDetailPage from "./pages/OsonConfigDetailPage";
import BroadcastPage from "./pages/BroadcastPage";
import HumoService from "./pages/HumoService";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/cards"
            element={
              <PrivateRoute>
                <CardsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/platforms"
            element={
              <PrivateRoute>
                <PlatformsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <PrivateRoute>
                <TransactionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/lottery"
            element={
              <PrivateRoute>
                <LotteryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/oson-configs"
            element={
              <PrivateRoute>
                <OsonConfigsListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/oson-configs/:id"
            element={
              <PrivateRoute>
                <OsonConfigDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/currency"
            element={
              <PrivateRoute>
                <CurrencyPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/login-devices"
            element={
              <PrivateRoute>
                <LoginDevicesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admins"
            element={
              <PrivateRoute>
                <AdminManagementPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/broadcast"
            element={
              <PrivateRoute>
                <BroadcastPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/humo"
            element={
              <PrivateRoute>
                <HumoService />
              </PrivateRoute>
            }
          />

          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
