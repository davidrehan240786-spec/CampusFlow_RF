import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Stats from "./components/Stats";
import Features from "./components/Features";
import Product from "./components/Product";
import Testimonials from "./components/Testimonials";
import Blog from "./components/Blog";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ToasterDemo from "./components/ui/toast-demo";
import Dashboard from "./components/Dashboard";
import StaffDashboard from "./components/StaffDashboard";
import ContactPage from "./components/ContactPage";
import AddItemPage from "./components/AddItemPage";
import ReportLostPage from "./components/ReportLostPage";
import ReportFoundPage from "./components/ReportFoundPage";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useScrollReveal } from "./lib/useScrollReveal";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const location = useLocation();
  const { user } = useAuth();
  useScrollReveal([location.pathname]);

  // Scroll to top or hash on route change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="relative min-h-screen bg-brand-bg-top overflow-x-hidden selection:bg-white selection:text-black">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignUp />} />
        <Route path="/toast-demo" element={<ToasterDemo />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/staff-dashboard" element={user ? <StaffDashboard /> : <Navigate to="/login" />} />
        <Route path="/add-item" element={user ? <AddItemPage /> : <Navigate to="/login" />} />
        <Route path="/report-lost" element={user ? <ReportLostPage /> : <Navigate to="/login" />} />
        <Route path="/report-found" element={user ? <ReportFoundPage /> : <Navigate to="/login" />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/" element={
          <>
            <Navbar />
            
            <main>
              <div id="hero"><Hero /></div>
              <div id="about"><About /></div>
              <div id="stats"><Stats /></div>
              <div id="features"><Features /></div>
              <div id="product"><Product /></div>
              <div id="testimonials"><Testimonials /></div>
              <div id="blog"><Blog /></div>
              <div id="faqs"><FAQ /></div>
            </main>

            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
