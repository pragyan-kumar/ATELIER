import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiCheck } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, calcDiscount, handleImageError } from '../utils';
import Rating from './Rating';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);
  const finalPrice = calcDiscount(product.price, product.discount);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!inWishlist) {
      addToast(`Added "${product.name}" to wishlist`);
    } else {
      addToast(`Removed "${product.name}" from wishlist`, 'info');
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // fall back to sensible defaults if no size/color options
    const defaultSize = product.sizes?.[0] || 'Standard';
    const defaultColor = product.colors?.[0] || '#000000';

    addToCart(product, defaultSize, defaultColor, 1);
    setIsAdded(true);
    addToast(`Added "${product.name}" to bag`);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Link to={`/product/${product.slug}`} className={styles.imageLink} aria-label={product.name}>
          <img
            src={product.images?.[0]}
            alt={product.name}
            className={styles.image}
            loading="lazy"
            onError={handleImageError}
          />
          {product.images?.[1] && (
            <img
              src={product.images[1]}
              alt={`${product.name} alternate view`}
              className={styles.imageHover}
              loading="lazy"
              onError={handleImageError}
            />
          )}
        </Link>

        {product.discount > 0 && (
          <span className={styles.badge}>-{product.discount}%</span>
        )}

        <button
          type="button"
          className={`${styles.wishlistBtn} ${inWishlist ? styles.activeWishlist : ''}`}
          onClick={handleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FiHeart className={inWishlist ? styles.heartFilled : ''} />
        </button>

        <button
          type="button"
          className={styles.quickAddBtn}
          onClick={handleQuickAdd}
          aria-label="Quick add to bag"
        >
          {isAdded ? (
            <><FiCheck /> Added</>
          ) : (
            <><FiShoppingBag /> Quick Add</>
          )}
        </button>
      </div>

      <div className={styles.details}>
        <span className={styles.category}>{product.category.replace('-', ' ')}</span>
        <h3 className={styles.title}>
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        <div className={styles.ratingRow}>
          <Rating rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(finalPrice)}</span>
          {product.discount > 0 && (
            <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
