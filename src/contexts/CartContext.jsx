import React, { createContext, useState, useContext, useCallback } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingCountry, setShippingCountry] = useState(null); // { id, name, shipping_cost }

  const addToCart = useCallback((book, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === book.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...book, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((bookId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== bookId));
  }, []);

  const updateQuantity = useCallback((bookId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === bookId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      // Utilise le prix en centimes s'il existe (price_cents), sinon le prix normal * 100
      const priceInCents = item.price_cents || (item.price * 100);
      return total + priceInCents * item.quantity;
    }, 0);
  };

  const getTotalPrice = () => {
    return getSubtotal();
  };

  const getShippingCost = () => {
    return shippingCountry ? shippingCountry.shipping_cost : 0;
  };

  const getTaxes = (subtotal) => {
    // TVA de 20%
    return Math.round(subtotal * 0.20);
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const taxes = getTaxes(subtotal);
    const shipping = getShippingCost();
    return subtotal + taxes + shipping;
  };

  const setCountry = useCallback((country) => {
    setShippingCountry(country);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getSubtotal,
        getTaxes,
        getShippingCost,
        getTotal,
        shippingCountry,
        setCountry,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
