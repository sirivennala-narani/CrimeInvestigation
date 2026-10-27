import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateCase from './pages/CreateCase';
import Investigation from './pages/Investigation';
import Accusation from './pages/Accusation';
import Results from './pages/Results';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#080b12] text-slate-100 noir-grid">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateCase />} />
            <Route path="/investigation/:id" element={<Investigation />} />
            <Route path="/accusation/:id" element={<Accusation />} />
            <Route path="/results/:id" element={<Results />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
