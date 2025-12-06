// src/components/AdminDashboard.jsx

// ==========================================
// 1. IMPORTS & CONFIG
// ==========================================
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
    doc, getDoc, updateDoc, collection, 
    query, getDocs, orderBy, deleteDoc, addDoc, setDoc 
} from 'firebase/firestore'; 
import useAuth from '../hooks/useAuth';

import CustomLoader from './common/CustomLoader'; 

// --- UPDATED IMPORTS FOR NEW DESIGN ---
import { 
    FaChartPie, FaUserAstronaut, FaSatelliteDish, 
    FaCheckDouble, FaTimes, FaStar, FaRocket, 
    FaList, FaRegCommentDots, FaUsers, FaCrown,
    FaMoneyCheckAlt, FaHistory, FaCalendarDay, FaFileDownload, 
    FaEdit, FaUserSecret, FaBullseye, FaTag, FaCalendarCheck, 
    FaShieldAlt, FaPowerOff, FaFingerprint, FaGlobe,
    FaSignOutAlt, FaCheckCircle, FaPhoneVolume, FaChartLine, FaDatabase,
    FaUserTie, FaCheck, FaBars // FaBars for mobile menu toggle
} from 'react-icons/fa'; 

import { 
    MdDashboardCustomize, MdNotificationsActive, MdContactPhone, 
    MdEmail, MdPlace, MdDescription, MdAutoGraph, MdOutlineContactMail 
} from 'react-icons/md';


// Policy feature options (must match the filter list in ProductsPage.jsx)
const POLICY_FEATURES = [
    "Term Insurance", "Retirement Plans", "Child Plans", "Savings", 
    "Tax Benefit", "Guaranteed Payout", "Whole Life", "Limited Premium",
    "ULIP", "Money Back", "Investment Plan", "Wealth Creation"
];


// ==========================================
// 2. UTILITIES & LOGIC
// ==========================================

// Time formatting (e.g., "2m ago")
const timeSince = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'Offline';
    const seconds = Math.floor((new Date() - timestamp.toDate()) / 1000);
    const intervals = { d: 86400, h: 3600, m: 60 };
    for (const [key, val] of Object.entries(intervals)) {
        if (seconds >= val) return `${Math.floor(seconds / val)}${key} ago`;
    }
    return 'Just now';
};

const triggerExport = () => alert("Initializing Secure Data Export Protocol... (Simulation)");


// ==========================================
// 3. UI COMPONENTS (Neo-Cyber Tech Blocks)
// ==========================================

// A. Insight Chip
const InsightChip = ({ icon: Icon, label, value, trend }) => (
    <div className="insight-pill">
        <Icon className="text-gold me-2" />
        <span className="text-white-50 me-2">{label}:</span>
        <span className="text-white fw-bold">{value}</span>
        {trend && <span className="ms-2 text-green small">▲ {trend}</span>}
    </div>
);

// B. Holographic Stat Card
const HoloCard = ({ icon: Icon, title, value, sub, color }) => (
    <div className="col-12 col-sm-6 col-lg-3 mb-4">
        <div className="holo-card-wrapper h-100">
            <div className="holo-bg"></div>
            <div className="position-relative z-2">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <p className="text-gold text-uppercase x-small fw-bold ls-2 mb-1">{title}</p>
                        <h2 className="text-white display-6 fw-bold mb-0">{value}</h2>
                    </div>
                    <div className={`icon-hexagon ${color}`}>
                        <Icon size={22} />
                    </div>
                </div>
                <div className="progress-bar-mini">
                    <div className={`progress-fill ${color}`} style={{width: '70%'}}></div>
                </div>
                <p className="text-white-50 x-small mt-2 mb-0">{sub}</p>
            </div>
        </div>
    </div>
);

// C. Neo-Input Field
const NeoInput = ({ label, icon: Icon, ...props }) => (
    <div className="mb-4 group">
        <label className="neo-label">{label}</label>
        <div className="neo-input-box">
            {Icon && <div className="input-icon-box"><Icon /></div>}
            {props.type === 'textarea' ? (
                <textarea className="neo-control" {...props} />
            ) : (
                <input className="neo-control" {...props} />
            )}
            <div className="active-border"></div>
        </div>
    </div>
);

// D. Status Tag
const StatusTag = ({ status }) => {
    const colors = {
        New: 'gold', Pending: 'gold', 'New - Recruitment Enquiry': 'cyan',
        Contacted: 'blue', Approved: 'blue',
        Converted: 'green', Confirmed: 'green',
        Lost: 'red', Rejected: 'red',
        'New - Policy Enquiry': 'blue'
    };
    return <span className={`status-tag ${colors[status] || 'gray'}`}>{status}</span>;
};

// E. Mobile Card
const MobileStackCard = ({ title, sub, status, time, children }) => (
    <div className="mobile-stack-card">
        <div className="d-flex justify-content-between mb-2">
            <div>
                <h6 className="text-white fw-bold mb-0">{title}</h6>
                <small className="text-white-50">{sub}</small>
            </div>
            <div className="text-end">
                <StatusTag status={status} />
                <div className="x-small text-gold mt-1">{time}</div>
            </div>
        </div>
        <div className="mobile-actions d-flex gap-2 mt-3">{children}</div>
    </div>
);

