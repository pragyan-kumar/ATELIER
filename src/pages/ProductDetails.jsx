import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiHeart,
  FiShoppingBag,
  FiCheck,
  FiTruck,
  FiShield,
  FiChevronRight,
  FiMinus,
  FiPlus,
  FiShare2,
} from 'react-icons/fi';
import { getProductBySlug, allProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { calcDiscount, formatPrice, handleImageError } from '../utils';
import Rating from '../components/Rating';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import styles from './ProductDetails.module.css';

export default function ProductDetails() {
  const { slug } = useParams();
  const product = useMemo(() => getProductBySlug(slug), [slug]);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [newReview, setNewReview] = useState({ name: '', comment: '', rating: 5 });
  const [submittedReview, setSubmittedReview] = useState(false);

  if (!product) {
    return (
      <div className={styles.notFoundContainer}>
        <div className="container">
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist or has been retired.</p>
          <Link to="/shop">
            <Button variant="primary">Return to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const finalPrice = calcDiscount(product.price, product.discount);
  const inWishlist = isInWishlist(product.id);

  // Related products
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Image zoom handler
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)',
    });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomStyle({ transformOrigin: 'center center', transform: 'scale(1)' });
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    addToast(`Added ${quantity} × "${product.name}" (${selectedSize}) to bag`);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
    if (!inWishlist) {
      addToast(`Saved "${product.name}" to your wishlist`);
    } else {
      addToast(`Removed "${product.name}" from wishlist`, 'info');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      addToast('Please enter your name and a comment', 'error');
      return;
    }
    setSubmittedReview(true);
    addToast('Review submitted for moderation! Thank you for your feedback.');
    setNewReview({ name: '', comment: '', rating: 5 });
  };

  return (
    <div className={styles.productPage}>
      <div className="container">
        {/* Breadcrumbs */}
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight className={styles.breadIcon} />
          <Link to="/shop">Shop</Link>
          <FiChevronRight className={styles.breadIcon} />
          <Link to={`/shop?category=${product.category}`}>
            {product.category.replace('-', ' ')}
          </Link>
          <FiChevronRight className={styles.breadIcon} />
          <span className={styles.breadCurrent}>{product.name}</span>
        </nav>

        {/* Product Main Section */}
        <div className={styles.mainGrid}>
          {/* Gallery Column */}
          <div className={styles.galleryCol}>
            <div
              className={styles.mainImageWrap}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={product.images[activeImageIdx]}
                alt={product.name}
                className={styles.mainImage}
                style={isZoomed ? zoomStyle : undefined}
                onError={handleImageError}
              />
              {product.discount > 0 && (
                <span className={styles.discountBadge}>-{product.discount}%</span>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className={styles.thumbStrip}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.thumbBtn} ${activeImageIdx === idx ? styles.activeThumb : ''}`}
                  onClick={() => setActiveImageIdx(idx)}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} onError={handleImageError} />
                </button>
              ))}
            </div>
          </div>

          {/* Details Column */}
          <div className={styles.detailsCol}>
            <span className={styles.categoryTag}>{product.category.replace('-', ' ')}</span>
            <h1 className={styles.productName}>{product.name}</h1>

            <div className={styles.ratingSection}>
              <Rating rating={product.rating} reviewCount={product.reviewCount} />
              <span className={styles.stockStatus}>
                <span className={styles.stockDot} /> In Stock ({product.stock} available)
              </span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.currentPrice}>{formatPrice(finalPrice)}</span>
              {product.discount > 0 && (
                <>
                  <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
                  <span className={styles.savedAmount}>
                    Save {formatPrice(product.price - finalPrice)}
                  </span>
                </>
              )}
            </div>

            <p className={styles.shortDescription}>{product.description}</p>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className={styles.optionSection}>
                <label className={styles.optionLabel}>
                  Color:{' '}
                  <span className={styles.optionValue}>
                    {selectedColor.toUpperCase()}
                  </span>
                </label>
                <div className={styles.colorSwatches}>
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`${styles.colorSwatch} ${selectedColor === color ? styles.activeSwatch : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className={styles.optionSection}>
                <div className={styles.sizeHeader}>
                  <label className={styles.optionLabel}>Select Size</label>
                  <span className={styles.sizeGuideLink}>Size Guide</span>
                </div>
                <div className={styles.sizeChips}>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`${styles.sizeChip} ${selectedSize === size ? styles.activeSize : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className={styles.purchaseControls}>
              <div className={styles.quantityPicker}>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className={styles.qtyBtn}
                  aria-label="Decrease quantity"
                >
                  <FiMinus />
                </button>
                <span className={styles.qtyDisplay}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className={styles.qtyBtn}
                  aria-label="Increase quantity"
                >
                  <FiPlus />
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
              >
                <FiShoppingBag /> Add to Bag
              </Button>

              <button
                type="button"
                className={`${styles.wishlistIconBtn} ${inWishlist ? styles.activeWishlist : ''}`}
                onClick={handleWishlistToggle}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <FiHeart style={{ fill: inWishlist ? 'currentColor' : 'none' }} />
              </button>

              <button
                type="button"
                className={styles.shareBtn}
                onClick={handleShare}
                aria-label="Share product"
              >
                <FiShare2 />
              </button>
            </div>

            {/* Delivery & Assurance info */}
            <div className={styles.perksCard}>
              <div className={styles.perk}>
                <FiTruck className={styles.perkIcon} />
                <div>
                  <strong>Standard Shipping (2–4 Business Days)</strong>
                  <p>Free delivery on orders over $100</p>
                </div>
              </div>
              <div className={styles.perk}>
                <FiShield className={styles.perkIcon} />
                <div>
                  <strong>ATELIER Quality Guarantee</strong>
                  <p>Certified craftsmanship with free returns for 30 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Info Section: Reviews, Specs, Care */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabHeaders}>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'description' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Full Specifications
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Verified Reviews ({product.reviews?.length || 0})
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'care' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('care')}
            >
              Care & Longevity
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'description' && (
              <div className={styles.specsTab}>
                <p className={styles.specLead}>{product.description}</p>
                <ul className={styles.specsList}>
                  <li><strong>Category:</strong> {product.category.replace('-', ' ')}</li>
                  <li><strong>Material Composition:</strong> 100% sustainably-harvested premium fibers</li>
                  <li><strong>Fit:</strong> Contemporary tailored silhouette</li>
                  <li><strong>Origin:</strong> Designed in Milan, assembled in specialized ateliers</li>
                  <li><strong>Item Reference:</strong> ATELIER-{product.id}-{product.slug.toUpperCase()}</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className={styles.reviewsTab}>
                <div className={styles.reviewsList}>
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev) => (
                      <div key={rev.id} className={styles.reviewItem}>
                        <div className={styles.reviewHeader}>
                          <Rating rating={rev.rating} />
                          <span className={styles.reviewDate}>{rev.date}</span>
                        </div>
                        <h4 className={styles.reviewAuthor}>{rev.author}</h4>
                        <p className={styles.reviewText}>{rev.text}</p>
                      </div>
                    ))
                  ) : (
                    <p>No customer reviews yet. Be the first to share your thoughts!</p>
                  )}
                </div>

                <div className={styles.addReviewBox}>
                  <h3 className={styles.addReviewTitle}>Write a Review</h3>
                  {submittedReview ? (
                    <p className={styles.reviewSuccessMsg}>
                      <FiCheck /> Thank you! Your review has been submitted for verification.
                    </p>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
                      <div>
                        <label className={styles.formLabel}>Your Name</label>
                        <input
                          type="text"
                          value={newReview.name}
                          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                          placeholder="e.g. Eleanor Vance"
                          className={styles.formInput}
                          required
                        />
                      </div>

                      <div>
                        <label className={styles.formLabel}>Rating</label>
                        <select
                          value={newReview.rating}
                          onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                          className={styles.formSelect}
                        >
                          <option value="5">5 Stars — Outstanding</option>
                          <option value="4">4 Stars — Very Good</option>
                          <option value="3">3 Stars — Average</option>
                          <option value="2">2 Stars — Below Expectations</option>
                          <option value="1">1 Star — Poor</option>
                        </select>
                      </div>

                      <div>
                        <label className={styles.formLabel}>Your Experience</label>
                        <textarea
                          rows="4"
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          placeholder="Share the texture, sizing, comfort, and general impressions..."
                          className={styles.formTextarea}
                          required
                        />
                      </div>

                      <Button type="submit" variant="primary" size="md">
                        Submit Review
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className={styles.careTab}>
                <h4>Preserving Your Garment</h4>
                <p>
                  ATELIER products are engineered with organic raw ingredients that reward mindful maintenance:
                </p>
                <ul className={styles.careList}>
                  <li>Dry clean gently or hand-wash in cold water with non-alkaline detergent.</li>
                  <li>Do not wring or tumble dry; dry flat on a clean terry towel in the shade.</li>
                  <li>Steam iron on low setting through a protective press cloth.</li>
                  <li>Store in breathable cotton garment covers away from direct ultraviolet sunlight.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>You May Also Appreciate</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
