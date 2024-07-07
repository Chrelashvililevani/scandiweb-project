import React from 'react';
import { toKebabCase } from './utils';

const CartOverlay = ({ cart = [], incrementQuantity, decrementQuantity, placeOrder, isOpen, toggleCartOverlay }) => {
  console.log('CartOverlay Rendered');
  console.log('Cart:', cart);
  console.log('Is Open:', isOpen);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  console.log('Total Items:', totalItems);

  const totalPrice = cart.reduce((sum, item) => {
    if (item.prices && item.prices[0]) {
      return sum + item.prices[0].amount * item.quantity;
    }
    return sum;
  }, 0).toFixed(2);
  console.log('Total Price:', totalPrice);

  return isOpen ? (
    <div className="cart-overlay">
      <div className="cart-content">
        <button className="close-btn" onClick={toggleCartOverlay}>×</button>
        <h2>My Bag, {totalItems} {totalItems === 1 ? 'Item' : 'Items'}</h2>
        <ul className="cart-list">
          {cart.map((item, index) => {
            console.log('Cart Item:', item);
            return (
              <li key={index} className="cart-item">
                {item.gallery && item.gallery[0] ? (
                  <img src={item.gallery[0]} alt={item.name} className="cart-item-image" />
                ) : (
                  <div>No Image</div>
                )}
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>Brand: {item.brand}</p>
                  {item.prices && item.prices[0] ? (
                    <p>Price: {item.prices[0].currency.symbol}{item.prices[0].amount}</p>
                  ) : (
                    <p>Price: Not available</p>
                  )}
                  <div className="cart-item-options">
                    {item.attributes && item.attributes.length > 0 ? (
                      item.attributes.map(attr => {
                        console.log('Attribute:', attr);
                        const selectedItem = attr.items.find(i => i.id === item.selectedAttributes[attr.id]);
                        return (
                          <div key={attr.id} data-testid={`product-attribute-${toKebabCase(attr.name)}`}>
                            <p>{attr.name}: {selectedItem ? selectedItem.displayValue : 'Not selected'}</p>
                          </div>
                        );
                      })
                    ) : (
                      <div>No Attributes</div>
                    )}
                  </div>
                  <div className="quantity-controls">
                    <button onClick={() => incrementQuantity(index)}>+</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => decrementQuantity(index)}>-</button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="cart-total">
          <h3>Total: {totalPrice}</h3>
        </div>
        <button
          className="place-order-btn"
          onClick={placeOrder}
          disabled={totalItems === 0}
        >
          Place Order
        </button>
      </div>
      <div className="cart-overlay-background" onClick={toggleCartOverlay}></div>
    </div>
  ) : null;
};

export default CartOverlay;
