// src/components/Calculator.jsx

import React, { useState, useCallback, useMemo, useEffect } from 'react'; 
import { Container, Row, Col, Form } from 'react-bootstrap';
import { FaCalculator, FaChartLine, FaRupeeSign, FaCalendarAlt, FaPercent, FaSpinner } from 'react-icons/fa';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// --- SIP Calculation Logic ---
const calculateSIP = (P, R, T) => {
    // P = Monthly Investment 
    // R = Annual Rate of Return (%) 
    // T = Time Period (Years) 

    // Check for invalid or empty inputs
    if (P <= 0 || R < 0 || T <= 0 || T > 50) {
        return { futureValue: 0, totalInvestment: 0, chartData: [] };
    }

    const monthlyRate = (R / 100) / 12; // r (Monthly rate)
    const totalMonths = T * 12; // n (Total periods in months)
    
    // Fallback if rate is 0
    if (monthlyRate === 0) {
         const totalInvested = P * totalMonths;
         return {
            futureValue: totalInvested,
            totalInvestment: totalInvested,
            chartData: Array.from({ length: T }, (_, i) => {
                const investment = P * 12 * (i + 1);
                return {
                    year: i + 1,
                    Investment: investment,
                    Value: investment
                };
            })
        };
    }

    const data = [];
    let currentCorpus = 0;
    let totalInvested = 0;

    for (let month = 1; month <= totalMonths; month++) {
        // Apply interest first (based on last month's corpus)
        currentCorpus *= (1 + monthlyRate);
        
        // Add this month's investment
        currentCorpus += P;
        totalInvested += P;


        if (month % 12 === 0) {
            // Save yearly data for charting (at the end of the year)
            const year = month / 12;
            data.push({
                year: year,
                // Rounding invested amount for consistency in chart/summary
                Investment: Math.round(totalInvested),
                Value: Math.round(currentCorpus)
            });
        }
    }
    
    // Final Future Value is the accumulated corpus
    const finalFutureValue = currentCorpus;

    return {
        // Ensure final values are correctly rounded for display
        futureValue: Math.round(finalFutureValue), 
        totalInvestment: Math.round(totalInvested), 
        chartData: data
    };
};

