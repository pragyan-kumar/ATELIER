import { Link } from 'react-router-dom';
import { FiHome, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import Button from '../components/Button';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.notFoundPage}>
      <div className="container">
        <div className={styles.content}>
          <span className={styles.statusCode}>404</span>
          <h1 className={styles.title}>Page Not Found</h1>
          <p className={styles.subtitle}>
            The archive, product, or editorial page you sought has either relocated or never existed.
          </p>

          <div className={styles.actions}>
            <Link to="/">
              <Button variant="primary" size="lg">
                <FiHome /> Return Home
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="secondary" size="lg">
                <FiShoppingBag /> Browse Collection
              </Button>
            </Link>
          </div>

          <div className={styles.quickLinks}>
            <span>Popular Destinations:</span>
            <Link to="/shop?category=mens-clothing">Men</Link>
            <span>•</span>
            <Link to="/shop?category=womens-clothing">Women</Link>
            <span>•</span>
            <Link to="/shop?category=accessories">Accessories</Link>
            <span>•</span>
            <Link to="/contact">Client Concierge</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
