import { useContext, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import Login from "@/components/Login/Login";
import MainPage from "@/components/Main/MainPage";
import Profile from "@/components/Profile/Profile";
import { Context } from "@/context/context";
import SkeletonLoader from "@/components/AnimatedComponents/SkeletonLoader";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";

const MarketPage = lazy(() => import("@/pages/MarketPage"));
const PortfolioPage = lazy(() => import("@/pages/PortfolioPage"));

function App() {
  const { authLoading } = useContext(Context);

  if (authLoading) {
    return <SkeletonLoader />;
  }

  return (
    <>
      <Suspense fallback={<SkeletonLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
          <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to={"/"} />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
