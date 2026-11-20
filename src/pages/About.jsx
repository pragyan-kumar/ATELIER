import { Link } from 'react-router-dom';
import { FiArrowRight, FiAward, FiFeather, FiGlobe, FiHeart } from 'react-icons/fi';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';
import { handleImageError } from '../utils';
import styles from './About.module.css';

export default function About() {
  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <span className={styles.tagline}>Our Heritage & Philosophy</span>
          <h1 className={styles.title}>Crafted for Modern Permanence</h1>
          <p className={styles.lead}>
            Founded on the conviction that everyday objects should command respect through intentional design,
            uncompromising material integrity, and ethical creation.
          </p>
        </div>
      </section>

      {/* Visual Editorial Banner */}
      <section className={styles.imageBanner}>
        <div className="container">
          <div className={styles.imageGrid}>
            <img
              src="/images/about/workshop.jpg"
              alt="Atelier workshop"
              className={styles.mainImg}
              onError={handleImageError}
            />
            <div className={styles.sideImages}>
              <img
                src="/images/about/fabrics.jpg"
                alt="Fabric cutting detail"
                onError={handleImageError}
              />
              <img
                src="/images/about/tailoring.jpg"
                alt="Tailoring craftsmanship"
                onError={handleImageError}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Story Narrative */}
      <section className={styles.narrativeSection}>
        <div className="container">
          <div className={styles.narrativeGrid}>
            <div>
              <h2 className={styles.narrativeHeading}>
                Eliminating the Superfluous to Reveal Pure Substance
              </h2>
            </div>
            <div className={styles.narrativeBody}>
              <p>
                In a fashion landscape dominated by ephemeral cycles and synthetic shortcuts, ATELIER was established
                as an antidote. We partner directly with historic textile mills in northern Italy, Portugal, and
                Japan that have preserved multi-generational weaving expertise.
              </p>
              <p>
                Every silhouette undergoes rigorous fitting iterations before entering production. We test drape,
                seam tension, breathability, and wash longevity to guarantee that each piece ages with dignity
                rather than wearing down.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars / Values */}
      <section className={styles.valuesSection}>
        <div className="container">
          <SectionHeader
            title="Our Foundational Standards"
            subtitle="The non-negotiable commitments behind every single product bearing the ATELIER label"
          />

          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <FiFeather className={styles.valueIcon} />
              <h3 className={styles.valueTitle}>Traceable Raw Materials</h3>
              <p className={styles.valueText}>
                From organic GOTS-certified long-staple cotton to ethically shorn Grade-A cashmere, our supply chain is transparent from farm to seam.
              </p>
            </div>

            <div className={styles.valueCard}>
              <FiAward className={styles.valueIcon} />
              <h3 className={styles.valueTitle}>Uncompromising Craft</h3>
              <p className={styles.valueText}>
                Hand-finished hems, reinforced stress points, and custom horn buttons. Details that remain invisible until you wear them.
              </p>
            </div>

            <div className={styles.valueCard}>
              <FiGlobe className={styles.valueIcon} />
              <h3 className={styles.valueTitle}>Zero Compromise Sustainability</h3>
              <p className={styles.valueText}>
                Plastic-free biodegradable packaging, closed-loop water treatment in dye houses, and carbon-neutral global logistics.
              </p>
            </div>

            <div className={styles.valueCard}>
              <FiHeart className={styles.valueIcon} />
              <h3 className={styles.valueTitle}>Patron-First Philosophy</h3>
              <p className={styles.valueText}>
                Dedicated concierge service, 30-day effortless returns, and complimentary lifetime repairs on our outerwear silhouettes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metric Milestones */}
      <section className={styles.metricsSection}>
        <div className="container">
          <div className={styles.metricsGrid}>
            <div className={styles.metricItem}>
              <span className={styles.metricNumber}>100%</span>
              <span className={styles.metricLabel}>Organic & Recycled Fibers</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricNumber}>45+</span>
              <span className={styles.metricLabel}>Global Atelier Partners</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricNumber}>98.4%</span>
              <span className={styles.metricLabel}>Customer Satisfaction</span>
            </div>
            <div className={styles.metricItem}>
              <span className={styles.metricNumber}>35k+</span>
              <span className={styles.metricLabel}>Patrons Worldwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Experience the Collection Firsthand</h2>
            <p className={styles.ctaText}>
              Discover garments engineered with intention, proportion, and quiet confidence.
            </p>
            <Link to="/shop">
              <Button variant="primary" size="lg">
                Explore The Shop <FiArrowRight style={{ marginLeft: 8 }} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
