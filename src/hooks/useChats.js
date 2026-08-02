import { useState } from 'react';
import { threadService } from '../services/threadService';

// ============================================================
// useChats — App-level hook for starting chats from product pages
//
// Used in App.jsx to handle "Chat with Seller" button.
// Wires to threadService.getOrCreateThread() for correct UUID flow.
// ============================================================

export function useChats() {
  const [activeChat, setActiveChat] = useState(null);

  /**
   * Start or resume a chat thread between current user (buyer) and seller.
   * @param {object} product   - product object with sellerId, title, price, images
   * @param {object} currentUser - logged-in user with id (UUID)
   * @returns {object} thread  - the DB thread record
   */
  const startChatWithSeller = async (product, currentUser) => {
    const buyerId = currentUser?.id || currentUser?.authId;
    const sellerId = product?.sellerId || product?.seller_id;

    if (!buyerId) throw new Error('You must be logged in to start a chat.');
    if (!sellerId) throw new Error('Seller ID is missing from this product.');
    if (buyerId === sellerId) throw new Error('You cannot chat with yourself.');

    const thread = await threadService.getOrCreateThread({
      buyerId,
      sellerId,
      productId: product?.id || null,
      productDetails: {
        title: product?.title || product?.product_name || 'Campus Item',
        price: product?.price || product?.selling_price || 0,
        images: product?.images || product?.image_urls || [],
        sellerName: product?.sellerName || product?.seller_name || 'Seller',
      },
    });

    setActiveChat(thread);
    return thread;
  };

  return {
    activeChat,
    setActiveChat,
    startChatWithSeller,
  };
}
