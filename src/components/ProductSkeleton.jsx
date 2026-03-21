import { motion } from "framer-motion";

const ProductSkeleton = () => {
  return (
    <div className="pt-24 pb-16 w-full">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Image Skeleton */}
          <div className="flex-1">
            <motion.div 
              className="w-full h-[500px] rounded-lg bg-neutral-100"
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Product Info Skeleton */}
          <div className="flex-1 space-y-8">
            <div>
              <motion.div 
                className="h-10 w-3/4 bg-neutral-100 rounded-md mb-4"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="h-6 w-1/4 bg-neutral-100 rounded-md mb-6"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
              />

              <div className="flex gap-4 mb-8">
                <motion.div className="w-10 h-10 rounded-full bg-neutral-100" animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
                <motion.div className="w-10 h-10 rounded-full bg-neutral-100" animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} />
              </div>

              <div className="space-y-4 mb-8">
                <motion.div 
                  className="h-14 w-full bg-neutral-100 rounded-md"
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                />
              </div>

              <div className="space-y-3 mb-8">
                <motion.div className="h-4 w-full bg-neutral-100 rounded" animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
                <motion.div className="h-4 w-5/6 bg-neutral-100 rounded" animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} />
                <motion.div className="h-4 w-4/6 bg-neutral-100 rounded" animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
