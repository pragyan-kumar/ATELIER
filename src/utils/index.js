export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function calcDiscount(price, discount) {
  if (!discount) return price;
  return price - (price * discount) / 100;
}

export function truncate(str, len = 80) {
  if (str.length <= len) return str;
  return str.slice(0, len).trimEnd() + '…';
}

export function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function classNames(...args) {
  return args.filter(Boolean).join(' ');
}

export function getFromStorage(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function setToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or private browsing restriction
  }
}

export function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function getRatingStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return { full, half, empty };
}

export const FALLBACK_IMAGE = '/images/fallback.jpg';

export function handleImageError(e, fallback = FALLBACK_IMAGE) {
  if (e?.target && e.target.src !== fallback) {
    e.target.src = fallback;
  }
}
