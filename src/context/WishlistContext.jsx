import { createContext, useContext, useReducer, useEffect } from 'react';
import { getFromStorage, setToStorage } from '../utils';

const WishlistContext = createContext(null);

const STORAGE_KEY = 'atelier_wishlist';

function wishlistReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE': {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        return { items: state.items.filter((i) => i.id !== action.payload.id) };
      }
      return { items: [...state.items, action.payload] };
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.id !== action.payload) };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

export function WishlistProvider({ children }) {
  const [state, dispatch] = useReducer(wishlistReducer, null, () => {
    const saved = getFromStorage(STORAGE_KEY);
    return saved || { items: [] };
  });

  // persist to localStorage whenever wishlist changes
  useEffect(() => {
    setToStorage(STORAGE_KEY, state);
  }, [state]);

  const toggleWishlist = (product) => {
    dispatch({
      type: 'TOGGLE',
      payload: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        discount: product.discount,
        image: product.images[0],
        rating: product.rating,
      },
    });
  };

  const removeFromWishlist = (id) => dispatch({ type: 'REMOVE', payload: id });
  const clearWishlist = () => dispatch({ type: 'CLEAR' });
  const isInWishlist = (id) => state.items.some((i) => i.id === id);

  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        count: state.items.length,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
