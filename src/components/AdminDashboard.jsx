// src/components/AdminDashboard.jsx

// ==========================================
// 1. IMPORTS & CONFIG
// ==========================================
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
    doc, getDoc, updateDoc, collection, 
    query, getDocs, orderBy, deleteDoc, addDoc 
} from 'firebase/firestore'; 
import useAuth from '../hooks/useAuth';

// --- FIXED IMPORTS (All Icons Added) ---
import { 
    FaChartPie, FaUserAstronaut, FaSatelliteDish, 
    FaCheckDouble, FaTimes, FaStar, FaRocket, 
    FaList, FaRegCommentDots, FaUsers, FaCrown,
    FaMoneyCheckAlt, FaHistory, FaCalendarDay, FaFileDownload, 
    FaEdit, FaUserSecret, FaBullseye, FaTag, FaCalendarCheck, 
    FaShieldAlt, FaPowerOff, FaFingerprint, FaGlobe,
    FaSignOutAlt, FaCheckCircle, FaPhoneVolume, FaChartLine, FaDatabase,
    FaUserTie // Added for Team Agents
} from 'react-icons/fa'; 

import { 
    MdDashboardCustomize, MdNotificationsActive, MdContactPhone, 
    MdEmail, MdPlace, MdDescription, MdAutoGraph, MdOutlineContactMail 
} from 'react-icons/md';


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

// PDF Simulation
const triggerExport = () => alert("Initializing Secure Data Export Protocol... (Simulation)");


// ==========================================
// 3. UI COMPONENTS (The "Royal Tech" Blocks)
// ==========================================

// A. Insight Chip (AI Pill)
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
        New: 'gold', Pending: 'gold', 'New - Recruitment Enquiry': 'cyan', // New custom status tag
        Contacted: 'blue', Approved: 'blue',
        Converted: 'green', Confirmed: 'green',
        Lost: 'red', Rejected: 'red'
    };
    return <span className={`status-tag ${colors[status] || 'gray'}`}>{status}</span>;
};

// E. Mobile Card (Responsive List Item)
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


// ==========================================
// 4. MAIN DASHBOARD LOGIC (UPDATED)
// ==========================================

