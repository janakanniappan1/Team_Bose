import React from 'react';
import { MessagesPage } from '../pages/MessagesPage';

// ============================================================
// MessagesView — Thin wrapper that connects App.jsx to MessagesPage
// Passes initialThreadId from the thread that was just created
// when "Chat with Seller" was clicked.
// ============================================================

export default function MessagesView({ currentUser, initialChat, initialThreadId, onSelectProduct, onGoBack }) {
  const resolvedThreadId = initialThreadId || initialChat?.id || null;

  return (
    <MessagesPage
      currentUser={currentUser}
      initialThreadId={resolvedThreadId}
      initialChat={initialChat}
      onGoBack={onGoBack}
      onOpenProduct={onSelectProduct}
    />
  );
}
