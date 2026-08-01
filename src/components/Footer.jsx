import React from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  HelpCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Share2, 
  MessageCircle 
} from 'lucide-react';

export default function Footer({ setActiveView }) {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          
          {/* Column 1: Brand & Safety */}
          <div className="footer-col brand-col">
            <div className="footer-brand" onClick={() => setActiveView('home')} style={{ cursor: 'pointer' }}>
              <div className="brand-logo-icon">
                <GraduationCap size={24} color="#FFFFFF" />
              </div>
              <span className="brand-name">Uni<span className="brand-highlight">Swap</span></span>
            </div>
            <p className="footer-description">
              The premier campus-exclusive marketplace engineered for college students & staff to buy, sell, and exchange products safely within campus grounds.
            </p>
            <div className="campus-badge-item">
              <ShieldCheck size={18} className="text-secondary" />
              <span>100% Verified Campus Community</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><button onClick={() => setActiveView('home')}>Browse Marketplace</button></li>
              <li><button onClick={() => setActiveView('sell')}>Sell an Item</button></li>
              <li><button onClick={() => setActiveView('profile')}>My Profile & Listings</button></li>
              <li><button onClick={() => setActiveView('register')}>Update Student ID</button></li>
              <li><button onClick={() => setActiveView('messages')}>Seller Messages</button></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Popular Categories</h4>
            <ul className="footer-links">
              <li><button onClick={() => setActiveView('home')}>Books & Lecture Notes</button></li>
              <li><button onClick={() => setActiveView('home')}>Engineering Calculators</button></li>
              <li><button onClick={() => setActiveView('home')}>Hostel Cycles & Gear</button></li>
              <li><button onClick={() => setActiveView('home')}>Hostel Furniture & Appliances</button></li>
              <li><button onClick={() => setActiveView('home')}>Lab Coats & Equipment</button></li>
            </ul>
          </div>

          {/* Column 4: Contact & Help */}
          <div className="footer-col">
            <h4 className="footer-heading">Campus Help & Support</h4>
            <div className="footer-contact-info">
              <p><MapPin size={16} /> Central Campus Plaza, Student Activity Center</p>
              <p><Mail size={16} /> support@uniswap-campus.edu</p>
              <p><Phone size={16} /> +91 800-CAMPUS-SWAP</p>
            </div>
            <div className="social-links">
              <a href="#website" aria-label="Campus Website"><Globe size={18} /></a>
              <a href="#chat" aria-label="Campus Forum"><MessageCircle size={18} /></a>
              <a href="#share" aria-label="Share Campus App"><Share2 size={18} /></a>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} UniSwap Campus Marketplace. Designed for College Students & Staff.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#safety">Safety Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
