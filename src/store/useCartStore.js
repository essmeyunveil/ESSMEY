import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, quantity = 1, size = null, customPrice = null, customMrp = null) => {
        const currentItems = get().items;
        const itemPrice = customPrice !== null && !isNaN(Number(customPrice)) ? Number(customPrice) : Number(product.price);
        const itemMrp = customMrp !== null && !isNaN(Number(customMrp)) ? Number(customMrp) : Number(product.mrp || product.price);

        const existingItemIndex = currentItems.findIndex(
          (item) => item._id === product._id && item.selectedSize === size
        );

        if (existingItemIndex >= 0) {
          // Increment quantity
          const updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ items: updatedItems });
        } else {
          // Add new item with size-specific pricing
          set({
            items: [
              ...currentItems,
              {
                ...product,
                price: itemPrice,
                mrp: itemMrp,
                image:
                  product.image ||
                  product.thumbnail ||
                  (product.images && product.images[0]) ||
                  "/images/product-1.jpg",
                selectedSize: size,
                quantity,
              },
            ],
          });
        }
        toast.success(`${product.name}${size ? ` (${size})` : ""} added to bag!`);
      },

      removeFromCart: (productId, size = null) => {
        set({
          items: get().items.filter(
            (item) => !(item._id === productId && item.selectedSize === size)
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
          items: get().items.map((item) =>
            item._id === productId && item.selectedSize === size
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "essmey-luxury-cart", // Automatically syncs to localStorage
    }
  )
);
