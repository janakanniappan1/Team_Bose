import React from 'react';
import { GraduationCap, Briefcase, Users, CheckCircle } from 'lucide-react';

export default function AudienceSelector({ selectedAudience, onSelectAudience }) {
  const AUDIENCE_OPTIONS = [
    {
      id: 'students',
      title: 'Students Only',
      desc: 'Listing will be visible exclusively to verified campus students.',
      icon: <GraduationCap size={28} className="text-primary" />,
      badgeColor: 'badge-primary'
    },
    {
      id: 'staff',
      title: 'Staff Only',
      desc: 'Listing will be visible exclusively to verified faculty and campus staff.',
      icon: <Briefcase size={28} className="text-secondary" />,
      badgeColor: 'badge-secondary'
    },
    {
      id: 'both',
      title: 'Students & Staff',
      desc: 'Listing will be visible to the entire campus community.',
      icon: <Users size={28} className="text-amber" />,
      badgeColor: 'badge-amber'
    }
  ];

  return (
    <div className="audience-selector-container">
      <div className="text-center mb-4">
        <h3 className="audience-title font-heading mb-1" style={{ fontSize: '1.4rem' }}>
          Who should be able to view this product?
        </h3>
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>
          Choose your target audience. An audience badge will be displayed on your listing.
        </p>
      </div>

      <div className="audience-cards-grid">
        {AUDIENCE_OPTIONS.map((option) => {
          const isSelected = selectedAudience === option.id;
          return (
            <div
              key={option.id}
              className={`audience-card card p-4 ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectAudience(option.id)}
            >
              <div className="audience-card-header d-flex align-items-center justify-content-between mb-3">
                <div className="audience-icon-box card p-2 background-slate-50">
                  {option.icon}
                </div>
                {isSelected && (
                  <CheckCircle size={22} className="text-primary animate-scale-up" />
                )}
              </div>

              <h4 className="audience-card-title mb-2" style={{ fontSize: '1.1rem' }}>
                {option.title}
              </h4>
              <p className="text-muted" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                {option.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
