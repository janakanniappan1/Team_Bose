import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { productSupabase } from '../lib/supabase';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Realtime subscription for dynamic live loading (INSERT, UPDATE, DELETE)
    const channel = productSupabase
      .channel('realtime:user_imagesss')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_imagesss' },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            const deletedId = payload.old?.id;
            if (deletedId) {
              setProducts((prev) => prev.filter((p) => p.id !== deletedId));
            } else {
              fetchProducts();
            }
          } else {
            fetchProducts();
          }
        }
      )
      .subscribe();

    return () => {
      productSupabase.removeChannel(channel);
    };
  }, []);

  const addProduct = async (newProductData) => {
    const created = await productService.createProduct(newProductData);
    setProducts((prev) => [created, ...prev]);
    return created;
  };

  const removeProduct = async (productId) => {
    await productService.deleteProduct(productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateProductStatus = async (productId) => {
    const updated = await productService.toggleMarkSold(productId);
    if (updated) {
      setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
    }
    return updated;
  };

  const changePrice = async (productId, newPrice) => {
    const updated = await productService.updatePrice(productId, newPrice);
    if (updated) {
      setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
    }
    return updated;
  };

  return {
    products,
    setProducts,
    loading,
    error,
    addProduct,
    removeProduct,
    updateProductStatus,
    changePrice,
    refreshProducts: fetchProducts
  };
}
