// src/components/ContactForm.jsx

import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore'; 
import useAgentMetrics from '../hooks/useAgentMetrics'; // Dynamic Data Hook
import { FaPaperPlane, FaSpinner, FaCheckCircle, FaExclamationCircle, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import { Container, Row, Col } from 'react-bootstrap';

// --- SUB-COMPONENT: CONTACT ITEM ---
const ContactItem = ({ icon: Icon, title, value, link, delay }) => (
    <div className="contact-glass-item d-flex align-items-center mb-4" style={{ animationDelay: delay }}>
        <div className="icon-box-glow me-3">
            <Icon size={20} />
        </div>
        <div className="overflow-hidden">
            <p className="text-gold text-uppercase x-small fw-bold mb-1 ls-1">{title}</p>
            {link ? (
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-white fw-bold text-decoration-none contact-link">
                    {value}
                </a>
            ) : (
                <p className="text-white fw-bold mb-0" style={{lineHeight: '1.4'}}>{value}</p>
            )}
        </div>
    </div>
);

// UPDATED: Component now accepts 'notify' prop
const ContactForm = ({ notify }) => {
  const { metrics } = useAgentMetrics();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState(''); // Status kept mainly for button disabling

  // Dynamic Data with Fallbacks
  const contactInfo = {
      phone: metrics?.phone || "+91 9696923995",
      email: metrics?.email || "ashoklic.yadav@gmail.com",
      address: metrics?.address || "LIC LalBagh Branch, Hazratganj, Lucknow, UP",
  };

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
        status: 'New'
      });
      
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // UPDATED: Use global notification for success
      notify("Secure Message Sent! I will contact you shortly.", 'success'); 

      setTimeout(() => setStatus(''), 3000);
      
    } catch (error) {
      console.error("Error:", error);
      setStatus('error');
      
      // UPDATED: Use global notification for error
      notify("Connection Error. Please call directly or try again later.", 'error');

      setTimeout(() => setStatus(''), 3000); 
    }
  };

  return (
    <section id="contact" className="contact-section position-relative overflow-hidden">
      
      {/* Background FX */}
      <div className="orb orb-7"></div>
      <div className="orb orb-8"></div>
      <div className="grid-overlay"></div>

      <Container className="position-relative z-2 py-5">
        
        <div className="text-center mb-5 animate-fade-down">
            <h6 className="text-gold text-uppercase ls-2 mb-2">Get In Touch</h6>
            <h2 className="display-5 fw-bold text-white">Start Your Financial Journey</h2>
        </div>

        <Row className="g-5">
            
            {/* LEFT: CONTACT INFO CARD */}
            <Col lg={5}>
                <div className="info-glass-card h-100 p-4 p-md-5 d-flex flex-column justify-content-center">
                    <div className="glow-circle"></div>
                    
                    <h3 className="text-white fw-bold mb-4 position-relative z-2">Contact Information</h3>
                    <p className="text-white-50 mb-5 position-relative z-2">
                        Ready to secure your future? Reach out directly or fill the form. I am here to guide you 24/7.
                    </p>

                    <div className="position-relative z-2">
                        <ContactItem 
                            icon={FaPhoneAlt} 
                            title="Call Directly" 
                            value={contactInfo.phone} 
                            link={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                            delay="0.1s"
                        />
                        <ContactItem 
                            icon={FaWhatsapp} 
                            title="WhatsApp Chat" 
                            value="Chat Now" 
                            link={`https://wa.me/${contactInfo.phone.replace(/\s|-/g, '')}`}
                            delay="0.2s"
                        />
                        <ContactItem 
                            icon={FaEnvelope} 
                            title="Email Support" 
                            value={contactInfo.email} 
                            link={`mailto:${contactInfo.email}`}
                            delay="0.3s"
                        />
                        <ContactItem 
                            icon={FaMapMarkerAlt} 
                            title="Office Location" 
                            value={contactInfo.address} 
                            delay="0.4s"
                        />
                    </div>
                </div>
            </Col>

            {/* RIGHT: FORM */}
            <Col lg={7}>
                <div className="form-glass-card p-4 p-md-5">
                    <form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6} className="mb-4">
                                <div className="cyber-field">
                                    <input 
                                        type="text" 
                                        className="cyber-input" 
                                        name="name" 
                                        placeholder=" " 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                    <label className="cyber-label">Full Name</label>
                                </div>
                            </Col>
                            <Col md={6} className="mb-4">
                                <div className="cyber-field">
                                    <input 
                                        type="email" 
                                        className="cyber-input" 
                                        name="email" 
                                        placeholder=" " 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                    <label className="cyber-label">Email Address</label>
                                </div>
                            </Col>
                            <Col md={12} className="mb-4">
                                <div className="cyber-field">
                                    <input 
                                        type="tel" 
                                        className="cyber-input" 
                                        name="phone" 
                                        placeholder=" " 
                                        value={formData.phone} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                    <label className="cyber-label">Phone Number</label>
                                </div>
                            </Col>
                            <Col md={12} className="mb-4">
                                <div className="cyber-field">
                                    <textarea 
                                        className="cyber-input" 
                                        name="message" 
                                        rows="4" 
                                        placeholder=" " 
                                        value={formData.message} 
                                        onChange={handleChange} 
                                        required
                                    ></textarea>
                                    <label className="cyber-label">How can I help you?</label>
                                </div>
                            </Col>
                        </Row>

                        <button type="submit" className="btn-gold-block w-100" disabled={status === 'loading'}>
                            {status === 'loading' ? (
                                <span className="d-flex align-items-center justify-content-center">
                                    <FaSpinner className="fa-spin me-2" /> Sending Securely...
                                </span>
                            ) : (
                                <span className="d-flex align-items-center justify-content-center">
                                    <FaPaperPlane className="me-2" /> Send Message
                                </span>
                            )}
                        </button>

                        {/* REMOVED: Inline Notifications (Success/Error) - Now handled by CustomNotification component */}
                        
                    </form>
                </div>
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

        .contact-section {
            background-color: var(--navy);
            border-top: 1px solid var(--glass-border);
            min-height: 90vh;
            display: flex;
            align-items: center;
        }

        /* Background Orbs */
        .orb { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.3; z-index: 0; }
        .orb-7 { bottom: -10%; left: -10%; width: 600px; height: 600px; background: radial-gradient(circle, #002D62, transparent); }
        .orb-8 { top: 20%; right: -10%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(218, 165, 32, 0.15), transparent); }
        .grid-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background-image: linear-gradient(var(--glass-bg) 1px, transparent 1px),
            linear-gradient(90deg, var(--glass-bg) 1px, transparent 1px);
            background-size: 40px 40px; z-index: 1; opacity: 0.3; pointer-events: none;
        }

        /* Info Card */
        .info-glass-card {
            background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));
            border: 1px solid var(--glass-border);
            border-radius: 24px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        .glow-circle {
            position: absolute; top: -20%; right: -20%; width: 300px; height: 300px;
            background: radial-gradient(circle, rgba(218,165,32,0.2), transparent 70%);
            border-radius: 50%; filter: blur(40px); z-index: 1;
        }

        /* Contact Items */
        .contact-glass-item {
            padding: 15px;
            border-radius: 16px;
            background: rgba(255,255,255,0.03);
            border: 1px solid transparent;
            transition: 0.3s;
            animation: slideRight 0.6s ease-out forwards;
            opacity: 0;
        }
        .contact-glass-item:hover {
            background: rgba(255,255,255,0.06);
            border-color: rgba(218,165,32,0.3);
            transform: translateX(10px);
        }
        .icon-box-glow {
            width: 45px; height: 45px;
            background: rgba(218,165,32,0.1);
            border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            color: var(--gold);
            box-shadow: 0 0 15px rgba(218,165,32,0.1);
        }
        .contact-link:hover { color: var(--gold) !important; }

        /* Form Card */
        .form-glass-card {
            background: rgba(10, 15, 30, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 24px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.4);
        }

        /* Cyber Inputs (Floating Label) */
        .cyber-field { position: relative; }
        .cyber-input {
            width: 100%;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 15px;
            color: white;
            font-size: 1rem;
            outline: none;
            transition: 0.3s;
        }
        .cyber-input:focus {
            border-color: var(--gold);
            background: rgba(255,255,255,0.05);
            box-shadow: 0 0 15px rgba(218,165,32,0.1);
        }
        .cyber-label {
            position: absolute;
            left: 15px; top: 15px;
            color: rgba(255,255,255,0.5);
            font-size: 1rem;
            pointer-events: none;
            transition: 0.3s;
            background: transparent;
        }
        .cyber-input:focus ~ .cyber-label,
        .cyber-input:not(:placeholder-shown) ~ .cyber-label {
            top: -10px;
            left: 10px;
            font-size: 0.75rem;
            color: var(--gold);
            background: var(--navy);
            padding: 0 5px;
        }

        /* Button */
        .btn-gold-block {
            background: linear-gradient(135deg, var(--gold), #B8860B);
            color: black; border: none;
            padding: 15px; border-radius: 12px;
            font-weight: bold; text-transform: uppercase; letter-spacing: 1px;
            transition: 0.3s;
            box-shadow: 0 5px 15px rgba(218,165,32,0.2);
        }
        .btn-gold-block:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(218,165,32,0.4);
        }

        /* Status Messages (Removed inline status divs) */

        /* Animations */
        .animate-fade-down { animation: fadeDown 0.8s ease-out; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }

        /* Utilities */
        .ls-1 { letter-spacing: 1px; }
        .ls-2 { letter-spacing: 2px; }
        .text-gold { color: var(--gold) !important; }
        .x-small { font-size: 0.7rem; }
      `}</style>
    </section>
  );
};

export default ContactForm;