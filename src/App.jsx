import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthPage from './components/AuthPage';
import ProfileSetupPage from './components/ProfileSetupPage';
import { authService } from './services/authService';
import HomePage from './components/HomePage';
import SellProductPage from './components/SellProductPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import UserProfilePage from './components/UserProfilePage';
import UserDashboardPage from './components/Dashboard/UserDashboardPage';
import MessagesView from './components/MessagesView';
import NotificationsModal from './components/NotificationsModal';
import WishlistPage from './components/Wishlist/WishlistPage';
import SearchResultsPage from './components/Search/SearchResultsPage';
import SavedSearchesPage from './components/Search/SavedSearchesPage';
import ProductComparisonModal from './components/Comparison/ProductComparisonModal';
import Toast from './components/Toast';

import { MOCK_USER } from './data/mockData';
import { useProducts } from './hooks/useProducts';
import { useWishlist } from './hooks/useWishlist';
import { useSearch } from './hooks/useSearch';
import { useNotifications } from './hooks/useNotifications';
import { useChats } from './hooks/useChats';

const SESSION_KEY = 'uniswap_is_logged_in';

export default function App() {
  // Session Management State (ALWAYS start unauthenticated on load so Sign In page shows first!)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initial View State (ALWAYS start on 'login' page!)
  const getHashView = () => {
    const hash = window.location.hash.replace('#', '');
    const validViews = ['login', 'register', 'home', 'search', 'sell', 'product-detail', 'profile', 'messages', 'wishlist', 'saved-searches'];
    return validViews.includes(hash) ? hash : 'login';
  };

  const [activeView, setActiveView] = useState('login');
  const [currentUser, setCurrentUser] = useState(MOCK_USER);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Database-Ready Custom Hooks Integration
  const { products, addProduct, removeProduct, updateProductStatus, changePrice } = useProducts();
  const { wishlist, toggleWishlist, isWishlisted } = useWishlist();
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, savedSearches, removeSavedSearch, renameSavedSearch } = useSearch();
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications(currentUser);
  const { activeChat, setActiveChat, startChatWithSeller } = useChats();

  // Restore session on page load (check if user was already logged in)
  useEffect(() => {
    authService.getCurrentUser().then((savedUser) => {
      if (savedUser) {
        setIsLoggedIn(true);
        const displayName = savedUser.full_name || (savedUser.username ? savedUser.username.charAt(0).toUpperCase() + savedUser.username.slice(1) : 'User');
        setCurrentUser((prev) => ({
          ...prev,
          username: savedUser.username || prev.username,
          fullName: displayName,
          firstName: displayName.split(' ')[0],
          lastName: displayName.split(' ').slice(1).join(' ') || prev.lastName,
          email: savedUser.email || prev.email,
          authId: savedUser.id,
          role: savedUser.role || prev.role
        }));
        navigateToView('home');
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Browser Back/Forward (popstate) & Hash Navigation Handler
  useEffect(() => {
    const handlePopState = (e) => {
      if (e.state && e.state.view) {
        setActiveView(e.state.view);
      } else {
        setActiveView(getHashView());
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronize Navigation with Browser History API
  const navigateToView = (newView, params = {}) => {
    if (activeView !== newView) {
      setActiveView(newView);
      window.location.hash = newView;
      window.history.pushState({ view: newView, ...params }, '', `/#${newView}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigateToView('home');
    }
  };

  // Show Toast feedback
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Session Handlers
  const handleLoginSuccess = (authUser) => {
    setIsLoggedIn(true);
    localStorage.setItem(SESSION_KEY, 'true');
    // Map Supabase user's full_name (set at signup) onto the currentUser shape
    if (authUser) {
      const displayName = authUser.full_name || (authUser.username ? authUser.username.charAt(0).toUpperCase() + authUser.username.slice(1) : 'User');
      setCurrentUser((prev) => ({
        ...prev,
        username: authUser.username || prev.username,
        fullName: displayName,
        firstName: displayName.split(' ')[0],
        lastName: displayName.split(' ').slice(1).join(' ') || prev.lastName,
        authId: authUser.id,
        role: authUser.role || prev.role
      }));
    }
    showToast(`Welcome back, ${authUser?.full_name || authUser?.username || 'there'}! 🎉`, 'success');
    navigateToView('home');
  };

  const handleSignOut = async () => {
    await authService.logout();
    setIsLoggedIn(false);
    localStorage.setItem(SESSION_KEY, 'false');
    showToast('Signed out successfully', 'info');
    navigateToView('login');
  };

  // Toggle Wishlist handler
  const handleToggleWishlist = (productId) => {
    const { isAdded } = toggleWishlist(productId);
    if (isAdded) {
      showToast('Item saved to your Wishlist ❤️', 'success');
    } else {
      showToast('Item removed from Wishlist', 'info');
    }
  };

  // Product Comparison Toggle handler (Max 3 items)
  const handleToggleCompare = (product) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed "${product.title}" from comparison`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        if (prev.length >= 3) {
          showToast('You can compare a maximum of 3 items at a time', 'error');
          return prev;
        }
        showToast(`Added "${product.title}" to product comparison! ⚖️`, 'success');
        return [...prev, product];
      }
    });
  };

  // Product Selection handler
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    navigateToView('product-detail', { productId: product.id });
  };

  // Start Search navigation handler
  const handleSearchNavigation = (term, category = 'all') => {
    if (term !== undefined) setSearchQuery(term);
    if (category !== undefined) setSelectedCategory(category);
    navigateToView('search', { query: term, category });
  };

  // Start Chat handler — flexible seller resolution & self-chat guard
  const handleStartChat = async (product) => {
    const myId = currentUser?.id || currentUser?.authId || currentUser?.username;
    const sellerId = product?.sellerId || product?.seller_id || product?.sellerName || product?.seller_name || product?.username || product?.seller_username;

    const cleanMyId = String(myId || '').trim().toLowerCase();
    const cleanSellerId = String(sellerId || '').trim().toLowerCase();
    const cleanUsername = String(currentUser?.username || '').trim().toLowerCase();
    const cleanFullName = String(currentUser?.full_name || '').trim().toLowerCase();

    // Self-chat guard
    if (cleanMyId && cleanSellerId && (cleanMyId === cleanSellerId || (cleanUsername && cleanUsername === cleanSellerId) || (cleanFullName && cleanFullName === cleanSellerId))) {
      showToast('⚠️ This is your own listing. You cannot chat with yourself.', 'info');
      return;
    }

    if (!myId) {
      showToast('Please log in to start a chat.', 'info');
      return;
    }

    try {
      const thread = await startChatWithSeller(product, currentUser);
      navigateToView('messages', { chatId: thread?.id });
      showToast(`Opening chat regarding ${product.title}...`, 'info');
    } catch (err) {
      showToast(err.message || 'Unable to open chat.', 'info');
    }
  };

  // Handle New Product Submission
  const handleProductSubmitted = async (newProduct) => {
    const formattedProduct = {
      ...newProduct,
      sellerName: currentUser?.fullName || 'Jana K',
      sellerAvatar: currentUser?.avatar || newProduct.sellerAvatar,
      status: 'Approved' // Ensure it immediately displays under My Active Products!
    };
    await addProduct(formattedProduct);
    showToast('🎉 Item published successfully to Campus Marketplace & My Active Products!', 'success');
    navigateToView('home');
  };

  // Handle Delete Product
  const handleDeleteProduct = async (productId) => {
    await removeProduct(productId);
    showToast('Listing removed successfully', 'info');
  };

  // Handle Mark Sold Toggle
  const handleToggleMarkSold = async (productId) => {
    await updateProductStatus(productId);
    showToast('Listing status updated!', 'success');
  };

  // Handle Profile Save
  const handleSaveProfile = (updatedProfile) => {
    setCurrentUser((prev) => ({ ...prev, ...updatedProfile }));
    showToast('Campus profile updated successfully!', 'success');
    navigateToView('home');
  };

  const handleChangePrice = async (productId, newPrice) => {
    await changePrice(productId, newPrice);
    showToast('Product price updated successfully!', 'success');
  };

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="app-container">
      
      {/* Navbar rendered except on full auth pages */}
      {activeView !== 'login' && (
        <Navbar
          activeView={activeView}
          setActiveView={navigateToView}
          searchQuery={searchQuery}
          setSearchQuery={(q) => handleSearchNavigation(q)}
          selectedCategory={selectedCategory}
          setSelectedCategory={(cat) => handleSearchNavigation(searchQuery, cat)}
          wishlistCount={wishlist.length}
          unreadNotifsCount={unreadCount}
          currentUser={currentUser}
          isLoggedIn={isLoggedIn}
          onSignOut={handleSignOut}
          onOpenNotifications={() => setNotificationsOpen(true)}
          compareCount={compareList.length}
          onOpenCompare={() => setShowCompareModal(true)}
        />
      )}

      {/* Main Content Router */}
      <main className="main-content">
        
        {activeView === 'login' && (
          <AuthPage
            onLoginSuccess={handleLoginSuccess}
            onGoToRegister={() => navigateToView('register')}
          />
        )}

        {activeView === 'register' && (
          <ProfileSetupPage
            onSaveProfile={handleSaveProfile}
            onSkip={() => {
              showToast('Profile setup skipped for now', 'info');
              navigateToView('home');
            }}
          />
        )}

        {activeView === 'home' && (
          <HomePage
            products={products}
            onSelectProduct={handleSelectProduct}
            onGoToSell={() => navigateToView('sell')}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onSelectCategory={(cat) => handleSearchNavigation('', cat)}
            onStartChat={handleStartChat}
            onToggleCompare={handleToggleCompare}
            compareList={compareList}
          />
        )}

        {activeView === 'search' && (
          <SearchResultsPage
            products={products}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectProduct={handleSelectProduct}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onStartChat={handleStartChat}
            onToggleCompare={handleToggleCompare}
            compareList={compareList}
            onGoToHome={() => navigateToView('home')}
          />
        )}

        {activeView === 'wishlist' && (
          <WishlistPage
            wishlistProducts={wishlistProducts}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onSelectProduct={handleSelectProduct}
            onGoToHome={() => navigateToView('home')}
          />
        )}

        {activeView === 'saved-searches' && (
          <SavedSearchesPage
            savedSearches={savedSearches}
            onDeleteSavedSearch={removeSavedSearch}
            onRenameSavedSearch={renameSavedSearch}
            onSearchAgain={(term, cat) => handleSearchNavigation(term, cat)}
            onGoToHome={() => navigateToView('home')}
          />
        )}

        {activeView === 'sell' && (
          <SellProductPage
            onProductSubmitted={handleProductSubmitted}
            onCancel={() => navigateToView('home')}
            currentUser={currentUser}
          />
        )}

        {activeView === 'product-detail' && (
          <ProductDetailsPage
            product={selectedProduct || products[0]}
            onBack={handleGoBack}
            isWishlisted={isWishlisted(selectedProduct?.id || products[0]?.id)}
            onToggleWishlist={handleToggleWishlist}
            onStartChat={handleStartChat}
            onSelectProduct={handleSelectProduct}
            onToggleCompare={handleToggleCompare}
            isCompared={compareList.some(p => p.id === (selectedProduct?.id || products[0]?.id))}
          />
        )}

        {(activeView === 'profile' || activeView === 'dashboard') && (
          <UserDashboardPage
            user={currentUser}
            products={products}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onSelectProduct={handleSelectProduct}
            onGoToSell={() => navigateToView('sell')}
            onEditProfile={() => navigateToView('register')}
            onDeleteProduct={handleDeleteProduct}
            onToggleMarkSold={handleToggleMarkSold}
            onChangePrice={handleChangePrice}
            onSignOut={handleSignOut}
            savedSearches={savedSearches}
            onDeleteSavedSearch={removeSavedSearch}
            onRenameSavedSearch={renameSavedSearch}
            onSearchAgain={(term, cat) => handleSearchNavigation(term, cat)}
            notifications={notifications}
            onMarkAllRead={markAllRead}
            onClearAllNotifications={clearAll}
          />
        )}

        {activeView === 'messages' && (
          <MessagesView
            currentUser={currentUser}
            initialChat={activeChat}
            onSelectProduct={handleSelectProduct}
            onGoBack={handleGoBack}
          />
        )}

      </main>

      {/* Footer rendered except on auth pages */}
      {activeView !== 'login' && (
        <Footer setActiveView={navigateToView} />
      )}

      {/* Product Comparison Modal */}
      {showCompareModal && (
        <ProductComparisonModal
          compareItems={compareList}
          onRemoveCompareItem={(id) => setCompareList(prev => prev.filter(p => p.id !== id))}
          onClearCompare={() => setCompareList([])}
          onSelectProduct={handleSelectProduct}
          onClose={() => setShowCompareModal(false)}
        />
      )}

      {/* Notifications Drawer Modal */}
      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={markAllRead}
      />

      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
