import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function ImageZoomModal({ images = [], initialIndex = 0, title = 'Product Photo', onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setZoomLevel(1);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setZoomLevel(1);
  };

  return (
    <div className="image-zoom-modal-overlay modal-overlay" onClick={onClose}>
      <div className="image-zoom-container p-4 animate-scale-up d-flex flex-column align-items-center justify-content-between" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Control Bar */}
        <div className="zoom-top-bar w-full d-flex align-items-center justify-content-between text-white mb-3">
          <div className="d-flex align-items-center gap-2">
            <Maximize2 size={18} className="text-primary" />
            <h4 style={{ fontSize: '1rem', color: '#FFFFFF' }} className="text-truncate">{title}</h4>
            <span className="badge badge-primary">{currentIndex + 1} / {images.length}</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-ghost btn-sm text-white" onClick={handleZoomOut} title="Zoom Out (-)">
              <ZoomOut size={20} />
            </button>
            <span className="text-white font-weight-bold" style={{ fontSize: '0.85rem', minWidth: '45px', textAlign: 'center' }}>
              {Math.round(zoomLevel * 100)}%
            </span>
            <button className="btn btn-ghost btn-sm text-white" onClick={handleZoomIn} title="Zoom In (+)">
              <ZoomIn size={20} />
            </button>
            <button className="btn btn-ghost btn-sm text-white" onClick={handleResetZoom} title="Reset Zoom">
              <RotateCcw size={18} />
            </button>
            <button className="btn btn-ghost btn-sm text-white" onClick={onClose} title="Close (Esc)">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Main Zoomable Image Stage */}
        <div className="zoom-image-stage position-relative d-flex align-items-center justify-content-center flex-1 w-full overflow-hidden my-2">
          
          {images.length > 1 && (
            <button className="zoom-nav-arrow prev-arrow" onClick={handlePrev}>
              <ChevronLeft size={28} />
            </button>
          )}

          <div className="zoom-img-wrapper d-flex align-items-center justify-content-center" style={{ overflow: 'auto', maxHeight: '75vh' }}>
            <img
              src={currentImage}
              alt={title}
              className="zoom-stage-image"
              style={{
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.2s ease',
                maxHeight: '70vh',
                maxWidth: '90vw',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
            />
          </div>

          {images.length > 1 && (
            <button className="zoom-nav-arrow next-arrow" onClick={handleNext}>
              <ChevronRight size={28} />
            </button>
          )}

        </div>

        {/* Bottom Thumbnail Strip */}
        {images.length > 1 && (
          <div className="zoom-thumb-strip d-flex gap-2 p-2 mt-3 background-slate-900 border-radius-md" style={{ background: 'rgba(15, 23, 42, 0.8)' }}>
            {images.map((imgUrl, idx) => (
              <button
                key={idx}
                className={`zoom-thumb-btn ${currentIndex === idx ? 'active' : ''}`}
                onClick={() => { setCurrentIndex(idx); setZoomLevel(1); }}
                style={{
                  border: currentIndex === idx ? '2px solid var(--primary)' : '2px solid transparent',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  width: '50px',
                  height: '50px',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <img src={imgUrl} alt={`Thumb ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
