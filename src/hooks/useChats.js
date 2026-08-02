import { useState } from 'react';
import { threadService } from '../services/threadService';

// ============================================================
// useChats — App-level hook for starting chats from product pages
//
// Used in App.jsx to handle "Chat with Seller" button.
// Handles both UUIDs and string identifiers (sellerName/username).
// ============================================================

export function useChats() {
  const [activeChat, setActiveChat] = useState(null);

  /**
   * Start or resume a chat thread between current user (buyer) and seller.
   * @param {object} product   - product object with sellerId/sellerName, title, price, images
   * @param {object} currentUser - logged-in user object
   * @returns {object} thread  - the DB thread record
   */
  const startChatWithSeller = async (product, currentUser) => {
    const buyerId = currentUser?.id || currentUser?.authId || currentUser?.username;
    const sellerId = product?.sellerId || product?.seller_id || product?.sellerName || product?.seller_name || product?.username || product?.seller_username;

    if (!buyerId) throw new Error('You must be logged in to start a chat.');
    if (!sellerId) throw new Error('Seller ID is missing from this product.');

    const cleanBuyer = String(buyerId).trim().toLowerCase();
    const cleanSeller = String(sellerId).trim().toLowerCase();
    const cleanUsername = String(currentUser?.username || '').trim().toLowerCase();
    const cleanFullName = String(currentUser?.full_name || '').trim().toLowerCase();

    if (cleanBuyer === cleanSeller || (cleanUsername && cleanUsername === cleanSeller) || (cleanFullName && cleanFullName === cleanSeller)) {
      throw new Error('This is your own listing! You cannot chat with yourself.');
    }

    const thread = await threadService.getOrCreateThread({
      buyerId: String(buyerId),
      sellerId: String(sellerId),
      productId: product?.id || null,
      productDetails: {
        title: product?.title || product?.product_name || 'Campus Item',
        price: product?.price || product?.selling_price || 0,
        images: product?.images || product?.image_urls || [],
        sellerName: product?.sellerName || product?.seller_name || product?.username || 'Seller',
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
