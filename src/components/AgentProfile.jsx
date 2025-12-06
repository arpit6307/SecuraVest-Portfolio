// src/components/AgentProfile.jsx

import React from 'react';
import useAgentMetrics from '../hooks/useAgentMetrics';
import { Container, Row, Col } from 'react-bootstrap'; 
import { FaUserTie, FaAward, FaChartLine, FaShieldAlt, FaPhoneVolume, FaCheckCircle, FaQuoteLeft } from 'react-icons/fa';
import { MdVerified, MdStarRate, MdWorkspacePremium } from 'react-icons/md';

// Hardcoded Image (Backup) - This will be used only if Firebase 'img_url' is empty.
const DEFAULT_FALLBACK_URL = "https://i.postimg.cc/W4jNLtsz/Whats-App-Image-2025-11-22-at-10-24-20-PM.jpg"; 

// --- SUB-COMPONENT: FEATURE CARD (Original) ---
const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="col-12 col-md-6 col-lg-3 mb-4">
        <div className="feature-glass-card h-100">
            <div className="icon-wrapper mb-3">
                <Icon size={28} />
            </div>
            <h5 className="fw-bold text-white mb-2">{title}</h5>
            <p className="text-white-50 small mb-0">{desc}</p>
        </div>
    </div>
);

const AgentProfile = () => {
    const { metrics, loading, error } = useAgentMetrics();

    if (loading) return <div className="text-center py-5 royal-text-accent">Loading Profile...</div>;
    if (error) return null;

    // Data Destructuring with Fallbacks
    const { 
        agent_name = "Ashok Kumar Yadav", 
        tagline = "Securing Families, Building Wealth.", 
        years_experience = 15,
        description = "Dedicated to providing financial stability through trusted LIC solutions.",
        specializations = ["Life Insurance", "Pension Plans", "Tax Planning"],
        policies_issued = 500,
        live_policies = 450,
        img_url // NEW: Fetch the dynamically set image URL
    } = metrics || {};

    // Use the dynamic URL if available, otherwise use the original hardcoded fallback
    const finalImageUrl = img_url || DEFAULT_FALLBACK_URL;
    
    const specializationList = Array.isArray(specializations) ? specializations : [];

    return (
        <section id="agent-profile" className="profile-section position-relative overflow-hidden">
            
            {/* BACKGROUND FX */}
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="grid-overlay"></div>

            <Container className="position-relative z-2 pt-5 pb-5">
                
                {/* --- HERO SECTION --- */}
                <Row className="align-items-center mb-5">
                    
                    {/* Left: Text & Bio */}
                    <div className="col-lg-7 order-2 order-lg-1 text-center text-lg-start">
                        <div className="badge-pill mb-3 mx-auto mx-lg-0">
                            <MdVerified className="me-1" /> Authorized LIC Advisor
                        </div>
                        
                        <h1 className="display-4 fw-bold text-white mb-2 name-gradient">
                            {agent_name}
                        </h1>
                        <p className="h5 royal-text-accent mb-4 fw-light ls-1">
                            {tagline}
                        </p>

                        <div className="bio-glass p-4 mb-4 text-start">
                            <FaQuoteLeft className="text-gold opacity-25 mb-2" size={20} />
                            <p className="text-white-75 mb-0" style={{lineHeight: '1.8'}}>
                                {description}
                            </p>
                        </div>

                        {/* Quick Stats Row */}
                        <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-3 mb-4">
                            <div className="stat-chip">
                                <span className="fw-bold text-gold">{years_experience}+</span> Years Exp
                            </div>
                            <div className="stat-chip">
                                <span className="fw-bold text-gold">{policies_issued}+</span> Families Secured
                            </div>
                            <div className="stat-chip">
                                <span className="fw-bold text-gold">100%</span> Claim Settlement
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
                            <a href="#contact" className="btn-gold-glow">
                                <FaPhoneVolume className="me-2" /> Schedule Consultation
                            </a>
                            <a href="#testimonials" className="btn-outline-glass">
                                <MdStarRate className="me-2" /> View Client Reviews
                            </a>
                        </div>
                    </div>

                    {/* Right: Profile Image (The "Halo" Effect) */}
                    <div className="col-lg-5 order-1 order-lg-2 mb-5 mb-lg-0 text-center">
                        <div className="profile-halo-wrapper mx-auto">
                            <div className="spinning-ring"></div>
                            <div className="static-ring"></div>
                            <img 
                                src={finalImageUrl} // DYNAMIC IMAGE SOURCE
                                alt={agent_name} 
                                className="profile-img-main" 
                            />
                            <div className="exp-badge floating-badge">
                                <MdWorkspacePremium size={24} className="text-gold mb-1" />
                                <span className="d-block fw-bold small">{years_experience} Years</span>
                                <span className="d-block x-small">Excellence</span>
                            </div>
                        </div>
                    </div>
                </Row>

                {/* --- WHY CHOOSE ME (Cards) --- */}
                <div className="my-5 pt-4">
                    <div className="text-center mb-5">
                        <h6 className="text-gold text-uppercase ls-2 mb-2">The SecuraVest Standard</h6>
                        <h2 className="text-white fw-bold">Why Trust Your Future With Me?</h2>
                    </div>
                    
                    <div className="row g-4">
                        <FeatureCard 
                            icon={FaUserTie} 
                            title="Client-First Philosophy" 
                            desc="Your goals are my priority. I offer personalized advice, not just standard policies." 
                        />
                        <FeatureCard 
                            icon={FaAward} 
                            title="Proven Expertise" 
                            desc={`Over ${years_experience} years of navigating the financial landscape with successful outcomes.`} 
                        />
                        <FeatureCard 
                            icon={FaShieldAlt} 
                            title="Lifetime Support" 
                            desc="I am with you from the first premium to the final claim settlement." 
                        />
                        <FeatureCard 
                            icon={FaChartLine} 
                            title="Wealth & Security" 
                            desc="Strategies designed to grow your wealth while protecting your family's future." 
                        />
                    </div>
                </div>

                {/* --- SPECIALIZATIONS (Tags) --- */}
                <div className="text-center pb-4">
                    <p className="text-white-50 mb-3 small text-uppercase">Areas of Expertise</p>
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                        {specializationList.map((skill, index) => (
                            <span key={index} className="spec-tag">
                                <FaCheckCircle className="me-2 text-gold" size={12} /> {skill}
                            </span>
                        ))}
                    </div>
                </div>

            </Container>

            {/* --- CSS STYLES (Scoped to this Component) --- */}
            <style>{`
                :root {
                    --gold: #DAA520;
                    --navy: #002D62;
                    --glass-bg: rgba(255, 255, 255, 0.03);
                    --glass-border: rgba(255, 255, 255, 0.1);
                }

                .profile-section {
                    background-color: #0a0f1c; /* Deep Navy */
                    /* Padding adjustments for fixed navbar */
                    padding-top: 80px; 
                    min-height: 100vh;
                }

                /* --- Background FX --- */
                .orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.4; z-index: 0; }
                .orb-1 { top: -10%; left: -20%; width: 600px; height: 600px; background: radial-gradient(circle, #002D62, transparent); }
                .orb-2 { bottom: 10%; right: -10%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(218, 165, 32, 0.15), transparent); }
                .grid-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background-image: linear-gradient(var(--glass-bg) 1px, transparent 1px),
                    linear-gradient(90deg, var(--glass-bg) 1px, transparent 1px);
                    background-size: 40px 40px; z-index: 1; opacity: 0.3; pointer-events: none;
                }

                /* --- Typography --- */
                .name-gradient {
                    background: linear-gradient(90deg, #ffffff, #e0e0e0);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    letter-spacing: -1px;
                }
                .ls-1 { letter-spacing: 1px; }
                .ls-2 { letter-spacing: 2px; }
                .text-gold { color: var(--gold) !important; }

                /* --- Badges & Bio --- */
                .badge-pill {
                    display: inline-flex; align-items: center;
                    background: rgba(218, 165, 32, 0.1);
                    border: 1px solid var(--gold);
                    color: var(--gold);
                    padding: 6px 16px; border-radius: 50px;
                    font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;
                }
                .bio-glass {
                    background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
                    border-left: 4px solid var(--gold);
                    border-radius: 0 12px 12px 0;
                    backdrop-filter: blur(5px);
                }
                .stat-chip {
                    background: rgba(0,0,0,0.3);
                    border: 1px solid var(--glass-border);
                    padding: 8px 15px; border-radius: 8px;
                    color: rgba(255,255,255,0.7); font-size: 0.9rem;
                }

                /* --- Buttons --- */
                .btn-gold-glow {
                    background: linear-gradient(135deg, var(--gold), #B8860B);
                    color: #000; padding: 12px 30px; border-radius: 50px;
                    font-weight: bold; text-decoration: none;
                    box-shadow: 0 0 20px rgba(218, 165, 32, 0.3);
                    transition: all 0.3s; display: inline-flex; align-items: center; justify-content: center;
                }
                .btn-gold-glow:hover { transform: translateY(-3px); box-shadow: 0 0 30px rgba(218, 165, 32, 0.5); color: black; }
                
                .btn-outline-glass {
                    background: transparent; border: 1px solid rgba(255,255,255,0.3);
                    color: white; padding: 12px 30px; border-radius: 50px;
                    font-weight: 600; text-decoration: none;
                    transition: all 0.3s; display: inline-flex; align-items: center; justify-content: center;
                }
                .btn-outline-glass:hover { background: rgba(255,255,255,0.1); border-color: white; color: white; }

                /* --- Profile Image (The Halo) --- */
                .profile-halo-wrapper {
                    position: relative; width: 280px; height: 280px;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                }
                .profile-img-main {
                    width: 260px; height: 260px; border-radius: 50%;
                    object-fit: cover; object-position: top center;
                    z-index: 2; border: 4px solid #0a0f1c;
                }
                .spinning-ring {
                    position: absolute; inset: 0; border-radius: 50%;
                    border: 2px solid transparent;
                    border-top-color: var(--gold);
                    border-right-color: var(--gold);
                    animation: spin 8s linear infinite;
                    z-index: 1;
                }
                .static-ring {
                    position: absolute; inset: 10px; border-radius: 50%;
                    border: 1px dashed rgba(218, 165, 32, 0.3);
                    z-index: 1;
                }
                .floating-badge {
                    position: absolute; bottom: 10px; right: 0;
                    background: rgba(10, 15, 28, 0.9);
                    border: 1px solid var(--gold);
                    padding: 10px 15px; border-radius: 12px;
                    z-index: 3; text-align: center;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
                    animation: float 3s ease-in-out infinite;
                }
                .x-small { font-size: 0.65rem; text-transform: uppercase; color: #aaa; }

                /* --- Feature Cards --- */
                .feature-glass-card {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid var(--glass-border);
                    border-radius: 16px; padding: 25px;
                    text-align: center;
                    transition: all 0.3s;
                }
                .feature-glass-card:hover {
                    transform: translateY(-10px);
                    background: rgba(255, 255, 255, 0.05);
                    border-color: var(--gold);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                }
                .icon-wrapper {
                    width: 60px; height: 60px; margin: 0 auto;
                    background: rgba(218, 165, 32, 0.1);
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    color: var(--gold);
                }

                /* --- Specialization Tags --- */
                .spec-tag {
                    background: rgba(0,0,0,0.4);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.8);
                    padding: 8px 16px; border-radius: 50px;
                    font-size: 0.9rem; display: inline-flex; align-items: center;
                    transition: 0.3s;
                }
                .spec-tag:hover { border-color: var(--gold); color: white; transform: scale(1.05); }

                /* --- Animations --- */
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

                /* Mobile Adjustments */
                @media (max-width: 768px) {
                    .profile-halo-wrapper { 
                        width: 220px; 
                        height: 220px; 
                        margin-top: 55px; /* FIX: Added margin for mobile visibility */
                    }
                    .profile-img-main { width: 200px; height: 200px; }
                    .display-4 { font-size: 2.5rem; }
                    .bio-glass { padding: 20px; }
                }
            `}</style>
        </section>
    );
};

export default AgentProfile;