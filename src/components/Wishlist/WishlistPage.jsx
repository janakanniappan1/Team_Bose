import React from 'react';
import { Heart, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { ProductCard } from '../HomePage';
import EmptyState from '../EmptyState/EmptyState';

export default function WishlistPage({ 
  wishlistProducts = [], 
  wishlist = [], 
  onToggleWishlist, 
  onSelectProduct,
  onGoToHome
}) {
  return (
    <div className="wishlist-page-container animate-fade-in py-4">
      <div className="container">
        
        {/* Top Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline btn-sm" onClick={onGoToHome}>
              <ArrowLeft size={16} />
              <span>Back to Marketplace</span>
            </button>
            
            <div className="d-flex align-items-center gap-2">
              <Heart size={24} className="text-rose fill-rose" />
              <h2 className="section-title">Saved Wishlist Items</h2>
              <span className="badge badge-primary font-weight-bold">
                {wishlistProducts.length} items
              </span>
            </div>
          </div>
        </div>

        {/* Wishlist Products Grid or Empty State */}
        {wishlistProducts.length > 0 ? (
          <div className="grid-responsive">
            {wishlistProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={true}
                onToggleWishlist={onToggleWishlist}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            type="wishlist"
            actionLabel="Explore Marketplace Items"
            onAction={onGoToHome}
          />
        )}

      </div>
    </div>
  );
}
