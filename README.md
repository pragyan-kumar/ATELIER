# ATELIER

A high-fidelity sartorial & lifestyle e-commerce web application engineered around architectural minimalism, tactile interactions, and uncompromising typography.

---

## Key Features

### Product Discovery & Catalog
- **Faceted Filtering**: Filter by category, price ranges (INR `₹`), and minimum rating thresholds.
- **Dynamic Sorting**: Instant client-side sorting by featured status, release date, price, and customer ratings.
- **View Modes**: One-click toggling between multi-column grid and detailed list layouts.
- **Live Search**: Instant keyword filtering across titles, tags, and category descriptors.

### Product Detail Experience
- **Interactive Gallery**: Multi-angle view switcher with smooth image fallbacks.
- **Cursor-Tracking Zoom**: Dynamic lens magnification that tracks pointer coordinates on desktop.
- **Variant Selectors**: Color swatch previews and size chip selectors with active feedback.
- **Tabbed Specifications**: Tab navigation for technical dimensions, verified patron reviews, and fabric care guidelines.

### Cart, Wishlist & Checkout
- **Persistent Cart**: Quantity adjustment, variant grouping, coupon code application, and dynamic free shipping threshold calculation.
- **Wishlist**: Quick-save capability with direct "Move to Bag" migration.
- **Checkout Flow**: Multi-step checkout simulation with form validation, address management, and dynamic order receipt generation.

---

## Project Structure

```
src/
├── components/      # Design system primitives (Button, Rating, Toast, Skeleton, etc.)
├── constants/       # Global navigation, taxonomy, price bands, and coupons
├── context/         # CartContext, WishlistContext, ToastContext
├── data/            # Local product catalog data and patron testimonials
├── hooks/           # useClickOutside, useInView, useMediaQuery, useScrollLock
├── layouts/         # MainLayout with header, scroll management, and footer
├── pages/           # Route views (Home, Shop, ProductDetails, Cart, Checkout, About, Contact)
├── styles/          # Design tokens, CSS variables, and global resets
└── utils/           # Localization, currency formatting, and storage wrappers
```

---

## Local Development

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Run production build
npm run build

# Preview production build locally
npm run preview
```



