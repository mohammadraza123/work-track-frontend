'use client'
import { useEffect } from "react";
import AuthPage from "./components/AuthPage";

const HomePage = () => {

useEffect (() => {
  // Replace history so this page becomes first entry
  window.history.replaceState(null, "", window.location.href);
}, []);

  return <AuthPage />;
  
};

export default HomePage;
