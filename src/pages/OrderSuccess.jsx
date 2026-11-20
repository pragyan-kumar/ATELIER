import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiTruck, FiPrinter, FiArrowRight } from 'react-icons/fi';
import { getFromStorage, formatPrice, handleImageError } from '../utils';
import Button from '../components/Button';
import styles from './OrderSuccess.module.css';

export default function OrderSuccess() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const saved = getFromStorage('atelier_last_order');
    if (saved) {
      setOrder(saved);
    } else {
      // fallback demo order if nothing in storage (e.g. direct navigation)
      setOrder({
        orderNumber: 'AT-849201',
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        grandTotal: 289.0,
        shippingAddress: {
          name: 'Eleanor Vance',
          email: 'eleanor.vance@example.com',
          address: '742 Evergreen Terrace',
          city: 'New York',
          state: 'NY',
          zip: '10001',
        },
        items: [
          {
            cartId: '1-M-#FFFFFF',
            name: 'Classic Oxford Shirt',
            price: 89,
            qty: 1,
            size: 'M',
            color: '#FFFFFF',
            image: '/images/products/classic-oxford-shirt-1.jpg',
          },
          {
            cartId: '15-9-#1C1C1C',
            name: 'Chelsea Boots',
            price: 200,
            qty: 1,
            size: '9',
            color: '#1C1C1C',
            image: '/images/products/chelsea-boots-1.jpg',
          },
        ],
      });
    }
  }, []);

  if (!order) return null;

  return (
    <div className={styles.successPage}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <FiCheckCircle className={styles.successIcon} />
          </div>

          <span className={styles.statusBadge}>Order Confirmed</span>
          <h1 className={styles.title}>Thank You For Your Order</h1>
          <p className={styles.subtitle}>
            We have dispatched an order receipt and tracking updates to{' '}
            <strong>{order.shippingAddress?.email || 'your email'}</strong>.
          </p>

          <div className={styles.metaStrip}>
            <div className={styles.metaItem}>
              <span>Order Number</span>
              <strong>{order.orderNumber}</strong>
            </div>
            <div className={styles.metaItem}>
              <span>Date Placed</span>
              <strong>{order.date}</strong>
            </div>
            <div className={styles.metaItem}>
              <span>Total Amount</span>
              <strong>{formatPrice(order.grandTotal)}</strong>
            </div>
            <div className={styles.metaItem}>
              <span>Estimated Arrival</span>
              <strong>3–5 Business Days</strong>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.itemsSection}>
              <h3 className={styles.sectionTitle}>
                <FiPackage /> Purchased Silhouettes
              </h3>
              <div className={styles.itemsList}>
                {order.items?.map((item) => (
                  <div key={item.cartId} className={styles.itemRow}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.itemImg}
                      onError={handleImageError}
                    />
                    <div className={styles.itemInfo}>
                      <h4 className={styles.itemName}>{item.name}</h4>
                      <p className={styles.itemSpecs}>
                        Qty: {item.qty} {item.size && `• Size: ${item.size}`}
                      </p>
                    </div>
                    <span className={styles.itemPrice}>
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.shippingSection}>
              <h3 className={styles.sectionTitle}>
                <FiTruck /> Destination Address
              </h3>
              <div className={styles.addressBox}>
                <p><strong>{order.shippingAddress?.name}</strong></p>
                <p>{order.shippingAddress?.address}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                  {order.shippingAddress?.zip}
                </p>
                <p className={styles.deliveryNote}>
                  Carrier signature required upon receipt. Tracking link will activate in 24 hours.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.actionsBar}>
            <Link to="/shop">
              <Button variant="primary" size="lg">
                Continue Exploring <FiArrowRight style={{ marginLeft: 8 }} />
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.print()}
              className={styles.printBtn}
            >
              <FiPrinter /> Print Receipt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
