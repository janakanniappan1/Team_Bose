import React from 'react';
import { MessagesPage } from '../pages/MessagesPage';

export default function MessagesView({ currentUser, initialChat, onSelectProduct, onGoBack }) {
  return (
    <MessagesPage
      currentUser={currentUser}
      initialThreadId={initialChat?.id}
      onGoBack={onGoBack}
      onOpenProduct={onSelectProduct}
    />
  );
}
