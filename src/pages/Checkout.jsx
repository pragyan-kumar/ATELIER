import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiLock,
  FiCreditCard,
  FiTruck,
  FiCheck,
  FiShield,
  FiChevronLeft,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { calcDiscount, formatPrice, setToStorage, handleImageError } from '../utils';
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD, TAX_RATE } from '../constants';
import Button from '../components/Button';
import styles from './Checkout.module.css';

export default function Checkout() {
  const { items, coupon, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    cardNumber: '',
    cardExp: '',
    cardCvv: '',
  });

  // Calculate numbers
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = calcDiscount(item.price, item.discount);
    return sum + itemPrice * item.qty;
  }, 0);

  let discountAmount = 0;
  if (coupon) {
    if (coupon.type === 'percent') {
      discountAmount = (subtotal * coupon.value) / 100;
    } else if (coupon.type === 'flat') {
      discountAmount = Math.min(coupon.value, subtotal);
    }
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * TAX_RATE;
  const grandTotal = taxableAmount + shipping + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address) {
      addToast('Please fill out all required contact and shipping details.', 'error');
      return;
    }

    if (paymentMethod === 'card' && (!formData.cardNumber || !formData.cardExp || !formData.cardCvv)) {
      addToast('Please complete all payment card fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate 1.2s smooth processing
    setTimeout(() => {
      const orderNumber = `AT-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderData = {
        orderNumber,
        items,
        subtotal,
        discountAmount,
        shipping,
        tax,
        grandTotal,
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
        paymentMethod,
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      };

      setToStorage('atelier_last_order', orderData);
      clearCart();
      setIsSubmitting(false);
      navigate('/order-success');
    }, 1200);
  };

  if (items.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className="container">
          <h2>No items in bag to checkout</h2>
          <p>Please select items before proceeding to checkout.</p>
          <Link to="/shop">
            <Button variant="primary">Return to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <div className="container">
        <div className={styles.header}>
          <Link to="/cart" className={styles.backLink}>
            <FiChevronLeft /> Back to bag
          </Link>
          <span className={styles.securityBadge}>
            <FiLock /> 256-Bit SSL Encrypted Checkout
          </span>
        </div>

        <form onSubmit={handleSubmit} className={styles.checkoutForm}>
          <div className={styles.formCol}>
            {/* Step 1: Contact Information */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Contact Information</h2>
              <div className={styles.formGrid}>
                <div className={styles.fullWidth}>
                  <label className={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@domain.com"
                    className={styles.input}
                    required
                  />
                </div>
                <div>
                  <label className={styles.label}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className={styles.input}
                  />
                </div>
              </div>
            </section>

            {/* Step 2: Shipping Address */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Shipping Address</h2>
              <div className={styles.formGrid}>
                <div>
                  <label className={styles.label}>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Eleanor"
                    className={styles.input}
                    required
                  />
                </div>
                <div>
                  <label className={styles.label}>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Vance"
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.fullWidth}>
                  <label className={styles.label}>Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Luxury Avenue, Suite 400"
                    className={styles.input}
                    required
                  />
                </div>
                <div>
                  <label className={styles.label}>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                    className={styles.input}
                    required
                  />
                </div>
                <div>
                  <label className={styles.label}>State / Province *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="NY"
                    className={styles.input}
                    required
                  />
                </div>
                <div>
                  <label className={styles.label}>Postal Code *</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    placeholder="10001"
                    className={styles.input}
                    required
                  />
                </div>
                <div>
                  <label className={styles.label}>Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                  </select>
                </div>
              </div>

              <div className={styles.checkboxWrap}>
                <label className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={sameAsBilling}
                    onChange={(e) => setSameAsBilling(e.target.checked)}
                  />
                  <span>Billing address is identical to shipping address</span>
                </label>
              </div>
            </section>

            {/* Step 3: Payment Method */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Payment Method</h2>

              <div className={styles.paymentOptions}>
                <label className={`${styles.paymentOpt} ${paymentMethod === 'card' ? styles.activeOpt : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <span>Credit / Debit Card</span>
                </label>
                <label className={`${styles.paymentOpt} ${paymentMethod === 'paypal' ? styles.activeOpt : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                  />
                  <span>PayPal</span>
                </label>
                <label className={`${styles.paymentOpt} ${paymentMethod === 'apple' ? styles.activeOpt : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="apple"
                    checked={paymentMethod === 'apple'}
                    onChange={() => setPaymentMethod('apple')}
                  />
                  <span>Apple Pay</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className={styles.cardFields}>
                  <div className={styles.fullWidth}>
                    <label className={styles.label}>Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="4000 1234 5678 9010"
                      maxLength="19"
                      className={styles.input}
                      required={paymentMethod === 'card'}
                    />
                  </div>
                  <div className={styles.halfWidth}>
                    <label className={styles.label}>Expiration (MM/YY) *</label>
                    <input
                      type="text"
                      name="cardExp"
                      value={formData.cardExp}
                      onChange={handleChange}
                      placeholder="08/28"
                      maxLength="5"
                      className={styles.input}
                      required={paymentMethod === 'card'}
                    />
                  </div>
                  <div className={styles.halfWidth}>
                    <label className={styles.label}>Security Code (CVV) *</label>
                    <input
                      type="password"
                      name="cardCvv"
                      value={formData.cardCvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength="4"
                      className={styles.input}
                      required={paymentMethod === 'card'}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <p className={styles.paymentNotice}>
                  You will be directed to PayPal to authenticate your transaction securely upon placing your order.
                </p>
              )}

              {paymentMethod === 'apple' && (
                <p className={styles.paymentNotice}>
                  Touch ID / Face ID prompt will trigger after clicking Place Order.
                </p>
              )}
            </section>
          </div>

          {/* Sidebar Summary */}
          <div className={styles.sidebarCol}>
            <div className={styles.summaryBox}>
              <h3 className={styles.summaryHeading}>In Your Order ({items.length})</h3>

              <div className={styles.itemsScroll}>
                {items.map((item) => {
                  const finalPrice = calcDiscount(item.price, item.discount);
                  return (
                    <div key={item.cartId} className={styles.summaryItem}>
                      <div className={styles.summaryImgWrap}>
                        <img src={item.image} alt={item.name} onError={handleImageError} />
                        <span className={styles.summaryQtyBadge}>{item.qty}</span>
                      </div>
                      <div className={styles.summaryItemDetails}>
                        <h4 className={styles.summaryItemName}>{item.name}</h4>
                        <span className={styles.summaryItemMeta}>
                          {item.size} • {item.color}
                        </span>
                      </div>
                      <span className={styles.summaryItemPrice}>
                        {formatPrice(finalPrice * item.qty)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className={styles.totalsTable}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className={`${styles.totalRow} ${styles.greenRow}`}>
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className={styles.totalRow}>
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Taxes (8%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                  <span>Total Due</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={isSubmitting}
                className={styles.placeOrderBtn}
              >
                {isSubmitting ? 'Authenticating Order...' : `Place Order • ${formatPrice(grandTotal)}`}
              </Button>

              <div className={styles.guaranteeText}>
                <FiShield /> 100% Secure Checkout with 30-Day Money Back Guarantee
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
