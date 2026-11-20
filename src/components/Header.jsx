import { useState, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import useScrollLock from '../hooks/useScrollLock';
import useClickOutside from '../hooks/useClickOutside';
import useMediaQuery from '../hooks/useMediaQuery';
import { NAV_LINKS, SITE_NAME, CATEGORIES } from '../constants';
import { handleImageError } from '../utils';
import styles from './Header.module.css';

export default function Header() {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();

  // Navigation & dropdown toggles
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Lock background scroll when mobile sidebar drawer is open
  useScrollLock(mobileOpen);

  const closeMega = useCallback(() => setMegaOpen(false), []);
  const closeUser = useCallback(() => setUserOpen(false), []);

  const megaRef = useClickOutside(closeMega);
  const userRef = useClickOutside(closeUser);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    navigate(`/shop?search=${encodeURIComponent(query)}`);
    setSearchQuery('');
    setSearchOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Brand Logo */}
        <Link to="/" className={styles.logo}>
          {SITE_NAME}
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className={styles.nav}>
            {NAV_LINKS.map((link) => {
              const isShop = link.label === 'Shop';

              return (
                <div
                  key={link.path}
                  className={styles.navItem}
                  ref={isShop ? megaRef : undefined}
                  onMouseEnter={isShop ? () => setMegaOpen(true) : undefined}
                  onMouseLeave={isShop ? () => setMegaOpen(false) : undefined}
                >
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                    }
                  >
                    {link.label}
                  </NavLink>

                  {/* Mega Menu Dropdown on Shop Hover */}
                  {isShop && (
                    <AnimatePresence>
                      {megaOpen && (
                        <motion.div
                          className={styles.megaMenu}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className={styles.megaGrid}>
                            {CATEGORIES.map((cat) => (
                              <Link
                                key={cat.slug}
                                to={`/shop?category=${cat.slug}`}
                                className={styles.megaCard}
                                onClick={() => setMegaOpen(false)}
                              >
                                <img
                                  src={cat.image}
                                  alt={cat.name}
                                  className={styles.megaImg}
                                  onError={handleImageError}
                                />
                                <span className={styles.megaName}>{cat.name}</span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>
        )}

        {/* Action icons (Search, Wishlist, Cart, Profile) */}
        <div className={styles.actions}>
          <button
            className={styles.iconBtn}
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <FiSearch />
          </button>

          <Link to="/wishlist" className={styles.iconBtn} aria-label="Wishlist">
            <FiHeart />
            {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
          </Link>

          <Link to="/cart" className={styles.iconBtn} aria-label="Cart">
            <FiShoppingBag />
            {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
          </Link>

          {/* Desktop User Menu */}
          {!isMobile && (
            <div style={{ position: 'relative' }} ref={userRef}>
              <button
                className={styles.iconBtn}
                onClick={() => setUserOpen(!userOpen)}
                aria-label="Account"
              >
                <FiUser />
              </button>
              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    className={styles.userDropdown}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.12 }}
                  >
                    <Link
                      to="/about"
                      className={styles.dropdownLink}
                      onClick={() => setUserOpen(false)}
                    >
                      About
                    </Link>
                    <Link
                      to="/contact"
                      className={styles.dropdownLink}
                      onClick={() => setUserOpen(false)}
                    >
                      Contact
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          {isMobile && (
            <button
              className={styles.hamburger}
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <FiMenu />
            </button>
          )}
        </div>
      </div>

      {/* Global search overlay modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className={styles.searchOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.form
              className={styles.searchBox}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSearch}
            >
              <FiSearch
                style={{
                  marginLeft: 12,
                  color: 'var(--color-text-muted)',
                  fontSize: '1.15rem',
                }}
              />
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                className={styles.searchClose}
                onClick={() => setSearchOpen(false)}
              >
                <FiX />
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className={styles.mobileOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className={styles.mobileDrawer}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <div className={styles.drawerHeader}>
                <span className={styles.logo}>{SITE_NAME}</span>
                <button
                  className={styles.drawerClose}
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <FiX />
                </button>
              </div>
              <nav className={styles.drawerNav}>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={styles.drawerLink}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/about"
                  className={styles.drawerLink}
                  onClick={() => setMobileOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className={styles.drawerLink}
                  onClick={() => setMobileOpen(false)}
                >
                  Contact
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
