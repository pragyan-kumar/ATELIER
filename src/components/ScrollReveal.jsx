import { motion } from 'framer-motion';
import useInView from '../hooks/useInView';
import { classNames } from '../utils';

export default function ScrollReveal({ children, delay = 0, className }) {
  const [ref, inView] = useInView({ threshold: 0.15 });

  return (
    <motion.div
      ref={ref}
      className={classNames(className)}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
