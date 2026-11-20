import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { getRatingStars } from '../utils';
import styles from './Rating.module.css';

export default function Rating({ rating, reviewCount }) {
  const { full, half, empty } = getRatingStars(rating);

  return (
    <div className={styles.rating}>
      <div className={styles.stars}>
        {[...Array(full)].map((_, i) => (
          <FaStar key={`f-${i}`} className={styles.star} />
        ))}
        {half === 1 && <FaStarHalfAlt className={styles.star} />}
        {[...Array(empty)].map((_, i) => (
          <FaRegStar key={`e-${i}`} className={styles.starEmpty} />
        ))}
      </div>
      {reviewCount != null && (
        <span className={styles.count}>({reviewCount})</span>
      )}
    </div>
  );
}
