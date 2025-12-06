// src/components/TeamRecruitment.jsx

import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore'; 
// Carousel, Card, aur Carousel controls ke imports ab hata diye gaye hain
import { Container, Row, Col } from 'react-bootstrap';
import { 
    FaUsers, FaUserTie, FaRocket, FaHandshake, FaSpinner, 
    FaCheckCircle, FaPaperPlane, FaEnvelope, FaPhoneVolume, FaMapMarkerAlt,
    FaAward, FaChartLine, FaChevronLeft, FaChevronRight // Chevron icons added
} from 'react-icons/fa';
import useTeamAgents from '../hooks/useTeamAgents'; 
import CustomLoader from './common/CustomLoader'; 

// --- MAIN COMPONENT ---
// UPDATED: Component now accepts 'notify' prop
const TeamRecruitment = ({ notify }) => {
    const { teamAgents, loading, error } = useTeamAgents(); 
    
    // --- NEW STATE & REF FOR CAROUSEL ---
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef(null);

    // Logic for Recruitment Form
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: 'Joining opportunity enquiry.' });
    const [status, setStatus] = useState(''); // Status kept mainly for button disabling

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            await addDoc(collection(db, "leads"), { 
                ...formData,
                timestamp: Timestamp.now(),
                status: 'New - Recruitment Enquiry' // Custom status for filtering
            });
            
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', message: 'Joining opportunity enquiry.' });
            
            // UPDATED: Use global notification for success
            notify("Application Received! We will contact you soon.", 'success'); 
            
            setTimeout(() => setStatus(''), 3000);
            
        } catch (error) {
            console.error("Error submitting recruitment form:", error);
            setStatus('error');
            
            // UPDATED: Use global notification for error
            notify("Submission Failed. Please try again or call directly.", 'error'); 
            
            setTimeout(() => setStatus(''), 3000); 
        }
    };
    
    // --- CAROUSEL NAVIGATION LOGIC ---
    const nextAgent = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % teamAgents.length);
    };
    const prevAgent = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + teamAgents.length) % teamAgents.length);
    };

    // --- EFFECT FOR AUTO-SLIDE AND MANUAL SCROLLING ---
    useEffect(() => {
        let interval;
        if (teamAgents.length > 0 && scrollContainerRef.current) {
            // 1. Auto-Slide Interval (FIXED: Increased speed to 6 seconds)
            interval = setInterval(nextAgent, 6000); 

            // 2. Scroll to Active Index
            const container = scrollContainerRef.current;
            const agentItem = container.querySelector('.agent-item-no-card');
            
            const agentWidth = agentItem ? agentItem.offsetWidth : 0;

            container.scroll({
                left: activeIndex * agentWidth,
                behavior: 'smooth'
            });
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [teamAgents, activeIndex]); 
    
    if (loading) return <CustomLoader />;

    return (
        <section id="team-recruitment" className="royal-team-section position-relative overflow-hidden py-5">
            
            {/* --- BACKGROUND FX (Matching Profile Section) --- */}
            <div className="orb orb-team-1"></div>
            <div className="orb orb-team-2"></div>
            <div className="grid-overlay"></div>

            <Container className="position-relative z-2 py-5">

                {/* --- 1. TEAM SHOWCASE HEADER --- */}
                <div className="text-center mb-5 animate-fade-down">
                    <div className="d-inline-flex align-items-center justify-content-center mb-2">
                        <span className="line-gold me-3"></span>
                        <span className="text-gold text-uppercase ls-2 small fw-bold">Mentored Success Network</span>
                        <span className="line-gold ms-3"></span>
                    </div>
                    <h2 className="display-5 fw-bold text-white">Our Elite Team of Agents</h2>
                    <p className="text-white-50 mx-auto fs-5" style={{ maxWidth: '700px' }}>
                        The true measure of mentorship is the success of those you guide. Meet the agents thriving under Ashok Sir's guidance.
                    </p>
                </div>
                
                {/* --- 1. TEAM SHOWCASE (UPDATED: Line/Scroller, No Card Form) --- */}
                <Row className="justify-content-center g-4 mb-5 pb-4">
                    <Col xs={12}>
                        {teamAgents.length > 0 ? (
                            <div className="team-carousel-wrapper position-relative">
                                
                                {/* Navigation Buttons (Mobile Only) */}
                                <button className="carousel-nav-btn prev d-lg-none" onClick={prevAgent} aria-label="Previous Agent">
                                    <FaChevronLeft />
                                </button>

                                <div className="agent-list-scroller-container" ref={scrollContainerRef}>
                                    <div className="agent-list-wrapper-flex">
                                        {teamAgents.map((agent, index) => (
                                            <div 
                                                key={agent.id} 
                                                className="agent-item-no-card"
                                                // FIXED: Removed conditional opacity for clear display on mobile
                                                style={{ opacity: 1 }}
                                            >
                                                
                                                {/* Image and Wrapper (Clean Halo) */}
                                                <div className="agent-image-wrapper-clean mx-auto mb-3"> 
                                                    <img 
                                                        src={agent.img || "/vite.svg"} 
                                                        alt={agent.name} 
                                                        className="agent-img-clean" 
                                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/120x120/002D62/DAA520?text=Agent"; }}
                                                    />
                                                    <div className="agent-award-tag-clean">
                                                        <FaAward size={14} />
                                                    </div>
                                                </div>
                                                
                                                {/* Details (Clear Show) */}
                                                <div className="text-center position-relative">
                                                    <h5 className="text-white fw-bold mb-0">{agent.name}</h5>
                                                    <p className="text-gold small fw-bold mb-1">{agent.title}</p>
                                                    <small className="text-white-50 d-block">{agent.policies || 0}+ Policies Secured</small>
                                                </div>

                                                {/* Vertical Separator (Hiding on last element) */}
                                                {index < teamAgents.length - 1 && <div className="vertical-divider d-none d-lg-block"></div>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <button className="carousel-nav-btn next d-lg-none" onClick={nextAgent} aria-label="Next Agent">
                                    <FaChevronRight />
                                </button>
                                
                            </div>
                        ) : (
                            <div className="text-center text-white-50 p-5 border border-gold-20 rounded-3" style={{ background: 'rgba(0,45,98,0.5)' }}>
                                {error ? `Data Fetch Error: ${error}` : 'No agents added to the team yet. Use the Admin Dashboard to populate the list.'}
                            </div>
                        )}
                    </Col>
                </Row>
                
                {/* --- 2. RECRUITMENT CONTACT FORM (Glass Panel) --- */}
                <div className="recruitment-glass-panel mx-auto p-4 p-md-5">
                    <Row className="align-items-center g-4">
                        <Col lg={5} className="text-center text-lg-start position-relative z-2">
                            <FaHandshake size={50} className="text-gold mb-3" />
                            <h3 className="text-white fw-bold mb-3">Become a SecuraVest Agent</h3>
                            <p className="text-white-50 mb-4">
                                Join our high-performing team. Receive direct training, access to exclusive resources, and a path to financial leadership.
                            </p>
                            <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-2 mt-4">
                                <span className="recruitment-chip"><FaUserTie className="me-2"/> Direct Mentorship</span>
                                <span className="recruitment-chip"><FaRocket className="me-2"/> High Incentives</span>
                                <span className="recruitment-chip"><FaMapMarkerAlt className="me-2"/> Flexible Work</span>
                            </div>
                        </Col>
                        <Col lg={7}>
                            <form onSubmit={handleSubmit} className="recruitment-form-bg p-3">
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <div className="custom-input-wrapper">
                                            <FaUserTie className="input-icon" />
                                            <input type="text" className="custom-input" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                                        </div>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <div className="custom-input-wrapper">
                                            <FaPhoneVolume className="input-icon" />
                                            <input type="tel" className="custom-input" name="phone" placeholder="Contact Number" value={formData.phone} onChange={handleChange} required />
                                        </div>
                                    </Col>
                                    <Col md={12} className="mb-4">
                                        <div className="custom-input-wrapper">
                                            <FaEnvelope className="input-icon" />
                                            <textarea className="custom-input" name="email" rows="1" placeholder="Email Address / Relevant Experience" value={formData.email} onChange={handleChange} required></textarea>
                                        </div>
                                    </Col>
                                </Row>

                                <button type="submit" className="btn-gold-glow w-100" disabled={status === 'loading'}>
                                    {status === 'loading' ? <span className="d-flex align-items-center justify-content-center"><FaSpinner className="fa-spin me-2" /> Submitting Request...</span> : <span className="d-flex align-items-center justify-content-center"><FaPaperPlane className="me-2" /> Apply Now</span>}
                                </button>

                                {/* REMOVED: Inline Notifications (Success/Error) - Now handled by CustomNotification component via 'notify' prop */}
                                
                            </form>
                        </Col>
                    </Row>
                </div>

            </Container>

            {/* --- ROYAL GLASS STYLES (UPDATED for Carousel Features and Scrollbar Fix) --- */}
            <style>{`
                :root {
                    --gold: #DAA520;
                    --navy: #002D62;
                    --dark-navy-bg: #002D62; 
                    --glass-bg: rgba(255, 255, 255, 0.03);
                    --glass-border: rgba(255, 255, 255, 0.1);
                    --red: #dc3545;
                    --success: #28a745;
                }
                .royal-team-section {
                    background-color: var(--dark-navy-bg); 
                    border-top: 1px solid var(--glass-border);
                }
                .ls-2 { letter-spacing: 2px; }
                .text-gold { color: var(--gold) !important; }
                .line-gold { width: 40px; height: 2px; background: var(--gold); display: inline-block; opacity: 0.7; }
                .text-white-50 { color: rgba(255, 255, 255, 0.5) !important; }

                /* Background FX (Unchanged) */
                .orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.4; z-index: 0; }
                .orb-team-1 { top: -20%; left: 80%; width: 500px; height: 500px; background: radial-gradient(circle, var(--navy), transparent); }
                .orb-team-2 { bottom: -10%; left: 10%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(218, 165, 32, 0.15), transparent); }
                .grid-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background-image: linear-gradient(var(--glass-bg) 1px, transparent 1px),
                    linear-gradient(90deg, var(--glass-bg) 1px, transparent 1px);
                    background-size: 40px 40px; z-index: 1; opacity: 0.3; pointer-events: none;
                }

                /* --- NEW: CAROUSEL/SCROLLER STYLES --- */
                
                .team-carousel-wrapper {
                    /* Wrapper for buttons position relative */
                    padding: 0 40px; /* Space for buttons on mobile */
                }
                
                .agent-list-scroller-container {
                    overflow-x: scroll; /* Scroll enable */
                    -webkit-overflow-scrolling: touch;
                    padding-bottom: 20px; 
                    
                    /* NEW: Hide Scrollbar on Desktop */
                    /* Firefox */
                    @media (min-width: 992px) {
                        scrollbar-width: none; 
                        -ms-overflow-style: none;  /* IE and Edge */
                        overflow-x: hidden; /* Desktop par scroll disable */
                    }
                }
                
                /* Chrome, Safari, Opera (General Scrollbar Hide) */
                .agent-list-scroller-container::-webkit-scrollbar {
                    display: none; 
                }
                
                .agent-list-wrapper-flex {
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    width: 100%; 
                    scroll-snap-type: none; 
                    margin-left: -10px; /* CRITICAL FIX: Counteract padding on agent items */
                }

                .agent-item-no-card {
                    /* Desktop: 1/6th of the container width */
                    flex-shrink: 0;
                    flex-grow: 1;
                    flex-basis: 16.666%; /* 100% / 6 members */
                    padding: 20px 15px;
                    position: relative;
                    /* Transition needed for smooth scroll/opacity */
                    transition: transform 0.3s ease, opacity 0.5s ease;
                }
                .agent-item-no-card:hover {
                    transform: translateY(-5px) scale(1.03); /* Subtle lift on hover */
                }
                
                /* --- NAVIGATION BUTTONS (Mobile Only) --- */
                .carousel-nav-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 10;
                    width: 40px; height: 40px;
                    background: var(--gold);
                    color: #000;
                    border: none;
                    border-radius: 50%;
                    box-shadow: 0 0 10px rgba(218, 165, 32, 0.5);
                    transition: all 0.3s;
                    display: flex; align-items: center; justify-content: center;
                }
                .carousel-nav-btn:hover {
                    transform: translateY(-50%) scale(1.1);
                    background: #FFD700;
                }
                .carousel-nav-btn.prev { left: 0; }
                .carousel-nav-btn.next { right: 0; }


                /* Vertical Divider (Desktop Only) */
                .vertical-divider {
                    position: absolute;
                    top: 20px;
                    right: 0;
                    width: 1px;
                    height: 80%;
                    background: linear-gradient(to bottom, transparent, rgba(218, 165, 32, 0.5), transparent);
                    opacity: 0.5;
                }

                /* Mobile/Tablet Adjustment (FIXED: 100% width for perfect slide and visibility) */
                @media (max-width: 991px) { /* Lg breakpoint se niche */
                    .team-carousel-wrapper {
                        padding: 0 50px; /* Increased space for bigger buttons */
                    }
                    .agent-list-scroller-container {
                        padding-left: 0;
                        padding-right: 0;
                    }
                    .agent-list-wrapper-flex {
                        justify-content: flex-start; /* Start from left */
                        min-width: max-content; /* Critical for horizontal layout */
                        margin-left: -10px; /* Counteract padding from agent-item */
                    }
                    .agent-item-no-card {
                        /* CRITICAL FIX: Set width to almost 100% of the view for a 1:1 scroll per item */
                        width: calc(100% - 20px); 
                        padding: 20px 10px; /* 10px spacing on left/right for separation */
                        margin-right: 0;
                    }
                    .agent-item-no-card:last-child {
                        padding-right: 10px;
                    }
                    .vertical-divider {
                        display: none; 
                    }
                }
                
                /* --- CLEAN IMAGE STYLES (Unchanged) --- */
                .agent-image-wrapper-clean {
                    width: 100px; 
                    height: 100px;
                    border-radius: 50%; 
                    overflow: hidden;
                    background-color: rgba(255, 255, 255, 0.05); /* Subtle dark background */
                    border: 3px solid var(--gold); /* Gold circle border */
                    position: relative;
                    margin-bottom: 10px; 
                    box-shadow: 0 0 10px rgba(218, 165, 32, 0.4);
                }
                .agent-img-clean {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: top center;
                    transition: transform 0.5s;
                    filter: grayscale(10%);
                }
                .agent-item-no-card:hover .agent-img-clean { transform: scale(1.05); filter: grayscale(0); }

                .agent-award-tag-clean {
                    position: absolute; top: -5px; right: -5px;
                    background: var(--gold);
                    color: var(--navy);
                    padding: 5px; border-radius: 50%;
                    line-height: 1;
                    box-shadow: 0 0 8px rgba(218, 165, 32, 0.8);
                }


                /* --- Recruitment Panel Styles (Unchanged for Context) --- */
                .recruitment-glass-panel {
                    background: #002D62;
                    backdrop-filter: blur(15px);
                    border: 1px solid var(--gold);
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.7);
                    max-width: 1100px;
                }
                .recruitment-chip {
                    background: rgba(218, 165, 32, 0.15);
                    border: 1px solid var(--gold);
                    padding: 10px 18px;
                    border-radius: 50px;
                    color: var(--gold);
                    font-size: 0.9rem;
                    display: inline-flex;
                    align-items: center;
                    font-weight: 600;
                    transition: all 0.3s;
                }
                .recruitment-chip:hover {
                    background: var(--gold);
                    color: var(--dark-navy-bg);
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(218, 165, 32, 0.4);
                }
                
                /* Form Background & Input Styles */
                .recruitment-form-bg {
                    background: rgba(0,0,0,0.3);
                    border-radius: 12px;
                    padding: 20px;
                }
                .custom-input-wrapper { position: relative; }
                .input-icon {
                    position: absolute; top: 50%; left: 15px; transform: translateY(-50%);
                    color: var(--gold); opacity: 0.7;
                }
                .custom-input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 14px 14px 14px 45px;
                    color: white;
                    font-size: 1rem;
                    transition: all 0.3s;
                }
                .custom-input:focus {
                    outline: none;
                    border-color: var(--gold);
                    box-shadow: 0 0 15px rgba(218, 165, 32, 0.2);
                    background: rgba(255, 255, 255, 0.08);
                }
                
                /* Button Styles */
                .btn-gold-glow {
                    background: linear-gradient(135deg, var(--gold), #B8860B);
                    color: #000; padding: 12px 30px; border-radius: 50px;
                    font-weight: bold; text-decoration: none;
                    box-shadow: 0 0 20px rgba(218, 165, 32, 0.3);
                    transition: all 0.3s; display: flex; align-items: center; justify-content: center;
                }
                .btn-gold-glow:hover:not(:disabled) { 
                    transform: translateY(-3px); 
                    box-shadow: 0 0 30px rgba(218, 165, 32, 0.5); 
                }
                .btn-gold-glow:disabled { opacity: 0.6; cursor: not-allowed; }

                .text-success { color: var(--success) !important; }
                .text-danger { color: var(--red) !important; }
                .fa-spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
                .animate-fade-up { animation: fadeUp 0.8s ease-out forwards; opacity: 0; transform: translateY(20px); }

                @media (max-width: 768px) {
                    .display-5 { font-size: 2rem; }
                    .h5, h5 { font-size: 1.8rem; }  
                    .agent-image-wrapper { width: 100px; height: 100px; margin-bottom: 10px; }
                    .agent-award-tag { top: 5px; right: 5px; padding: 3px; }
                }
            `}</style>
        </section>
    );
};

export default TeamRecruitment;