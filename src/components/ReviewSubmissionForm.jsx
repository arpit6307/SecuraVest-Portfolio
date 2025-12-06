// src/components/ReviewSubmissionForm.jsx

import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore'; 
import { FaPaperPlane, FaStar, FaSpinner, FaCheckCircle, FaExclamationCircle, FaUser, FaPenNib, FaShieldAlt } from 'react-icons/fa';

const StarRating = ({ rating, onRatingChange }) => {
    return (
        <div className="d-flex gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                    key={star}
                    size={24}
                    className="star-icon"
                    style={{ 
                        color: star <= rating ? '#DAA520' : 'rgba(255,255,255,0.2)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onClick={() => onRatingChange(star)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
            ))}
        </div>
    );
};

// UPDATED: Component now accepts 'notify' prop
const ReviewSubmissionForm = ({ notify }) => {
    const [formData, setFormData] = useState({ name: '', reviewText: '', rating: 5, policyType: '', customPolicyName: '' });
    const [status, setStatus] = useState(''); // Status kept mainly for button disabling

    // --- LOGIC: Determine Sentiment Tag ---
    const determineSentiment = (rating) => {
        if (rating >= 4) return 'Exceptional';
        if (rating === 3) return 'Neutral';
        return 'Needs Follow-up';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Input Validation Check (REPLACED old alert() with new notification)
        if (!formData.policyType || formData.policyType === 'Select Policy Type') { 
            notify("Please select a policy type before submitting.", 'warning');
            return; 
        }

        setStatus('loading');
        const finalPolicy = formData.policyType === 'Other Plan' ? formData.customPolicyName : formData.policyType;
        
        // --- NEW FIELD: Calculated Sentiment ---
        const sentimentTag = determineSentiment(formData.rating);

        try {
            await addDoc(collection(db, "testimonials"), {
                client_name: formData.name,
                review_text: formData.reviewText,
                rating: formData.rating,
                timestamp: Timestamp.now(),
                status: 'Pending', 
                policy_type: finalPolicy,
                order: 999,
                sentiment: sentimentTag, // <-- SENTIMENT SAVED
            });
            setStatus('success');
            setFormData({ name: '', reviewText: '', rating: 5, policyType: '', customPolicyName: '' });
            
            // UPDATED: Use global notification for success
            notify("Review Submitted for Approval!", 'success'); 
            
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            console.error("Error:", error);
            setStatus('error');
            
            // UPDATED: Use global notification for error
            notify("Review Submission Failed. Please try again.", 'error');

            setTimeout(() => setStatus(''), 3000);
        }
    };

    const policyOptions = ['Select Policy Type', 'Life Insurance', 'Retirement Plan', 'Child Education', 'Investment Plan', 'Other Plan'];

    return (
        <div className="glass-form-card h-100 position-relative overflow-hidden">
            {/* Decorative Glow */}
            <div className="form-glow"></div>

            <h4 className="fw-bold text-white mb-1">Share Your Experience</h4>
            <p className="text-white-50 small mb-4">Your feedback helps others build trust.</p>
            
            <form onSubmit={handleSubmit} className="position-relative z-2">
                
                {/* Rating */}
                <div className="mb-3 text-center p-3 rating-box rounded-3">
                    <label className="text-gold small text-uppercase fw-bold mb-2 d-block">Rate Service</label>
                    <StarRating rating={formData.rating} onRatingChange={(r) => setFormData({...formData, rating: r})} />
                </div>

                {/* Inputs */}
                <div className="mb-3 group">
                    <div className="input-wrapper">
                        <FaUser className="input-icon" />
                        <input type="text" className="custom-input" placeholder="Your Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>
                </div>
                
                <div className="mb-3 group">
                    <div className="input-wrapper">
                        <FaShieldAlt className="input-icon" />
                        <select className="custom-input" value={formData.policyType} onChange={(e) => setFormData({...formData, policyType: e.target.value})} required>
                            {policyOptions.map((opt, i) => <option key={i} value={opt === 'Select Policy Type' ? '' : opt} className="text-dark">{opt}</option>)}
                        </select>
                    </div>
                </div>

                {formData.policyType === 'Other Plan' && (
                    <div className="mb-3 animate-fade-in">
                        <input type="text" className="custom-input ps-3" placeholder="Enter Plan Name" value={formData.customPolicyName} onChange={(e) => setFormData({...formData, customPolicyName: e.target.value})} required />
                    </div>
                )}

                <div className="mb-4 group">
                    <div className="input-wrapper">
                        <FaPenNib className="input-icon mt-2" />
                        <textarea className="custom-input" rows="3" placeholder="Write your review..." value={formData.reviewText} onChange={(e) => setFormData({...formData, reviewText: e.target.value})} required></textarea>
                    </div>
                </div>
                
                <button type="submit" className="btn-gold-block w-100" disabled={status === 'loading'}>
                    {status === 'loading' ? <><FaSpinner className="fa-spin me-2" /> Submitting...</> : <><FaPaperPlane className="me-2" /> Submit Review</>}
                </button>
                
                {/* REMOVED: Inline Notifications (Success/Error) - Now handled by CustomNotification component via 'notify' prop */}

            </form>

            <style>{`
                .glass-form-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(218, 165, 32, 0.2);
                    border-radius: 20px;
                    padding: 30px;
                }
                .form-glow {
                    position: absolute; top: -50%; right: -50%; width: 100%; height: 100%;
                    background: radial-gradient(circle, rgba(218,165,32,0.15), transparent 70%);
                    pointer-events: none;
                }
                .rating-box { background: rgba(0,0,0,0.2); border: 1px dashed rgba(255,255,255,0.1); }
                
                .input-wrapper { position: relative; }
                .input-icon { position: absolute; top: 15px; left: 15px; color: #DAA520; opacity: 0.7; }
                
                .custom-input {
                    width: 100%;
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    padding: 12px 12px 12px 45px;
                    color: white;
                    transition: 0.3s;
                }
                .custom-input:focus {
                    outline: none;
                    border-color: #DAA520;
                    background: rgba(0, 0, 0, 0.4);
                    box-shadow: 0 0 15px rgba(218, 165, 32, 0.1);
                }
                .custom-input::placeholder { color: rgba(255, 255, 255, 0.3); }

                .btn-gold-block {
                    background: linear-gradient(45deg, #DAA520, #B8860B);
                    border: none;
                    color: black;
                    font-weight: bold;
                    padding: 12px;
                    border-radius: 10px;
                    transition: 0.3s;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-size: 0.9rem;
                }
                .btn-gold-block:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(218, 165, 32, 0.3);
                }
                .animate-fade-in { animation: fadeIn 0.5s ease; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default ReviewSubmissionForm;