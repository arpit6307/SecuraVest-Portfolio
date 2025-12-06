// src/components/ProductsPage.jsx

import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form, Badge, Modal, Button } from 'react-bootstrap'; // Import Modal and Button
import { collection, addDoc, Timestamp } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebase'; // Import Firestore instance
import useProducts from '../hooks/useProducts'; // Fetching product data
import CustomLoader from './common/CustomLoader';
import { 
    FaShieldAlt, FaRocket, FaTag, FaCheckCircle, FaFilter, 
    FaUsers, FaCalendarAlt, FaEnvelope, FaChevronRight, FaPhoneVolume, FaSpinner,
    FaUserTie, FaPaperPlane
} from 'react-icons/fa';

// --- CONFIGURATION ---
const ALL_FILTERS = [
    "All Categories", 
    "Term Insurance", 
    "Retirement Plans", 
    "Child Plans", 
    "Savings", 
    "Tax Benefit",
    "Guaranteed Payout",
    "Whole Life", 
    "Limited Premium",
    "ULIP",
    "Money Back",
    "Investment Plan",
    "Wealth Creation"
];

// --- SUB-COMPONENT: POLICY CARD (MODIFIED) ---
// Now accepts a function to trigger the modal
const PolicyCard = ({ product, onInquiryClick }) => {
    return (
        <Col xs={12} md={6} lg={4} className="mb-4">
            <div className="policy-glass-card h-100 position-relative">
                
                {product.is_featured && (
                    <div className="featured-badge">
                        <FaRocket className="me-1"/> Featured
                    </div>
                )}
                
                <div className="card-header-icon mb-3">
                    <FaShieldAlt size={30} />
                </div>

                <h4 className="text-white fw-bold mb-2">{product.policy_name}</h4>
                <p className="text-white-50 small mb-3">{product.tagline}</p>
                
                <hr className="divider-gold" />

                {/* Key Details */}
                <div className="key-details mb-3">
                    <div className="detail-item">
                        <FaUsers size={12} className="me-2 text-gold"/> Min Age: 
                        <span className="fw-bold ms-1">{product.min_age} Yrs</span>
                    </div>
                    <div className="detail-item">
                        <FaCalendarAlt size={12} className="me-2 text-gold"/> Max Age: 
                        <span className="fw-bold ms-1">{product.max_age} Yrs</span>
                    </div>
                </div>

                {/* Features Tags */}
                <div className="d-flex flex-wrap gap-2 mb-4 features-wrapper">
                    {Array.isArray(product.key_features) && product.key_features.map((feature, i) => (
                        <Badge key={i} className="feature-tag">
                            <FaCheckCircle size={10} className="me-1"/> {feature}
                        </Badge>
                    ))}
                </div>

                {/* CTA - Now opens the modal */}
                <button 
                    className="btn-card-cta w-100"
                    onClick={() => onInquiryClick(product)} // Pass the entire product object
                >
                    <FaEnvelope className="me-2"/> Request Details
                </button>
            </div>
        </Col>
    );
};


