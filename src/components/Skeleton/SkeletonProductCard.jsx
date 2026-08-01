import React from 'react';

export default function SkeletonProductCard() {
  return (
    <div className="product-card card skeleton-card animate-pulse">
      <div className="skeleton-image-box"></div>
      <div className="product-card-body p-3">
        <div className="skeleton-line skeleton-title mb-2"></div>
        <div className="skeleton-line skeleton-price mb-3"></div>
        <div className="skeleton-line skeleton-subtext mb-2"></div>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="skeleton-circle"></div>
          <div className="skeleton-line skeleton-badge"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid-responsive mt-4">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonProductCard key={idx} />
      ))}
    </div>
  );
}
