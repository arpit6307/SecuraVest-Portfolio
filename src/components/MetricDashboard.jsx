// src/components/MetricDashboard.jsx

import React from 'react';
import useAgentMetrics from '../hooks/useAgentMetrics';
import { Container, Row, Col } from 'react-bootstrap'; 
import { FaFileSignature, FaHandshake, FaShieldAlt, FaHourglassHalf, FaChartLine } from 'react-icons/fa';

// --- CUSTOM METRIC CARD COMPONENT ---
const MetricCard = ({ icon: Icon, title, value, description, delay }) => (
    <Col xs={12} sm={6} lg={3} className="mb-4">
        <div className="metric-glass-card h-100" style={{ animationDelay: delay }}>
            {/* Icon glow effect behind */}
            <div className="icon-glow"></div>
            
            <div className="card-content position-relative z-2">
                <div className="icon-box mb-3">
                    <Icon size={32} />
                </div>
                
                <h2 className="display-4 fw-bold text-gold mb-1 counter-text">
                    {value.toLocaleString()}{title.includes("Years") ? "+" : ""}
                </h2>
                
                <p className="text-uppercase ls-1 fw-bold text-white mb-3 small border-bottom border-white-10 pb-2 d-inline-block">
                    {title}
                </p>
                
                <p className="text-white-50 small mb-0" style={{ minHeight: '40px', lineHeight: '1.4' }}>
                    {description}
                </p>
            </div>
        </div>
    </Col>
);

const MetricDashboard = () => {
    const { metrics, loading, error } = useAgentMetrics();

    if (loading) return <div className="text-center py-5 royal-text-accent">Loading Metrics...</div>;
    
    // Fallback data agar DB load na ho
    const data = metrics || {
        policies_issued: 0,
        live_policies: 0,
        claims_settled: 0,
        years_experience: 0
    };

    const metricData = [
        {
            icon: FaFileSignature, 
            title: "Policies Issued", 
            value: data.policies_issued, 
            description: "Providing comprehensive coverage plans tailored to individual needs.",
            delay: "0.1s"
        },
        {
            icon: FaHandshake, 
            title: "Active Families", 
            value: data.live_policies, 
            description: "Ongoing trusted relationships building long-term financial security.",
            delay: "0.2s"
        },
        {
            icon: FaShieldAlt, 
            title: "Claims Settled", 
            value: data.claims_settled, 
            description: "A 100% commitment to being there when you need it most.",
            delay: "0.3s"
        },
        {
            icon: FaHourglassHalf, 
            title: "Years of Service", 
            value: data.years_experience, 
            description: "Decades of navigating the financial landscape with expertise.",
            delay: "0.4s"
        },
    ];

    return (
        <section id="metrics" className="metrics-section position-relative overflow-hidden">
            
            {/* BACKGROUND ELEMENTS (Same as Profile) */}
            <div className="orb orb-3"></div>
            <div className="orb orb-4"></div>
            <div className="grid-overlay"></div>

            <Container className="position-relative z-2 py-5">
                
                {/* SECTION HEADER */}
                <div className="text-center mb-5 animate-fade-up">
                    <div className="d-inline-flex align-items-center justify-content-center mb-2">
                        <span className="line-gold me-3"></span>
                        <span className="text-gold text-uppercase ls-2 small fw-bold">Performance & Trust</span>
                        <span className="line-gold ms-3"></span>
                    </div>
                    <h2 className="display-5 fw-bold text-white">Our Proven Track Record</h2>
                    <p className="text-white-50 mx-auto" style={{ maxWidth: '600px' }}>
                        Numbers that speak for themselves. A history of reliability, trust, and financial protection.
                    </p>
                </div>

                {/* METRICS GRID */}
                <Row className="justify-content-center">
                    {metricData.map((item, index) => (
                        <MetricCard 
                            key={index}
                            {...item}
                        />
                    ))}
                </Row>

            </Container>

            {/* --- CSS STYLES --- */}
            <style>{`
                :root {
                    --gold: #DAA520;
                    --navy: #002D62;
                    --glass-bg: rgba(255, 255, 255, 0.03);
                    --glass-border: rgba(255, 255, 255, 0.1);
                }

                .metrics-section {
                    background-color: var(--navy);
                    /* Seamlessly connect with profile section */
                    border-top: 1px solid var(--glass-border); 
                }

                /* --- Background FX (Varied positions) --- */
                .orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.3; z-index: 0; }
                .orb-3 { top: 20%; left: 10%; width: 400px; height: 400px; background: radial-gradient(circle, #002D62, transparent); }
                .orb-4 { bottom: 10%; right: 5%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(218, 165, 32, 0.1), transparent); }
                .grid-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background-image: linear-gradient(var(--glass-bg) 1px, transparent 1px),
                    linear-gradient(90deg, var(--glass-bg) 1px, transparent 1px);
                    background-size: 40px 40px; z-index: 1; opacity: 0.3; pointer-events: none;
                }

                /* --- Header Styling --- */
                .ls-1 { letter-spacing: 1px; }
                .ls-2 { letter-spacing: 2px; }
                .text-gold { color: var(--gold) !important; }
                .line-gold { width: 40px; height: 2px; background: var(--gold); display: inline-block; opacity: 0.7; }
                .border-white-10 { border-color: rgba(255,255,255,0.1) !important; }

                /* --- Glass Card Styling --- */
                .metric-glass-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid var(--glass-border);
                    border-radius: 20px;
                    padding: 30px 20px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    animation: fadeUp 0.8s ease-out forwards;
                    opacity: 0; transform: translateY(20px);
                }

                .metric-glass-card:hover {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: var(--gold);
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                }

                /* --- Icon & Glow --- */
                .icon-box {
                    width: 70px; height: 70px; margin: 0 auto;
                    background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.01));
                    border: 1px solid var(--glass-border);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    color: var(--gold);
                    font-size: 1.5rem;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                    transition: 0.3s;
                }
                .metric-glass-card:hover .icon-box {
                    background: var(--gold);
                    color: var(--navy);
                    transform: scale(1.1) rotate(5deg);
                }

                .icon-glow {
                    position: absolute; top: -20%; left: 50%; transform: translateX(-50%);
                    width: 100px; height: 100px;
                    background: var(--gold);
                    filter: blur(60px); opacity: 0;
                    transition: 0.4s;
                }
                .metric-glass-card:hover .icon-glow { opacity: 0.2; }

                /* --- Typography Effects --- */
                .counter-text {
                    background: linear-gradient(to bottom, #fff, #ccc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-shadow: 0 5px 15px rgba(0,0,0,0.3);
                }
                .metric-glass-card:hover .counter-text {
                    background: linear-gradient(to bottom, #DAA520, #F0E68C);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                /* --- Animations --- */
                @keyframes fadeUp {
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-up { animation: fadeUp 1s ease-out forwards; }

            `}</style>
        </section>
    );
};

export default MetricDashboard;