// --- ADVANCED INQUIRY MODAL (NEW COMPONENT LOGIC) ---
const AdvancedInquiryModal = ({ show, handleClose, policy, notify }) => {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        phone: '', 
        message: `Inquiry for policy: ${policy?.policy_name || 'N/A'}` // Auto-set message
    });
    const [status, setStatus] = useState('');

    // Reset form when policy changes or modal opens
    React.useEffect(() => {
        if (policy) {
            setFormData({ 
                name: '', 
                email: '', 
                phone: '', 
                message: `Inquiry for policy: ${policy.policy_name} (Features: ${(policy.key_features || []).join(', ')})`
            });
            setStatus('');
        }
    }, [policy]);


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
                status: 'New - Policy Enquiry', // Custom status for filtering in Admin
                policy_name: policy.policy_name // Save policy name separately
            });
            
            setStatus('success');
            
            notify(`Inquiry for ${policy.policy_name} sent successfully! I'll contact you soon.`, 'success'); 
            
            setTimeout(() => {
                handleClose(); // Close modal on success
            }, 1000); 
            
        } catch (error) {
            console.error("Error submitting policy inquiry:", error);
            setStatus('error');
            notify("Submission Failed. Please try again or call directly.", 'error'); 
            
            setTimeout(() => setStatus(''), 3000); 
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal-dark">
            <div className="modal-content-glass p-4">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="text-white fw-bold">
                        Request Details for: 
                        <span className="text-gold d-block fs-5 mt-1">{policy?.policy_name}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-2">
                    <p className="text-white-50 small mb-4">
                        Please provide your contact information to receive a personalized consultation for this policy.
                    </p>

                    <Form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <div className="input-group-royal-modal">
                                <span className="input-group-text"><FaUserTie /></span>
                                <Form.Control type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="input-group-royal-modal">
                                <span className="input-group-text"><FaPhoneVolume /></span>
                                <Form.Control type="tel" name="phone" placeholder="Contact Number" value={formData.phone} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="input-group-royal-modal">
                                <span className="input-group-text"><FaEnvelope /></span>
                                <Form.Control type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                            </div>
                        </div>
                        
                        <input type="hidden" name="message" value={formData.message} /> 

                        <Button type="submit" className="btn-gold-glow w-100" disabled={status === 'loading' || status === 'success'}>
                            {status === 'loading' ? (
                                <span className="d-flex align-items-center justify-content-center"><FaSpinner className="fa-spin me-2" /> Sending Request...</span>
                            ) : status === 'success' ? (
                                <span className="d-flex align-items-center justify-content-center"><FaCheckCircle className="me-2" /> Sent!</span>
                            ) : (
                                <span className="d-flex align-items-center justify-content-center"><FaPaperPlane className="me-2" /> Get Personalised Quote</span>
                            )}
                        </Button>
                    </Form>
                </Modal.Body>
            </div>

            {/* In-Modal Styles */}
            <style jsx="true">{`
                .custom-modal-dark .modal-content {
                    background: none !important;
                    border: none !important;
                }
                .modal-content-glass {
                    background: rgba(10, 20, 35, 0.9);
                    backdrop-filter: blur(15px);
                    border: 1px solid var(--gold);
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.7);
                }
                .input-group-royal-modal {
                    display: flex;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .input-group-royal-modal .input-group-text {
                    background-color: rgba(218, 165, 32, 0.1);
                    border: none;
                    color: var(--gold);
                }
                .input-group-royal-modal .form-control {
                    background-color: rgba(255, 255, 255, 0.05);
                    border: none;
                    color: white;
                }
                .input-group-royal-modal .form-control:focus {
                    background-color: rgba(255, 255, 255, 0.1);
                    box-shadow: 0 0 5px var(--gold);
                }
                .btn-gold-glow {
                    /* Inheriting style from AgentProfile or setting fresh for consistency */
                    background: linear-gradient(135deg, var(--gold), #B8860B);
                    color: #000; padding: 12px 30px; border-radius: 50px;
                    font-weight: bold;
                    box-shadow: 0 0 20px rgba(218, 165, 32, 0.3);
                    transition: all 0.3s;
                }
                .btn-gold-glow:hover:not(:disabled) { 
                    transform: translateY(-3px); 
                    box-shadow: 0 0 30px rgba(218, 165, 32, 0.5); 
                    filter: brightness(1.1);
                }
            `}</style>
        </Modal>
    );
}

