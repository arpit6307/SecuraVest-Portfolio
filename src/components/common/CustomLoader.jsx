// src/components/common/CustomLoader.jsx

import React from 'react';
import { FaShieldAlt, FaCrown } from 'react-icons/fa';

const CustomLoader = () => {
  return (
    <div className="loader-wrapper">
      
      {/* Ambient Background Glow */}
      <div className="loader-orb"></div>
      
      <div className="loader-content position-relative z-2">
        
        {/* CENTRAL EMBLEM (SPINNING RINGS) */}
        <div className="emblem-container mb-4">
          {/* Outer Gold Ring */}
          <div className="ring-outer"></div>
          
          {/* Inner Dashed Ring */}
          <div className="ring-inner"></div>
          
          {/* Static Icon Center */}
          <div className="shield-icon-wrapper">
            <FaShieldAlt size={55} className="text-gold shield-base" />
            <FaCrown size={22} className="crown-overlay" />
          </div>
        </div>

        {/* TEXT & PROGRESS */}
        <div className="text-center">
          <h5 className="text-white fw-bold ls-3 mb-2 animate-fade">SECURAVEST</h5>
          <p className="text-gold x-small text-uppercase ls-2 mb-4">Secure Gateway Initializing...</p>
          
          {/* High-Tech Progress Bar */}
          <div className="progress-track mx-auto">
            <div className="progress-fill"></div>
          </div>
        </div>

      </div>

      {/* --- CSS STYLES --- */}
      <style>{`
        :root {
            --gold: #DAA520;
            --navy: #0a0f1c;
        }
        
        /* Container */
        .loader-wrapper {
            position: fixed; top: 0; left: 0; width: 100%; height: 100vh;
            background-color: var(--navy);
            z-index: 9999;
            display: flex; align-items: center; justify-content: center;
            overflow: hidden;
        }

        /* Background Breathing Orb */
        .loader-orb {
            position: absolute; width: 500px; height: 500px;
            background: radial-gradient(circle, rgba(218, 165, 32, 0.1), transparent 70%);
            border-radius: 50%;
            animation: breathe 3s infinite ease-in-out;
        }

        /* Emblem Container */
        .emblem-container {
            position: relative; width: 120px; height: 120px;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto;
        }

        /* Rotating Rings */
        .ring-outer {
            position: absolute; inset: 0;
            border: 2px solid transparent;
            border-top: 2px solid var(--gold);
            border-bottom: 2px solid var(--gold);
            border-radius: 50%;
            animation: spin 2s linear infinite;
            box-shadow: 0 0 20px rgba(218, 165, 32, 0.2);
        }

        .ring-inner {
            position: absolute; inset: 15px;
            border: 1px dashed rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            animation: spin-reverse 4s linear infinite;
        }

        /* Icons */
        .shield-icon-wrapper {
            position: relative; z-index: 2;
            display: flex; flex-direction: column; align-items: center;
            animation: float 2s ease-in-out infinite;
        }
        .text-gold { color: var(--gold); filter: drop-shadow(0 0 8px rgba(218,165,32,0.6)); }
        
        .crown-overlay {
            position: absolute; top: -10px; color: white;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));
            animation: glow 2s infinite alternate;
        }

        /* Typography */
        .ls-2 { letter-spacing: 2px; }
        .ls-3 { letter-spacing: 3px; }
        .x-small { font-size: 0.65rem; opacity: 0.8; }
        .animate-fade { animation: fadeInOut 2s infinite; }

        /* Progress Bar */
        .progress-track {
            width: 180px; height: 2px;
            background: rgba(255, 255, 255, 0.1);
            position: relative;
            overflow: hidden;
            border-radius: 2px;
        }
        .progress-fill {
            position: absolute; top: 0; left: 0; height: 100%; width: 40%;
            background: linear-gradient(90deg, transparent, var(--gold), transparent);
            animation: loading-slide 1.2s infinite ease-in-out;
        }

        /* Keyframes */
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes spin-reverse { 100% { transform: rotate(-360deg); } }
        @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 0.3; } 50% { transform: scale(1.2); opacity: 0.6; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes glow { from { filter: drop-shadow(0 0 2px white); } to { filter: drop-shadow(0 0 8px var(--gold)); } }
        @keyframes fadeInOut { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
        @keyframes loading-slide {
            0% { left: -50%; }
            100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default CustomLoader;