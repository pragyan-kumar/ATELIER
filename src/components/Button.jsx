import { classNames } from '../utils';
import styles from './Button.module.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  ...rest
}) {
  return (
    <button
      className={classNames(
        styles.btn,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        className
      )}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
