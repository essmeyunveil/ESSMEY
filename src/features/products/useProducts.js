import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        if (db.__isMock) {
          throw new Error("Firebase is running in local MOCK mode");
        }

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Firestore timeout")), 6000)
        );
        const fetchPromise = getDocs(collection(db, "products"));
        const querySnapshot = await Promise.race([fetchPromise, timeoutPromise]);

        const productsList = [];
        querySnapshot.forEach((doc) => {
          productsList.push({ _id: doc.id, ...doc.data() });
        });

        if (productsList.length > 0) {
          try {
            localStorage.setItem("essmey_mock_products_v2", JSON.stringify(productsList));
          } catch (e) {
            console.error("Failed to update cache with Firestore data:", e);
          }
          return productsList;
        }

        throw new Error("No products found in Firestore");
      } catch (error) {
        console.warn("Using local storage/sample fallback for products:", error.message);
        
        // Retrieve from localStorage (v2 key to clear old cached products list) or fallback to sample data
        const localSaved = localStorage.getItem("essmey_mock_products_v2");
        if (localSaved) {
          try {
            return JSON.parse(localSaved);
          } catch (e) {
            console.error("Failed to parse mock products:", e);
          }
        }

        const sampleProducts = [
          {
            _id: "local-1",
            name: "Midnight Allure",
            slug: "midnight-allure",
            description: "A seductive blend of jasmine, vanilla, and amber notes that unfolds throughout the evening. Perfect for those who appreciate a rich, premium fragrance with lasting power.",
            price: 699,
            mrp: 999,
            stock: 15,
            category: "unisex",
            featured: true,
            bestSeller: true,
            new: true,
            images: ["/images/product-1.jpg"],
            thumbnail: "/images/product-1.jpg",
            notes: {
              top: ["Bergamot", "Black Currant", "Pink Pepper"],
              middle: ["Jasmine", "Rose", "Ylang-Ylang"],
              base: ["Vanilla", "Amber", "Patchouli"],
            }
          }
        ];

        localStorage.setItem("essmey_mock_products_v2", JSON.stringify(sampleProducts));
        return sampleProducts;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour caching
  });
};
