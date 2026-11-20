import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiShield, FiTruck, FiRefreshCw } from 'react-icons/fi';
import {
  getFeaturedProducts,
  getTrendingProducts,
  getBestSellers,
  getNewArrivals,
  testimonials,
  allProducts,
} from '../data/products';
import { CATEGORIES } from '../constants';
import ProductCard from '../components/ProductCard';
import SectionHeader from '../components/SectionHeader';
import ScrollReveal from '../components/ScrollReveal';
import Button from '../components/Button';
import Rating from '../components/Rating';
import { useToast } from '../context/ToastContext';
import { handleImageError } from '../utils';
import styles from './Home.module.css';

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 36,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (n) => String(n).padStart(2, '0');

  return (
    <div className={styles.timerWrapper}>
      <div className={styles.timerUnit}>
        <span className={styles.timerNumber}>{format(timeLeft.hours)}</span>
        <span className={styles.timerLabel}>Hours</span>
      </div>
      <span className={styles.timerColon}>:</span>
      <div className={styles.timerUnit}>
        <span className={styles.timerNumber}>{format(timeLeft.minutes)}</span>
        <span className={styles.timerLabel}>Mins</span>
      </div>
      <span className={styles.timerColon}>:</span>
      <div className={styles.timerUnit}>
        <span className={styles.timerNumber}>{format(timeLeft.seconds)}</span>
        <span className={styles.timerLabel}>Secs</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { addToast } = useToast();

  const featured = getFeaturedProducts().slice(0, 4);
  const trending = getTrendingProducts().slice(0, 4);
  const bestSellers = getBestSellers().slice(0, 4);
  const newArrivals = getNewArrivals().slice(0, 4);
  const dealProducts = allProducts.filter((p) => p.discount >= 15).slice(0, 3);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    addToast('Thank you for subscribing! Check your inbox for 10% off.');
    setEmail('');
  };

  return (
    <div className={styles.home}>
      {/* 1. Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <span className={styles.heroSubhead}>Spring / Summer 2026</span>
            <h1 className={styles.heroTitle}>
              Elegance in Every <br />
              Single Thread
            </h1>
            <p className={styles.heroDesc}>
              Explore our new architectural silhouettes, sustainable fabrics, and minimalist everyday staples.
            </p>
            <div className={styles.heroActions}>
              <Link to="/shop">
                <Button variant="primary" size="lg">
                  Explore Collection <FiArrowRight style={{ marginLeft: 8 }} />
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="secondary" size="lg" className={styles.heroSecondaryBtn}>
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className={styles.featuresBar}>
        <div className="container">
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <FiTruck className={styles.featureIcon} />
              <div>
                <h4 className={styles.featureTitle}>Complimentary Shipping</h4>
                <p className={styles.featureText}>On all continental orders over $100</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <FiShield className={styles.featureIcon} />
              <div>
                <h4 className={styles.featureTitle}>Authenticity Guaranteed</h4>
                <p className={styles.featureText}>100% verified premium craftsmanship</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <FiRefreshCw className={styles.featureIcon} />
              <div>
                <h4 className={styles.featureTitle}>30-Day Effortless Returns</h4>
                <p className={styles.featureText}>Prepaid return label with every box</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Products */}
      <section className={styles.section}>
        <div className="container">
          <SectionHeader
            title="Curated For You"
            subtitle="Hand-selected wardrobe cornerstones constructed with enduring elegance"
          />
          <ScrollReveal>
            <div className={styles.productGrid}>
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. Categories Grid */}
      <section className={`${styles.section} ${styles.altSection}`}>
        <div className="container">
          <SectionHeader
            title="Shop by Category"
            subtitle="Find exactly what suits your daily rhythm"
          />
          <ScrollReveal>
            <div className={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/shop?category=${cat.slug}`}
                  className={styles.categoryCard}
                >
                  <img src={cat.image} alt={cat.name} className={styles.categoryImage} onError={handleImageError} />
                  <div className={styles.categoryOverlay}>
                    <h3 className={styles.categoryName}>{cat.name}</h3>
                    <span className={styles.categoryLink}>
                      Explore <FiArrowRight />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. Trending Products */}
      <section className={styles.section}>
        <div className="container">
          <SectionHeader
            title="Trending Now"
            subtitle="Pieces capturing attention across our worldwide community"
          />
          <ScrollReveal>
            <div className={styles.productGrid}>
              {trending.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. Promotional Banner */}
      <section className={styles.promoBanner}>
        <div className="container">
          <div className={styles.promoInner}>
            <div className={styles.promoTextCol}>
              <span className={styles.promoTag}>Limited Capsule</span>
              <h2 className={styles.promoHeading}>The Cashmere & Wool Study</h2>
              <p className={styles.promoParagraph}>
                Crafted in northern Italy using ethically sheared long-staple yarns. Unrivaled insulation meets modern tailoring.
              </p>
              <Link to="/shop?category=mens-clothing">
                <Button variant="primary" size="md">
                  Shop The Capsule <FiArrowRight style={{ marginLeft: 6 }} />
                </Button>
              </Link>
            </div>
            <div className={styles.promoImgCol}>
              <img
                src="/images/banners/promo.jpg"
                alt="Cashmere and wool campaign"
                className={styles.promoImage}
                onError={handleImageError}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Best Sellers */}
      <section className={styles.section}>
        <div className="container">
          <SectionHeader
            title="Best Sellers"
            subtitle="The most-requested silhouettes, perfected over countless fittings"
          />
          <ScrollReveal>
            <div className={styles.productGrid}>
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 7. Limited Deals Section with Timer */}
      <section className={`${styles.section} ${styles.dealSection}`}>
        <div className="container">
          <div className={styles.dealHeader}>
            <div>
              <span className={styles.dealBadge}>
                <FiClock /> Flash Offer
              </span>
              <h2 className={styles.dealTitle}>Exclusive Mid-Season Pricing</h2>
              <p className={styles.dealSubtitle}>
                Save up to 25% on selected iconic styles before inventory refreshes.
              </p>
            </div>
            <CountdownTimer />
          </div>

          <div className={styles.dealGrid}>
            {dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. New Arrivals */}
      <section className={styles.section}>
        <div className="container">
          <SectionHeader
            title="New Arrivals"
            subtitle="Just landed styles fresh from our studio ateliers"
          />
          <ScrollReveal>
            <div className={styles.productGrid}>
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 9. Testimonials */}
      <section className={`${styles.section} ${styles.altSection}`}>
        <div className="container">
          <SectionHeader
            title="What Our Patrons Say"
            subtitle="Unfiltered feedback from clients across more than 40 countries"
          />
          <div className={styles.testimonialsGrid}>
            {testimonials.map((t) => (
              <div key={t.id} className={styles.testimonialCard}>
                <Rating rating={t.rating} />
                <p className={styles.testimonialQuote}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <strong>{t.name}</strong>
                  <span>{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Newsletter */}
      <section className={styles.newsletterSection}>
        <div className="container">
          <div className={styles.newsletterCard}>
            <span className={styles.newsletterBadge}>Private Editorial</span>
            <h2 className={styles.newsletterTitle}>Join The Collective</h2>
            <p className={styles.newsletterText}>
              Receive private preview invitations, seasonal style lookbooks, and 10% off your initial purchase.
            </p>

            {subscribed ? (
              <p className={styles.subscribedMsg}>
                Welcome to ATELIER. Please check your inbox to confirm your registration.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={styles.newsletterInput}
                  aria-label="Email address for newsletter"
                />
                <Button type="submit" variant="primary" size="md">
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
