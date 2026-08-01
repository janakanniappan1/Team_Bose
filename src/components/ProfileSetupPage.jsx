import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Building, 
  Calendar, 
  MapPin, 
  Upload, 
  Camera, 
  CheckCircle, 
  ArrowRight, 
  Shield, 
  GraduationCap, 
  School,
  Sparkles
} from 'lucide-react';
import { DEPARTMENTS, HOSTELS } from '../data/mockData';

export default function ProfileSetupPage({ onSaveProfile, onSkip }) {
  const [formData, setFormData] = useState({
    firstName: 'Jana',
    lastName: 'K',
    phone: '+91 98765 00112',
    collegeEmail: 'jana.k@campus.edu',
    department: 'Computer Science & Engineering',
    yearOfStudy: '3rd Year B.Tech',
    role: 'Student', // 'Student' or 'Staff'
    gender: 'Male',
    housing: 'Hostel Resident', // 'Hostel Resident' or 'Day Scholar'
    hostelBlock: 'Hostel 5, Room 212',
    city: 'Campus Town',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
  });

  const [avatarPreview, setAvatarPreview] = useState(formData.avatar);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      setFormData((prev) => ({ ...prev, avatar: url }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(formData);
  };

  return (
    <div className="profile-setup-container animate-fade-in">
      <div className="container">
        
        {/* Step Progress Indicator Header */}
        <div className="setup-progress-bar-card card glass-panel">
          <div className="progress-header">
            <div>
              <span className="badge badge-primary">Step 2 of 3</span>
              <h2 className="progress-title">Complete Your Profile</h2>
              <p className="progress-subtitle">This helps buyers and sellers trust each other on campus.</p>
            </div>
            <div className="progress-indicator">
              <div className="progress-step completed">1. Account</div>
              <div className="progress-step active">2. Campus Details</div>
              <div className="progress-step">3. Preferences</div>
            </div>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: '66%' }}></div>
          </div>
        </div>

        <div className="setup-grid">
          
          {/* Left Form Column */}
          <div className="setup-form-card card">
            <form onSubmit={handleSubmit} className="setup-form">
              
              {/* Section 1: Profile Avatar Upload */}
              <div className="avatar-upload-section">
                <div className="avatar-preview-box">
                  <img src={avatarPreview} alt="Profile Preview" className="avatar-img-large" />
                  <label htmlFor="avatar-file-input" className="avatar-edit-overlay">
                    <Camera size={20} />
                    <input 
                      type="file" 
                      id="avatar-file-input" 
                      accept="image/*" 
                      onChange={handleAvatarUpload} 
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                <div className="avatar-instructions">
                  <h4>Profile Picture</h4>
                  <p>Upload a clear photo of yourself. Clear photos increase deal success by 4x.</p>
                  <label htmlFor="avatar-file-input" className="btn btn-sm btn-outline-primary" style={{ marginTop: '0.5rem' }}>
                    <Upload size={14} /> Upload New Photo
                  </label>
                </div>
              </div>

              <div className="form-divider">
                <span>Personal & Campus Info</span>
              </div>

              {/* Student vs Staff Selection Toggle */}
              <div className="form-group">
                <label className="form-label">Role on Campus</label>
                <div className="segment-toggle">
                  <button 
                    type="button" 
                    className={`segment-btn ${formData.role === 'Student' ? 'active' : ''}`}
                    onClick={() => setFormData((prev) => ({ ...prev, role: 'Student' }))}
                  >
                    <GraduationCap size={18} /> Student
                  </button>
                  <button 
                    type="button" 
                    className={`segment-btn ${formData.role === 'Staff' ? 'active' : ''}`}
                    onClick={() => setFormData((prev) => ({ ...prev, role: 'Staff' }))}
                  >
                    <School size={18} /> Faculty / Staff
                  </button>
                </div>
              </div>

              {/* First Name & Last Name */}
              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label" htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="form-input"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="form-input"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone Number (For WhatsApp / Deal Call)</label>
                  <div className="input-icon-wrapper">
                    <Phone className="input-icon" size={18} />
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      className="form-input icon-input"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="collegeEmail">College Email</label>
                  <div className="input-icon-wrapper">
                    <Mail className="input-icon" size={18} />
                    <input
                      id="collegeEmail"
                      name="collegeEmail"
                      type="email"
                      className="form-input icon-input"
                      value={formData.collegeEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Department & Year of Study */}
              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label" htmlFor="department">Department</label>
                  <select
                    id="department"
                    name="department"
                    className="form-select"
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="yearOfStudy">Year of Study / Designation</label>
                  <select
                    id="yearOfStudy"
                    name="yearOfStudy"
                    className="form-select"
                    value={formData.yearOfStudy}
                    onChange={handleInputChange}
                  >
                    <option value="1st Year B.Tech">1st Year B.Tech</option>
                    <option value="2nd Year B.Tech">2nd Year B.Tech</option>
                    <option value="3rd Year B.Tech">3rd Year B.Tech</option>
                    <option value="4th Year B.Tech">4th Year B.Tech</option>
                    <option value="M.Tech / M.Sc">M.Tech / M.Sc</option>
                    <option value="PhD Research Scholar">PhD Research Scholar</option>
                    <option value="Faculty / Staff Member">Faculty / Staff Member</option>
                  </select>
                </div>
              </div>

              {/* Gender & Hostel / Day Scholar Selection */}
              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Prefer not to say</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Hostel / Residence Type</label>
                  <select
                    name="housing"
                    className="form-select"
                    value={formData.housing}
                    onChange={handleInputChange}
                  >
                    <option value="Hostel Resident">Hostel Resident (On-Campus)</option>
                    <option value="Day Scholar">Day Scholar (Commuter)</option>
                  </select>
                </div>
              </div>

              {/* Hostel / Department Pickup location */}
              <div className="form-row-2col">
                <div className="form-group">
                  <label className="form-label" htmlFor="hostelBlock">Hostel Block / Department Address</label>
                  <select
                    id="hostelBlock"
                    name="hostelBlock"
                    className="form-select"
                    value={formData.hostelBlock}
                    onChange={handleInputChange}
                  >
                    {HOSTELS.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="city">City / Campus Zone</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    className="form-input"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Buttons Footer */}
              <div className="setup-actions">
                <button type="button" className="btn btn-outline" onClick={onSkip}>
                  Skip for Now
                </button>
                <button type="submit" className="btn btn-primary btn-lg">
                  <span>Save & Continue</span>
                  <ArrowRight size={18} />
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Profile Trust & Illustration */}
          <div className="setup-info-card card glass-panel">
            <div className="trust-card-content">
              <div className="trust-illustration-circle">
                <Shield size={48} className="text-primary" />
              </div>
              <h3>Why Complete Profile?</h3>
              <p className="text-muted">
                UniSwap is a closed, trusted network. Completing your profile establishes authentic campus identity and makes buying & selling 5x faster.
              </p>

              <div className="trust-perks-list">
                <div className="perk-item">
                  <CheckCircle size={18} className="text-secondary" />
                  <div>
                    <strong>Campus Verification Badge</strong>
                    <p>Shows a green checkmark next to your listings.</p>
                  </div>
                </div>

                <div className="perk-item">
                  <CheckCircle size={18} className="text-secondary" />
                  <div>
                    <strong>Direct Hostel Delivery Spot</strong>
                    <p>Buyers know which hostel block to meet for item handover.</p>
                  </div>
                </div>

                <div className="perk-item">
                  <CheckCircle size={18} className="text-secondary" />
                  <div>
                    <strong>Instant Seller Rating</strong>
                    <p>Build 5-star reputation for exam book notes & gear.</p>
                  </div>
                </div>
              </div>

              <div className="trust-footer-note">
                <Sparkles size={16} className="text-amber" />
                <span>Your contact info is shared only with confirmed buyers.</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
