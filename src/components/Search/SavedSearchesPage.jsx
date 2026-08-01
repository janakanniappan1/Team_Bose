import React, { useState } from 'react';
import { Bookmark, Trash2, Edit2, Search, ArrowLeft, Check, X } from 'lucide-react';
import EmptyState from '../EmptyState/EmptyState';

export default function SavedSearchesPage({ 
  savedSearches = [], 
  onDeleteSavedSearch,
  onRenameSavedSearch,
  onSearchAgain,
  onGoToHome
}) {
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const handleStartRename = (item) => {
    setEditingId(item.id);
    setEditingText(item.term);
  };

  const handleSaveRename = (id) => {
    if (editingText.trim() && onRenameSavedSearch) {
      onRenameSavedSearch(id, editingText.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="saved-searches-page-container animate-fade-in py-4">
      <div className="container">
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline btn-sm" onClick={onGoToHome}>
              <ArrowLeft size={16} />
              <span>Back to Marketplace</span>
            </button>
            
            <div className="d-flex align-items-center gap-2">
              <Bookmark size={24} className="text-primary fill-primary" />
              <h2 className="section-title">Saved Searches</h2>
              <span className="badge badge-primary font-weight-bold">
                {savedSearches.length} Saved
              </span>
            </div>
          </div>
        </div>

        {/* Saved Searches Grid or Empty State */}
        {savedSearches.length > 0 ? (
          <div className="saved-searches-grid grid-responsive">
            {savedSearches.map((item) => (
              <div key={item.id} className="saved-search-card card p-4 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge badge-secondary text-uppercase">{item.category || 'ALL'}</span>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>Saved {item.date}</span>
                  </div>

                  {editingId === item.id ? (
                    <div className="d-flex align-items-center gap-1 my-2">
                      <input
                        type="text"
                        className="form-input btn-sm"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        autoFocus
                      />
                      <button className="btn btn-primary btn-sm" onClick={() => handleSaveRename(item.id)}>
                        <Check size={14} />
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <h3 className="saved-search-term my-2" style={{ fontSize: '1.1rem' }}>
                      "{item.term}"
                    </h3>
                  )}
                </div>

                <div className="d-flex align-items-center justify-content-between gap-2 mt-4 pt-3 border-top">
                  <button 
                    className="btn btn-primary btn-sm flex-1"
                    onClick={() => onSearchAgain(item.term, item.category)}
                  >
                    <Search size={14} /> Search Again
                  </button>

                  <div className="d-flex align-items-center gap-1">
                    <button 
                      className="btn btn-ghost btn-sm text-muted"
                      onClick={() => handleStartRename(item)}
                      title="Rename Search"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button 
                      className="btn btn-ghost btn-sm text-rose"
                      onClick={() => onDeleteSavedSearch && onDeleteSavedSearch(item.id)}
                      title="Delete Saved Search"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            type="search"
            title="No Saved Searches Yet"
            message="Save your frequent search queries to get notified when new campus listings match your interest."
            actionLabel="Explore Marketplace Items"
            onAction={onGoToHome}
          />
        )}

      </div>
    </div>
  );
}
