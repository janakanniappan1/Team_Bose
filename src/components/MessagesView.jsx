import React from 'react';
import { MessagesPage } from '../pages/MessagesPage';

// ============================================================
// MessagesView — Thin wrapper that connects App.jsx to MessagesPage
// Passes initialThreadId from the thread that was just created
// when "Chat with Seller" was clicked.
// ============================================================

export default function MessagesView({ currentUser, initialChat, onSelectProduct, onGoBack }) {
  // initialChat is the thread object returned by startChatWithSeller
  // We pass its .id as initialThreadId so MessagesPage opens that thread directly
  const initialThreadId = initialChat?.id || null;

  return (
    <MessagesPage
      currentUser={currentUser}
      initialThreadId={initialThreadId}
      onGoBack={onGoBack}
      onOpenProduct={onSelectProduct}
    />
  );
}
