import React, { useState, useRef } from 'react';
import { Send, Image as ImageIcon, Smile, Paperclip, DollarSign } from 'lucide-react';
import { ImagePreview } from './ImagePreview';

export function MessageInput({ onSendMessage, onSendImage, onTyping, onMakeOffer }) {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const QUICK_REPLIES = [
    'Is this still available?',
    'When can we meet?',
    'Can you reduce the price?',
    'Where can we meet?'
  ];

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (onTyping) onTyping();
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleConfirmSendImage = () => {
    if (imageFile && onSendImage) {
      onSendImage(imageFile);
      setImageFile(null);
    }
  };

  return (
    <div className="message-input-bar p-3 border-top bg-white" style={{ flex: '0 0 auto', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Quick Reply Chips */}
      <div className="d-flex align-items-center gap-2 mb-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <span className="text-muted" style={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }}>Quick:</span>
        {QUICK_REPLIES.map((reply, i) => (
          <button
            key={i}
            className="btn btn-ghost btn-sm py-1 px-2 border"
            style={{ borderRadius: '14px', fontSize: '0.72rem', whiteSpace: 'nowrap', backgroundColor: '#F8FAFC' }}
            onClick={() => {
              setText(reply);
              if (onTyping) onTyping();
            }}
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input controls */}
      <div className="d-flex align-items-center gap-2">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />

        <button 
          className="btn btn-ghost btn-sm icon-btn"
          onClick={() => fileInputRef.current?.click()}
          title="Attach Image"
        >
          <ImageIcon size={20} className="text-slate" />
        </button>

        {onMakeOffer && (
          <button 
            className="btn btn-ghost btn-sm icon-btn text-amber"
            onClick={onMakeOffer}
            title="Make Offer"
          >
            <DollarSign size={20} />
          </button>
        )}

        <div className="flex-1 position-relative">
          <input
            type="text"
            className="form-input btn-sm w-100"
            style={{
              paddingRight: '40px',
              borderRadius: '24px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              fontSize: '0.92rem'
            }}
            placeholder="Type a message or click quick replies..."
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
          />
          <button
            className="btn btn-ghost btn-sm icon-btn position-absolute right-2 top-2"
            style={{ padding: '2px' }}
            title="Add Emoji"
            onClick={() => setText((prev) => prev + ' 😊')}
          >
            <Smile size={18} className="text-muted" />
          </button>
        </div>

        <button
          className="btn btn-primary btn-sm d-flex align-items-center justify-content-center"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#C85A32', // Terracotta Theme
            border: 'none'
          }}
          disabled={!text.trim()}
          onClick={handleSend}
          title="Send Message"
        >
          <Send size={18} style={{ marginLeft: '2px' }} />
        </button>
      </div>

      {/* Image Preview Modal */}
      {imageFile && (
        <ImagePreview
          imageFile={imageFile}
          onCancel={() => setImageFile(null)}
          onSend={handleConfirmSendImage}
        />
      )}

    </div>
  );
}
