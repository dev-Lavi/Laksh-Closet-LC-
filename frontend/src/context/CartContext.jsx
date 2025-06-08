import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [favourites, setFavourites] = useState([]);

  // Calculate total cart count (sum of all quantities)
  const cartCount = useMemo(() => (
    cartItems.reduce((total, item) => total + item.quantity, 0)
  ), [cartItems]);

  // Add item to cart or update quantity if exists (now handles size variations)
  const addToCart = useCallback((item) => {
    setCartItems(prev => {
      // Check for matching ID AND size
      const existingItemIndex = prev.findIndex(prevItem => 
        prevItem.id === item.id && prevItem.selectedSize === item.selectedSize
      );
      
      if (existingItemIndex !== -1) {
        // Create new array to avoid mutation
        const newItems = [...prev];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + (item.quantity || 1)
        };
        return newItems;
      }
      // Add new item with default quantity 1 if not specified
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  }, []);

  // Remove item from cart (now handles size variations)
  const removeFromCart = useCallback((itemId, size) => {
    setCartItems(prev => prev.filter(item => 
      !(item.id === itemId && item.selectedSize === size)
    ));
  }, []);

  // Update specific item quantity
  const updateQuantity = useCallback((itemId, size, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => 
      prev.map(item => 
        (item.id === itemId && item.selectedSize === size)
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  }, []);

  // Clear all items from cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Toggle favorite status
  const toggleFavourite = useCallback((product) => {
    setFavourites(prev => {
      const isFavorited = prev.some(item => item.id === product.id);
      if (isFavorited) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  }, []);

  // Context value
  const value = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    favourites,
    toggleFavourite  // Added toggle function
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}