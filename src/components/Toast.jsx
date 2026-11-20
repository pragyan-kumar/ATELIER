import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import styles from './Toast.module.css';

// pick the right icon based on toast type
function getIcon(type) {
  if (type === 'error') return FaExclamationCircle;
  if (type === 'info') return FaInfoCircle;
  return FaCheckCircle;
}

export default function Toast({ toasts, onRemove }) {
  return (
    <div className={styles.container} aria-live="polite">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = getIcon(toast.type);
          return (
            <motion.div
              key={toast.id}
              className={`${styles.toast} ${styles[toast.type] || styles.success}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Icon className={styles.icon} />
              <span className={styles.message}>{toast.message}</span>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => onRemove(toast.id)}
                aria-label="Close notification"
              >
                <FaTimes />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
