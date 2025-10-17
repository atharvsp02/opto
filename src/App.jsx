import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import MainPage from "./Components/Main/MainPage";
import Profile from "./Components/Profile/Profile";
import { Context } from "./context/context";
import SkeletonLoader from "./Components/AnimatedComponents/SkeletonLoader";
import "./App.css";

function App() {
  const { user, authLoading } = useContext(Context);

  // ⏳ While Firebase still checking session
  if (authLoading) {
    return <SkeletonLoader />;
  }

  // ✅ Once done, then render routes
  return (
    <Routes>

      <Route path="/" element={<MainPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="*" element={<Navigate to={"/"} />} />


    </Routes>
  )
}


export default App;
