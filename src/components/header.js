import React from 'react';
import { Link } from 'react-router-dom';
import './style.css'; // Assuming you have a separate CSS file for styles

const Header = ({ categories, activeCategory, handleCategoryClick, cart, toggleCartOverlay }) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="shop-header">
        <nav className="nav-bar">
          <ul className="nav-links">
          {categories.map((category) => (
              <li key={category}>
                <Link
                  to="/"
                  onClick={() => handleCategoryClick(category)}
                  data-testid={category === activeCategory ? 'active-category-link' : 'category-link'}
                  className={category === activeCategory ? 'active' : ''}
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
          <div className="basket-icon" data-testid="cart-btn" onClick={toggleCartOverlay}>
            <i className="fas fa-shopping-basket"></i>
            {totalItems > 0 && <span className="item-count-bubble">{totalItems}</span>}
          </div>
        </nav>
      </header>
      <div className='pad'></div>
    </>
  );
};

export default Header;
