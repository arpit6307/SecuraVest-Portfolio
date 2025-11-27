// src/components/Appointment.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import { 
    FaUser, FaEnvelope, FaPhone, FaCalendarAlt, 
    FaCheckCircle, FaArrowRight, FaArrowLeft, FaCrown, FaDownload, 
    FaShieldAlt, FaBriefcase, FaChild, FaHeartbeat, FaCoins, FaSignature, FaSpinner
} from 'react-icons/fa';
import Navbar from './Navbar';
import Footer from './Footer';

// --- NEW FUNCTION: Rule-Based Policy Recommendation ---
const getPolicyRecommendations = (purpose) => {
    switch (purpose) {
        case 'Life Insurance':
            return [
                { name: "LIC Jeevan Utsav", tagline: "Lifetime guaranteed returns and flexibility." },
                { name: "LIC New Jeevan Shanti", tagline: "Immediate/deferred annuity plan for retirement." },
            ];
        case 'Retirement Plan':
            return [
                { name: "LIC Saral Pension", tagline: "Immediate annuity plan for consistent income." },
                { name: "LIC Pension Fund Scheme", tagline: "Market-linked growth for long-term corpus." },
            ];
        case 'Child Education':
            return [
                { name: "LIC New Children's Money Back Plan", tagline: "Periodic payouts aligned with educational milestones." },
                { name: "LIC Jeevan Tarun", tagline: "Protection and savings for child’s future needs." },
            ];
        case 'Tax Saving':
             return [
                { name: "LIC Jeevan Labh", tagline: "Limited Premium Payment, High Tax Benefits." },
                { name: "ULIP Tax Saver", tagline: "Market growth with maximum Section 80C deduction." },
            ];
        default:
            return [];
    }
};

// --- SUB-COMPONENT: RECOMMENDATION DISPLAY ---
const PolicyRecommendation = ({ policies }) => (
    <div className="recommendation-box mt-4 p-3 animate-fade-in">
        <h6 className="royal-text-accent fw-bold mb-3 d-flex align-items-center"><FaCrown className="me-2" /> Initial Recommendations</h6>
        {policies.map((p, index) => (
            <div key={index} className="recommendation-item mb-2">
                <span className="fw-bold">{p.name}</span>
                <p className="text-white-50 x-small mb-0">{p.tagline}</p>
            </div>
        ))}
        <p className="text-white-50 small mt-3 mb-0 fst-italic">
            *These are preliminary options. Final plan will be customized during the session.
        </p>
    </div>
);


// --- CUSTOM COMPONENT: SELECTION CARD ---
const SelectionCard = ({ icon: Icon, title, subtitle, selected, onClick }) => (
    <div 
        onClick={onClick}
        className={`selection-card ${selected ? 'selected' : ''}`}
    >
        <div className="icon-box">
            <Icon size={24} />
        </div>
        <div className="text-box">
            <h6 className="fw-bold mb-1">{title}</h6>
            <small>{subtitle}</small>
        </div>
        {selected && <div className="check-badge"><FaCheckCircle /></div>}
    </div>
);

// --- CUSTOM COMPONENT: TIME CHIP ---
const TimeChip = ({ time, selected, onClick }) => (
    <button 
        onClick={onClick}
        className={`time-chip ${selected ? 'selected' : ''}`}
        type="button"
    >
        {time}
    </button>
);

