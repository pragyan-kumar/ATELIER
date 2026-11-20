import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { CATEGORIES } from '../constants';
import { allProducts } from '../data/products';
import SectionHeader from '../components/SectionHeader';
import { handleImageError } from '../utils';
import styles from './Categories.module.css';

// short blurb for each category shown on the card
const categoryDescriptions = {
  'mens-clothing': 'Refined tailoring, structured overcoats, and organic cotton essentials for everyday precision.',
  'womens-clothing': 'Fluid silhouettes, pure mulberry silk wrap dresses, and sculptural layering pieces.',
  accessories: 'Full-grain leather accessories, polarized optics, and minimalist Swiss-movement timepieces.',
  footwear: 'Handcrafted leather Chelsea boots, cushioned performance runners, and Italian suede loafers.',
  bags: 'Top-tier vegetable-tanned leather totes, weekender duffels, and tech-ready urban daypacks.',
  electronics: 'Acoustic studio-grade headphones, smart wearables, and sleek everyday computing companions.',
};

export default function Categories() {
  return (
    <div className={styles.categoriesPage}>
      <div className="container">
        <SectionHeader
          title="Browse All Departments"
          subtitle="Explore our comprehensive catalogue organized into focused lifestyle collections"
        />

        <div className={styles.grid}>
          {CATEGORIES.map((cat) => {
            const count = allProducts.filter((p) => p.category === cat.slug).length;
            const desc = categoryDescriptions[cat.slug] || 'Explore the complete collection.';

            return (
              <div key={cat.slug} className={styles.card}>
                <div className={styles.imageWrap}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className={styles.image}
                    onError={handleImageError}
                  />
                  <span className={styles.countBadge}>{count} Products</span>
                </div>
                <div className={styles.content}>
                  <h3 className={styles.name}>{cat.name}</h3>
                  <p className={styles.description}>{desc}</p>
                  <Link to={`/shop?category=${cat.slug}`} className={styles.link}>
                    Explore Collection <FiArrowRight />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
