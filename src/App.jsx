// src/App.jsx

import React, { useState, useEffect } from 'react';

// Core Layout and Feature Components (Public Site)
import Navbar from './components/Navbar';
import AgentProfile from './components/AgentProfile';
// --- NEW IMPORT: TeamRecruitment Component ---
import TeamRecruitment from './components/TeamRecruitment'; // <--- NEW IMPORT
import MetricDashboard from './components/MetricDashboard';
import Testimonials from './components/Testimonials';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer'; 
import CustomLoader from './components/common/CustomLoader'; 

// --- NEW IMPORT: Appointment Component ---
import Appointment from './components/Appointment';

// Admin Components
import useAuth from './hooks/useAuth'; 
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

// Icons
import { FaArrowUp } from 'react-icons/fa';

// css
import './App.css';

// --- NEW COMPONENT: SCROLL TO TOP BUTTON ---
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button 
            onClick={scrollToTop} 
            className="scroll-to-top-btn"
            aria-label="Scroll to top"
        >
          <FaArrowUp className="arrow-icon" />
        </button>
      )}
      <style>{`
        .scroll-to-top-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 55px;
            height: 55px;
            background: linear-gradient(135deg, #DAA520, #B8860B); /* Royal Gold Gradient */
            color: #0a0f1c; /* Deep Navy Icon */
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(218, 165, 32, 0.4), 0 0 0 2px rgba(255, 255, 255, 0.1); /* Glow Ring */
            z-index: 9999;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Bouncy Transition */
            opacity: 0;
            animation: fadeInUp 0.5s forwards;
        }

        .scroll-to-top-btn:hover {
            transform: translateY(-8px) scale(1.1); /* Lift Effect */
            box-shadow: 0 10px 25px rgba(218, 165, 32, 0.6);
            color: #fff; /* Icon turns white on hover */
            background: linear-gradient(135deg, #FFD700, #DAA520); /* Brighter Gold */
        }

        .scroll-to-top-btn:active {
            transform: scale(0.9);
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Mobile Adjustment */
        @media (max-width: 768px) {
            .scroll-to-top-btn {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
                font-size: 1.2rem;
            }
        }
      `}</style>
    </>
  );
};

// Component to render the full public-facing website
const PublicSite = () => (
  <>
    <Navbar />
    <main className="container-fluid p-0">
      <AgentProfile /> 
      {/* --- UPDATED: TeamRecruitment component inserted here --- */}
      <TeamRecruitment />
      <MetricDashboard />
      <Testimonials /> 
      <ContactForm /> 
    </main>
    
    <Footer />
    
    {/* --- ADDED SCROLL TO TOP HERE --- */}
    <ScrollToTop />
  </>
);

function App() {
  const { user, loading } = useAuth();
  
  // Check for specific paths
  const isAdminPath = window.location.pathname === '/admin';
  const isAppointmentPath = window.location.pathname === '/book-appointment'; 
  
  if (loading) {
    return <CustomLoader />;
  }

  // --- ADMIN ROUTE ---
  if (isAdminPath) {
    if (user) {
      return <AdminDashboard />;
    } else {
      return <AdminLogin />;
    }
  }

  // --- APPOINTMENT ROUTE ---
  if (isAppointmentPath) {
    return <Appointment />;
  }

  // --- PUBLIC SITE ---
  return <PublicSite />;
}

export default App;