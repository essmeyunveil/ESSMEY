import { motion } from "framer-motion";

const CheckoutSkeleton = () => {
  return (
    <div className="pt-24 pb-16 min-h-[70vh] w-full">
      <div className="container-custom grid gap-12 md:grid-cols-3">
        {/* Form Skeleton */}
        <div className="md:col-span-2 bg-white border rounded-lg shadow p-8">
          <motion.div className="h-8 w-1/3 bg-neutral-100 rounded mb-8" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div className="h-12 w-full bg-neutral-100 rounded" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }} />
            <motion.div className="h-12 w-full bg-neutral-100 rounded" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
            <motion.div className="h-12 w-full bg-neutral-100 rounded" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} />
            <motion.div className="h-12 w-full bg-neutral-100 rounded" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} />
            <motion.div className="md:col-span-2 h-24 w-full bg-neutral-100 rounded" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
          </div>
          
          <motion.div className="h-12 w-full bg-neutral-200 rounded" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} />
        </div>

        {/* Order Summary Skeleton */}
        <div className="bg-white border rounded-lg shadow p-8 h-fit">
          <motion.div className="h-7 w-1/2 bg-neutral-100 rounded mb-6" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <div className="space-y-4">
            <motion.div className="h-6 w-full bg-neutral-100 rounded" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }} />
            <motion.div className="h-6 w-full bg-neutral-100 rounded" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
            <motion.div className="h-6 w-full bg-neutral-100 rounded" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} />
            
            <div className="border-t border-neutral-100 pt-4 mt-6">
              <motion.div className="h-6 w-full bg-neutral-200 rounded" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSkeleton;