const Calculator = ({ showNotification }) => {
    const [principal, setPrincipal] = useState(10000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);
    const [results, setResults] = useState(null);
    

    // Memoize calculation to ensure efficiency
    const calculatedResults = useMemo(() => {
        // Return a default empty result if inputs are invalid/empty
        if (principal <= 0 || rate < 0 || years <= 0 || years > 50) {
            return { futureValue: 0, totalInvestment: 0, chartData: [] };
        }
        return calculateSIP(principal, rate, years);
    }, [principal, rate, years]);
    
    // Live Update Function: Sets results immediately when calculatedResults change
    const runCalculation = useCallback(() => {
        setResults(calculatedResults);
    }, [calculatedResults]);

    // Live Calculation Update Triggered by input change
    useEffect(() => {
        runCalculation();
    }, [principal, rate, years, runCalculation]);
    
    // Manual press handler (Only sends notification for UX confirmation)
    const handleRecalculatePress = () => {
        if (results && results.futureValue > 0) {
             // CHANGED: Notification message to English
             showNotification(`Projection updated. Final Value: ₹${results.futureValue.toLocaleString('en-IN')}`, 'info');
        } else {
             // CHANGED: Notification message to English
             showNotification("Please check inputs. Values must be positive and within the valid range.", 'warning');
        }
    }
    
    // Helper to format large numbers for display (e.g., 1,20,000)
    const formatNumber = (value) => {
        if (value === 0) return '₹0';
        // Use Indian numbering system for better readability
        return `₹${value.toLocaleString('en-IN')}`;
    };


    return (
        <div className="calculator-page-wrapper">
            <Container className="py-5 position-relative z-2">
                <div className="text-center mb-5 animate-fade-down">
                    <h6 className="text-gold text-uppercase ls-2 mb-2">Grow Your Corpus</h6>
                    <h2 className="display-5 fw-bold text-white">Financial Projection Calculator</h2>
                    <p className="text-white-50 mx-auto" style={{ maxWidth: '600px' }}>
                        Estimate the future value of your Systematic Investment Plan (SIP) and visualize your wealth growth over time.
                    </p>
                </div>

                <Row className="justify-content-center g-4">
                    
                    {/* INPUT FORM (Left Column, Full width on mobile) */}
                    <Col xs={12} lg={4}>
                        <div className="calculator-glass-card p-4 h-100">
                            <h4 className="text-white mb-4"><FaCalculator className='me-2 text-gold'/> Input Parameters</h4>
                            
                            <Form>
                                {/* Monthly Investment */}
                                <div className="mb-4 input-group-royal">
                                    <span className="input-group-text"><FaRupeeSign /> Monthly SIP</span>
                                    <Form.Control 
                                        type="number" 
                                        value={principal} 
                                        onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))} 
                                        placeholder="e.g. 10000" 
                                        min="0"
                                    />
                                </div>
                                
                                {/* Annual Return Rate */}
                                <div className="mb-4 input-group-royal">
                                    <span className="input-group-text"><FaPercent /> Expected Return (%)</span>
                                    <Form.Control 
                                        type="number" 
                                        value={rate} 
                                        onChange={(e) => setRate(Math.min(30, Math.max(0, Number(e.target.value))))} 
                                        placeholder="e.g. 12" 
                                        min="0"
                                        max="30"
                                    />
                                </div>

                                {/* Time Period */}
                                <div className="mb-5 input-group-royal">
                                    <span className="input-group-text"><FaCalendarAlt /> Time Period (Years)</span>
                                    <Form.Control 
                                        type="number" 
                                        value={years} 
                                        onChange={(e) => setYears(Math.min(50, Math.max(1, Number(e.target.value))))} 
                                        placeholder="e.g. 10" 
                                        min="1"
                                        max="50"
                                    />
                                </div>
                                
                                {/* Button changed to Calculate Projection */}
                                <button type="button" onClick={handleRecalculatePress} className="btn-gold-block w-100">
                                    Calculate Projection
                                </button>

                            </Form>
                        </div>
                    </Col>

                    {/* RESULTS & CHART (Right Column, Full width on mobile) */}
                    <Col xs={12} lg={8}>
                        <div className="calculator-glass-card p-4 h-100">
                            
                            <h4 className="text-white mb-4"><FaChartLine className='me-2 text-gold'/> Investment Summary</h4>

                            {results && results.futureValue > 0 ? (
                                <>
                                    {/* Summary Stats - ALIGNMENT AND SIZING IMPROVED FOR MOBILE */}
                                    <Row className="mb-4 text-center g-3 summary-stats-row">
                                        
                                        {/* Total Investment */}
                                        <Col xs={4} className="summary-box">
                                            <p className="text-white-50 mb-1 summary-label-text">Total Investment (P x T)</p>
                                            <h5 className="fw-bold text-white summary-value-text">{formatNumber(results.totalInvestment)}</h5>
                                        </Col>
                                        
                                        {/* Estimated Gains */}
                                        <Col xs={4} className="summary-box">
                                            <p className="text-white-50 mb-1 summary-label-text">Estimated Gains</p>
                                            <h5 className="fw-bold text-green summary-value-text">{formatNumber(results.futureValue - results.totalInvestment)}</h5>
                                        </Col>
                                        
                                        {/* Future Value */}
                                        <Col xs={4} className="summary-box final-value-box">
                                            <p className="text-gold mb-1 summary-label-text fw-bold">Future Value</p>
                                            <h4 className="fw-bolder text-gold summary-value-text mb-0">{formatNumber(results.futureValue)}</h4>
                                        </Col>
                                    </Row>

                                    {/* Line Chart - DESIGN IMPROVEMENT FOR VISIBILITY */}
                                    <div className="chart-container-wrapper"> 
                                        <ResponsiveContainer width="100%" height={350}>
                                            <LineChart
                                                data={results.chartData}
                                                // Margin adjusted for better alignment
                                                margin={{ top: 10, right: 10, left: 0, bottom: 0 }} 
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)"/>
                                                {/* YAxis margin is set to 0, width is implicitly handled by chart data */}
                                                <XAxis dataKey="year" stroke="#DAA520" tick={{ fill: 'white', fontSize: 10 }} label={{ value: 'Year', position: 'bottom', fill: 'white', dy: 10 }} />
                                                <YAxis 
                                                    stroke="#DAA520" 
                                                    tick={{ fill: 'white', fontSize: 10 }} 
                                                    // Improved Lakhs formatting
                                                    tickFormatter={(value) => `₹${(value / 100000).toLocaleString('en-IN', { maximumFractionDigits: 1 })} L`}
                                                />
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#002D62', border: '1px solid #FFD700', color: 'white', fontSize: 12, padding: '5px' }}
                                                    formatter={(value, name) => [`₹${value.toLocaleString('en-IN')}`, name]}
                                                    labelFormatter={(label) => `Year: ${label}`}
                                                />
                                                <Legend wrapperStyle={{ color: 'white', fontSize: 12, paddingTop: '10px' }}/>
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="Investment" 
                                                    stroke="#00f2ea" 
                                                    strokeWidth={2}
                                                    dot={false}
                                                />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="Value" 
                                                    stroke="#FFD700" // BRIGHTER GOLD for better visibility
                                                    strokeWidth={4} // Thicker line for emphasis
                                                    dot={false}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-5 text-white-50">
                                    <FaChartLine size={50} className='text-gold mb-3' />
                                    <p>Enter your SIP details to view the projected financial growth graph.</p>
                                </div>
                            )}
                        </div>
                    </Col>

                </Row>
            </Container>

            {/* Background FX (Matching theme) */}
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="grid-overlay"></div>

            {/* CSS STYLES - Enhanced for Alignment and Mobile View */}
            <style>{`
                :root {
                    --gold: #DAA520;
                    --bright-gold: #FFD700; /* New variable for chart line */
                    --navy: #002D62;
                    --glass-bg: rgba(255, 255, 255, 0.03);
                    --glass-border: rgba(255, 255, 255, 0.1);
                    --green: #28a745;
                }
                .calculator-page-wrapper {
                    background-color: var(--navy);
                    color: white;
                    min-height: 100vh;
                    padding-top: 100px;
                    padding-bottom: 50px;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                }
                @media (max-width: 991px) {
                    .calculator-page-wrapper {
                        padding-top: 70px; /* Adjust for mobile navbar */
                    }
                }

                /* Background FX (Matching App/Appointment) */
                .orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4; z-index: 0; }
                .orb-1 { top: -10%; left: -10%; width: 500px; height: 500px; background: radial-gradient(circle, var(--navy), transparent); }
                .orb-2 { bottom: -10%; right: -10%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(218, 165, 32, 0.2), transparent); }
                .grid-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background-image: linear-gradient(var(--glass-bg) 1px, transparent 1px),
                    linear-gradient(90deg, var(--glass-bg) 1px, transparent 1px);
                    background-size: 40px 40px; z-index: 1; opacity: 0.3; pointer-events: none;
                }

                /* Glass Card */
                .calculator-glass-card {
                    background: rgba(10, 20, 35, 0.75);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--glass-border);
                    border-radius: 24px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    transition: all 0.3s;
                }
                .calculator-glass-card:hover {
                    border-color: var(--gold);
                }

                /* Input Group Styling - ENSURING ALIGNMENT */
                .input-group-royal {
                    display: flex;
                    align-items: center;
                    border-radius: 12px; /* Uniform rounded corners for the whole group */
                    overflow: hidden;
                }
                .input-group-royal .input-group-text {
                    background-color: rgba(218, 165, 32, 0.15);
                    border: 1px solid var(--gold);
                    color: var(--gold);
                    padding: 0.75rem 1rem;
                    border-radius: 0; /* Remove specific rounding */
                    font-weight: 600;
                    font-size: 0.9rem;
                    border-right: none; /* Hide internal border */
                }
                .input-group-royal .form-control {
                    background-color: rgba(255, 255, 255, 0.08);
                    border: 1px solid var(--glass-border);
                    border-left: none;
                    color: white;
                    padding: 0.75rem 1rem;
                    border-radius: 0; /* Remove specific rounding */
                    transition: all 0.3s;
                }
                .input-group-royal .form-control:focus {
                    background-color: rgba(255, 255, 255, 0.15);
                    border-color: var(--gold);
                    box-shadow: none;
                }
                
                /* Summary Boxes (Mobile Responsiveness & Text Overflow Fix) */
                .summary-stats-row {
                    flex-wrap: nowrap; 
                    overflow-x: hidden; 
                    /* Ensure vertical alignment */
                    align-items: stretch; 
                }
                .summary-box {
                    background: rgba(255,255,255,0.05);
                    padding: 15px 5px; 
                    border-radius: 10px;
                    border: 1px solid var(--glass-border);
                    flex-basis: 33.33%; 
                    max-width: 33.33%;
                    display: flex; /* Flex container for content */
                    flex-direction: column;
                    justify-content: center; /* Center content vertically */
                }
                .final-value-box {
                    border: 2px solid var(--gold);
                    box-shadow: 0 0 15px rgba(218, 165, 32, 0.3);
                    background: rgba(218, 165, 32, 0.1);
                }
                .text-green { color: var(--green) !important; }
                
                /* Mobile Fixes (Text Overflow and Font Sizing) */
                @media (max-width: 767px) {
                    /* Smallest text size for labels */
                    .summary-label-text {
                        font-size: 0.55rem !important; 
                        white-space: nowrap;
                    }
                    /* H4/H5 size reduction for large numbers */
                    .summary-value-text {
                        font-size: 0.7rem !important; /* Reduced main number size */
                        font-weight: 700 !important;
                        white-space: nowrap; 
                        overflow: hidden;
                        text-overflow: ellipsis; 
                    }
                    .summary-box {
                        padding: 10px 3px; 
                    }
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
                
                /* Chart Fixes */
                .chart-container-wrapper {
                    width: 100%;
                    min-height: 350px;
                }
            `}</style>
        </div>
    );
};

export default Calculator;