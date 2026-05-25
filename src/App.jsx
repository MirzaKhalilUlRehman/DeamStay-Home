import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages imports
import Home from './pages/Home.jsx';
import Properties from './pages/Properties.jsx';
import PropertyDetails from './pages/PropertyDetails.jsx';
import AddProperty from './pages/AddProperty.jsx';
import Rent from './pages/Rent.jsx';
import Buy from './pages/Buy.jsx';
import Sell from './pages/Sell.jsx';
import Apartments from './pages/Apartments.jsx';
import Villas from './pages/Villas.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Favorites from './pages/Favorites.jsx';
import Agents from './pages/Agents.jsx';
import AgentDetails from './pages/AgentDetails.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
// Subcomponent to handle selective layout hiding on routes like login or signup
function MainLayout() {
  const location = useLocation();
  const hideLayoutRoutes = ['/login', '/signup', '/forgot-password'];
  const shouldHide = hideLayoutRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-transparent text-slate-800 dark:text-stone-200 transition-colors duration-300 relative z-10">
      
      {/* Global Mesh Gradient Background for Frosted Glass Theme */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[120px]" />
      </div>
      
      <div className="relative z-10 flex-grow flex flex-col justify-between">
        {!shouldHide && <Navbar />}
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/add-property" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
            <Route path="/rent" element={<Rent />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
            <Route path="/apartments" element={<Apartments />} />
            <Route path="/villas" element={<Villas />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/agents/:id" element={<AgentDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {!shouldHide && <Footer />}
      </div>
      
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </BrowserRouter>
  );
}