const Appointment = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [processingStage, setProcessingStage] = useState('');
    const [docId, setDocId] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', date: '', time: '', 
        purpose: '', signature: ''
    });

    // --- DYNAMIC TIME SLOT LOGIC ---
    useEffect(() => {
        if (formData.date) {
            const dateObj = new Date(formData.date);
            const day = dateObj.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            
            let slots = [];

            // Schedule Logic
            // Monday (1) to Friday (5)
            if (day >= 1 && day <= 5) {
                slots.push('09:00 AM', '09:30 AM');
                slots.push('08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM');
            } 
            // Saturday (6) and Sunday (0)
            else {
                slots.push('09:00 AM', '09:30 AM');
                slots.push('01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM');
                slots.push('08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM');
            }
            setAvailableSlots(slots);
            
            if (!slots.includes(formData.time)) {
                setFormData(prev => ({ ...prev, time: '' }));
            }
        } else {
            setAvailableSlots([]);
        }
    }, [formData.date]);

    // --- ULTRA-PROFESSIONAL PDF GENERATOR ---
    const generatePDF = (data, id) => {
        const doc = new jsPDF();
        const primaryColor = [0, 45, 98]; // Navy Blue
        const accentColor = [218, 165, 32]; // Gold

        // 1. Top Header Bar
        doc.setFillColor(...primaryColor);
        doc.rect(0, 0, 210, 40, 'F');

        // Logo / Brand Name
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("SECURAVEST", 20, 20);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Your Partner in Financial Stability", 20, 28);

        // "Appointment Confirmed" Badge in Header
        doc.setTextColor(...accentColor);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("APPOINTMENT CONFIRMED", 190, 25, null, null, "right");

        // 2. Booking Info Section
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 190, 50, null, null, "right");
        doc.text(`Reference ID: #${id.substring(0, 8).toUpperCase()}`, 20, 50);

        // Separator Line
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(20, 55, 190, 55);

        // 3. Main Content - Two Columns
        let yStart = 70;
        
        // Left Column: Client Details
        doc.setFontSize(12);
        doc.setTextColor(...primaryColor);
        doc.setFont("helvetica", "bold");
        doc.text("CLIENT DETAILS", 20, yStart);
        
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.setFont("helvetica", "normal");
        doc.text(`Name:`, 20, yStart + 10);
        doc.text(data.name, 60, yStart + 10);
        
        doc.text(`Email:`, 20, yStart + 20);
        doc.text(data.email, 60, yStart + 20);
        
        doc.text(`Phone:`, 20, yStart + 30);
        doc.text(data.phone, 60, yStart + 30);

        // Right Column: Appointment Details
        doc.setFontSize(12);
        doc.setTextColor(...primaryColor);
        doc.setFont("helvetica", "bold");
        doc.text("SESSION DETAILS", 110, yStart);
        
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.setFont("helvetica", "normal");
        doc.text(`Date:`, 110, yStart + 10);
        doc.text(new Date(data.date).toDateString(), 150, yStart + 10);
        
        doc.text(`Time:`, 110, yStart + 20);
        doc.text(data.time, 150, yStart + 20);
        
        doc.text(`Topic:`, 110, yStart + 30);
        doc.text(data.purpose, 150, yStart + 30);

        // 4. Box for Important Instructions
        doc.setDrawColor(...accentColor);
        doc.setFillColor(255, 253, 245); // Very light yellow/cream
        doc.rect(20, yStart + 50, 170, 30, 'FD');
        
        doc.setFontSize(10);
        doc.setTextColor(...primaryColor);
        doc.setFont("helvetica", "bold");
        doc.text("IMPORTANT NOTE:", 25, yStart + 60);
        
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");
        doc.text("Please arrive 5 minutes before your scheduled time. If you need to reschedule,", 25, yStart + 68);
        doc.text("kindly contact us at least 24 hours in advance.", 25, yStart + 73);

        // 5. Signature Area
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Digitally Signed By Client:", 20, 220);
        doc.setFont("times", "italic");
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(data.signature, 20, 230);
        doc.line(20, 232, 80, 232); // Underline

        // Authorized Signatory
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Authorized Advisor:", 140, 220);
        doc.setFontSize(12);
        doc.setTextColor(...primaryColor);
        doc.setFont("helvetica", "bold");
        doc.text("Ashok Kumar Yadav", 140, 230);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text("LIC of India", 140, 235);

        // 6. Footer
        doc.setDrawColor(200, 200, 200);
        doc.line(10, 280, 200, 280);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("SecuraVest Portfolio | Lucknow, UP | Contact: +91 9696923995", 105, 285, null, null, "center");
        doc.text("This is a computer-generated document and does not require a physical signature.", 105, 290, null, null, "center");

        return doc;
    };

    // --- HANDLING SUBMISSION ---
    const handleSubmit = async () => {
        setLoading(true);
        
        const stages = ["Verifying Identity...", "Checking Availability...", "Locking Time Slot...", "Generating Official Pass..."];
        
        for (let i = 0; i < stages.length; i++) {
            setProcessingStage(stages[i]);
            await new Promise(r => setTimeout(r, 800)); 
        }

        try {
            const docRef = await addDoc(collection(db, "appointments"), {
                ...formData,
                status: 'Confirmed',
                timestamp: Timestamp.now(),
            });
            setDocId(docRef.id);

            const pdf = generatePDF(formData, docRef.id);
            pdf.save(`SecuraVest_Appointment_${formData.name.replace(/\s/g, '_')}.pdf`);

            setStep(5); 
            setLoading(false);

        } catch (error) {
            console.error("Error booking:", error);
            alert("Connection Error. Please try again.");
            setLoading(false);
        }
    };

    // --- RENDER STEPS ---
    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center py-5">
                    <div className="loader-ring mb-4 mx-auto"></div>
                    <h4 className="royal-text-accent fw-bold animate-pulse">{processingStage}</h4>
                    <p className="text-white-50 small">Please do not close this window.</p>
                </div>
            );
        }

        switch(step) {
            case 1: // IDENTITY
                return (
                    <div className="step-container">
                        <div className="step-header">
                            <span className="step-badge">01</span>
                            <h3 className="fw-bold text-white">Personal Identity</h3>
                            <p className="text-white-50">Let's start with your secure profile.</p>
                        </div>
                        
                        <div className="row g-4">
                            <div className="col-12">
                                <label className="custom-label">Full Legal Name</label>
                                <div className="custom-input-wrapper">
                                    <FaUser className="input-icon" />
                                    <input type="text" className="custom-input" placeholder="e.g. Rajesh Kumar" 
                                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="custom-label">Mobile Number</label>
                                <div className="custom-input-wrapper">
                                    <FaPhone className="input-icon" />
                                    <input type="tel" className="custom-input" placeholder="+91 98765..." 
                                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="custom-label">Email Address</label>
                                <div className="custom-input-wrapper">
                                    <FaEnvelope className="input-icon" />
                                    <input type="email" className="custom-input" placeholder="name@mail.com" 
                                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-5">
                            <button className="btn-next" onClick={() => setStep(2)} 
                                disabled={!formData.name || !formData.phone || !formData.email}>
                                Continue <FaArrowRight />
                            </button>
                        </div>
                    </div>
                );

            case 2: // PURPOSE
                // --- NEW: Fetch Recommendations ---
                const recommendedPolicies = formData.purpose ? getPolicyRecommendations(formData.purpose) : [];
                
                return (
                    <div className="step-container">
                        <div className="step-header">
                            <span className="step-badge">02</span>
                            <h3 className="fw-bold text-white">Consultation Focus</h3>
                            <p className="text-white-50">Select the primary topic for your session.</p>
                        </div>

                        <div className="selection-grid">
                            <SelectionCard 
                                icon={FaHeartbeat} title="Life Insurance" subtitle="Secure family future" 
                                selected={formData.purpose === 'Life Insurance'} 
                                onClick={() => setFormData({...formData, purpose: 'Life Insurance'})} 
                            />
                            <SelectionCard 
                                icon={FaBriefcase} title="Retirement Plan" subtitle="Pension & Freedom" 
                                selected={formData.purpose === 'Retirement Plan'} 
                                onClick={() => setFormData({...formData, purpose: 'Retirement Plan'})} 
                            />
                            <SelectionCard 
                                icon={FaChild} title="Child Education" subtitle="Future savings" 
                                selected={formData.purpose === 'Child Education'} 
                                onClick={() => setFormData({...formData, purpose: 'Child Education'})} 
                            />
                            <SelectionCard 
                                icon={FaCoins} title="Tax Saving" subtitle="Maximize wealth" 
                                selected={formData.purpose === 'Tax Saving'} 
                                onClick={() => setFormData({...formData, purpose: 'Tax Saving'})} 
                            />
                        </div>
                        
                        {/* --- NEW: Recommendation Component Display --- */}
                        {recommendedPolicies.length > 0 && (
                             <PolicyRecommendation policies={recommendedPolicies} />
                        )}

                        <div className="d-flex justify-content-between mt-5">
                            <button className="btn-back" onClick={() => setStep(1)}><FaArrowLeft /> Back</button>
                            <button className="btn-next" onClick={() => setStep(3)} disabled={!formData.purpose}>
                                Continue <FaArrowRight />
                            </button>
                        </div>
                    </div>
                );

            case 3: // SCHEDULING (DYNAMIC)
                return (
                    <div className="step-container">
                        <div className="step-header">
                            <span className="step-badge">03</span>
                            <h3 className="fw-bold text-white">Date & Time</h3>
                            <p className="text-white-50">Slots update automatically based on the day.</p>
                        </div>

                        <div className="mb-4">
                            <label className="custom-label">Select Date</label>
                            <div className="custom-input-wrapper">
                                <FaCalendarAlt className="input-icon" />
                                <input 
                                    type="date" 
                                    className="custom-input" 
                                    value={formData.date} 
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={e => setFormData({...formData, date: e.target.value})} 
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="custom-label mb-3 d-block">Available Slots (30 Mins)</label>
                            {!formData.date ? (
                                <div className="text-white-50 p-3 text-center border border-secondary rounded" style={{background: 'rgba(255,255,255,0.05)'}}>
                                    Please select a date first.
                                </div>
                            ) : (
                                <div className="time-grid">
                                    {availableSlots.length > 0 ? (
                                        availableSlots.map(time => (
                                            <TimeChip key={time} time={time} 
                                                selected={formData.time === time} 
                                                onClick={() => setFormData({...formData, time: time})} 
                                            />
                                        ))
                                    ) : (
                                        <div className="col-12 text-danger small">No slots available for this day.</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="d-flex justify-content-between mt-5">
                            <button className="btn-back" onClick={() => setStep(2)}><FaArrowLeft /> Back</button>
                            <button className="btn-next" onClick={() => setStep(4)} disabled={!formData.date || !formData.time}>
                                Review <FaArrowRight />
                            </button>
                        </div>
                    </div>
                );

            case 4: // REVIEW & SIGNATURE
                return (
                    <div className="step-container">
                        <div className="step-header">
                            <span className="step-badge">04</span>
                            <h3 className="fw-bold text-white">Final Confirmation</h3>
                            <p className="text-white-50">Please review and sign below.</p>
                        </div>

                        <div className="review-card">
                            <div className="review-row">
                                <span>Name:</span> <strong>{formData.name}</strong>
                            </div>
                            <div className="review-row">
                                <span>Topic:</span> <strong>{formData.purpose}</strong>
                            </div>
                            <div className="review-row">
                                <span>Slot:</span> <strong className="royal-text-accent">{new Date(formData.date).toDateString()} @ {formData.time}</strong>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="custom-label">Digital Signature</label>
                            <p className="small text-white-50 mb-2">Type your full name to digitally sign this request.</p>
                            <div className="custom-input-wrapper">
                                <FaSignature className="input-icon" />
                                <input type="text" className="custom-input signature-font" placeholder="Sign here..." 
                                    value={formData.signature} onChange={e => setFormData({...formData, signature: e.target.value})} />
                            </div>
                        </div>

                        <div className="d-flex justify-content-between mt-5">
                            <button className="btn-back" onClick={() => setStep(3)}><FaArrowLeft /> Back</button>
                            <button className="btn-confirm w-50" onClick={handleSubmit} disabled={formData.signature.length < 3}>
                                Secure Appointment
                            </button>
                        </div>
                    </div>
                );

            case 5: // SUCCESS
                return (
                    <div className="step-container text-center py-3">
                        <div className="success-animation mb-4">
                            <div className="shield-icon-wrapper">
                                <FaShieldAlt size={70} className="royal-text-accent" />
                                <FaCheckCircle size={24} className="success-tick" />
                            </div>
                        </div>
                        
                        <h2 className="fw-bold text-white mb-2">Appointment Secured!</h2>
                        <p className="text-white-50 mb-4">Your appointment has been officially booked.<br/>The confirmation document has been downloaded.</p>

                        <div className="golden-ticket mx-auto mb-4">
                            <div className="ticket-header">
                                <FaCrown className="me-2" /> SECURAVEST PASS
                            </div>
                            <div className="ticket-body">
                                <div className="ticket-row">
                                    <span className="label">VISITOR</span>
                                    <span className="value">{formData.name}</span>
                                </div>
                                <div className="ticket-row">
                                    <span className="label">DATE</span>
                                    <span className="value">{formData.date}</span>
                                </div>
                                <div className="ticket-row">
                                    <span className="label">ACCESS</span>
                                    <span className="value status">CONFIRMED</span>
                                </div>
                            </div>
                            <div className="ticket-footer">
                                Priority Access Granted
                            </div>
                        </div>

                        <button className="btn-download mb-3" onClick={() => {
                            const pdf = generatePDF(formData, docId);
                            pdf.save(`SecuraVest_Appointment_${formData.name.replace(/\s/g, '_')}.pdf`);
                        }}>
                            <FaDownload className="me-2" /> Download Official PDF
                        </button>
                        
                        <div>
                            <a href="/" className="text-white-50 text-decoration-none border-bottom border-secondary">Return Home</a>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="page-wrapper">
            <Navbar />
            
            <div className="content-wrapper">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="grid-overlay"></div>

                <div className="container position-relative z-2">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-9">
                            <div className="luxury-glass-card">
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <style>{`
                :root {
                    --gold: #DAA520;
                    --navy: #002D62;
                    --glass-bg: rgba(255, 255, 255, 0.03);
                    --glass-border: rgba(255, 255, 255, 0.1);
                }

                .page-wrapper {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    background-color: #002D62;
                    color: white;
                    overflow-x: hidden;
                }

                .content-wrapper {
                    flex-grow: 1;
                    position: relative;
                    display: flex;
                    align-items: center;
                    padding: 100px 0;
                }

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

                .luxury-glass-card {
                    background: rgba(10, 20, 35, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--border);
                    border-radius: 24px;
                    padding: 40px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05);
                    position: relative;
                    overflow: hidden;
                }
                
                .luxury-glass-card::before {
                    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px;
                    background: linear-gradient(90deg, transparent, var(--gold), transparent);
                }

                .step-badge {
                    display: inline-block;
                    background: rgba(218, 165, 32, 0.1);
                    color: var(--gold);
                    border: 1px solid var(--gold);
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    font-weight: bold;
                    margin-bottom: 10px;
                }

                .custom-label {
                    color: #ccc; font-size: 0.9rem; font-weight: 500; margin-bottom: 8px; display: block;
                }
                .custom-input-wrapper {
                    position: relative;
                    transition: all 0.3s;
                }
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
                .custom-input[type="date"] {
                    color-scheme: dark;
                }
                .custom-input:focus {
                    outline: none;
                    border-color: var(--gold);
                    box-shadow: 0 0 15px rgba(218, 165, 32, 0.2);
                    background: rgba(255, 255, 255, 0.08);
                }
                .signature-font { font-family: 'Cursive', sans-serif; font-style: italic; letter-spacing: 1px; }

                .selection-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
                .selection-card {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 15px;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.3s;
                }
                .selection-card:hover { background: rgba(255, 255, 255, 0.08); transform: translateY(-2px); }
                .selection-card.selected {
                    border-color: var(--gold);
                    background: rgba(218, 165, 32, 0.1);
                    box-shadow: 0 0 15px rgba(218, 165, 32, 0.1);
                }
                .selection-card .icon-box { color: var(--gold); margin-bottom: 8px; }
                .selection-card .check-badge { position: absolute; top: 10px; right: 10px; color: var(--gold); }

                .time-grid { display: flex; flex-wrap: wrap; gap: 10px; }
                .time-chip {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 50px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .time-chip:hover { border-color: var(--gold); }
                .time-chip.selected {
                    background: var(--gold);
                    color: #000;
                    font-weight: bold;
                    border-color: var(--gold);
                    box-shadow: 0 0 10px rgba(218, 165, 32, 0.4);
                }

                .review-card {
                    background: rgba(0,0,0,0.3);
                    border-radius: 12px;
                    padding: 20px;
                    border-left: 4px solid var(--gold);
                }
                .review-row {
                    display: flex; justify-content: space-between;
                    padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .review-row:last-child { border-bottom: none; }

                .btn-next, .btn-confirm {
                    background: linear-gradient(45deg, var(--gold), #F0E68C);
                    color: #000;
                    border: none; padding: 12px 30px;
                    border-radius: 50px; font-weight: bold;
                    display: flex; align-items: center; gap: 10px;
                    transition: all 0.3s;
                }
                .btn-next:disabled, .btn-confirm:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); }
                .btn-next:hover:not(:disabled), .btn-confirm:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(218, 165, 32, 0.4);
                }
                .btn-back {
                    background: transparent; border: 1px solid rgba(255,255,255,0.2);
                    color: white; padding: 12px 25px; border-radius: 50px;
                    display: flex; align-items: center; gap: 10px;
                    transition: all 0.3s;
                }
                .btn-back:hover { background: rgba(255,255,255,0.1); }
                
                .btn-download {
                    background: transparent;
                    border: 2px solid var(--gold);
                    color: var(--gold);
                    width: 100%; padding: 12px;
                    font-weight: bold; border-radius: 12px;
                    transition: all 0.3s;
                }
                .btn-download:hover {
                    background: var(--gold); color: #000;
                }

                .success-animation { position: relative; height: 100px; display: flex; justify-content: center; align-items: center; }
                .shield-icon-wrapper { position: relative; animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .success-tick { position: absolute; bottom: -5px; right: -5px; background: #000; border-radius: 50%; color: #28a745; }
                
                .golden-ticket {
                    background: linear-gradient(135deg, #FFD700, #B8860B);
                    width: 100%; max-width: 320px;
                    border-radius: 12px;
                    color: #000;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    transform: rotate(-2deg);
                    transition: transform 0.5s;
                }
                .golden-ticket:hover { transform: rotate(0) scale(1.05); }
                .ticket-header {
                    background: rgba(0,0,0,0.1); padding: 10px;
                    font-weight: bold; font-size: 0.9rem;
                    display: flex; align-items: center; justify-content: center;
                }
                .ticket-body { padding: 15px; background: rgba(255,255,255,0.1); }
                .ticket-row { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.9rem; }
                .ticket-row .label { opacity: 0.7; font-size: 0.75rem; }
                .ticket-row .value { font-weight: bold; }
                .ticket-footer { background: #000; color: var(--gold); text-align: center; padding: 5px; font-size: 0.7rem; letter-spacing: 1px; text-transform: uppercase; }

                .loader-ring {
                    width: 60px; height: 60px;
                    border: 4px solid rgba(218, 165, 32, 0.3);
                    border-top: 4px solid var(--gold);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes popIn { 0% { transform: scale(0); } 100% { transform: scale(1); } }

                /* --- NEW: Recommendation Box Styles --- */
                .recommendation-box {
                    background: rgba(218, 165, 32, 0.1);
                    border: 1px solid var(--gold);
                    border-radius: 12px;
                    padding: 20px;
                    color: white;
                }
                .recommendation-item {
                    border-left: 2px solid var(--gold);
                    padding-left: 10px;
                    margin-bottom: 10px;
                }
                .recommendation-item .x-small {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.7);
                }
                .animate-fade-in { 
                    animation: fadeIn 0.5s ease; 
                }
                @keyframes fadeIn { 
                    from { opacity: 0; transform: translateY(10px); } 
                    to { opacity: 1; transform: translateY(0); } 
                }
                
                @media (max-width: 576px) {
                    .luxury-glass-card { padding: 20px; }
                    .selection-grid { grid-template-columns: 1fr; }
                    .btn-next, .btn-back, .btn-confirm { padding: 10px 15px; font-size: 0.9rem; }
                }
            `}</style>
        </div>
    );
};

export default Appointment;