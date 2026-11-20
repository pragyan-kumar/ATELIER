import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FiSearch,
  FiFilter,
  FiX,
  FiGrid,
  FiList,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
} from 'react-icons/fi';
import { allProducts } from '../data/products';
import { CATEGORIES, SORT_OPTIONS, PRICE_RANGES } from '../constants';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { calcDiscount, formatPrice } from '../utils';
import useScrollLock from '../hooks/useScrollLock';
import styles from './Shop.module.css';

const ITEMS_PER_PAGE = 12;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedPriceIdx, setSelectedPriceIdx] = useState(-1);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useScrollLock(mobileFilterOpen);

  // Sync with URL params if they change externally (e.g. clicking header links)
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const query = searchParams.get('search') || '';
    setSelectedCategory(cat);
    setSearchQuery(query);
    setCurrentPage(1);
  }, [searchParams]);

  // Handle category change
  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    if (!searchQuery.trim()) {
      searchParams.delete('search');
    } else {
      searchParams.set('search', searchQuery.trim());
    }
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedPriceIdx(-1);
    setMinRating(0);
    setSortBy('featured');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Price
    if (selectedPriceIdx >= 0) {
      const range = PRICE_RANGES[selectedPriceIdx];
      result = result.filter((p) => {
        const finalPrice = calcDiscount(p.price, p.discount);
        return finalPrice >= range.min && finalPrice <= range.max;
      });
    }

    // Rating
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
        break;
      case 'price-asc':
        result.sort(
          (a, b) =>
            calcDiscount(a.price, a.discount) - calcDiscount(b.price, b.discount)
        );
        break;
      case 'price-desc':
        result.sort(
          (a, b) =>
            calcDiscount(b.price, b.discount) - calcDiscount(a.price, a.discount)
        );
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, selectedPriceIdx, minRating, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery.trim() !== '' ||
    selectedPriceIdx >= 0 ||
    minRating > 0;

  const renderFilters = () => (
    <div className={styles.filterSidebar}>
      <div className={styles.filterSection}>
        <h4 className={styles.filterTitle}>Categories</h4>
        <ul className={styles.filterList}>
          <li>
            <button
              type="button"
              className={`${styles.filterBtn} ${selectedCategory === 'all' ? styles.filterBtnActive : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              All Categories
              <span className={styles.countBadge}>{allProducts.length}</span>
            </button>
          </li>
          {CATEGORIES.map((cat) => {
            const count = allProducts.filter((p) => p.category === cat.slug).length;
            return (
              <li key={cat.slug}>
                <button
                  type="button"
                  className={`${styles.filterBtn} ${selectedCategory === cat.slug ? styles.filterBtnActive : ''}`}
                  onClick={() => handleCategoryChange(cat.slug)}
                >
                  {cat.name}
                  <span className={styles.countBadge}>{count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.filterSection}>
        <h4 className={styles.filterTitle}>Price Range</h4>
        <ul className={styles.filterList}>
          {PRICE_RANGES.map((range, idx) => (
            <li key={idx}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="priceRange"
                  checked={selectedPriceIdx === idx}
                  onChange={() => {
                    setSelectedPriceIdx(idx);
                    setCurrentPage(1);
                  }}
                  className={styles.radioInput}
                />
                <span>{range.label}</span>
              </label>
            </li>
          ))}
          {selectedPriceIdx >= 0 && (
            <li>
              <button
                type="button"
                className={styles.resetFilterLink}
                onClick={() => setSelectedPriceIdx(-1)}
              >
                Clear price filter
              </button>
            </li>
          )}
        </ul>
      </div>

      <div className={styles.filterSection}>
        <h4 className={styles.filterTitle}>Customer Rating</h4>
        <div className={styles.ratingFilterList}>
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              type="button"
              className={`${styles.ratingBtn} ${minRating === stars ? styles.ratingBtnActive : ''}`}
              onClick={() => {
                setMinRating(minRating === stars ? 0 : stars);
                setCurrentPage(1);
              }}
            >
              <span className={styles.starsRow}>
                {stars} <FiStar className={styles.starIcon} /> & up
              </span>
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="secondary" size="sm" fullWidth onClick={clearAllFilters}>
          Reset All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className={styles.shopPage}>
      <div className="container">
        {/* Breadcrumb & Header */}
        <div className={styles.headerBar}>
          <div>
            <h1 className={styles.pageTitle}>Shop All Products</h1>
            <p className={styles.pageSubtitle}>
              Showing {filteredProducts.length} results
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  searchParams.delete('search');
                  setSearchParams(searchParams);
                }}
                className={styles.searchClear}
              >
                <FiX />
              </button>
            )}
          </form>
        </div>

        {/* Controls Toolbar */}
        <div className={styles.toolbar}>
          <button
            type="button"
            className={styles.mobileFilterToggle}
            onClick={() => setMobileFilterOpen(true)}
          >
            <FiFilter /> Filters {hasActiveFilters && '(Active)'}
          </button>

          <div className={styles.sortWrapper}>
            <label htmlFor="sortSelect" className={styles.sortLabel}>
              Sort by:
            </label>
            <select
              id="sortSelect"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className={styles.sortSelect}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.viewToggle}>
            <button
              type="button"
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <FiGrid />
            </button>
            <button
              type="button"
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <FiList />
            </button>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className={styles.layout}>
          {/* Desktop Sidebar */}
          <aside className={styles.desktopSidebar}>{renderFilters()}</aside>

          {/* Product Listing */}
          <main className={styles.mainContent}>
            {paginatedProducts.length === 0 ? (
              <EmptyState
                icon={FiSearch}
                title="No matching products found"
                description="Try loosening your filters or searching with different keywords."
                actionLabel="Clear all filters"
                onAction={clearAllFilters}
              />
            ) : (
              <>
                <div
                  className={
                    viewMode === 'grid' ? styles.gridDisplay : styles.listDisplay
                  }
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className={styles.pagination}>
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage((p) => p - 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={styles.pageArrow}
                      aria-label="Previous page"
                    >
                      <FiChevronLeft />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        type="button"
                        className={`${styles.pageNumber} ${currentPage === pg ? styles.pageNumberActive : ''}`}
                        onClick={() => {
                          setCurrentPage(pg);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        {pg}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => {
                        setCurrentPage((p) => p + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={styles.pageArrow}
                      aria-label="Next page"
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className={styles.drawerOverlay} onClick={() => setMobileFilterOpen(false)}>
          <div
            className={styles.drawerContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.drawerHeader}>
              <h3 className={styles.drawerTitle}>Filters</h3>
              <button
                type="button"
                className={styles.drawerClose}
                onClick={() => setMobileFilterOpen(false)}
              >
                <FiX />
              </button>
            </div>
            <div className={styles.drawerBody}>{renderFilters()}</div>
            <div className={styles.drawerFooter}>
              <Button
                variant="primary"
                fullWidth
                onClick={() => setMobileFilterOpen(false)}
              >
                Apply Filters ({filteredProducts.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
