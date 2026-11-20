import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, calcDiscount, handleImageError } from '../utils';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Rating from '../components/Rating';
import styles from './Wishlist.module.css';

export default function Wishlist() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleMoveToCart = (item) => {
    // use sensible defaults since wishlist items don't store size/color
    addToCart(
      {
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        discount: item.discount,
        images: [item.image],
        stock: 20,
      },
      'Standard',
      '#000000',
      1
    );
    removeFromWishlist(item.id);
    addToast(`Moved "${item.name}" to shopping bag`);
  };

  const handleRemove = (id, name) => {
    removeFromWishlist(id);
    addToast(`Removed "${name}" from wishlist`, 'info');
  };

  if (items.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className="container">
          <EmptyState
            icon={FiHeart}
            title="Your Wishlist is Empty"
            description="Keep track of pieces you adore. Tap the heart on any product to save it here for later."
            actionLabel="Explore Catalog"
            onAction={() => navigate('/shop')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wishlistPage}>
      <div className="container">
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>My Saved Items</h1>
            <p className={styles.subtitle}>
              {items.length} {items.length === 1 ? 'item' : 'items'} in your curated list
            </p>
          </div>

          <button
            type="button"
            className={styles.clearAllBtn}
            onClick={() => {
              clearWishlist();
              addToast('Cleared entire wishlist', 'info');
            }}
          >
            Clear Wishlist
          </button>
        </div>

        <div className={styles.grid}>
          {items.map((item) => {
            const finalPrice = calcDiscount(item.price, item.discount);

            return (
              <div key={item.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <Link to={`/product/${item.slug}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.image}
                      onError={handleImageError}
                    />
                  </Link>

                  <button
                    type="button"
                    className={styles.removeIconBtn}
                    onClick={() => handleRemove(item.id, item.name)}
                    aria-label="Remove item"
                  >
                    <FiTrash2 />
                  </button>

                  {item.discount > 0 && (
                    <span className={styles.discountBadge}>-{item.discount}%</span>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.productName}>
                    <Link to={`/product/${item.slug}`}>{item.name}</Link>
                  </h3>

                  {item.rating && (
                    <div className={styles.ratingRow}>
                      <Rating rating={item.rating} />
                    </div>
                  )}

                  <div className={styles.priceRow}>
                    <span className={styles.currentPrice}>{formatPrice(finalPrice)}</span>
                    {item.discount > 0 && (
                      <span className={styles.origPrice}>{formatPrice(item.price)}</span>
                    )}
                  </div>

                  <div className={styles.actions}>
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => handleMoveToCart(item)}
                    >
                      <FiShoppingBag /> Move to Bag
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
