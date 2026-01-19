'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Cart, CartItem } from '@/types/cart';
import { formatCurrency, calculateTotal } from '@/lib/currency';

export default function CartClient() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountMessage, setDiscountMessage] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      setCart(JSON.parse(cartData));
    } else {
      setCart({ items: [], currency: 'USD' });
    }
  }, []);

  const removeItem = (index: number) => {
    if (!cart) return;

    const updatedCart = {
      ...cart,
      items: cart.items.filter((_, i) => i !== index),
    };

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const applyDiscount = async () => {
    if (!discountCode.trim()) return;

    try {
      const response = await fetch(`/api/discount/${discountCode}`);
      const data = await response.json();

      if (data.valid && cart) {
        const subtotal = cart.items.reduce((sum, item) => sum + item.price, 0);
        const discountAmount = subtotal * ((data.percentage || 0) / 100);

        setCart({
          ...cart,
          discountCode: discountCode,
          discountAmount: discountAmount,
        });

        localStorage.setItem(
          'cart',
          JSON.stringify({
            ...cart,
            discountCode,
            discountAmount,
          })
        );

        setDiscountMessage(`Discount applied: ${data.percentage}% off!`);
      } else {
        setDiscountMessage('Invalid discount code');
      }
    } catch (error) {
      console.error('Failed to apply discount:', error);
      setDiscountMessage('Failed to apply discount code');
    }
  };

  const proceedToCheckout = () => {
    setIsCheckingOut(true);
    // In a real app, this would navigate to checkout
    // For now, we'll show a message
    alert('Checkout functionality will be implemented in the next phase');
    setIsCheckingOut(false);
  };

  if (!cart) {
    return (
      <div className="loading">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-5">
        <h2>Your cart is empty</h2>
        <p className="text-muted">Add some products to get started!</p>
        <a href="/" className="btn btn-primary mt-3">
          Browse Products
        </a>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.price, 0);
  const discount = cart.discountAmount || 0;
  const shipping = 10; // Placeholder
  const tax = (subtotal - discount + shipping) * 0.1; // Placeholder 10% tax
  const total = calculateTotal({
    subtotal,
    shipping,
    discount,
    tax,
  });

  return (
    <div className="row">
      <div className="col-md-8">
        <h1 className="mb-4">Shopping Cart</h1>

        {cart.items.map((item, index) => (
          <div key={index} className="cart-item">
            <div className="row align-items-center">
              <div className="col-md-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="img-fluid rounded"
                />
              </div>
              <div className="col-md-6">
                <h5>{item.name}</h5>
                <p className="text-muted mb-0">{item.variantName}</p>
              </div>
              <div className="col-md-2 text-end">
                <strong>
                  {formatCurrency(item.price, item.currency)}
                </strong>
              </div>
              <div className="col-md-2 text-end">
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="col-md-4">
        <div className="order-summary">
          <h4 className="mb-3">Order Summary</h4>

          <div className="summary-row">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal, cart.currency)}</span>
          </div>

          {discount > 0 && (
            <div className="summary-row text-success">
              <span>Discount:</span>
              <span>-{formatCurrency(discount, cart.currency)}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Shipping:</span>
            <span>{formatCurrency(shipping, cart.currency)}</span>
          </div>

          <div className="summary-row">
            <span>Tax (est.):</span>
            <span>{formatCurrency(tax, cart.currency)}</span>
          </div>

          <div className="summary-row total">
            <span>Total:</span>
            <span>{formatCurrency(total, cart.currency)}</span>
          </div>

          <div className="mt-3">
            <label className="form-label">Discount Code</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                disabled={!!cart.discountCode}
              />
              <button
                className="btn btn-outline-secondary"
                onClick={applyDiscount}
                disabled={!!cart.discountCode}
              >
                Apply
              </button>
            </div>
            {discountMessage && (
              <small
                className={
                  discountMessage.includes('applied')
                    ? 'text-success'
                    : 'text-danger'
                }
              >
                {discountMessage}
              </small>
            )}
          </div>

          <button
            className="btn btn-primary w-100 mt-3"
            onClick={proceedToCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
          </button>

          <a href="/" className="btn btn-outline-secondary w-100 mt-2">
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
}