// F. Admin Footer (IMPROVED AND MOBILE RESPONSIVE)
const AdminFooter = () => (
    <footer className="admin-footer mt-5 p-3">
        {/* Decorative Gold Line */}
        <div className="footer-line"></div> 
        
        <div className="container-fluid d-flex flex-column flex-md-row justify-content-between align-items-center py-3">
            
            {/* Left Section: Brand & Copyright */}
            <div className="d-flex align-items-center mb-2 mb-md-0">
                <FaCrown className="text-gold me-2" size={16}/>
                <p className="text-white-50 small m-0 fw-bold ls-1">
                    SECURAVEST COMMAND &copy; {new Date().getFullYear()}
                </p>
            </div>
            
            {/* Right Section: Status & Version (Stacks on mobile) */}
            <div className="d-flex flex-column flex-sm-row gap-3 text-white-50 small text-center text-md-end">
                <span className="text-green-footer fw-bold">
                    <FaCheckCircle className="me-1"/> SYSTEM STABLE
                </span>
                <span className="text-white-50">
                    <FaDatabase className="me-1 text-gold"/> PROTOCOL V3.2.0
                </span>
            </div>
        </div>
    </footer>
);


// ==========================================
// 4. MAIN DASHBOARD LOGIC 
// ==========================================

const AdminDashboard = ({ showNotification }) => {
    const { logout } = useAuth();
    
    // --- STATE ---
    const [data, setData] = useState({ 
        metrics: {}, profile: {}, leads: [], reviews: [], 
        appts: [], teamAgents: [], policies: []
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
    
    // State for Add/Edit Forms
    const [isEditingAgent, setIsEditingAgent] = useState(null); 
    const [newAgentForm, setNewAgentForm] = useState({ name: '', title: '', policies: 0, img: '' });
    const [isEditingPolicy, setIsEditingPolicy] = useState(null); 
    const [newPolicyForm, setNewPolicyForm] = useState({
        policy_name: '', tagline: '', min_age: 18, max_age: 65, key_features: [], is_featured: false
    });
    
    // --- REFS ---
    const REFS = {
        metrics: doc(db, "agent_data", "main_metrics"),
        leads: collection(db, "leads"),
        reviews: collection(db, "testimonials"),
        appts: collection(db, "appointments"),
        teamAgents: collection(db, "team_agents"),
        policies: collection(db, "products")
    };

    // --- SYNC DATA ---
    const syncSystem = async () => {
        try {
            const [mSnap, lSnap, rSnap, aSnap, tSnap, pSnap] = await Promise.all([ 
                getDoc(REFS.metrics),
                getDocs(query(REFS.leads, orderBy("timestamp", "desc"))),
                getDocs(query(REFS.reviews, orderBy("timestamp", "desc"))),
                getDocs(query(REFS.appts, orderBy("timestamp", "desc"))),
                getDocs(query(REFS.teamAgents, orderBy("policies", "desc"))),
                getDocs(query(REFS.policies, orderBy("policy_name", "asc"))) 
            ]);

            if (mSnap.exists()) setData(prev => ({ ...prev, metrics: mSnap.data(), profile: mSnap.data() }));
            
            setData(prev => ({
                ...prev,
                leads: lSnap.docs.map(d => ({ id: d.id, ...d.data() })),
                reviews: rSnap.docs.map(d => ({ id: d.id, ...d.data() })),
                appts: aSnap.docs.map(d => ({ id: d.id, ...d.data() })),
                teamAgents: tSnap.docs.map(d => ({ id: d.id, ...d.data() })),
                policies: pSnap.docs.map(d => ({ id: d.id, ...d.data() }))
            }));
            
            setLoading(false);
        } catch (e) { console.error("System Sync Failed:", e); }
    };

    useEffect(() => { syncSystem(); }, []);

    // --- GENERIC DB ACTIONS ---
    const updateDB = async (coll, id, payload) => {
        try {
            if (coll === 'metrics') await updateDoc(REFS.metrics, payload);
            else await updateDoc(doc(db, coll, id), payload);
            
            showNotification("System Protocols Updated", 'success'); 
            syncSystem();
        } catch (e) { console.error(e); }
    };

    const deleteEntry = async (coll, id) => {
        if(!window.confirm("Purge this record from database?")) return;
        try {
            await deleteDoc(doc(db, coll, id));
            
            showNotification("Record Purged", 'error'); 
            syncSystem();
        } catch (e) { console.error(e); }
    };

    // --- AGENTS CRUD ---
    const handleAgentFormChange = (e) => {
        const { name, value } = e.target;
        setNewAgentForm(prev => ({ ...prev, [name]: name === 'policies' ? Number(value) : value }));
    };
    const saveAgent = async () => {
        try {
            const payload = { ...newAgentForm, policies: Number(newAgentForm.policies) };
            if (isEditingAgent) {
                await updateDoc(doc(db, "team_agents", isEditingAgent.id), payload);
                showNotification("Agent Record Updated", 'success'); 
                setIsEditingAgent(null);
            } else {
                await addDoc(REFS.teamAgents, payload);
                showNotification("New Agent Added", 'success');
            }
            setNewAgentForm({ name: '', title: '', policies: 0, img: '' });
            syncSystem();
        } catch (e) { showNotification("Error saving agent. Check console for details.", 'error'); }
    };
    const startEditAgent = (agent) => {
        setIsEditingAgent(agent);
        setNewAgentForm({ name: agent.name, title: agent.title, policies: agent.policies || 0, img: agent.img || '' });
        setActiveTab('team'); 
    };
    const deleteAgent = async (id) => deleteEntry('team_agents', id);
    
    // --- POLICY CRUD ---
    const handlePolicyFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'is_featured') {
             setNewPolicyForm(prev => ({ ...prev, is_featured: checked }));
        } else if (name === 'min_age' || name === 'max_age') {
             setNewPolicyForm(prev => ({ ...prev, [name]: Number(value) }));
        } else {
             setNewPolicyForm(prev => ({ ...prev, [name]: value }));
        }
    };
    const handleFeatureToggle = (feature) => {
        setNewPolicyForm(prev => {
            const features = prev.key_features || [];
            if (features.includes(feature)) {
                return { ...prev, key_features: features.filter(f => f !== feature) };
            } else {
                return { ...prev, key_features: [...features, feature] };
            }
        });
    };
    const savePolicy = async () => {
        try {
            const payload = { ...newPolicyForm };
            if (isEditingPolicy) {
                const docRef = doc(db, "products", isEditingPolicy.id);
                await setDoc(docRef, payload, { merge: true }); 
                showNotification("Policy Updated Successfully!", 'success'); 
                setIsEditingPolicy(null);
            } else {
                await addDoc(REFS.policies, payload);
                showNotification("New Policy Added!", 'success');
            }
            setNewPolicyForm({ policy_name: '', tagline: '', min_age: 18, max_age: 65, key_features: [], is_featured: false });
            syncSystem();
        } catch (e) { showNotification("Error saving policy. Check console for details.", 'error'); }
    };
    const startEditPolicy = (policy) => {
        setIsEditingPolicy(policy);
        setNewPolicyForm({ 
            policy_name: policy.policy_name || '', tagline: policy.tagline || '', 
            min_age: policy.min_age || 18, max_age: policy.max_age || 65, 
            key_features: policy.key_features || [], is_featured: policy.is_featured || false
        });
        setActiveTab('policies'); 
    };
    const deletePolicy = async (id) => deleteEntry('products', id);
    
    // --- CALCULATIONS ---
    const pendingReviews = data.reviews.filter(r => r.status === 'Pending');
    const newLeads = data.leads.filter(l => l.status === 'New' || l.status === 'New - Recruitment Enquiry' || l.status === 'New - Policy Enquiry'); 
    const goalPercent = data.metrics.policies_goal > 0 ? Math.min(100, Math.round((data.metrics.policies_issued / data.metrics.policies_goal) * 100)) : 0;


    // --- HELPERS ---
    const changeTab = (tabId) => {
        setActiveTab(tabId);
        setIsMobileMenuOpen(false); // Close menu after selection
    };

    // ==========================================
    // 5. VIEW RENDERERS (Core Dashboard Views)
    // ==========================================

    // 1. OVERVIEW DECK
    const renderOverview = () => (
        <div className="row g-4 animate-fade-in">
            <div className="col-lg-7 order-2 order-lg-1">
                <div className="command-panel h-100">
                    <div className="panel-header">
                        <FaUserSecret className="text-gold me-2" /> Agent Identity Protocol
                    </div>
                    <div className="panel-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <NeoInput label="Codename / Full Name" icon={FaUserAstronaut} value={data.profile.agent_name || ''} onChange={(e) => setData({...data, profile: {...data.profile, agent_name: e.target.value}})} />
                            </div>
                            <div className="col-md-6">
                                <NeoInput label="Mission Tagline" icon={FaTag} value={data.profile.tagline || ''} onChange={(e) => setData({...data, profile: {...data.profile, tagline: e.target.value}})} />
                            </div>
                        </div>
                        
                        {/* --- Profile Image URL Input (To feed AgentProfile.jsx) --- */}
                        <NeoInput 
                            label="Profile Image URL" 
                            icon={FaGlobe} 
                            value={data.profile.img_url || ''} 
                            onChange={(e) => setData({...data, profile: {...data.profile, img_url: e.target.value}})} 
                        />
                        {/* ---------------------------------------------------------- */}

                        <NeoInput label="Bio / Mission Brief" type="textarea" rows="4" icon={MdDescription} value={data.profile.description || ''} onChange={(e) => setData({...data, profile: {...data.profile, description: e.target.value}})} />
                        <div className="row g-3">
                            <div className="col-md-6"><NeoInput label="Specializations" icon={FaStar} value={Array.isArray(data.profile.specializations) ? data.profile.specializations.join(', ') : (data.profile.specializations || '')} onChange={(e) => setData({...data, profile: {...data.profile, specializations: e.target.value.split(', ')}})} /></div>
                            <div className="col-md-6"><NeoInput label="Secure Comms (Phone)" icon={FaPhoneVolume} value={data.profile.phone || ''} onChange={(e) => setData({...data, profile: {...data.profile, phone: e.target.value}})} /></div>
                        </div>
                        <div className="row g-3">
                             <div className="col-md-6"><NeoInput label="Email Frequency" icon={MdEmail} value={data.profile.email || ''} onChange={(e) => setData({...data, profile: {...data.profile, email: e.target.value}})} /></div>
                             <div className="col-md-6"><NeoInput label="Base Location" icon={MdPlace} value={data.profile.address || ''} onChange={(e) => setData({...data, profile: {...data.profile, address: e.target.value}})} /></div>
                        </div>

                        <button className="btn-neon-gold w-100 mt-2" onClick={() => updateDB('metrics', null, data.profile)}>UPLOAD IDENTITY</button>
                    </div>
                </div>
            </div>

            <div className="col-lg-5 order-1 order-lg-2">
                <div className="command-panel h-100">
                    <div className="panel-header">
                        <MdAutoGraph className="text-gold me-2" /> Performance Core
                    </div>
                    <div className="panel-body">
                        <div className="metric-grid">
                            <NeoInput label="Policies Issued" type="number" value={data.metrics.policies_issued || 0} onChange={(e) => setData({...data, metrics: {...data.metrics, policies_issued: Number(e.target.value)}})} />
                            <NeoInput label="Active Units" type="number" value={data.metrics.live_policies || 0} onChange={(e) => setData({...data, metrics: {...data.metrics, live_policies: Number(e.target.value)}})} />
                            <NeoInput label="Settlements" type="number" value={data.metrics.claims_settled || 0} onChange={(e) => setData({...data, metrics: {...data.metrics, claims_settled: Number(e.target.value)}})} />
                            <NeoInput label="XP Level (Years)" type="number" value={data.metrics.years_experience || 0} onChange={(e) => setData({...data, metrics: {...data.metrics, years_experience: Number(e.target.value)}})} />
                        </div>
                        <div className="p-3 bg-dark-glass rounded border border-gold-20 mt-2">
                            <div className="d-flex justify-content-between mb-2 text-white small">
                                <span>Monthly Target</span>
                                <span className="text-gold fw-bold">{goalPercent}% Achieved</span>
                            </div>
                            <NeoInput label="Target Value" icon={FaBullseye} type="number" value={data.metrics.policies_goal || 0} onChange={(e) => setData({...data, metrics: {...data.metrics, policies_goal: Number(e.target.value)}})} />
                        </div>
                        <button className="btn-outline-neon w-100 mt-3" onClick={() => updateDB('metrics', null, data.metrics)}>SYNC METRICS</button>
                    </div>
                </div>
            </div>
        </div>
    );

    // 2. TEAM AGENTS MANAGEMENT
    const renderTeamAgents = () => (
        <div className="row g-4 animate-fade-in">
            <div className="col-lg-4 order-2 order-lg-1">
                <div className="command-panel h-100">
                    <div className="panel-header">
                        <FaUserTie className="text-gold me-2" /> {isEditingAgent ? 'Edit Agent Profile' : 'Add New Agent'}
                    </div>
                    <div className="panel-body">
                        <NeoInput label="Agent Name" icon={FaUserAstronaut} name="name" value={newAgentForm.name} onChange={handleAgentFormChange} />
                        <NeoInput label="Title / Designation" icon={FaTag} name="title" value={newAgentForm.title} onChange={handleAgentFormChange} />
                        <NeoInput label="Policies Issued" icon={FaChartLine} type="number" name="policies" value={newAgentForm.policies} onChange={handleAgentFormChange} />
                        <NeoInput label="Image URL" icon={FaGlobe} name="img" value={newAgentForm.img} onChange={handleAgentFormChange} />
                        
                        <button className="btn-neon-gold w-100 mt-3" onClick={saveAgent} disabled={!newAgentForm.name || !newAgentForm.title}>
                            {isEditingAgent ? 'SAVE CHANGES' : 'ADD AGENT'}
                        </button>
                        {isEditingAgent && (
                            <button className="btn-outline-neon w-100 mt-2 btn-red-outline" onClick={() => { setIsEditingAgent(null); setNewAgentForm({ name: '', title: '', policies: 0, img: '' }); }}>
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="col-lg-8 order-1 order-lg-2">
                <div className="command-panel h-100">
                    <div className="panel-header">
                        <FaUsers className="text-gold me-2" /> Active Team Agents ({data.teamAgents.length})
                    </div>
                    <div className="table-responsive">
                        <table className="royal-table">
                            <thead>
                                <tr>
                                    <th>Name / Title</th>
                                    <th>Policies</th>
                                    <th>Image URL</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.teamAgents.map(agent => (
                                    <tr key={agent.id}>
                                        <td className="fw-bold text-white">
                                            {agent.name}
                                            <div className="text-white-50 small">{agent.title}</div>
                                        </td>
                                        <td className="text-gold fw-bold">{agent.policies}</td>
                                        <td className="text-white-50 small" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {agent.img || 'No URL'}
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button className="icon-btn btn-blue" onClick={() => startEditAgent(agent)} title="Edit"><FaEdit/></button>
                                                <button className="icon-btn btn-red" onClick={() => deleteEntry('team_agents', agent.id)} title="Delete"><FaPowerOff/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {data.teamAgents.length === 0 && <tr><td colSpan="4" className="text-center py-5 text-white-50">No Team Agents Found. Add one to display on the public page.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <style>{`
                .btn-red-outline {
                    background: transparent; border: 1px solid var(--red); color: var(--red);
                }
                .btn-red-outline:hover {
                    background: var(--red); color: white;
                }
            `}</style>
        </div>
    );
    
    // 3. POLICIES MANAGEMENT
    const renderPolicies = () => (
        <div className="row g-4 animate-fade-in">
            <div className="col-lg-4 order-2 order-lg-1">
                <div className="command-panel h-100">
                    <div className="panel-header">
                        <FaShieldAlt className="text-gold me-2" /> {isEditingPolicy ? 'Edit Policy Details' : 'Add New Policy'}
                    </div>
                    <div className="panel-body">
                        <NeoInput 
                            label="Policy Name (e.g., Jeevan Anand)" icon={FaCrown} name="policy_name" 
                            value={newPolicyForm.policy_name} onChange={handlePolicyFormChange} 
                        />
                        <NeoInput 
                            label="Tagline (Short Description)" icon={FaTag} name="tagline" 
                            value={newPolicyForm.tagline} onChange={handlePolicyFormChange} 
                        />
                        <div className="row g-3">
                            <div className="col-6">
                                <NeoInput 
                                    label="Min Age (Yrs)" icon={FaChartLine} type="number" name="min_age" 
                                    value={newPolicyForm.min_age} onChange={handlePolicyFormChange} 
                                />
                            </div>
                            <div className="col-6">
                                <NeoInput 
                                    label="Max Age (Yrs)" icon={FaChartLine} type="number" name="max_age" 
                                    value={newPolicyForm.max_age} onChange={handlePolicyFormChange} 
                                />
                            </div>
                        </div>
                        
                        <div className="form-check form-switch mb-4">
                            <input 
                                className="form-check-input" type="checkbox" id="isFeaturedSwitch"
                                name="is_featured" 
                                checked={newPolicyForm.is_featured} 
                                onChange={handlePolicyFormChange}
                            />
                            <label className="form-check-label text-white-50" htmlFor="isFeaturedSwitch">
                                <FaStar className="me-2 text-gold"/> Feature on Homepage?
                            </label>
                        </div>

                        <label className="neo-label">Key Features (Select All that Apply)</label>
                        <div className="feature-select-grid mb-4">
                            {POLICY_FEATURES.map(feature => (
                                <div key={feature} className="feature-chip-container">
                                    <button 
                                        type="button"
                                        className={`feature-chip ${newPolicyForm.key_features.includes(feature) ? 'active' : ''}`}
                                        onClick={() => handleFeatureToggle(feature)}
                                    >
                                        {newPolicyForm.key_features.includes(feature) && <FaCheck size={10} className="me-1" />}
                                        {feature}
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <button className="btn-neon-gold w-100 mt-3" onClick={savePolicy} disabled={!newPolicyForm.policy_name || newPolicyForm.key_features.length === 0}>
                            {isEditingPolicy ? 'SAVE POLICY' : 'ADD POLICY'}
                        </button>
                        {isEditingPolicy && (
                            <button className="btn-outline-neon w-100 mt-2 btn-red-outline" onClick={() => { setIsEditingPolicy(null); setNewPolicyForm({ policy_name: '', tagline: '', min_age: 18, max_age: 65, key_features: [], is_featured: false }); }}>
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="col-lg-8 order-1 order-lg-2">
                <div className="command-panel h-100">
                    <div className="panel-header">
                        <FaList className="text-gold me-2" /> Current Policy Catalog ({data.policies.length})
                    </div>
                    <div className="table-responsive">
                        <table className="royal-table">
                            <thead>
                                <tr>
                                    <th>Policy Name / Tagline</th>
                                    <th>Ages</th>
                                    <th>Features</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.policies.map(policy => (
                                    <tr key={policy.id}>
                                        <td className="fw-bold text-white">
                                            {policy.policy_name}
                                            <div className="text-white-50 small">{policy.tagline}</div>
                                        </td>
                                        <td className="text-gold fw-bold small">{policy.min_age}-{policy.max_age} Yrs</td>
                                        <td className="text-white-50 small" style={{ maxWidth: '200px' }}>
                                            {(policy.key_features || []).join(', ')}
                                        </td>
                                        <td>
                                            {policy.is_featured ? (
                                                <span className="status-tag gold d-flex align-items-center"><FaStar size={10} className="me-1"/> Featured</span>
                                            ) : (
                                                <span className="status-tag gray">Standard</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button className="icon-btn btn-blue" onClick={() => startEditPolicy(policy)} title="Edit"><FaEdit/></button>
                                                <button className="icon-btn btn-red" onClick={() => deleteEntry('products', policy.id)} title="Delete"><FaPowerOff/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {data.policies.length === 0 && <tr><td colSpan="5" className="text-center py-5 text-white-50">No Policies Found. Add a plan using the form.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <style>{`
                .feature-select-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 5px;
                }
                .feature-chip {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: rgba(255, 255, 255, 0.7);
                    padding: 5px 10px;
                    border-radius: 50px;
                    font-size: 0.8rem;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                }
                .feature-chip.active {
                    background: var(--gold);
                    color: black;
                    border-color: var(--gold);
                    font-weight: bold;
                }
                .status-tag.gray { 
                    color: rgba(255,255,255,0.5); 
                    background: rgba(255,255,255,0.05); 
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .btn-red-outline {
                    background: transparent; border: 1px solid var(--red); color: var(--red);
                }
                .btn-red-outline:hover {
                    background: var(--red); color: white;
                }
            `}</style>
        </div>
    );


    // 4. DATA LISTS (Generic for Appointments, Leads, Reviews)
    const renderList = (type) => {
        let items = [];
        let title = "";
        if (type === 'appts') { items = data.appts; title = "Scheduled Operations"; }
        if (type === 'leads') { items = data.leads; title = "Incoming Signals"; }
        if (type === 'reviews') { items = data.reviews; title = "Public Feedback"; }

        return (
            <div className="command-panel animate-fade-in">
                <div className="panel-header d-flex justify-content-between align-items-center">
                    <span><FaList className="text-gold me-2"/> {title}</span>
                    <span className="badge bg-gold-20 text-gold">{items.length} Records</span>
                </div>
                
                {/* Desktop Table */}
                <div className="table-responsive d-none d-lg-block">
                    <table className="royal-table">
                        <thead>
                            <tr>
                                <th>Entity / Name</th>
                                <th>Timestamp / Date</th>
                                <th>Data Payload</th>
                                <th>Status</th>
                                <th>Command</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td className="fw-bold text-white">{item.name || item.client_name}</td>
                                    <td className="text-white-50 font-monospace small">
                                        {type === 'appts' ? `${item.date} @ ${item.time}` : timeSince(item.timestamp)}
                                    </td>
                                    <td className="text-white-75 small">
                                        {type === 'appts' && item.purpose}
                                        {type === 'leads' && item.phone}
                                        {type === 'reviews' && `Rating: ${item.rating}★`}
                                    </td>
                                    <td><StatusTag status={item.status || 'Confirmed'} /></td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            {type === 'appts' && <button className="icon-btn btn-red" onClick={() => deleteEntry('appointments', item.id)} title="Cancel"><FaTimes/></button>}
                                            {type === 'leads' && item.status === 'New' && <button className="icon-btn btn-blue" onClick={() => updateDB('leads', item.id, {status: 'Contacted'})} title="Mark Contacted"><FaCheckDouble/></button>}
                                            {type === 'leads' && item.status === 'New - Recruitment Enquiry' && <button className="icon-btn btn-blue" onClick={() => updateDB('leads', item.id, {status: 'Contacted'})} title="Mark Contacted"><FaCheckDouble/></button>}
                                            {type === 'reviews' && item.status === 'Pending' && <button className="icon-btn btn-green" onClick={() => updateDB('testimonials', item.id, {status: 'Approved'})} title="Approve"><FaCheckDouble/></button>}
                                            <button className="icon-btn btn-red" onClick={() => deleteEntry(type === 'reviews' ? 'testimonials' : (type === 'appts' ? 'appointments' : 'leads'), item.id)} title="Delete"><FaPowerOff/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && <tr><td colSpan="5" className="text-center py-5 text-white-50">No Data Streams Active.</td></tr>}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Stack View */}
                <div className="d-lg-none p-3">
                    {items.length > 0 ? items.map(item => (
                        <MobileStackCard 
                            key={item.id} 
                            title={item.name || item.client_name} 
                            sub={type === 'appts' ? item.purpose : item.phone} 
                            status={item.status || 'Confirmed'} 
                            time={type === 'appts' ? item.date : timeSince(item.timestamp)}
                        >
                            <div className="d-flex gap-2 w-100">
                                {type === 'leads' && <a href={`tel:${item.phone}`} className="btn-mob-action btn-gold flex-fill"><FaPhoneVolume/> Call</a>}
                                {type === 'reviews' && item.status === 'Pending' && <button className="btn-mob-action btn-green flex-fill" onClick={() => updateDB('testimonials', item.id, {status: 'Approved'})}>Approve</button>}
                                <button className="btn-mob-action btn-red flex-fill" onClick={() => deleteEntry(type === 'reviews' ? 'testimonials' : (type === 'appts' ? 'appointments' : 'leads'), item.id)}>Purge</button>
                            </div>
                        </MobileStackCard>
                    )) : <div className="text-center text-white-50">No Data.</div>}
                </div>
            </div>
        );
    };


    // ==========================================
    // 6. FINAL RENDER (NEW STRUCTURE)
    // ==========================================
    
    if (loading) return <CustomLoader />;

    return (
        <div className="admin-interface">
            {/* Background FX (Retained) */}
            <div className="bg-orb top-left"></div>
            <div className="bg-orb bottom-right"></div>
            <div className="scanlines"></div>

            {/* --- 1. FIXED TOP NAVBAR --- */}
            <nav className="command-nav fixed-top">
                <div className="container-fluid px-3 px-lg-4 h-100 d-flex justify-content-between align-items-center">
                    
                    {/* Brand & Mobile Toggle */}
                    <div className="d-flex align-items-center gap-3">
                        <button className="d-lg-none menu-toggle-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                             <FaBars size={20} className="text-white"/>
                        </button>
                        <div className="brand-shield"><FaShieldAlt /></div>
                        <div>
                            <h6 className="m-0 text-white fw-bold ls-2 mobile-h6">COMMAND CENTER</h6>
                            <div className="d-flex align-items-center gap-2">
                                <span className="pulse-dot"></span>
                                <small className="text-green x-small mobile-hide">SYSTEM ONLINE</small>
                            </div>
                        </div>
                    </div>
                    
                    {/* Desktop Insights (Primary) */}
                    <div className="d-none d-lg-flex overflow-auto gap-3">
                         <InsightChip icon={FaDatabase} label="DB Latency" value="12ms" />
                         <InsightChip icon={FaFingerprint} label="Access" value="Admin" />
                    </div>

                    {/* LOGOUT BUTTON REMOVED FROM NAVBAR - NOW IN SIDEBAR FOOTER */}
                    <div className="d-none d-lg-block">
                        <p className="text-white-50 small m-0">Admin Protocol Active</p>
                    </div>

                </div>
            </nav>
            
            {/* --- 2. MAIN CONTAINER --- */}
            <div className="main-layout-container">

                {/* --- 3. DESKTOP SIDEBAR / MOBILE SLIDER MENU (FIXED/SLIDER) --- */}
                <div className={`sidebar-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                    
                    {/* Fixed Top Section */}
                    <div className="sidebar-header d-flex justify-content-center pt-4 mb-4 d-lg-none">
                         <h6 className="text-white-50 ls-2">NAVIGATION</h6>
                    </div>
                    
                    {/* Nav Items */}
                    <div className="menu-items-group">
                        {[
                            {id: 'overview', icon: MdDashboardCustomize, label: 'Overview'},
                            {id: 'policies', icon: FaShieldAlt, label: 'Policies'}, 
                            {id: 'team', icon: FaUsers, label: 'Team Agents'}, 
                            {id: 'appts', icon: FaCalendarDay, label: 'Schedule'},
                            {id: 'leads', icon: MdContactPhone, label: 'Client Leads'},
                            {id: 'reviews', icon: FaRegCommentDots, label: 'Reviews'}
                        ].map(tab => (
                            <button key={tab.id} onClick={() => changeTab(tab.id)} className={`sidebar-btn ${activeTab === tab.id ? 'active' : ''}`}>
                                <tab.icon className="me-3" /> {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Footer / Insights + LOGOUT BUTTON ADDED HERE */}
                    <div className="sidebar-footer">
                        <InsightChip icon={FaGlobe} label="Total Traffic" value="Live" trend="Stable" />
                        <p className="text-white-50 x-small mt-3">Protocol v3.2.0 Active</p>
                        
                        {/* --- NEW LOGOUT BUTTON LOCATION --- */}
                        <button onClick={logout} className="btn-sidebar-logout w-100 mt-3">
                            <FaSignOutAlt className="me-2"/> SECURE LOGOUT
                        </button>
                    </div>

                </div>
                
                {/* --- Mobile Overlay (Closes menu when clicking outside) --- */}
                {isMobileMenuOpen && <div className="mobile-menu-overlay d-lg-none" onClick={() => setIsMobileMenuOpen(false)}></div>}


                {/* --- 4. CONTENT AREA --- */}
                <div className="content-area">
                    <div className="container-fluid">
                         
                        {/* --- HOLO STATS (Top Section) --- */}
                        <div className="row g-3 mb-4">
                            <HoloCard icon={FaCalendarCheck} title="Appointments" value={data.appts.length} sub="Active Sessions" color="cyan" />
                            <HoloCard icon={FaUsers} title="New Leads" value={newLeads.length} sub="Awaiting Response" color="gold" />
                            <HoloCard icon={FaStar} title="Pending Reviews" value={pendingReviews.length} sub="Moderation Queue" color="red" />
                            <HoloCard icon={FaRocket} title="Target Status" value={`${goalPercent}%`} sub={`${data.metrics.policies_issued} / ${data.metrics.policies_goal}`} color="green" />
                        </div>

                        {/* --- DYNAMIC VIEW --- */}
                        <div className="view-port">
                            {activeTab === 'overview' && renderOverview()}
                            {activeTab === 'policies' && renderPolicies()}
                            {activeTab === 'team' && renderTeamAgents()} 
                            {activeTab === 'appts' && renderList('appts')}
                            {activeTab === 'leads' && renderList('leads')}
                            {activeTab === 'reviews' && renderList('reviews')}
                        </div>
                        
                    </div>
                    
                    {/* --- 5. ADMIN FOOTER --- */}
                    <AdminFooter />

                </div>

            </div>

            {/* --- 7. NEW CSS STYLES (Neo-Cyber Glass Design) --- */}
            <style>{`
                :root {
                    --navy: #050810;
                    --gold: #DAA520;
                    --cyan: #00f2ea;
                    --red: #ff0050;
                    --green: #00ff88;
                    --glass: rgba(16, 24, 40, 0.9); /* Darker glass for main panels */
                    --sidebar-bg: #071221;
                    --border: rgba(255, 255, 255, 0.1);
                    --content-padding-top: 70px; /* Adjusted to match navbar height */
                }
                
                /* --- BASE LAYOUT --- */
                .admin-interface { 
                    background-color: var(--navy); 
                    min-height: 100vh; 
                    color: white; 
                    position: relative; 
                    overflow-x: hidden; 
                    font-family: 'Segoe UI', sans-serif;
                }
                .main-layout-container {
                    display: flex;
                    padding-top: var(--content-padding-top); /* Space for fixed navbar */
                    position: relative;
                    z-index: 2;
                }
                .content-area {
                    flex-grow: 1;
                    padding: 20px;
                    max-width: 100%; 
                    /* No margin-left transition needed as sidebar is fixed now */
                    transition: all 0.3s ease; 
                }
                
                /* --- 1. FIXED TOP NAVBAR (Header) --- */
                .command-nav { 
                    height: var(--content-padding-top); 
                    background: rgba(5, 8, 16, 0.95); 
                    backdrop-filter: blur(20px); 
                    border-bottom: 1px solid var(--border); 
                    z-index: 1000;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                }
                .menu-toggle-btn { 
                    background: none; border: none; padding: 0; 
                    cursor: pointer;
                }

                /* --- 2. SIDEBAR MENU (FIXED POSITION FOR DESKTOP) --- */
                .sidebar-menu {
                    width: 260px;
                    flex-shrink: 0;
                    background: var(--sidebar-bg);
                    border-right: 1px solid var(--border);
                    box-shadow: 2px 0 15px rgba(0,0,0,0.5);
                    /* KEY FIX: Changed from sticky to fixed for absolute lock */
                    position: fixed; 
                    top: var(--content-padding-top); 
                    left: 0;
                    /* Ensure height covers the whole screen minus the navbar */
                    height: calc(100vh - var(--content-padding-top)); 
                    padding: 20px 15px;
                    display: flex;
                    flex-direction: column;
                    z-index: 900;
                }
                .menu-items-group { flex-grow: 1; }
                .sidebar-footer { 
                    padding-top: 20px; 
                    border-top: 1px solid rgba(255,255,255,0.05); 
                }

                /* Sidebar Buttons */
                .sidebar-btn {
                    width: 100%;
                    background: none;
                    border: none;
                    text-align: left;
                    padding: 12px 15px;
                    margin-bottom: 8px;
                    border-radius: 8px;
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 600;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                }
                .sidebar-btn:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                }
                .sidebar-btn.active {
                    background: var(--gold);
                    color: var(--navy);
                    box-shadow: 0 0 10px rgba(218, 165, 32, 0.4);
                }
                
                /* --- NEW LOGOUT BUTTON STYLE --- */
                .btn-sidebar-logout {
                    background: transparent; 
                    border: 1px solid var(--red); 
                    color: var(--red); 
                    padding: 10px; 
                    border-radius: 8px; 
                    font-weight: bold; 
                    transition: 0.3s;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .btn-sidebar-logout:hover {
                    background: var(--red);
                    color: white;
                }


                /* --- MOBILE SPECIFIC SLIDER --- */
                @media (max-width: 991px) {
                    .sidebar-menu {
                        /* Mobile slider stays fixed, but hidden off-screen */
                        position: fixed; 
                        left: 0;
                        top: 0; 
                        height: 100vh;
                        transform: translateX(-100%);
                        transition: transform 0.3s ease;
                        z-index: 1020; 
                        padding-top: var(--content-padding-top);
                    }
                    .sidebar-menu.open {
                        transform: translateX(0);
                    }
                    .main-layout-container {
                        padding-top: var(--content-padding-top);
                    }
                    .content-area {
                        margin-left: 0 !important;
                    }
                    .mobile-menu-overlay {
                        position: fixed;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: rgba(0, 0, 0, 0.7);
                        z-index: 1010;
                    }
                }

                /* --- DESKTOP LAYOUT ADJUSTMENTS --- */
                @media (min-width: 992px) {
                    .main-layout-container {
                        /* ADDED: Margin-left to offset the fixed sidebar width */
                        margin-left: 260px; 
                    }
                    .content-area {
                        padding-left: 30px; 
                        width: calc(100% - 260px); /* Fill remaining space */
                    }
                }

                /* --- IMPROVED ADMIN FOOTER STYLES --- */
                .admin-footer {
                    background: rgba(0,0,0,0.3); /* Match command panel background but slightly darker */
                    padding: 0 20px !important; /* Control padding */
                    border-top: 1px solid var(--border);
                }
                .footer-line {
                    height: 2px;
                    background: linear-gradient(to right, transparent, var(--gold), transparent);
                    margin-bottom: 5px; 
                    opacity: 0.7;
                }
                .text-green-footer {
                    color: var(--green);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .text-white-50 { color: rgba(255,255,255,0.6); }

                /* --- GENERAL STYLES (Retained/Refined) --- */
                .admin-interface .container-fluid {
                    max-width: 1600px;
                }
                .brand-shield { width: 40px; height: 40px; background: rgba(218, 165, 32, 0.1); border: 1px solid var(--gold); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--gold); animation: pulse-gold 3s infinite; }
                .pulse-dot { width: 8px; height: 8px; background: var(--green); border-radius: 50%; box-shadow: 0 0 10px var(--green); animation: blink 2s infinite; }
                .command-panel { background: var(--glass); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; backdrop-filter: blur(10px); }
                .panel-header { background: rgba(255,255,255,0.03); padding: 15px 20px; border-bottom: 1px solid var(--border); font-weight: bold; letter-spacing: 1px; text-transform: uppercase; font-size: 0.9rem; color: var(--gold); display: flex; align-items: center; }
                .panel-body { padding: 25px; }

                /* Inputs */
                .neo-label { font-size: 0.75rem; text-transform: uppercase; color: rgba(255,255,255,0.5); letter-spacing: 1px; margin-bottom: 8px; display: block; }
                .neo-input-box { position: relative; background: rgba(0,0,0,0.3); border-radius: 8px; border-bottom: 2px solid rgba(255,255,255,0.1); transition: 0.3s; }
                .neo-input-box:focus-within { background: rgba(0,0,0,0.5); border-bottom-color: var(--gold); }
                .input-icon-box { position: absolute; top: 12px; left: 15px; color: var(--gold); opacity: 0.8; }
                .neo-control { width: 100%; background: transparent; border: none; color: white; padding: 12px 15px 12px 45px; font-size: 0.95rem; outline: none; }
                
                /* Buttons */
                .btn-neon-gold { background: var(--gold); color: black; border: none; padding: 12px; font-weight: bold; border-radius: 8px; transition: 0.3s; text-transform: uppercase; letter-spacing: 1px; }
                .btn-neon-gold:hover { box-shadow: 0 0 20px rgba(218, 165, 32, 0.5); transform: translateY(-2px); }
                .btn-outline-neon { background: transparent; border: 1px solid var(--gold); color: var(--gold); padding: 10px; font-weight: bold; border-radius: 8px; transition: 0.3s; }
                .btn-outline-neon:hover { background: var(--gold); color: black; }
                
                .icon-btn { width: 32px; height: 32px; border-radius: 6px; border: none; display: flex; align-items: center; justify-content: center; transition: 0.2s; color: white; }
                .btn-blue { background: rgba(0, 242, 234, 0.2); color: var(--cyan); } .btn-blue:hover { background: var(--cyan); color: black; }
                .btn-red { background: rgba(255, 0, 80, 0.2); color: var(--red); } .btn-red:hover { background: var(--red); color: white; }
                .btn-green { background: rgba(0, 255, 136, 0.2); color: var(--green); } .btn-green:hover { background: var(--green); color: black; }

                /* Tables */
                .royal-table { width: 100%; border-collapse: collapse; }
                .royal-table th { text-align: left; padding: 15px; color: rgba(255,255,255,0.4); font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid var(--border); }
                .royal-table td { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: middle; }
                .royal-table tr:hover { background: rgba(255,255,255,0.02); }

                /* Utils */
                .ls-2 { letter-spacing: 2px; } .x-small { font-size: 0.65rem; }
                .status-tag { padding: 4px 10px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase; background: rgba(255,255,255,0.1); }
                .status-tag.gold { color: var(--gold); background: rgba(218, 165, 32, 0.15); border: 1px solid rgba(218, 165, 32, 0.3); }
                .status-tag.green { color: var(--green); background: rgba(0, 255, 136, 0.15); border: 1px solid rgba(0, 255, 136, 0.3); }
                .status-tag.blue { color: var(--cyan); background: rgba(0, 242, 234, 0.15); border: 1px solid rgba(0, 242, 234, 0.3); }
                .status-tag.red { color: var(--red); background: rgba(255, 0, 80, 0.15); border: 1px solid rgba(255, 0, 80, 0.3); }
                .status-tag.gray { 
                    color: rgba(255,255,255,0.5); 
                    background: rgba(255,255,255,0.05); 
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .btn-red-outline {
                    background: transparent; border: 1px solid var(--red); color: var(--red);
                }
                .btn-red-outline:hover {
                    background: var(--red); color: white;
                }
                
                /* Policy Management Styles */
                .feature-select-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 5px;
                }
                .feature-chip {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: rgba(255, 255, 255, 0.7);
                    padding: 5px 10px;
                    border-radius: 50px;
                    font-size: 0.8rem;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                }
                .feature-chip.active {
                    background: var(--gold);
                    color: black;
                    border-color: var(--gold);
                    font-weight: bold;
                }
                /* Animations */
                @keyframes pulse-gold { 0% { box-shadow: 0 0 0 0 rgba(218, 165, 32, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(218, 165, 32, 0); } 100% { box-shadow: 0 0 0 0 rgba(218, 165, 32, 0); } }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
                .animate-fade-in { animation: fadeIn 0.5s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { transform: translateY(0); opacity: 1; } }

                /* Mobile Tweaks */
                @media (max-width: 768px) {
                    .admin-interface { padding-top: 70px; }
                    .panel-body { padding: 15px; }
                    .display-6 { font-size: 2rem; }
                    .mobile-hide { display: none; }
                    .mobile-h6 { font-size: 0.9rem; }
                    .sidebar-menu { width: 90%; max-width: 300px; }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;