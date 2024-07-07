import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './components/style.css';
import ProductDetails from './components/ProductDetails';
import Header from './components/header';
import Footer from './components/footer';
import Main from './components/main';
import CartOverlay from './components/CartOverlay';

function App() {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Clothes');
  const categories = ['Clothes', 'Tech'];
  const [isCartOverlayOpen, setCartOverlayOpen] = useState(false);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingProductIndex = prevCart.findIndex(p => p.id === product.id && JSON.stringify(p.selectedAttributes) === JSON.stringify(product.selectedAttributes));
      if (existingProductIndex >= 0) {
        const newCart = [...prevCart];
        newCart[existingProductIndex].quantity += 1;
        return newCart;
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const incrementQuantity = (index) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      newCart[index].quantity += 1;
      return newCart;
    });
  };

  const decrementQuantity = (index) => {
    setCart(prevCart => {
      if (prevCart[index].quantity === 1) {
        return prevCart.filter((_, i) => i !== index);
      } else {
        const newCart = [...prevCart];
        newCart[index].quantity -= 1;
        return newCart;
      }
    });
  };

  const toggleCartOverlay = () => {
    setCartOverlayOpen(prev => !prev);
  };

  const placeOrder = () => {
    // Perform GraphQL mutation to create order
    // Empty the cart after order is placed
    setCart([]);
    setCartOverlayOpen(false);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  return (
    <Router>
      <Header
        categories={categories}
        activeCategory={activeCategory}
        handleCategoryClick={handleCategoryClick}
        cart={cart}
        toggleCartOverlay={toggleCartOverlay}
      />
      <Routes>
        <Route
          path="/"
          element={<Main activeCategory={activeCategory} addToCart={addToCart} />}
        />
        <Route path="/product/:productId" element={<ProductDetails addToCart={addToCart} />} />
      </Routes>
      <CartOverlay
        cart={cart}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
        placeOrder={placeOrder}
        isOpen={isCartOverlayOpen}
        toggleCartOverlay={toggleCartOverlay}
      />
      <Footer />
    </Router>
  );
}

export default App;
