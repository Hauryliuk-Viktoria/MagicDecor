import React from "react";
import Header from "./components/UI/Header";
import Hero from "./components/UI/Hero";
import About from "./components/About/About";
import InfiniteGallery from "./components/Gallery/InfiniteGallery";
import Contacts from "./components/Contacts/Contacts";
import Footer from "./components/UI/Footer";
import "./styles/global.css";

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <About />
        <InfiniteGallery />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
}

// export default App;

// import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import App from './App'; // Твой основной компонент
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ProtectedRoute from "./components/Admin/ProtectedRoute";

function Root() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Основной сайт */}
        <Route path="/*" element={<App />} />

        {/* Админка */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Root;

//magicdecorPass!
//https://xbrmwpxksmdgktkfhdkq.supabase.co
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhicm13cHhrc21kZ2t0a2ZoZGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNjIzODAsImV4cCI6MjA4NzkzODM4MH0.viV6aCCmD73c3i7YtK3H8HefLNoxW9X76vr2ZMZJS-g
