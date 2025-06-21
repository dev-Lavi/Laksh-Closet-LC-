import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [favourites, setFavourites] = useState([]);

  // 🧮 Calculate total items in cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // 🛒 Add item to cart (checks _id + selectedSize)
  const addToCart = useCallback((item) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(prevItem =>
        prevItem._id === item._id && prevItem.selectedSize === item.selectedSize
      );

      if (existingItemIndex !== -1) {
        const newItems = [...prev];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + (item.quantity || 1),
        };
        return newItems;
      }

      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  }, []);

  // ❌ Remove specific item from cart
  const removeFromCart = useCallback((itemId, size) => {
    setCartItems(prev =>
      prev.filter(item =>
        !(item._id === itemId && item.selectedSize === size)
      )
    );
  }, []);

  // 🔁 Update quantity of an item
  const updateQuantity = useCallback((itemId, size, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        (item._id === itemId && item.selectedSize === size)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, []);

  // 🧹 Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // ❤️ Toggle wishlist
  const toggleFavourite = useCallback((product) => {
    setFavourites(prev => {
      const isFavorited = prev.some(item => item._id === product._id);
      return isFavorited
        ? prev.filter(item => item._id !== product._id)
        : [...prev, product];
    });
  }, []);

  // 📦 Context value
  const value = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    favourites,
    toggleFavourite,
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
