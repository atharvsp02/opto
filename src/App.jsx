import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import MainPage from "./components/Main/MainPage";
import Profile from "./components/Profile/Profile";
import { Context } from "./context/context";
import SkeletonLoader from "./components/AnimatedComponents/SkeletonLoader";
import "./App.css";

function App() {
  const { authLoading } = useContext(Context);

  if (authLoading) {
    return <SkeletonLoader />;
  }

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
