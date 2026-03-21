import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (product, quantity = 1, size = null) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
           item => item._id === product._id && item.selectedSize === size
        );

        if (existingItemIndex >= 0) {
          // Increment quantity
          const updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          // Add new item
          set({ items: [...currentItems, { 
            ...product, 
            image: product.image || (product.images && product.images[0]?.asset?.url) || "",
            selectedSize: size, 
            quantity 
          }] });
        }
        toast.success(`${product.name} added to cart!`);
      },
      
      removeFromCart: (productId, size = null) => {
        set({
           items: get().items.filter(
            item => !(item._id === productId && item.selectedSize === size)
          ),
        });
        toast.success("Item removed from cart");
      },
      
      updateCartQuantity: (productId, quantity, size = null) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, size);
          return;
        }
        set({
          items: get().items.map(item =>
            item._id === productId && item.selectedSize === size
              ? { ...item, quantity }
              : item
          ),
        });
      },
      
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'essmey-luxury-cart', // Automatically syncs to localStorage
    }
  )
);
