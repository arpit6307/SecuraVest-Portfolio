// src/components/Testimonials.jsx

import React, { useState, useEffect } from 'react';
import useTestimonials from '../hooks/useTestimonials';
import ReviewSubmissionForm from './ReviewSubmissionForm'; 
import { FaQuoteLeft, FaQuoteRight, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Container, Row, Col } from 'react-bootstrap';

const Testimonials = () => {
  const { testimonials, loading } = useTestimonials();
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate logic
  useEffect(() => {
    if (testimonials.length > 0) {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % testimonials.length);
        }, 6000); // 6 Seconds rotation
        return () => clearInterval(interval);
    }
  }, [testimonials]);

  const nextReview = () => setActiveIndex((current) => (current + 1) % testimonials.length);
  const prevReview = () => setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);

  // Fallback if no reviews
  const displayTestimonials = testimonials.length > 0 ? testimonials : [
      { id: 1, client_name: "Valued Client", review_text: "SecuraVest provided excellent guidance for my retirement planning. Highly recommended!", rating: 5, policy_type: "Retirement Plan" }
  ];

  const currentReview = displayTestimonials[activeIndex];

  return (
    <section id="testimonials" className="testimonial-section position-relative overflow-hidden">
      
      {/* BACKGROUND ORBS (Consistency) */}
      <div className="orb orb-5"></div>
      <div className="orb orb-6"></div>
      <div className="grid-overlay"></div>

      <Container className="position-relative z-2 py-5">
        
        {/* HEADER */}
        <div className="text-center mb-5">
            <div className="d-inline-flex align-items-center justify-content-center mb-2">
                <span className="line-gold me-3"></span>
                <span className="text-gold text-uppercase ls-2 small fw-bold">Client Stories</span>
                <span className="line-gold ms-3"></span>
            </div>
            <h2 className="display-5 fw-bold text-white">Trusted by Families</h2>
        </div>
        
        <Row className="justify-content-center g-5 align-items-center">
            
            {/* LEFT: REVIEW SLIDER (Luxury Glass Card) */}
            <Col lg={7}>
                <div className="review-glass-card position-relative p-4 p-md-5">
                    
                    {/* Big Gold Quote Icon */}
                    <div className="quote-icon-bg">
                        <FaQuoteLeft />
                    </div>

                    {/* Animated Content */}
                    <div className="position-relative z-2 text-center fade-in-key" key={activeIndex}>
                        
                        {/* Star Rating */}
                        <div className="mb-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <FaStar key={i} className={i < currentReview.rating ? "text-gold me-1" : "text-white-10 me-1"} size={20} />
                            ))}
                        </div>

                        {/* Review Text */}
                        <p className="lead text-white fst-italic mb-4 review-text">
                            "{currentReview.review_text}"
                        </p>

                        {/* Client Details */}
                        <div className="mt-4 pt-4 border-top border-white-10">
                            <h5 className="fw-bold text-white mb-0">{currentReview.client_name}</h5>
                            <small className="text-gold text-uppercase ls-1 small fw-bold">{currentReview.policy_type}</small>
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <button onClick={prevReview} className="nav-arrow prev"><FaChevronLeft /></button>
                    <button onClick={nextReview} className="nav-arrow next"><FaChevronRight /></button>

                    {/* Progress Indicators */}
                    <div className="d-flex justify-content-center mt-4 gap-2">
                        {displayTestimonials.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`dot ${idx === activeIndex ? 'active' : ''}`}
                                onClick={() => setActiveIndex(idx)}
                            ></div>
                        ))}
                    </div>
                </div>
            </Col>
            
            {/* RIGHT: SUBMISSION FORM */}
            <Col lg={5}>
                <ReviewSubmissionForm /> 
            </Col>
            
        </Row>
      </Container>

      {/* CSS STYLES */}
      <style>{`
        :root {
                    --gold: #DAA520;
                    --navy: #002D62;
                    --glass-bg: rgba(255, 255, 255, 0.03);
                    --glass-border: rgba(255, 255, 255, 0.1);
                }

        .testimonial-section {
            background-color: var(--navy);
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            min-height: 90vh;
            display: flex;
            align-items: center;
        }

        /* Background FX */
        .orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.3; z-index: 0; }
        .orb-5 { top: 10%; right: 5%; width: 400px; height: 400px; background: radial-gradient(circle, #002D62, transparent); }
        .orb-6 { bottom: 10%; left: 5%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(218, 165, 32, 0.15), transparent); }
        .grid-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
            background-size: 40px 40px; z-index: 1; opacity: 0.3; pointer-events: none;
        }

        /* Text Styles */
        .text-gold { color: var(--gold) !important; }
        .text-white-10 { color: rgba(255, 255, 255, 0.1); }
        .ls-1 { letter-spacing: 1px; }
        .ls-2 { letter-spacing: 2px; }
        .line-gold { width: 40px; height: 2px; background: var(--gold); display: inline-block; opacity: 0.7; }
        .border-white-10 { border-color: rgba(255,255,255,0.1) !important; }

        /* Review Card */
        .review-glass-card {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--glass-border);
            border-radius: 24px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            backdrop-filter: blur(10px);
            transition: transform 0.3s;
        }
        .review-glass-card:hover { transform: translateY(-5px); border-color: rgba(218, 165, 32, 0.3); }

        .quote-icon-bg {
            position: absolute; top: -25px; left: 50%; transform: translateX(-50%);
            width: 60px; height: 60px;
            background: var(--navy);
            border: 2px solid var(--gold);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: var(--gold); font-size: 1.5rem;
            z-index: 3;
        }

        .review-text { font-size: 1.1rem; line-height: 1.8; color: rgba(255,255,255,0.9); }

        /* Navigation */
        .nav-arrow {
            position: absolute; top: 50%; transform: translateY(-50%);
            background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
            color: white; width: 40px; height: 40px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            transition: 0.3s;
        }
        .nav-arrow:hover { background: var(--gold); color: black; }
        .prev { left: -20px; }
        .next { right: -20px; }

        /* Dots */
        .dot { width: 8px; height: 8px; background: rgba(255,255,255,0.2); border-radius: 50%; cursor: pointer; transition: 0.3s; }
        .dot.active { background: var(--gold); width: 25px; border-radius: 10px; }

        /* Animation */
        .fade-in-key { animation: fadeIn 0.8s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

        /* Mobile Tweaks */
        @media (max-width: 768px) {
            .nav-arrow { display: none; } /* Hide arrows on mobile, use dots */
            .review-glass-card { padding: 30px 20px; margin-top: 20px; }
            .prev { left: 0; } .next { right: 0; }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;