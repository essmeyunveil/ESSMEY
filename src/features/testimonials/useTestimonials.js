import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";

export const useTestimonials = () => {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      try {
        if (db.__isMock) {
          throw new Error("Firebase is running in local MOCK mode");
        }

        const querySnapshot = await getDocs(collection(db, "testimonials"));
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ _id: doc.id, ...doc.data() });
        });

        return list;
      } catch (error) {
        console.error("Testimonial fetch failed:", error);
        try {
          const { testimonials } = await import("../../utils/sampleData");
          return testimonials.map((t) => ({
            _id: `local-${t.id}`,
            name: t.name,
            location: t.location,
            rating: t.rating,
            text: t.text,
          }));
        } catch (innerErr) {
          return [];
        }
      }
    },
    staleTime: 1000 * 60 * 60,
  });
};
