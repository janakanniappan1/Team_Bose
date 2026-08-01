import React from 'react';
import { X, Scale, Trash2, CheckCircle, AlertCircle, ShoppingBag, Plus } from 'lucide-react';

export default function ProductComparisonModal({ 
  compareItems = [], 
  onRemoveCompareItem, 
  onClearCompare,
  onSelectProduct,
  onClose 
}) {
  if (!compareItems || compareItems.length === 0) return null;

  const maxCompareSlots = 3;
  const emptySlotsCount = Math.max(0, maxCompareSlots - compareItems.length);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card glass-panel compare-modal-content p-4 animate-scale-up" onClick={(e) => e.stopPropagation()}>
        
        <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <Scale size={24} className="text-primary" />
            <div>
              <h3>Compare Products ({compareItems.length}/3)</h3>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>Side-by-side specifications & campus deal analysis</p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-ghost btn-sm text-muted" onClick={onClearCompare}>
              <Trash2 size={16} />
              <span>Clear All</span>
            </button>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Comparison Table Grid */}
        <div className="compare-table-wrapper overflow-x-auto">
          <table className="compare-table w-full">
            <thead>
              <tr>
                <th style={{ width: '160px' }}>Attribute</th>
                {compareItems.map((item) => (
                  <th key={item.id} className="text-center">
                    <div className="compare-item-header card p-2 mb-2 background-slate-50">
                      <button 
                        className="remove-compare-btn" 
                        onClick={() => onRemoveCompareItem(item.id)}
                        title="Remove from comparison"
                      >
                        <X size={14} />
                      </button>
                      <img src={item.images[0]} alt={item.title} className="compare-thumb mx-auto mb-2" />
                      <h4 style={{ fontSize: '0.85rem' }} className="text-truncate">{item.title}</h4>
                      <strong className="text-primary font-weight-bold">₹{item.price}</strong>
                    </div>
                  </th>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                  <th key={`empty-head-${idx}`} className="text-center">
                    <div className="compare-item-header card p-3 mb-2 background-slate-100 border-dashed text-center d-flex flex-column align-items-center justify-content-center" style={{ height: '140px' }}>
                      <Plus size={24} className="text-muted mb-1" />
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Add Product to Compare</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="font-weight-600">Price Tag</td>
                {compareItems.map(item => (
                  <td key={item.id} className="text-center font-weight-bold text-primary">
                    ₹{item.price} {item.negotiable && <span className="badge badge-amber font-normal">Negotiable</span>}
                  </td>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                  <td key={`empty-price-${idx}`} className="text-center text-muted">-</td>
                ))}
              </tr>

              <tr>
                <td className="font-weight-600">Condition</td>
                {compareItems.map(item => (
                  <td key={item.id} className="text-center">
                    <span className="badge badge-secondary">{item.condition}</span>
                  </td>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                  <td key={`empty-cond-${idx}`} className="text-center text-muted">-</td>
                ))}
              </tr>

              <tr>
                <td className="font-weight-600">Department</td>
                {compareItems.map(item => (
                  <td key={item.id} className="text-center" style={{ fontSize: '0.85rem' }}>
                    {item.department || 'Campus Wide'}
                  </td>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                  <td key={`empty-dept-${idx}`} className="text-center text-muted">-</td>
                ))}
              </tr>

              <tr>
                <td className="font-weight-600">Location / Hostel</td>
                {compareItems.map(item => (
                  <td key={item.id} className="text-center text-muted" style={{ fontSize: '0.85rem' }}>
                    {item.location || 'Main Campus'}
                  </td>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                  <td key={`empty-loc-${idx}`} className="text-center text-muted">-</td>
                ))}
              </tr>

              <tr>
                <td className="font-weight-600">Seller Verification</td>
                {compareItems.map(item => (
                  <td key={item.id} className="text-center">
                    <span className="badge badge-primary">
                      ★ {item.sellerRating || 4.8} Verified
                    </span>
                  </td>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                  <td key={`empty-verify-${idx}`} className="text-center text-muted">-</td>
                ))}
              </tr>

              <tr>
                <td className="font-weight-600">Action</td>
                {compareItems.map(item => (
                  <td key={item.id} className="text-center">
                    <button 
                      className="btn btn-primary btn-sm w-full"
                      onClick={() => {
                        onClose();
                        onSelectProduct(item);
                      }}
                    >
                      <ShoppingBag size={14} /> View Item
                    </button>
                  </td>
                ))}
                {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                  <td key={`empty-act-${idx}`} className="text-center text-muted">
                    <button className="btn btn-outline btn-sm w-full" onClick={onClose}>
                      Browse Items
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
