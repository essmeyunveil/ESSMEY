import { useQuery } from '@tanstack/react-query';
import { client } from '../../utils/sanity';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const data = await client.fetch(
          `*[_type == "product"] {
            _id,
            name,
            description,
            price,
            stock,
            category,
            featured,
            new,
            bestSeller,
            images[] {
              asset-> {
                _id,
                url,
                metadata {
                  dimensions {
                    width,
                    height
                  }
                }
              }
            }
          }`
        );

        // Strict Remote Enforcement: No local fallback Data

        return data.map(product => ({
          ...product,
          images: product.images?.map(image => ({
            ...image,
            asset: {
              _ref: image.asset?._id,
              _type: "image",
              url: image.asset?.url
            }
          })) || [],
          featured: product.featured || false,
          bestSeller: product.bestSeller || false,
          new: product.new || false,
          price: product.price || 0,
          stock: product.stock || 0
        }));

      } catch (error) {
        console.error("Sanity fetch failed:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour caching
  });
};
