import React, { useState, useEffect } from 'react';
import { toKebabCase } from './utils';
import { Link } from 'react-router-dom';
import './style.css'; // Assuming you have a separate CSS file for styles

const Main = ({ activeCategory, addToCart }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost/scandiweb-back/public/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          products {
            id
            name
            inStock
            description
            category
            brand
            typename
            gallery
            prices {
              amount
              currency {
                label
                symbol
              }
            }
          }
        }`
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('GraphQL Response:', data);
      if (data.errors) {
        console.error('GraphQL Errors:', data.errors);
      }
      if (data.data && data.data.products) {
        setProducts(data.data.products);
      } else {
        console.error('No products found in response:', data);
      }
    })
    .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === activeCategory.toLowerCase()
  );
  const getCategoryBackground = () => {
    switch (activeCategory.toLowerCase()) {
      case 'tech':
        return 'url(./images/tech.jpg)';
      case 'clothes':
      default:
        return 'url(./images/main.jpg)';
    }
  };

  return (
    <div className="shop-market">
      <main className="main-pic" style={{ backgroundImage: getCategoryBackground() }}>
      {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <section key={product.id} className="section-clothes" data-testid={`product-${toKebabCase(product.name)}`}>
              <h2>{product.name}</h2>
              <p>Brand: {product.brand}</p>
              <p>
                Price: {product.prices && product.prices[0] && product.prices[0].currency.symbol}
                {product.prices && product.prices[0] && product.prices[0].amount}
              </p>
              {product.inStock && (
                <div className='icon-inside'>
                  <i
                    className="fas fa-cart-plus add-to-cart-icon"
                    onClick={() => addToCart(product)}
                  ></i>
                </div>
              )}
              <Link to={`/product/${product.id}`} className="product-link">
                <img
                  src={product.gallery && product.gallery.length > 0 ? product.gallery[0] : ''}
                  alt={product.name}
                  className={!product.inStock ? 'grayed-out' : ''}
                />
              </Link>
            </section>
          ))
        ) : (
          <p>No products found for {activeCategory} category.</p>
        )}
      </main>
    </div>
  );
};

export default Main;
