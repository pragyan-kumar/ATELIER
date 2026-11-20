import { classNames } from '../utils';
import styles from './Skeleton.module.css';

export default function Skeleton({ width, height, variant = 'text', count = 1 }) {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className={classNames(styles.skeleton, styles[variant])}
          style={{
            width: width || undefined,
            height: height || undefined,
          }}
        />
      ))}
    </>
  );
}
