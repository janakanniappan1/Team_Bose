import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  DollarSign, 
  MapPin, 
  Tag, 
  FileText, 
  Image as ImageIcon,
  Check,
  Eye,
  Clock,
  ShieldCheck,
  Camera,
  AlertCircle,
  Video,
  CheckSquare
} from 'lucide-react';
import { CATEGORIES, HOSTELS, DEPARTMENTS } from '../data/mockData';
import AudienceSelector from './Seller/AudienceSelector';
import ProductPreview from './Seller/ProductPreview';

export default function SellProductPage({ onProductSubmitted, onCancel, currentUser }) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Audience, 2: Details, 3: Preview
  const [audience, setAudience] = useState('students');
  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'
  ]);
  const [videoUrl, setVideoUrl] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedProduct, setSubmittedProduct] = useState(null);

  const [formData, setFormData] = useState({
    title: 'Casio fx-991CW Advanced Scientific Calculator',
    category: 'electronics',
    condition: 'Like New',
    price: 900,
    originalPrice: 1595,
    negotiable: true,
    description: 'Practically brand new Casio CW scientific calculator. Purchased last semester for engineering math. Includes box, manual, and protective case.',
    hostel: 'Hostel 5 (Boys)',
    department: 'Computer Science & Engineering',
    pickupPreference: 'Central Library / Student Activity Center',
    brand: 'Casio',
    model: 'fx-991CW',
    purchaseYear: '2025',
    reasonForSelling: 'Completed math course requirement'
  });

  // Camera Live Modal State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setValidationError('');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImageUrls = files.map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImageUrls].slice(0, 8));
      setValidationError('');
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Open WebCam Live Stream
  const openCameraModal = async () => {
    setCameraError(null);
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access device camera. Please upload photos from your device.');
    }
  };

  const closeCameraModal = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      setImages((prev) => [...prev, imageUrl].slice(0, 8));
      setValidationError('');
      closeCameraModal();
    }
  };

  const validateStep2 = () => {
    if (images.length < 3) {
      setValidationError('Please upload at least 3 photos of your product to ensure buyer quality.');
      return false;
    }
    if (!formData.title.trim()) {
      setValidationError('Product title is required.');
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      setValidationError('Please enter a valid price.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) {
        setCurrentStep(3);
      }
    }
  };

  const handleFinalPostProduct = () => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      title: formData.title,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice) || Number(formData.price) * 1.4,
      category: formData.category,
      condition: formData.condition,
      postedDate: 'Just now',
      location: `${formData.hostel}, ${formData.pickupPreference}`,
      department: formData.department,
      sellerId: currentUser?.id || currentUser?.authId || currentUser?.username || 'seller-user',
      seller_id: currentUser?.id || currentUser?.authId || currentUser?.username || 'seller-user',
      sellerName: currentUser?.full_name || currentUser?.fullName || currentUser?.username || 'Campus Seller',
      sellerDept: formData.department,
      sellerYear: '3rd Year B.Tech',
      sellerRating: 5.0,
      sellerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      images: images,
      videoUrl: videoUrl,
      audience: audience,
      description: formData.description,
      negotiable: formData.negotiable,
      brand: formData.brand,
      model: formData.model,
      purchaseYear: formData.purchaseYear,
      reasonForSelling: formData.reasonForSelling,
      featured: false,
      popular: false,
      recommended: false,
      views: 1,
      likes: 0,
      badge: 'Pending Review',
      status: 'Pending Approval' // Sent to Pending Approval tab!
    };

    setSubmittedProduct(newProduct);
    if (onProductSubmitted) {
      onProductSubmitted(newProduct);
    }
    setShowSuccessModal(true);
  };

  return (
    <div className="sell-page-container animate-fade-in py-4">
      <div className="container">
        
        {/* Wizard Header Progress Card */}
        <div className="sell-progress-card card glass-panel p-4 mb-4">
          <div className="progress-header d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <span className="badge badge-secondary">Seller Wizard</span>
              <h2 className="progress-title font-heading mt-1">Post Your Item for Campus Sale</h2>
              <p className="progress-subtitle text-muted">Follow 3 simple steps to list your product for eligible buyers.</p>
            </div>

            <div className="step-pills d-flex gap-2">
              <div className={`step-pill ${currentStep >= 1 ? 'active' : ''}`}>
                <span className="step-num">1</span>
                <span>Audience</span>
              </div>
              <div className={`step-pill ${currentStep >= 2 ? 'active' : ''}`}>
                <span className="step-num">2</span>
                <span>Details & Photos</span>
              </div>
              <div className={`step-pill ${currentStep >= 3 ? 'active' : ''}`}>
                <span className="step-num">3</span>
                <span>Live Preview</span>
              </div>
            </div>
          </div>

          <div className="progress-track mt-3">
            <div 
              className="progress-fill" 
              style={{ width: currentStep === 1 ? '33%' : currentStep === 2 ? '66%' : '100%' }}
            ></div>
          </div>
        </div>

        {/* STEP 1: AUDIENCE SELECTOR */}
        {currentStep === 1 && (
          <div className="step-card card glass-panel p-4 mb-4">
            <AudienceSelector
              selectedAudience={audience}
              onSelectAudience={(aud) => setAudience(aud)}
            />

            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
              <button className="btn btn-outline" onClick={onCancel}>
                Cancel
              </button>
              <button className="btn btn-primary btn-lg" onClick={handleNext}>
                <span>Continue to Item Details</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PRODUCT DETAILS & PHOTOS */}
        {currentStep === 2 && (
          <div className="step-card card glass-panel p-4 mb-4">
            
            {validationError && (
              <div className="alert alert-danger p-3 mb-4 card background-rose-light text-rose border-rose d-flex align-items-center gap-2">
                <AlertCircle size={18} />
                <span>{validationError}</span>
              </div>
            )}

            {/* Photos Section */}
            <div className="form-section mb-4 pb-4 border-bottom">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="section-subtitle font-weight-bold">
                  Product Photos (Min 3 Required) *
                </h4>
                <span className={`badge ${images.length >= 3 ? 'badge-secondary' : 'badge-amber'}`}>
                  {images.length}/8 Uploaded
                </span>
              </div>

              <div className="photos-grid">
                {images.map((imgUrl, idx) => (
                  <div key={idx} className="photo-preview-item card">
                    <img src={imgUrl} alt={`Product ${idx + 1}`} />
                    {idx === 0 && <span className="cover-badge">Main Photo</span>}
                    <button type="button" className="remove-photo-btn" onClick={() => removeImage(idx)}>
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {images.length < 8 && (
                  <>
                    <label className="photo-upload-dropzone card">
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="file-input-hidden" 
                      />
                      <Upload size={24} className="text-primary mb-1" />
                      <span className="upload-label">Upload File</span>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>PNG, JPG up to 10MB</span>
                    </label>

                    <button type="button" className="photo-upload-dropzone card camera-dropzone" onClick={openCameraModal}>
                      <Camera size={24} className="text-secondary mb-1" />
                      <span className="upload-label">Use Camera</span>
                      <span className="text-muted" style={{ fontSize: '0.7rem' }}>Snap live photo</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Optional Video URL */}
            <div className="form-group mb-4">
              <label className="form-label">Product Video Showcase (Optional)</label>
              <div className="input-icon-wrapper">
                <Video className="input-icon" size={18} />
                <input
                  type="url"
                  className="form-input icon-input"
                  placeholder="Paste YouTube, Drive or Video URL link..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Mandatory Details Grid */}
            <div className="grid-2-cols gap-3 mb-4">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select name="category" className="form-select" value={formData.category} onChange={handleInputChange}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Condition *</label>
                <select name="condition" className="form-select" value={formData.condition} onChange={handleInputChange}>
                  <option value="Brand New">Brand New (Unopened)</option>
                  <option value="Like New">Like New (Mint Condition)</option>
                  <option value="Good">Good (Lightly Used)</option>
                </select>
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Product Name / Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Casio fx-991CW Scientific Calculator"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid-2-cols gap-3 mb-4">
              <div className="form-group">
                <label className="form-label">Selling Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  className="form-input"
                  placeholder="e.g. 900"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Original Purchase Price (₹)</label>
                <input
                  type="number"
                  name="originalPrice"
                  className="form-input"
                  placeholder="e.g. 1595"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <label className="filter-toggle-label mb-4 card p-3 background-slate-50">
              <input
                type="checkbox"
                name="negotiable"
                checked={formData.negotiable}
                onChange={handleInputChange}
              />
              <span className="font-weight-600">Price Negotiable for Campus Peers</span>
            </label>

            {/* Optional Specifications */}
            <div className="form-section mb-4 pt-3 border-top">
              <h4 className="section-subtitle font-weight-bold mb-3">Optional Details</h4>
              <div className="grid-2-cols gap-3">
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input type="text" name="brand" className="form-input" placeholder="e.g. Casio, Dell, Hero" value={formData.brand} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Model</label>
                  <input type="text" name="model" className="form-input" placeholder="e.g. fx-991CW" value={formData.model} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Purchase Year</label>
                  <input type="text" name="purchaseYear" className="form-input" placeholder="e.g. 2024" value={formData.purchaseYear} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Reason for Selling</label>
                  <input type="text" name="reasonForSelling" className="form-input" placeholder="e.g. Graduating, Upgraded" value={formData.reasonForSelling} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Full Product Description *</label>
              <textarea
                name="description"
                className="form-textarea"
                rows={4}
                placeholder="Describe condition, accessories included, and pickup notes..."
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <div className="d-flex justify-content-between align-items-center pt-3 border-top">
              <button className="btn btn-outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft size={16} /> Back to Audience
              </button>
              <button className="btn btn-primary btn-lg" onClick={handleNext}>
                <span>Preview Product Listing</span>
                <ArrowRight size={18} />
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: LIVE PRODUCT PREVIEW */}
        {currentStep === 3 && (
          <div>
            <ProductPreview
              formData={formData}
              images={images}
              audience={audience}
              currentUser={currentUser}
            />

            <div className="d-flex justify-content-between align-items-center card glass-panel p-4">
              <button className="btn btn-outline" onClick={() => setCurrentStep(2)}>
                <ArrowLeft size={16} /> Edit Details
              </button>
              <button className="btn btn-secondary btn-lg animate-pulse-glow" onClick={handleFinalPostProduct}>
                <CheckCircle size={20} />
                <span>Post Product Listing</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PENDING APPROVAL SUCCESS MODAL */}
        {showSuccessModal && (
          <div className="modal-overlay">
            <div className="modal-content card glass-panel p-4 text-center animate-scale-up max-w-md mx-auto">
              
              <div className="success-icon-circle mx-auto mb-3 background-amber-light text-amber p-3 border-radius-full d-inline-flex">
                <Clock size={48} />
              </div>

              <h2 className="modal-title font-heading mb-2">Listing Submitted Successfully</h2>

              <p className="text-muted mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                Your product has been submitted successfully and is currently waiting for admin approval. Once approved, it will become visible to eligible buyers.
              </p>

              <div className="d-flex flex-column gap-2">
                <button 
                  className="btn btn-primary w-full"
                  onClick={() => {
                    setShowSuccessModal(false);
                    if (onCancel) onCancel();
                  }}
                >
                  View My Listings
                </button>

                <button 
                  className="btn btn-outline w-full"
                  onClick={() => {
                    setShowSuccessModal(false);
                    if (onCancel) onCancel();
                  }}
                >
                  Continue Browsing Marketplace
                </button>
              </div>

            </div>
          </div>
        )}

        {/* WebCam Capture Modal */}
        {isCameraOpen && (
          <div className="modal-overlay">
            <div className="modal-content p-4 text-center max-w-lg mx-auto">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Snap Live Product Photo</h3>
                <button className="btn btn-ghost btn-sm" onClick={closeCameraModal}>✕</button>
              </div>

              {cameraError ? (
                <div className="alert alert-danger p-3 mb-3">{cameraError}</div>
              ) : (
                <div className="camera-viewport-container mb-3 border-radius-md overflow-hidden background-black">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-auto"></video>
                  <canvas ref={canvasRef} className="d-none"></canvas>
                </div>
              )}

              <div className="d-flex justify-content-center gap-2">
                <button className="btn btn-outline" onClick={closeCameraModal}>Cancel</button>
                {!cameraError && (
                  <button className="btn btn-primary" onClick={capturePhoto}>
                    <Camera size={18} /> Take Photo
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
