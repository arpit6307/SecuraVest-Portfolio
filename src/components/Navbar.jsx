// src/components/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { 
  FaUserAlt, FaChartArea, FaRegHandshake, FaEnvelope, 
  FaLock, FaCrown, FaCalendarCheck, FaWhatsapp, FaPhoneAlt, FaLinkedinIn, FaInstagram,
  FaUsers, FaCalculator, FaShieldAlt // FaShieldAlt (Product/Policy Icon)
} from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock Body Scroll on Menu Open
  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navItems = [
    { name: 'Profile', href: '/#agent-profile', icon: FaUserAlt },
    { name: 'Team', href: '/#team-recruitment', icon: FaUsers },
    { name: 'Policies', href: '/products', icon: FaShieldAlt }, // <--- NEW LINK: Products Page
    { name: 'Metrics', href: '/#metrics', icon: FaChartArea },
    { name: 'Calculators', href: '/calculators', icon: FaCalculator }, // Updated Link
    { name: 'Testimonials', href: '/#testimonials', icon: FaRegHandshake },
    { name: 'Book Now', href: '/book-appointment', icon: FaCalendarCheck, isCta: true },
    { name: 'Contact', href: '/#contact', icon: FaEnvelope },
  ];

  const adminItem = { name: 'Admin', href: '/admin', icon: FaLock };

  const socialLinks = [
    { icon: FaWhatsapp, href: "https://wa.me/+919696923995", color: "#25D366" },
    { icon: FaPhoneAlt, href: "tel:+919696923995", color: "#FFD700" },
    { icon: FaLinkedinIn, href: "https://www.linkedin.com/in/arpit-singh-yadav-b675301a1/?trk=opento_sprofile_details", color: "#0077B5" },
    { icon: FaInstagram, href: "https://www.instagram.com/arpit__6307/?__pwa=1", color: "#E1306C" },
  ];

  return (
    <>
      {/* --- DESKTOP NAVBAR --- */}
      <nav className={`royal-navbar fixed-top ${scrolled ? 'scrolled' : ''}`}>
        <div className="container d-flex justify-content-between align-items-center">
          
          {/* BRAND */}
          <a className="navbar-brand d-flex align-items-center gap-3" href="/">
            <div className="brand-glow-container">
                <FaCrown size={22} className="text-gold" />
            </div>
            <div className="d-flex flex-column">
                <span className="brand-text text-white fw-bold ls-1">SECURAVEST</span>
                <span className="brand-sub text-gold x-small text-uppercase ls-3">Portfolio</span>
            </div>
          </a>

          {/* DESKTOP LINKS */}
          <div className="d-none d-lg-flex align-items-center gap-4">
            {navItems.map((item, index) => (
              <a 
                key={index} 
                href={item.href}
                className={`nav-link-custom ${item.isCta ? 'btn-gold-cta' : ''}`}
              >
                {item.isCta && <item.icon className="me-2" size={14} />}
                {item.name}
              </a>
            ))}
            
            <div className="nav-divider"></div>
            <a href={adminItem.href} className="nav-link-custom admin-link">
              <FaLock size={14} className="me-2" /> {adminItem.name}
            </a>
          </div>

          {/* NEW PREMIUM MOBILE TOGGLE BUTTON */}
          <button 
            className={`mobile-toggle-btn d-lg-none ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div className="bar-wrapper">
                <span className="bar bar1"></span>
                <span className="bar bar2"></span>
                <span className="bar bar3"></span>
            </div>
          </button>

        </div>
      </nav>

      {/* --- MOBILE MENU PORTAL --- */}
      <div className={`mobile-menu-portal ${isMenuOpen ? 'open' : ''}`}>
        
        {/* Background FX */}
        <div className="portal-bg"></div>
        <div className="portal-orb top-left"></div>
        <div className="portal-orb bottom-right"></div>

        <div className="menu-inner container h-100 d-flex flex-column justify-content-center position-relative z-2">
            
            {/* Header in Menu */}
            <div className="text-center mb-5 animate-in" style={{animationDelay: '0.1s'}}>
                <div className="d-inline-block p-3 rounded-circle border border-white-10 bg-white-05 mb-2">
                    <FaCrown size={28} className="text-gold" />
                </div>
                <h5 className="text-white fw-bold ls-2">MENU</h5>
            </div>

            {/* Links */}
            <ul className="list-unstyled text-center w-100 mb-5">
                {navItems.map((item, index) => (
                    <li key={index} className="mobile-list-item" style={{transitionDelay: `${150 + (index * 60)}ms`}}>
                        <a 
                            href={item.href} 
                            className={`mobile-nav-link ${item.isCta ? 'cta-highlight' : ''}`}
                            onClick={closeMenu}
                        >
                            {item.name}
                            {item.isCta && <FaCalendarCheck className="ms-2 text-gold" size={18} />}
                        </a>
                    </li>
                ))}
                
                <li className="mobile-list-item mt-4" style={{transitionDelay: '500ms'}}>
                    <a href={adminItem.href} className="mobile-admin-btn" onClick={closeMenu}>
                        <FaLock className="me-2" /> Admin Access
                    </a>
                </li>
            </ul>

            {/* Footer Socials */}
            <div className="text-center animate-in" style={{animationDelay: '0.6s'}}>
                <p className="text-white-50 x-small text-uppercase ls-1 mb-3">Instant Connect</p>
                <div className="d-flex justify-content-center gap-3">
                    {socialLinks.map((link, i) => (
                        <a key={i} href={link.href} className="mobile-social-icon" style={{color: link.color}}>
                            <link.icon size={22} />
                        </a>
                    ))}
                </div>
            </div>

        </div>
      </div>

      {/* --- STYLES --- */}
      <style>{`
        :root {
            --gold: #DAA520;
            --navy: #0a0f1c;
            --dark-glass: rgba(10, 15, 28, 0.90);
            --portal-bg: rgba(3, 5, 10, 0.98);
        }

        /* --- Navbar Core --- */
        .royal-navbar {
            padding: 15px 0;
            transition: all 0.4s ease;
            z-index: 1050;
            background: transparent;
        }
        .royal-navbar.scrolled {
            padding: 10px 0;
            background: var(--dark-glass);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        /* Brand */
        .brand-glow-container {
            width: 42px; height: 42px;
            border-radius: 50%;
            background: rgba(218, 165, 32, 0.1);
            border: 1px solid rgba(218, 165, 32, 0.3);
            display: flex; align-items: center; justify-content: center;
            transition: 0.3s;
        }
        .navbar-brand:hover .brand-glow-container {
            background: var(--gold);
            box-shadow: 0 0 15px rgba(218, 165, 32, 0.6);
        }
        .navbar-brand:hover .brand-glow-container .text-gold { color: black !important; }
        .ls-1 { letter-spacing: 1px; }
        .ls-3 { letter-spacing: 3px; }
        .x-small { font-size: 0.6rem; }
        .text-gold { color: var(--gold) !important; }

        /* Desktop Links */
        .nav-link-custom {
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            position: relative;
            padding: 5px 0;
            transition: 0.3s;
        }
        .nav-link-custom:hover { color: white; }
        .nav-link-custom:not(.btn-gold-cta)::after {
            content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px;
            background: var(--gold); transition: 0.3s;
        }
        .nav-link-custom:not(.btn-gold-cta):hover::after { width: 100%; }

        .btn-gold-cta {
            background: linear-gradient(135deg, var(--gold), #B8860B);
            color: black !important;
            padding: 8px 20px;
            border-radius: 50px;
            font-weight: bold;
            box-shadow: 0 0 10px rgba(218, 165, 32, 0.3);
        }
        .btn-gold-cta:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(218, 165, 32, 0.5); }
        
        .nav-divider { width: 1px; height: 20px; background: rgba(255,255,255,0.1); }
        .admin-link { font-size: 0.8rem; opacity: 0.6; }
        .admin-link:hover { opacity: 1; color: var(--gold); }

        /* --- NEW HAMBURGER BUTTON --- */
        .mobile-toggle-btn {
            width: 45px; height: 45px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(218, 165, 32, 0.3);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            z-index: 2000;
        }
        .mobile-toggle-btn:hover, .mobile-toggle-btn.active {
            background: rgba(218, 165, 32, 0.15);
            border-color: var(--gold);
            box-shadow: 0 0 15px rgba(218, 165, 32, 0.3);
        }
        
        .bar-wrapper {
            width: 20px; height: 14px;
            position: relative;
            display: flex; flex-direction: column; justify-content: space-between;
        }
        .bar {
            display: block; width: 100%; height: 2px;
            background-color: var(--gold);
            border-radius: 2px;
            transition: 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        /* Hamburger Animation State */
        .mobile-toggle-btn.active .bar1 { transform: translateY(6px) rotate(45deg); }
        .mobile-toggle-btn.active .bar2 { opacity: 0; transform: scale(0); }
        .mobile-toggle-btn.active .bar3 { transform: translateY(-6px) rotate(-45deg); }

        /* --- MOBILE PORTAL --- */
        .mobile-menu-portal {
            position: fixed; inset: 0;
            background: var(--portal-bg);
            z-index: 1500;
            backdrop-filter: blur(20px);
            transform: scale(1.1); opacity: 0; visibility: hidden;
            transition: all 0.4s ease;
            display: flex; align-items: center; justify-content: center;
        }
        .mobile-menu-portal.open {
            transform: scale(1); opacity: 1; visibility: visible;
        }

        /* Background Orbs */
        .portal-orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.3; }
        .top-left { top: -10%; left: -10%; width: 300px; height: 300px; background: var(--navy); }
        .bottom-right { bottom: -10%; right: -10%; width: 300px; height: 300px; background: var(--gold); }

        /* Menu Links */
        .mobile-list-item {
            transform: translateY(30px); opacity: 0;
            transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .mobile-menu-portal.open .mobile-list-item { transform: translateY(0); opacity: 1; }

        .mobile-nav-link {
            font-size: 1rem; font-weight: 1000;
            color: rgba(255,255,255,1); /* FIX APPLIED: Changed to 100% opacity for high contrast */
            text-decoration: none;
            display: inline-block;
            margin-bottom: 15px;
            transition: 0.3s;
            text-transform: uppercase;
            letter-spacing: -1px;
        }
        .mobile-nav-link:hover, .mobile-nav-link:active {
            color: var(--gold);
            transform: scale(1.1);
            text-shadow: 0 0 20px rgba(218, 165, 32, 0.5);
        }
        .cta-highlight { color: white; }

        .mobile-admin-btn {
            font-size: 0.8rem; color: rgba(255,255,255,0.4);
            text-decoration: none; border: 1px solid rgba(255,255,255,0.1);
            padding: 10px 20px; border-radius: 50px;
            text-transform: uppercase; letter-spacing: 1px;
            transition: 0.3s; display: inline-block;
        }
        .mobile-admin-btn:hover { border-color: var(--gold); color: var(--gold); }

        /* Social Icons */
        .mobile-social-icon {
            width: 45px; height: 45px;
            background: rgba(255,255,255,0.05);
            border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            transition: 0.3s; border: 1px solid transparent;
        }
        .mobile-social-icon:hover {
            background: rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.2);
            transform: translateY(-5px);
        }

        .bg-white-05 { background: rgba(255,255,255,0.05); }
        .border-white-10 { border-color: rgba(255,255,255,0.1) !important; }
        .animate-in { animation: fadeIn 0.8s ease forwards; opacity: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

      `}</style>
    </>
  );
};

export default Navbar;