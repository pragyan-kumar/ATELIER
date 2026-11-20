export const SITE_NAME = 'ATELIER';

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Categories', path: '/categories' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export const CATEGORIES = [
  { slug: 'mens-clothing', name: "Men's Clothing", image: '/images/categories/mens-clothing.jpg' },
  { slug: 'womens-clothing', name: "Women's Clothing", image: '/images/categories/womens-clothing.jpg' },
  { slug: 'accessories', name: 'Accessories', image: '/images/categories/accessories.jpg' },
  { slug: 'footwear', name: 'Footwear', image: '/images/categories/footwear.jpg' },
  { slug: 'bags', name: 'Bags', image: '/images/categories/bags.jpg' },
  { slug: 'electronics', name: 'Electronics', image: '/images/categories/electronics.jpg' },
];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export const PRICE_RANGES = [
  { min: 0, max: 50, label: 'Under ₹50' },
  { min: 50, max: 100, label: '₹50 – ₹100' },
  { min: 100, max: 200, label: '₹100 – ₹200' },
  { min: 200, max: 500, label: '₹200 – ₹500' },
  { min: 500, max: Infinity, label: '₹500+' },
];

// coupon codes — keep these secret from real users lol
export const COUPON_CODES = {
  SAVE10: { type: 'percent', value: 10, label: '10% off' },
  FLAT20: { type: 'flat', value: 20, label: '₹20 off' },
  ATELIER15: { type: 'percent', value: 15, label: '15% off' },
};

export const SHIPPING_COST = 8.99;
export const FREE_SHIPPING_THRESHOLD = 100;
export const TAX_RATE = 0.08;
