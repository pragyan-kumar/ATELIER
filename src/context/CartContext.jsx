import { createContext, useContext, useReducer, useEffect } from 'react';
import { getFromStorage, setToStorage } from '../utils';

const CartContext = createContext(null);

const STORAGE_KEY = 'atelier_cart';

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      // check if same product + size + color combo already in cart
      const existing = state.items.find(
        (i) =>
          i.id === action.payload.id &&
          i.size === action.payload.size &&
          i.color === action.payload.color
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i === existing ? { ...i, qty: i.qty + (action.payload.qty || 1) } : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, qty: action.payload.qty || 1 }],
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.cartId !== action.payload),
      };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.cartId === action.payload.cartId
            ? { ...i, qty: Math.max(1, action.payload.qty) }
            : i
        ),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'SET_COUPON':
      return { ...state, coupon: action.payload };
    case 'REMOVE_COUPON':
      return { ...state, coupon: null };
    default:
      return state;
  }
}

const initialState = { items: [], coupon: null };

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, null, () => {
    const saved = getFromStorage(STORAGE_KEY);
    return saved || initialState;
  });

  // keep localStorage in sync
  useEffect(() => {
    setToStorage(STORAGE_KEY, state);
  }, [state]);

  const addToCart = (product, size, color, qty = 1) => {
    // cartId uniquely identifies this product+size+color combination
    const cartId = `${product.id}-${size}-${color}`;
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        cartId,
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        discount: product.discount,
        image: product.images[0],
        size,
        color,
        qty,
        stock: product.stock,
      },
    });
  };

  const removeFromCart = (cartId) => dispatch({ type: 'REMOVE_ITEM', payload: cartId });
  const updateQty = (cartId, qty) => dispatch({ type: 'UPDATE_QTY', payload: { cartId, qty } });
  const clearCart = () => dispatch({ type: 'CLEAR' });
  const applyCoupon = (coupon) => dispatch({ type: 'SET_COUPON', payload: coupon });
  const removeCoupon = () => dispatch({ type: 'REMOVE_COUPON' });

  const itemCount = state.items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        coupon: state.coupon,
        itemCount,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
