import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toKebabCase } from './utils';

const ProductDetails = ({ addToCart }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    console.log(`Fetching product details for product ID: ${productId}`);
    fetch('http://localhost/scandiweb-back/public/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          product(id: "${productId}") {
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
            attributes {
              id
              name
              type
              items {
                displayValue
                value
                id
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
      if (data.data && data.data.product) {
        setProduct(data.data.product);
      } else {
        console.error('No product found in response:', data);
      }
    })
    .catch((error) => console.error('Error fetching product:', error));
  }, [productId]);

  const handleAttributeSelect = (attributeId, itemId) => {
    setSelectedAttributes({
      ...selectedAttributes,
      [attributeId]: itemId,
    });
  };

  const isAddToCartDisabled = () => {
    if (!product || !product.attributes) return true;
    return product.attributes.some(
      (attr) => !selectedAttributes[attr.id]
    );
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedAttributes,
    });
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : product.gallery.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex < product.gallery.length - 1 ? prevIndex + 1 : 0));
  };

  if (!product) {
    console.log('Product is null, returning loading message.');
    return <p>Loading...</p>;
  }

  return (
    <div className="product-details">
    <div className='first-box'>
      <div className="product-gallery" data-testid="product-gallery">
        <div className="gallery-thumbnails">
          {product.gallery && product.gallery.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className={`thumbnail ${index === currentImageIndex ? 'selected' : ''}`}
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
        <div className="main-image">
          <button className="prev" onClick={handlePrevImage}>&#10094;</button>
          {product.gallery && (
            <img src={product.gallery[currentImageIndex]} alt="Product" />
          )}
          <button className="next" onClick={handleNextImage}>&#10095;</button>
        </div>
      </div>
      </div>
      <div className='second-box'>
      <div>
            <h1>{product.name}</h1>
            <div className="product-attributes">
                {product.attributes && product.attributes.map((attribute) => (
                <div
                    key={attribute.id}
                    data-testid={`product-attribute-${toKebabCase(attribute.name)}`}
                    className="attribute-container"
                >
                    <h3>{attribute.name}</h3>
                    <div className="attribute-items">
                    {attribute.items.map((item) => (
                        <button
                        key={item.id}
                        className={`attribute-item ${selectedAttributes[attribute.id] === item.id ? 'selected' : ''}`}
                        onClick={() => handleAttributeSelect(attribute.id, item.id)}
                        style={attribute.type === 'swatch' ? { backgroundColor: item.value } : {}}
                        >
                        {attribute.type === 'text' ? item.displayValue : ''}
                        </button>
                    ))}
                    </div>
                </div>
                ))} 
      </div>
      <div className="product-price">
        <h3>Price</h3>
        {product.prices && product.prices[0] && (
          <p>
            {product.prices[0].currency.symbol}
            {product.prices[0].amount.toFixed(2)}
          </p>
        )}
      </div>
      </div>
      <button
        data-testid="add-to-cart"
        className="add-to-cart-button"
        onClick={handleAddToCart}
        disabled={isAddToCartDisabled()}
      >
        Add to Cart
      </button>
      <div
        className="product-description"
        data-testid="product-description"
        dangerouslySetInnerHTML={{ __html: product.description }}
      ></div>
      </div>
    </div>
  );
};

export default ProductDetails;