// --- MAIN PAGE COMPONENT (MODIFIED) ---
const ProductsPage = ({ notify }) => {
    const { products, loading, error } = useProducts();
    const [activeFilter, setActiveFilter] = useState("All Categories");
    
    // State for the modal
    const [showModal, setShowModal] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    const handleInquiryClick = (product) => {
        setSelectedPolicy(product);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedPolicy(null);
    };

    // Memoized Filtering Logic
    const filteredProducts = useMemo(() => {
        if (activeFilter === "All Categories") {
            return products;
        }
        return products.filter(product => 
            Array.isArray(product.key_features) && product.key_features.includes(activeFilter)
        );
    }, [products, activeFilter]);


    if (loading) return <CustomLoader />;
    if (error) return (
        <div className="text-center py-5 text-white" style={{ backgroundColor: '#002D62', minHeight: '100vh' }}>
            <h2 className='text-danger'>Error Loading Products</h2>
            <p className='text-white-50'>{error}</p>
        </div>
    );
    
    return (
        <section id="products-page" className="products-section position-relative overflow-hidden">
            
            {/* Background FX */}
            <div className="orb orb-products-1"></div>
            <div className="grid-overlay"></div>

            <Container className="position-relative z-2 py-5">
                
                {/* Header */}
                <div className="text-center mb-5 pt-4">
                    <h6 className="text-gold text-uppercase ls-2 mb-2">Exclusive Plans</h6>
                    <h2 className="display-5 fw-bold text-white">Our Comprehensive Policy Portfolio</h2>
                    <p className="text-white-50 mx-auto fs-5" style={{ maxWidth: '800px' }}>
                        Find the perfect financial solution for security, retirement, savings, and your child's future. Filter by key features below.
                    </p>
                </div>
                
                {/* --- FILTER DECK --- */}
                <div className="filter-deck mx-auto mb-5">
                    <div className="filter-deck-header">
                        <FaFilter className="me-2"/> Filter by Category
                    </div>
                    <div className="filter-buttons-container">
                        {ALL_FILTERS.map(filter => (
                            <button 
                                key={filter}
                                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- PRODUCTS GRID --- */}
                <Row className="justify-content-center">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <PolicyCard 
                                key={product.id} 
                                product={product} 
                                onInquiryClick={handleInquiryClick} // Pass the click handler
                            />
                        ))
                    ) : (
                        <Col xs={12} className="text-center p-5">
                            <FaTag size={40} className="text-gold mb-3"/>
                            <h4 className="text-white">No Policies Found</h4>
                            <p className="text-white-50">Try selecting a different filter category.</p>
                        </Col>
                    )}
                </Row>
            </Container>

            {/* --- ADVANCED INQUIRY MODAL RENDER --- */}
            <AdvancedInquiryModal 
                show={showModal}
                handleClose={handleClose}
                policy={selectedPolicy}
                notify={notify}
            />

            {/* --- CSS STYLES (Optimized for Mobile and Design) --- */}
            <style>{`
                :root {
                    --gold: #DAA520;
                    --navy: #002D62;
                    --glass-bg: rgba(255, 255, 255, 0.03);
                    --glass-border: rgba(255, 255, 255, 0.1);
                    --cyan: #00f2ea;
                }
                .products-section {
                    background-color: var(--navy);
                    min-height: 100vh;
                    padding-top: 80px; 
                    border-top: 1px solid var(--glass-border);
                }

                /* Background FX */
                .orb-products-1 { position: absolute; top: 10%; right: 10%; width: 50vw; height: 50vw; border-radius: 50%; background: radial-gradient(circle, rgba(218, 165, 32, 0.2), transparent 70%); filter: blur(100px); opacity: 0.3; z-index: 0; }
                .grid-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background-image: linear-gradient(var(--glass-bg) 1px, transparent 1px),
                    linear-gradient(90deg, var(--glass-bg) 1px, transparent 1px);
                    background-size: 40px 40px; z-index: 1; opacity: 0.3; pointer-events: none;
                }

                /* Policy Card Styling */
                .policy-glass-card {
                    background: rgba(10, 20, 35, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--glass-border);
                    border-radius: 16px;
                    padding: 30px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    transition: all 0.3s ease;
                }
                .policy-glass-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--gold);
                    box-shadow: 0 15px 40px rgba(0,0,0,0.5), 0 0 15px rgba(218, 165, 32, 0.2);
                }
                .card-header-icon {
                    width: 50px; height: 50px;
                    background: rgba(218, 165, 32, 0.1);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    color: var(--gold);
                    transition: 0.3s;
                }
                .policy-glass-card:hover .card-header-icon {
                    background: var(--gold);
                    color: var(--navy);
                    transform: scale(1.1);
                }
                .divider-gold { border-top: 1px dashed rgba(218, 165, 32, 0.5); opacity: 0.5; margin-top: 1rem; margin-bottom: 1rem; }

                /* Details & Features */
                .key-details {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    margin-bottom: 20px;
                }
                .detail-item {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                }
                .feature-tag {
                    background-color: var(--navy);
                    border: 1px solid var(--cyan);
                    color: var(--cyan);
                    padding: 5px 10px;
                    border-radius: 50px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                /* CTA Button */
                .btn-card-cta {
                    background: var(--gold);
                    color: var(--navy);
                    border: none;
                    padding: 12px;
                    border-radius: 8px;
                    font-weight: bold;
                    transition: 0.3s;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .btn-card-cta:hover {
                    background: #FFD700;
                    box-shadow: 0 5px 15px rgba(218, 165, 32, 0.5);
                    transform: translateY(-2px);
                }
                
                .featured-badge {
                    position: absolute; top: 15px; right: 15px;
                    background: var(--cyan);
                    color: var(--navy);
                    padding: 5px 10px;
                    border-radius: 50px;
                    font-size: 0.8rem;
                    font-weight: bold;
                    animation: pulse-cyan 1.5s infinite alternate;
                }

                /* --- FILTER DECK STYLING --- */
                .filter-deck {
                    max-width: 1200px;
                    background: rgba(0,0,0,0.3);
                    border: 1px solid var(--glass-border);
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.4);
                }
                .filter-deck-header {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 15px 20px;
                    font-weight: bold;
                    color: var(--gold);
                    border-bottom: 1px solid var(--glass-border);
                    font-size: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .filter-buttons-container {
                    padding: 15px;
                    display: flex;
                    flex-wrap: wrap; /* Allows wrapping on small screens */
                    gap: 10px;
                }
                .filter-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: rgba(255, 255, 255, 0.8);
                    padding: 8px 15px;
                    border-radius: 50px;
                    font-size: 0.9rem;
                    transition: all 0.3s;
                    white-space: nowrap; /* Essential for mobile scrolling/wrapping */
                }
                .filter-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: var(--gold);
                }
                .filter-btn.active {
                    background: var(--gold);
                    color: var(--navy);
                    font-weight: bold;
                    border-color: var(--gold);
                    box-shadow: 0 0 10px rgba(218, 165, 32, 0.4);
                }

                /* Mobile Adjustments */
                @media (max-width: 768px) {
                    .filter-deck {
                        border-radius: 0; /* Full width mobile look */
                    }
                    .products-section {
                        padding-top: 50px;
                    }
                }

                /* Animations */
                @keyframes pulse-cyan {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(0, 242, 234, 0.4); }
                    50% { box-shadow: 0 0 0 8px rgba(0, 242, 234, 0); }
                }
            `}</style>
        </section>
    );
};

export default ProductsPage;