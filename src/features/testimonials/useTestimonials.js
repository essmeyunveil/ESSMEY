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
            text
          }`
        );

        if (!data || data.length === 0) {
          const { testimonials: sampleTestimonials } = await import('../../utils/sampleData');
          return sampleTestimonials;
        }

        return data;
      } catch (error) {
        console.error("Testimonial fetch failed, using fallback:", error);
        const { testimonials: sampleTestimonials } = await import('../../utils/sampleData');
        return sampleTestimonials;
      }
    },
    staleTime: 1000 * 60 * 60, 
  });
};
