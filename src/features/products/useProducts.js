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

        if (!data || data.length === 0) {
          const { products: sampleProducts } = await import('../../utils/sampleData');
          return sampleProducts;
        }

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
        console.error("Sanity fetch failed, using fallback:", error);
        const { products: sampleProducts } = await import('../../utils/sampleData');
        return sampleProducts;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour caching
  });
};
