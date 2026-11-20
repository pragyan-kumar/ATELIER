import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiArrowRight,
  FiShoppingBag,
  FiTag,
  FiCheck,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import {
  calcDiscount,
  formatPrice,
  handleImageError,
} from '../utils';
import {
  COUPON_CODES,
  SHIPPING_COST,
  FREE_SHIPPING_THRESHOLD,
  TAX_RATE,
} from '../constants';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import styles from './Cart.module.css';

export default function Cart() {
  const {
    items,
    coupon,
    updateQty,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { addToast } = useToast();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Calculate Subtotal
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = calcDiscount(item.price, item.discount);
    return sum + itemPrice * item.qty;
  }, 0);

  // Calculate Coupon Discount
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

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');

    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (COUPON_CODES[code]) {
      applyCoupon({ code, ...COUPON_CODES[code] });
      addToast(`Coupon "${code}" applied: ${COUPON_CODES[code].label}`);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try SAVE10, FLAT20, or ATELIER15.');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    addToast('Coupon removed', 'info');
  };

  if (items.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className="container">
          <EmptyState
            icon={FiShoppingBag}
            title="Your Shopping Bag is Empty"
            description="Explore our latest collections and find wardrobe staples that speak to you."
            actionLabel="Start Shopping"
            onAction={() => navigate('/shop')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className="container">
        <h1 className={styles.pageTitle}>Shopping Bag ({items.length})</h1>

        <div className={styles.cartGrid}>
          {/* Items Table */}
          <div className={styles.itemsCol}>
            <div className={styles.itemsHeader}>
              <span>Product</span>
              <span className={styles.headerQty}>Quantity</span>
              <span className={styles.headerTotal}>Total</span>
            </div>

            <div className={styles.itemsList}>
              {items.map((item) => {
                const itemPrice = calcDiscount(item.price, item.discount);
                const lineTotal = itemPrice * item.qty;

                return (
                  <div key={item.cartId} className={styles.cartItem}>
                    <div className={styles.productCell}>
                      <Link to={`/product/${item.slug}`} className={styles.itemImageLink}>
                        <img src={item.image} alt={item.name} className={styles.itemImg} onError={handleImageError} />
                      </Link>

                      <div className={styles.itemInfo}>
                        <h3 className={styles.itemName}>
                          <Link to={`/product/${item.slug}`}>{item.name}</Link>
                        </h3>

                        <div className={styles.itemSpecs}>
                          {item.size && <span>Size: <strong>{item.size}</strong></span>}
                          {item.color && (
                            <span className={styles.colorPill}>
                              Color: <span className={styles.colorCircle} style={{ backgroundColor: item.color }} />
                            </span>
                          )}
                        </div>

                        <div className={styles.itemPriceMobile}>
                          {formatPrice(itemPrice)}
                          {item.discount > 0 && (
                            <span className={styles.origPrice}>{formatPrice(item.price)}</span>
                          )}
                        </div>

                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => {
                            removeFromCart(item.cartId);
                            addToast(`Removed "${item.name}" from bag`, 'info');
                          }}
                        >
                          <FiTrash2 /> Remove
                        </button>
                      </div>
                    </div>

                    <div className={styles.qtyCell}>
                      <div className={styles.qtyPicker}>
                        <button
                          type="button"
                          onClick={() => updateQty(item.cartId, item.qty - 1)}
                          className={styles.qtyBtn}
                          disabled={item.qty <= 1}
                          aria-label="Decrease quantity"
                        >
                          <FiMinus />
                        </button>
                        <span className={styles.qtyValue}>{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.cartId, item.qty + 1)}
                          className={styles.qtyBtn}
                          disabled={item.qty >= item.stock}
                          aria-label="Increase quantity"
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>

                    <div className={styles.totalCell}>
                      <span className={styles.lineTotal}>{formatPrice(lineTotal)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.cartActionsBar}>
              <Link to="/shop">
                <Button variant="secondary" size="md">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className={styles.summaryCol}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>

              {/* Free Shipping Meter */}
              <div className={styles.shippingMeter}>
                {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                  <p className={styles.freeShipSuccess}>
                    <FiCheck /> You have qualified for free express shipping!
                  </p>
                ) : (
                  <p className={styles.freeShipPrompt}>
                    Add <strong>{formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> more to unlock Free Shipping
                  </p>
                )}
                <div className={styles.meterTrack}>
                  <div
                    className={styles.meterBar}
                    style={{
                      width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Breakdown */}
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {coupon && (
                <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                  <span>
                    Discount ({coupon.code})
                    <button
                      type="button"
                      className={styles.removeCouponLink}
                      onClick={handleRemoveCoupon}
                    >
                      Remove
                    </button>
                  </span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className={styles.summaryRow}>
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Estimated Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>

              <div className={`${styles.summaryRow} ${styles.grandTotalRow}`}>
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
                <div className={styles.couponInputWrap}>
                  <FiTag className={styles.couponIcon} />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code (SAVE10, FLAT20)"
                    className={styles.couponInput}
                  />
                  <button type="submit" className={styles.couponApplyBtn}>
                    Apply
                  </button>
                </div>
                {couponError && <span className={styles.couponError}>{couponError}</span>}
              </form>

              {/* Checkout CTA */}
              <Link to="/checkout" className={styles.checkoutLink}>
                <Button variant="primary" size="lg" fullWidth>
                  Proceed to Checkout <FiArrowRight style={{ marginLeft: 8 }} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
