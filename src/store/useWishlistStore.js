import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addToWishlist: (product) => {
        const currentItems = get().items;
        if (!currentItems.some(item => item._id === product._id)) {
          set({ items: [...currentItems, product] });
          toast.success(`${product.name} added to wishlist!`);
        }
      },
      
      removeFromWishlist: (productId) => {
        set({
          items: get().items.filter((item) => item._id !== productId),
        });
        toast.success("Removed from wishlist");
      },
      
      isInWishlist: (productId) => {
        return get().items.some(item => item._id === productId);
      }
    }),
    {
      name: 'essmey-luxury-wishlist',
    }
  )
);
