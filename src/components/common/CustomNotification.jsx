// src/components/common/CustomNotification.jsx

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';

/**
 * CustomNotification Component (Toast/Snackbar)
 * @param {object} props - Component props
 * @param {number} [props.duration=3000] - How long the notification stays visible
 * @param {object} ref - Reference object for imperative control
 */
const CustomNotification = forwardRef(({ duration = 3000 }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info'); // default type

  // Expose show method to parent components
  useImperativeHandle(ref, () => ({
    show: (msg, notificationType = 'info') => {
      setMessage(msg);
      setType(notificationType);
      setIsVisible(true);
    }
  }));

  // Hide logic using useEffect
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  // Determine styles and icon based on type
  const getStyle = () => {
    // Theme colors: --gold: #DAA520; --navy: #002D62;
    switch (type) {
      case 'success':
        return { background: '#002D62', borderLeft: '4px solid #28a745', color: '#28a745' };
      case 'error':
        return { background: '#002D62', borderLeft: '4px solid #dc3545', color: '#dc3545' };
      case 'warning':
        return { background: '#002D62', borderLeft: '4px solid #DAA520', color: '#DAA520' };
      case 'info':
      default:
        return { background: '#002D62', borderLeft: '4px solid #17a2b8', color: '#17a2b8' };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <FaCheckCircle className="me-2" />;
      case 'error': return <FaTimesCircle className="me-2" />;
      case 'warning': return <FaExclamationTriangle className="me-2" />;
      case 'info':
      default: return <FaInfoCircle className="me-2" />;
    }
  };

  // Only render if visible
  if (!isVisible) return null;

  return (
    <div className="custom-system-toast" style={getStyle()}>
      {getIcon()}
      <span className="text-white fw-bold">{message}</span>
      <style>{`
        .custom-system-toast { 
            position: fixed; 
            bottom: 30px; 
            right: 30px; 
            padding: 15px 25px; 
            border-radius: 8px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.5); 
            animation: slideUp 0.3s ease-out forwards; 
            z-index: 2000;
            display: flex;
            align-items: center;
        }
        @keyframes slideUp { 
            from { opacity: 0; transform: translateY(20px); } 
            to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
});

export default CustomNotification;