import React from 'react';
import { Clock, Eye, Sparkles } from 'lucide-react';
import { ProductCard } from '../HomePage';

export default function RecentlyViewedBar({ 
  recentProducts = [], 
  wishlist = [], 
  onToggleWishlist, 
  onSelectProduct 
}) {
  if (!recentProducts || recentProducts.length === 0) return null;

  return (
    <section className="recently-viewed-section my-4">
      <div className="container">
        <div className="section-header mb-3">
          <div className="title-with-badge">
            <Clock className="text-secondary" size={20} />
            <h3 className="section-title" style={{ fontSize: '1.35rem' }}>Recently Viewed Products</h3>
          </div>
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
            ({recentProducts.length} items saved locally)
          </span>
        </div>

        <div className="horizontal-scroll pb-2">
          {recentProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onSelectProduct={onSelectProduct}
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
}
