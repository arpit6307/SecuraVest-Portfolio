// src/components/AdminLogin.jsx

import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { FaLock, FaUserShield, FaEnvelope, FaEye, FaEyeSlash, FaFingerprint, FaShieldAlt } from 'react-icons/fa';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const { loading, authError, login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <div className="page-wrapper">
            
            {/* BACKGROUND ELEMENTS */}
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="grid-overlay"></div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="container position-relative z-2 d-flex align-items-center justify-content-center min-vh-100">
                
                <div className="luxury-glass-card animate-zoom-in">
                    
                    {/* Header Section */}
                    <div className="text-center mb-5">
                        <div className="security-icon-wrapper mb-3">
                            <div className="icon-pulse"></div>
                            <FaUserShield size={40} className="royal-text-accent position-relative z-2" />
                        </div>
                        <h2 className="fw-bold text-white tracking-wide">COMMAND CENTER</h2>
                        <p className="text-white-50 small text-uppercase letter-spacing-2">Restricted Access Only</p>
                    </div>

                    {/* Error Message Display */}
                    {authError && (
                        <div className="error-badge mb-4">
                            <FaShieldAlt className="me-2" /> {authError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        
                        {/* Email Input */}
                        <div className="mb-4 group">
                            <label className="custom-label">Admin Identity</label>
                            <div className="custom-input-wrapper">
                                <FaEnvelope className="input-icon" />
                                <input 
                                    type="email" 
                                    className="custom-input" 
                                    placeholder="Enter secure email ID"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <div className="input-border-bottom"></div>
                            </div>
                        </div>
                        
                        {/* Password Input */}
                        <div className="mb-5 group">
                            <label className="custom-label">Access Key</label>
                            <div className="custom-input-wrapper">
                                <FaLock className="input-icon" />
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    className="custom-input" 
                                    placeholder="Enter authorized password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button" 
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                <div className="input-border-bottom"></div>
                            </div>
                        </div>
                        
                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className="btn-gold-gradient w-100"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="d-flex align-items-center justify-content-center">
                                    <FaFingerprint className="me-2 fa-spin-slow" /> Verifying...
                                </span>
                            ) : (
                                <span className="d-flex align-items-center justify-content-center">
                                    <FaFingerprint className="me-2" /> Authenticate
                                </span>
                            )}
                        </button>

                    </form>

                    <div className="text-center mt-4">
                        <p className="text-white-50 extra-small">
                            <FaLock className="me-1" size={10} /> 
                            Connection is End-to-End Encrypted via SecuraVest Protocols.
                        </p>
                    </div>

                </div>
            </div>

            {/* --- CSS STYLES (Matches Appointment.jsx Theme) --- */}
            <style>{`
                :root {
                    --gold: #DAA520;
                    --navy: #002D62;
                    --glass-bg: rgba(255, 255, 255, 0.03);
                    --glass-border: rgba(255, 255, 255, 0.1);
                }

                .page-wrapper {
                    position: relative;
                    min-height: 100vh;
                    background-color: #002D62; /* Deep Navy/Black */
                    color: white;
                    overflow: hidden;
                }

                /* Background Orbs */
                .orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    z-index: 0;
                    opacity: 0.4;
                }
                .orb-1 {
                    top: -10%; left: -10%; width: 500px; height: 500px;
                    background: radial-gradient(circle, var(--navy), transparent);
                }
                .orb-2 {
                    bottom: -10%; right: -10%; width: 400px; height: 400px;
                    background: radial-gradient(circle, rgba(218, 165, 32, 0.2), transparent);
                }
                .grid-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background-image: linear-gradient(var(--glass) 1px, transparent 1px),
                    linear-gradient(90deg, var(--glass) 1px, transparent 1px);
                    background-size: 40px 40px;
                    z-index: 1;
                    opacity: 0.3;
                }

                /* Glass Card */
                .luxury-glass-card {
                    width: 100%;
                    max-width: 450px;
                    background: rgba(10, 20, 35, 0.75);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--border);
                    border-radius: 24px;
                    padding: 3rem;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05);
                    position: relative;
                    overflow: hidden;
                }
                
                /* Top Gold Line */
                .luxury-glass-card::before {
                    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px;
                    background: linear-gradient(90deg, transparent, var(--gold), transparent);
                }

                /* Icons & Badges */
                .security-icon-wrapper {
                    position: relative;
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    width: 80px; height: 80px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--border);
                }
                .icon-pulse {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    border-radius: 50%; border: 1px solid var(--gold);
                    animation: pulse 2s infinite;
                    opacity: 0;
                }
                .error-badge {
                    background: rgba(220, 53, 69, 0.2);
                    border: 1px solid rgba(220, 53, 69, 0.5);
                    color: #ff6b6b;
                    padding: 10px;
                    border-radius: 8px;
                    font-size: 0.9rem;
                    display: flex; align-items: center; justify-content: center;
                }

                /* Inputs */
                .custom-label {
                    color: #8892b0; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; margin-bottom: 8px; display: block; letter-spacing: 1px;
                }
                .custom-input-wrapper {
                    position: relative;
                    background: rgba(0,0,0,0.2);
                    border-radius: 8px;
                    border: 1px solid rgba(255,255,255,0.1);
                    transition: all 0.3s;
                }
                .custom-input-wrapper:focus-within {
                    border-color: var(--gold);
                    box-shadow: 0 0 15px rgba(218, 165, 32, 0.1);
                }
                .input-icon {
                    position: absolute; top: 50%; left: 15px; transform: translateY(-50%);
                    color: var(--gold); opacity: 0.7;
                }
                .custom-input {
                    width: 100%;
                    background: transparent;
                    border: none;
                    padding: 14px 45px 14px 45px; /* Space for icons */
                    color: white;
                    font-size: 1rem;
                }
                .custom-input:focus {
                    outline: none;
                }
                .custom-input::placeholder { color: rgba(255,255,255,0.3); }
                
                .password-toggle {
                    position: absolute; top: 50%; right: 15px; transform: translateY(-50%);
                    background: none; border: none; color: #8892b0; cursor: pointer;
                    transition: color 0.3s;
                }
                .password-toggle:hover { color: white; }

                /* Button */
                .btn-gold-gradient {
                    background: linear-gradient(135deg, var(--gold), #B8860B);
                    color: #000;
                    border: none;
                    padding: 14px;
                    border-radius: 50px;
                    font-weight: bold;
                    font-size: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.3s;
                    box-shadow: 0 4px 15px rgba(218, 165, 32, 0.3);
                }
                .btn-gold-gradient:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(218, 165, 32, 0.5);
                    filter: brightness(1.1);
                }
                .btn-gold-gradient:disabled {
                    opacity: 0.7; cursor: not-allowed;
                }

                /* Utility */
                .tracking-wide { letter-spacing: 1px; }
                .letter-spacing-2 { letter-spacing: 2px; }
                .extra-small { font-size: 0.75rem; }
                .fa-spin-slow { animation: spin 2s linear infinite; }

                /* Animations */
                .animate-zoom-in { animation: zoomIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
                @keyframes zoomIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.5; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                @keyframes spin { 100% { transform: rotate(360deg); } }

            `}</style>
        </div>
    );
};

export default AdminLogin;