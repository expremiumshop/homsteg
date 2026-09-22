import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
  } from "react";
  
  export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
    variants?: Record<string, string>;
    storeSlug?: string;
  }
  
  interface AddToCartItem {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    variants?: Record<string, string>;
    storeSlug?: string;
    quantity?: number;
  }
  
  interface CartContextType {
    cart: CartItem[];
    addToCart: (item: AddToCartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    totalItems: number;
  }
  
  const CartContext = createContext<CartContextType | undefined>(
    undefined
  );
  
  const STORAGE_KEY = "homsteg-nova-cart";
  
  export function CartProvider({
    children,
  }: {
    children: ReactNode;
  }) {
    const [cart, setCart] = useState<CartItem[]>(() => {
      if (typeof window === "undefined") {
        return [];
      }
  
      try {
        const savedCart = localStorage.getItem(STORAGE_KEY);
  
        if (!savedCart) {
          return [];
        }
  
        const parsedCart = JSON.parse(savedCart);
  
        if (!Array.isArray(parsedCart)) {
          return [];
        }
  
        return parsedCart;
      } catch {
        return [];
      }
    });
  
    useEffect(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(cart)
        );
      } catch {
        // Ignora erros de localStorage.
      }
    }, [cart]);
  
    const addToCart = (item: AddToCartItem) => {
      setCart((currentCart) => {
        const cartForStore = item.storeSlug
          ? currentCart.filter(
              (cartItem) =>
                !cartItem.storeSlug ||
                cartItem.storeSlug === item.storeSlug,
            )
          : currentCart;

        const quantityToAdd = Math.max(
          1,
          Number(item.quantity ?? 1)
        );
  
        const existingIndex = cartForStore.findIndex(
          (cartItem) =>
            cartItem.id === item.id &&
            JSON.stringify(cartItem.variants ?? {}) ===
              JSON.stringify(item.variants ?? {})
        );
  
        if (existingIndex !== -1) {
          return cartForStore.map((cartItem, index) => {
            if (index !== existingIndex) {
              return cartItem;
            }
  
            return {
              ...cartItem,
              quantity:
                Number(cartItem.quantity) + quantityToAdd,
            };
          });
        }
  
        return [
          ...cartForStore,
          {
            id: item.id,
            name: item.name,
            price: Number(item.price),
            quantity: quantityToAdd,
            image_url: item.image_url,
            variants: item.variants,
            storeSlug: item.storeSlug,
          },
        ];
      });
    };
  
    const removeFromCart = (id: string) => {
      setCart((currentCart) =>
        currentCart.filter((item) => item.id !== id)
      );
    };
  
    const updateQuantity = (
      id: string,
      quantity: number
    ) => {
      setCart((currentCart) => {
        if (quantity <= 0) {
          return currentCart.filter(
            (item) => item.id !== id
          );
        }
  
        return currentCart.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(1, quantity),
              }
            : item
        );
      });
    };
  
    const clearCart = () => {
      setCart([]);
    };
  
    const total = useMemo(() => {
      return cart.reduce(
        (sum, item) =>
          sum +
          Number(item.price) *
            Number(item.quantity),
        0
      );
    }, [cart]);
  
    const totalItems = useMemo(() => {
      return cart.reduce(
        (sum, item) =>
          sum + Number(item.quantity),
        0
      );
    }, [cart]);
  
    const value: CartContextType = {
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      totalItems,
    };
  
    return (
      <CartContext.Provider value={value}>
        {children}
      </CartContext.Provider>
    );
  }
  
  export function useCart() {
    const context = useContext(CartContext);
  
    if (!context) {
      throw new Error(
        "useCart deve ser usado dentro de um CartProvider."
      );
    }
  
    return context;
  }