const AdminDashboard = () => {
    const { logout } = useAuth();
    
    // --- STATE ---
    const [data, setData] = useState({ 
        metrics: {}, 
        profile: {}, 
        leads: [], 
        reviews: [], 
        appts: [],
        teamAgents: [] // NEW STATE FOR TEAM AGENTS
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); 
    const [msg, setMsg] = useState('');
    
    // State for Add/Edit Agent Form
    const [isEditingAgent, setIsEditingAgent] = useState(null); 
    const [newAgentForm, setNewAgentForm] = useState({ 
        name: '', title: '', policies: 0, img: '' 
    });

    // --- REFS ---
    const REFS = {
        metrics: doc(db, "agent_data", "main_metrics"),
        leads: collection(db, "leads"),
        reviews: collection(db, "testimonials"),
        appts: collection(db, "appointments"),
        teamAgents: collection(db, "team_agents") // NEW COLLECTION REF
    };

    // --- SYNC DATA ---
    const syncSystem = async () => {
        try {
            const [mSnap, lSnap, rSnap, aSnap, tSnap] = await Promise.all([
                getDoc(REFS.metrics),
                getDocs(query(REFS.leads, orderBy("timestamp", "desc"))),
                getDocs(query(REFS.reviews, orderBy("timestamp", "desc"))),
                getDocs(query(REFS.appts, orderBy("timestamp", "desc"))),
                getDocs(query(REFS.teamAgents, orderBy("policies", "desc"))) // FETCH TEAM AGENTS, ORDERED BY POLICIES
            ]);

            if (mSnap.exists()) setData(prev => ({ ...prev, metrics: mSnap.data(), profile: mSnap.data() }));
            
            setData(prev => ({
                ...prev,
                leads: lSnap.docs.map(d => ({ id: d.id, ...d.data() })),
                reviews: rSnap.docs.map(d => ({ id: d.id, ...d.data() })),
                appts: aSnap.docs.map(d => ({ id: d.id, ...d.data() })),
                teamAgents: tSnap.docs.map(d => ({ id: d.id, ...d.data() })) // Set new data
            }));
            
            setLoading(false);
        } catch (e) { console.error("System Sync Failed:", e); }
    };

    useEffect(() => { syncSystem(); }, []);

    // --- ACTIONS ---
    const notify = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

    const updateDB = async (coll, id, payload) => {
        try {
            if (coll === 'metrics') await updateDoc(REFS.metrics, payload);
            else await updateDoc(doc(db, coll, id), payload);
            notify("System Protocols Updated");
            syncSystem();
        } catch (e) { console.error(e); }
    };

    const deleteEntry = async (coll, id) => {
        if(!window.confirm("Purge this record from database?")) return;
        try {
            await deleteDoc(doc(db, coll, id));
            notify("Record Purged");
            syncSystem();
        } catch (e) { console.error(e); }
    };

    // --- TEAM AGENTS CRUD LOGIC ---

    const handleAgentFormChange = (e) => {
        const { name, value } = e.target;
        setNewAgentForm(prev => ({ 
            ...prev, 
            [name]: name === 'policies' ? Number(value) : value 
        }));
    };

    const saveAgent = async () => {
        try {
            const payload = { ...newAgentForm, policies: Number(newAgentForm.policies) };
            
            if (isEditingAgent) {
                // Update existing agent
                await updateDoc(doc(db, "team_agents", isEditingAgent.id), payload);
                notify("Agent Record Updated");
                setIsEditingAgent(null);
            } else {
                // Add new agent
                await addDoc(REFS.teamAgents, payload);
                notify("New Agent Added");
            }

            setNewAgentForm({ name: '', title: '', policies: 0, img: '' });
            syncSystem();

        } catch (e) { console.error("Agent Save Error:", e); notify("Error saving agent."); }
    };

    const startEditAgent = (agent) => {
        setIsEditingAgent(agent);
        setNewAgentForm({ 
            name: agent.name, 
            title: agent.title, 
            policies: agent.policies || 0, 
            img: agent.img || '' 
        });
        // Switch to the Team tab if not already there
        setActiveTab('team'); 
    };

    const deleteAgent = async (id) => {
        if(!window.confirm("Purge this agent record?")) return;
        try {
            await deleteDoc(doc(db, 'team_agents', id));
            notify("Agent Record Purged");
            syncSystem();
        } catch (e) { console.error(e); }
    };
    
    // --- CALCULATIONS ---
    const pendingReviews = data.reviews.filter(r => r.status === 'Pending');
    // Including the new recruitment status for New Leads count
    const newLeads = data.leads.filter(l => l.status === 'New' || l.status === 'New - Recruitment Enquiry'); 
    const goalPercent = data.metrics.policies_goal > 0 ? Math.min(100, Math.round((data.metrics.policies_issued / data.metrics.policies_goal) * 100)) : 0;


    // ==========================================
    // 5. VIEW RENDERERS (Tabs)
    // ==========================================

    // 1. OVERVIEW DECK (No functional changes here)
    const renderOverview = () => (
        <div className="row g-4 animate-fade-in">
            {/* Profile Command */}
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
                        <NeoInput label="Bio / Mission Brief" type="textarea" rows="4" icon={MdDescription} value={data.profile.description || ''} onChange={(e) => setData({...data, profile: {...data.profile, description: e.target.value}})} />
                        <div className="row g-3">
                            <div className="col-md-6"><NeoInput label="Specializations" icon={FaStar} value={Array.isArray(data.profile.specializations) ? data.profile.specializations.join(', ') : (data.profile.specializations || '')} onChange={(e) => setData({...data, profile: {...data.profile, specializations: e.target.value.split(', ')}})} /></div>
                            <div className="col-md-6"><NeoInput label="Secure Comms (Phone)" icon={FaPhoneVolume} value={data.profile.phone || ''} onChange={(e) => setData({...data, profile: {...data.profile, phone: e.target.value}})} /></div>
                        </div>
                        {/* Added Email & Address Fields */}
                        <div className="row g-3">
                             <div className="col-md-6"><NeoInput label="Email Frequency" icon={MdEmail} value={data.profile.email || ''} onChange={(e) => setData({...data, profile: {...data.profile, email: e.target.value}})} /></div>
                             <div className="col-md-6"><NeoInput label="Base Location" icon={MdPlace} value={data.profile.address || ''} onChange={(e) => setData({...data, profile: {...data.profile, address: e.target.value}})} /></div>
                        </div>

                        <button className="btn-neon-gold w-100 mt-2" onClick={() => updateDB('metrics', null, data.profile)}>UPLOAD IDENTITY</button>
                    </div>
                </div>
            </div>

            {/* Metrics Core */}
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

    // 2. TEAM AGENTS MANAGEMENT (NEW RENDERER)
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
                                                <button className="icon-btn btn-red" onClick={() => deleteAgent(agent.id)} title="Delete"><FaPowerOff/></button>
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
            {/* Custom CSS for Edit/Cancel button consistency */}
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

    // 3. DATA LISTS (Generic for Appointments, Leads, Reviews)
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
                                            {type === 'leads' && item.status === 'New - Recruitment Enquiry' && <button className="icon-btn btn-blue" onClick={() => updateDB('leads', item.id, {status: 'Contacted'})} title="Mark Contacted"><FaCheckDouble/></button>} {/* Added check for new status */}
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
    // 6. FINAL RENDER
    // ==========================================
    
    if (loading) return <div className="loader-screen">SYSTEM INITIALIZING...</div>;

    return (
        <div className="admin-interface">
            {/* Background FX */}
            <div className="bg-orb top-left"></div>
            <div className="bg-orb bottom-right"></div>
            <div className="scanlines"></div>

            {/* Navbar */}
            <nav className="command-nav fixed-top">
                <div className="container-fluid px-3 px-lg-4 h-100 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                        <div className="brand-shield"><FaShieldAlt /></div>
                        <div>
                            <h6 className="m-0 text-white fw-bold ls-2 mobile-h6">SECURAVEST</h6>
                            <div className="d-flex align-items-center gap-2">
                                <span className="pulse-dot"></span>
                                <small className="text-green x-small mobile-hide">SYSTEM ONLINE</small>
                            </div>
                        </div>
                    </div>
                    <button onClick={logout} className="btn-outline-neon btn-sm"><FaSignOutAlt className="me-2"/> LOGOUT</button>
                </div>
            </nav>

            <div className="container-fluid main-container">
                
                {/* Insight Deck (Top Bar) */}
                <div className="d-flex overflow-auto gap-3 mb-4 pb-2 hide-scrollbar">
                    <InsightChip icon={FaGlobe} label="Total Traffic" value="Live" trend="Stable" />
                    <InsightChip icon={FaFingerprint} label="Admin Access" value="Secure" />
                    <InsightChip icon={FaDatabase} label="DB Latency" value="12ms" />
                </div>

                {/* Stat Cards */}
                <div className="row g-3 mb-4">
                    <HoloCard icon={FaCalendarCheck} title="Appointments" value={data.appts.length} sub="Active Sessions" color="cyan" />
                    <HoloCard icon={FaUsers} title="New Leads" value={newLeads.length} sub="Awaiting Response" color="gold" />
                    <HoloCard icon={FaStar} title="Pending Reviews" value={pendingReviews.length} sub="Moderation Queue" color="red" />
                    <HoloCard icon={FaRocket} title="Target Status" value={`${goalPercent}%`} sub={`${data.metrics.policies_issued} / ${data.metrics.policies_goal}`} color="green" />
                </div>

                {/* Navigation Deck */}
                <div className="control-deck mb-4">
                    {[
                        {id: 'overview', icon: MdDashboardCustomize, label: 'Overview'},
                        {id: 'team', icon: FaUsers, label: 'Team Agents'}, // <--- NEW TAB
                        {id: 'appts', icon: FaCalendarDay, label: 'Schedule'},
                        {id: 'leads', icon: MdContactPhone, label: 'Leads'},
                        {id: 'reviews', icon: FaRegCommentDots, label: 'Reviews'}
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`deck-btn ${activeTab === tab.id ? 'active' : ''}`}>
                            <tab.icon className="me-2" /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Dynamic View */}
                <div className="view-port">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'team' && renderTeamAgents()} {/* <--- NEW VIEW */}
                    {activeTab === 'appts' && renderList('appts')}
                    {activeTab === 'leads' && renderList('leads')}
                    {activeTab === 'reviews' && renderList('reviews')}
                </div>

            </div>

            {/* Toast */}
            {msg && <div className="system-toast"><FaCheckCircle className="me-2"/> {msg}</div>}

            {/* STYLES (THE MAGIC) */}
            <style>{`
                :root {
                    --navy: #050810;
                    --gold: #DAA520;
                    --cyan: #00f2ea;
                    --red: #ff0050;
                    --green: #00ff88;
                    --glass: rgba(16, 24, 40, 0.75);
                    --border: rgba(255, 255, 255, 0.08);
                }
                
                /* Base Layout */
                .admin-interface { background-color: var(--navy); min-height: 100vh; color: white; padding-top: 80px; position: relative; overflow-x: hidden; font-family: 'Segoe UI', sans-serif; }
                .main-container { padding: 20px; max-width: 1600px; position: relative; z-index: 2; }
                
                /* Background FX */
                .bg-orb { position: absolute; width: 50vw; height: 50vw; border-radius: 50%; filter: blur(120px); opacity: 0.15; z-index: 0; pointer-events: none; }
                .top-left { top: -10%; left: -10%; background: var(--gold); }
                .bottom-right { bottom: -10%; right: -10%; background: #002D62; }
                .scanlines { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1)); background-size: 100% 4px; pointer-events: none; z-index: 1; }

                /* Navbar */
                .command-nav { height: 70px; background: rgba(5, 8, 16, 0.9); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); z-index: 1000; }
                .brand-shield { width: 40px; height: 40px; background: rgba(218, 165, 32, 0.1); border: 1px solid var(--gold); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--gold); animation: pulse-gold 3s infinite; }
                .pulse-dot { width: 8px; height: 8px; background: var(--green); border-radius: 50%; box-shadow: 0 0 10px var(--green); animation: blink 2s infinite; }

                /* Insight Pills */
                .insight-pill { background: rgba(255,255,255,0.05); border: 1px solid var(--border); padding: 8px 15px; border-radius: 50px; font-size: 0.8rem; white-space: nowrap; display: flex; align-items: center; }

                /* Holo Cards */
                .holo-card-wrapper { position: relative; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 16px; padding: 25px; overflow: hidden; transition: 0.3s; }
                .holo-card-wrapper:hover { transform: translateY(-5px); border-color: var(--gold); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                .holo-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.03) 100%); z-index: 1; }
                .icon-hexagon { width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
                .cyan { color: var(--cyan); } .gold { color: var(--gold); } .red { color: var(--red); } .green { color: var(--green); }
                
                .progress-bar-mini { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; margin-top: 10px; }
                .progress-fill { height: 100%; }
                .progress-fill.cyan { background: var(--cyan); box-shadow: 0 0 10px var(--cyan); }
                .progress-fill.gold { background: var(--gold); box-shadow: 0 0 10px var(--gold); }
                .progress-fill.red { background: var(--red); box-shadow: 0 0 10px var(--red); }
                .progress-fill.green { background: var(--green); box-shadow: 0 0 10px var(--green); }

                /* Command Panels */
                .command-panel { background: var(--glass); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; backdrop-filter: blur(10px); }
                .panel-header { background: rgba(255,255,255,0.03); padding: 15px 20px; border-bottom: 1px solid var(--border); font-weight: bold; letter-spacing: 1px; text-transform: uppercase; font-size: 0.9rem; color: var(--gold); display: flex; align-items: center; }
                .panel-body { padding: 25px; }

                /* Neo Inputs */
                .neo-label { font-size: 0.75rem; text-transform: uppercase; color: rgba(255,255,255,0.5); letter-spacing: 1px; margin-bottom: 8px; display: block; }
                .neo-input-box { position: relative; background: rgba(0,0,0,0.3); border-radius: 8px; border-bottom: 2px solid rgba(255,255,255,0.1); transition: 0.3s; }
                .neo-input-box:focus-within { background: rgba(0,0,0,0.5); border-bottom-color: var(--gold); }
                .input-icon-box { position: absolute; top: 12px; left: 15px; color: var(--gold); opacity: 0.8; }
                .neo-control { width: 100%; background: transparent; border: none; color: white; padding: 12px 15px 12px 45px; font-size: 0.95rem; outline: none; }
                
                /* Control Deck (Tabs) */
                .control-deck { display: flex; gap: 10px; background: rgba(0,0,0,0.3); padding: 5px; border-radius: 12px; border: 1px solid var(--border); overflow-x: auto; }
                .deck-btn { flex: 1; background: transparent; border: none; color: rgba(255,255,255,0.6); padding: 12px; border-radius: 8px; font-weight: 600; transition: 0.3s; white-space: nowrap; }
                .deck-btn:hover { color: white; background: rgba(255,255,255,0.05); }
                .deck-btn.active { background: var(--gold); color: black; box-shadow: 0 0 15px rgba(218, 165, 32, 0.4); }

                /* Tables */
                .royal-table { width: 100%; border-collapse: collapse; }
                .royal-table th { text-align: left; padding: 15px; color: rgba(255,255,255,0.4); font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid var(--border); }
                .royal-table td { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: middle; }
                .royal-table tr:hover { background: rgba(255,255,255,0.02); }

                /* Buttons */
                .btn-neon-gold { background: var(--gold); color: black; border: none; padding: 12px; font-weight: bold; border-radius: 8px; transition: 0.3s; text-transform: uppercase; letter-spacing: 1px; }
                .btn-neon-gold:hover { box-shadow: 0 0 20px rgba(218, 165, 32, 0.5); transform: translateY(-2px); }
                .btn-outline-neon { background: transparent; border: 1px solid var(--gold); color: var(--gold); padding: 10px; font-weight: bold; border-radius: 8px; transition: 0.3s; }
                .btn-outline-neon:hover { background: var(--gold); color: black; }
                
                .icon-btn { width: 32px; height: 32px; border-radius: 6px; border: none; display: flex; align-items: center; justify-content: center; transition: 0.2s; color: white; }
                .btn-blue { background: rgba(0, 242, 234, 0.2); color: var(--cyan); } .btn-blue:hover { background: var(--cyan); color: black; }
                .btn-red { background: rgba(255, 0, 80, 0.2); color: var(--red); } .btn-red:hover { background: var(--red); color: white; }
                .btn-green { background: rgba(0, 255, 136, 0.2); color: var(--green); } .btn-green:hover { background: var(--green); color: black; }

                /* Mobile Stack */
                .mobile-stack-card { background: rgba(255,255,255,0.03); border: 1px solid var(--border); padding: 15px; border-radius: 12px; margin-bottom: 15px; }
                .btn-mob-action { padding: 8px; border-radius: 6px; border: none; font-weight: bold; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 8px; color: black; }
                .btn-mob-action.btn-gold { background: var(--gold); }
                .btn-mob-action.btn-red { background: rgba(255, 0, 80, 0.2); color: var(--red); border: 1px solid var(--red); color: white; }
                .btn-mob-action.btn-green { background: var(--green); color: black; }

                /* Utils */
                .loader-screen { position: fixed; inset: 0; background: var(--navy); display: flex; align-items: center; justify-content: center; color: var(--gold); font-family: monospace; letter-spacing: 3px; z-index: 9999; }
                .system-toast { position: fixed; bottom: 20px; right: 20px; background: #000; border-left: 4px solid var(--green); color: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); animation: slideUp 0.3s; z-index: 2000; }
                .ls-1 { letter-spacing: 1px; } .ls-2 { letter-spacing: 2px; } .x-small { font-size: 0.65rem; }
                .status-tag { padding: 4px 10px; border-radius: 4px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase; background: rgba(255,255,255,0.1); }
                .status-tag.gold { color: var(--gold); background: rgba(218, 165, 32, 0.15); border: 1px solid rgba(218, 165, 32, 0.3); }
                .status-tag.green { color: var(--green); background: rgba(0, 255, 136, 0.15); border: 1px solid rgba(0, 255, 136, 0.3); }
                .status-tag.blue { color: var(--cyan); background: rgba(0, 242, 234, 0.15); border: 1px solid rgba(0, 242, 234, 0.3); }
                .status-tag.red { color: var(--red); background: rgba(255, 0, 80, 0.15); border: 1px solid rgba(255, 0, 80, 0.3); }

                @keyframes pulse-gold { 0% { box-shadow: 0 0 0 0 rgba(218, 165, 32, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(218, 165, 32, 0); } 100% { box-shadow: 0 0 0 0 rgba(218, 165, 32, 0); } }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-fade-in { animation: fadeIn 0.5s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

                /* Mobile Tweaks */
                @media (max-width: 768px) {
                    .admin-interface { padding-top: 70px; }
                    .panel-body { padding: 15px; }
                    .display-6 { font-size: 2rem; }
                    .mobile-hide { display: none; }
                    .mobile-h6 { font-size: 0.9rem; }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;