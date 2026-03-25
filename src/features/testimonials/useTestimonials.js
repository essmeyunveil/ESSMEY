import { useQuery } from '@tanstack/react-query';
import { client } from '../../utils/sanity';

export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      try {
        const data = await client.fetch(
          `*[_type == "testimonial"] | order(_createdAt desc)[0...6] {
            _id,
            name,
            location,
            rating,
            text,
            "imageUrl": image.asset->url
          }`
        );

        return data || [];
      } catch (error) {
        console.error("Testimonial fetch failed:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 60, 
  });
};
