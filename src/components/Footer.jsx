// src/components/Footer.jsx

import React from 'react';
import { FaLinkedinIn, FaFacebookF, FaInstagram, FaCrown, FaHeart, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'; 
import useAgentMetrics from '../hooks/useAgentMetrics';

const Footer = () => {
    const { metrics } = useAgentMetrics();
    
    const currentYear = new Date().getFullYear();
    const DEVELOPER_NAME = "Arpit Singh Yadav";
    
    // Dynamic Data with Fallbacks
    const contactInfo = {
        address: metrics?.address || 'LIC LalBagh Branch, Hazratganj, Lucknow, UP',
        phone: metrics?.phone || '+91 9696923995',
        email: metrics?.email || 'ashoklic.yadav@gmail.com'
    };

    return (
        <footer className="royal-footer position-relative overflow-hidden">
            
            {/* Background FX (Seamless Match) */}
            <div className="orb orb-footer-1"></div>
            <div className="orb orb-footer-2"></div>
            <div className="grid-overlay"></div>

            <div className="container position-relative z-2 pt-5 pb-4">
                
                <div className="row g-5 justify-content-between">
                    
                    {/* 1. BRAND SECTION */}
                    <div className="col-lg-4 col-md-6">
                        <div className="brand-box mb-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="crown-icon-bg me-3">
                                    <FaCrown size={24} className="text-gold" />
                                </div>
                                <div>
                                    <h4 className="text-white fw-bold mb-0 ls-1">SECURAVEST</h4>
                                    <small className="text-gold text-uppercase x-small">Wealth & Security</small>
                                </div>
                            </div>
                            <p className="text-white-50 small" style={{lineHeight: '1.6'}}>
                                Your lifelong partner in securing wealth and ensuring family stability. 
                                We build foundations that last for generations.
                            </p>
                        </div>
                    </div>

                    {/* 2. QUICK LINKS */}
                    <div className="col-lg-3 col-md-6">
                        <h6 className="text-gold text-uppercase fw-bold mb-4 ls-2">Navigation</h6>
                        <ul className="list-unstyled footer-links">
                            <li><a href="#agent-profile">Agent Profile</a></li>
                            <li><a href="#metrics">Performance</a></li>
                            <li><a href="#testimonials">Client Stories</a></li>
                            <li><a href="/book-appointment" className="text-gold">Book Appointment</a></li>
                        </ul>
                    </div>

                    {/* 3. CONTACT & SOCIAL */}
                    <div className="col-lg-4 col-md-12">
                        <h6 className="text-gold text-uppercase fw-bold mb-4 ls-2">Connect</h6>
                        
                        <div className="contact-mini mb-4">
                            <p className="text-white-50 small mb-2"><FaMapMarkerAlt className="me-2 text-gold"/> {contactInfo.address}</p>
                            <p className="text-white-50 small mb-2"><FaPhoneAlt className="me-2 text-gold"/> {contactInfo.phone}</p>
                            <p className="text-white-50 small"><FaEnvelope className="me-2 text-gold"/> {contactInfo.email}</p>
                        </div>

                        <div className="d-flex gap-3 social-icons">
                            <a href="https://www.linkedin.com/in/arpit-singh-yadav-b675301a1/?trk=opento_sprofile_details" className="social-btn"><FaLinkedinIn /></a>
                            <a href="https://www.facebook.com/share/17Nd1G3pKS/" className="social-btn"><FaFacebookF /></a>
                            <a href="https://www.instagram.com/arpit__6307/?__pwa=1" className="social-btn"><FaInstagram /></a>
                        </div>
                    </div>

                </div>

                {/* SEPARATOR */}
                <hr className="footer-divider my-5" />

                {/* 4. BOTTOM COPYRIGHT & CREDIT */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <p className="text-white-50 small mb-3 mb-md-0">
                        © {currentYear} SecuraVest Portfolio. All Rights Reserved.
                    </p>
                    
                    {/* THE SHINING SIGNATURE */}
                    <div className="developer-credit">
                        <span className="text-white-50 small me-2">Masterpiece by</span>
                        <span className="signature-text">
                            {DEVELOPER_NAME} <FaHeart className="heart-pulse ms-1" size={12} />
                        </span>
                    </div>
                </div>

            </div>

            {/* CSS STYLES */}
            <style>{`
                :root {
                    --gold: #DAA520;
                    --navy: #002D62;
                    --glass-bg: rgba(255, 255, 255, 0.03);
                    --glass-border: rgba(255, 255, 255, 0.1);
                }

                .royal-footer {
                    background-color: var(--navy); /* Using the exact same navy variable */
                    border-top: 1px solid rgba(255, 255, 255, 0.05); /* Subtle separator */
                    color: white;
                }

                /* Background Orbs (Consistency) */
                .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.3; z-index: 0; }
                .orb-footer-1 { top: -50%; left: -10%; width: 400px; height: 400px; background: radial-gradient(circle, #002D62, transparent); }
                .orb-footer-2 { bottom: -50%; right: -10%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(218, 165, 32, 0.15), transparent); }
                .grid-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 30px 30px; z-index: 1; opacity: 0.2; pointer-events: none;
                }

                /* Brand */
                .crown-icon-bg {
                    width: 45px; height: 45px;
                    background: rgba(218, 165, 32, 0.1);
                    border: 1px solid var(--gold);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 0 15px rgba(218, 165, 32, 0.2);
                }
                .ls-1 { letter-spacing: 1px; }
                .ls-2 { letter-spacing: 2px; }
                .x-small { font-size: 0.65rem; }
                .text-gold { color: var(--gold) !important; }

                /* Links */
                .footer-links li { margin-bottom: 12px; }
                .footer-links a {
                    color: rgba(255, 255, 255, 0.6);
                    text-decoration: none;
                    transition: all 0.3s;
                    display: inline-block;
                }
                .footer-links a:hover {
                    color: var(--gold);
                    transform: translateX(5px);
                }

                /* Social Buttons */
                .social-btn {
                    width: 40px; height: 40px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--glass-border);
                    display: flex; align-items: center; justify-content: center;
                    color: white; transition: all 0.3s;
                }
                .social-btn:hover {
                    background: var(--gold);
                    color: #000;
                    transform: translateY(-3px) rotate(360deg);
                    box-shadow: 0 0 15px rgba(218, 165, 32, 0.4);
                }

                /* Divider */
                .footer-divider {
                    border-color: rgba(255, 255, 255, 0.1);
                    opacity: 0.5;
                }

                /* Developer Signature */
                .developer-credit {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 8px 20px;
                    border-radius: 50px;
                    border: 1px solid var(--glass-border);
                    display: inline-flex; align-items: center;
                }
                .signature-text {
                    font-family: 'Cursive', sans-serif;
                    font-weight: bold;
                    background: linear-gradient(45deg, #fff, #DAA520);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .heart-pulse { color: #ff6b6b; animation: pulse 1.5s infinite; }
                
                @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }

                @media (max-width: 768px) {
                    .footer-links { text-align: left; }
                    .social-icons { justify-content: flex-start; }
                }
            `}</style>
        </footer>
    );
};

export default Footer;