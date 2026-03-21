import { motion } from 'framer-motion';

const AnimatedScentProfile = ({ notes }) => {
  if (!notes || (!notes.top && !notes.middle && !notes.base)) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="mt-8">
      <motion.div 
        className="space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <h2 className="text-3xl font-serif font-bold tracking-tight text-neutral-900 mb-2">Scent Profile</h2>
        
        {/* Top Notes */}
        {notes.top && notes.top.length > 0 && (
          <motion.div variants={itemVariants} className="relative group">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-3 gap-1">
              <h3 className="text-xl font-serif font-medium text-neutral-800">Top Notes</h3>
              <span className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">The first impression (5-15 min)</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {notes.top.map((note, i) => (
                 <span key={i} className="px-4 py-1.5 bg-neutral-50 border border-neutral-200 text-neutral-600 rounded-full text-sm font-medium transition-colors group-hover:bg-amber-50 group-hover:border-amber-200 group-hover:text-amber-700">{note}</span>
              ))}
            </div>
            <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-amber-300" 
                 initial={{ width: 0 }}
                 whileInView={{ width: '40%' }}
                 transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
               />
            </div>
          </motion.div>
        )}

        {/* Heart/Middle Notes */}
        {notes.middle && notes.middle.length > 0 && (
          <motion.div variants={itemVariants} className="relative group">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-3 gap-1">
              <h3 className="text-xl font-serif font-medium text-neutral-800">Heart Notes</h3>
              <span className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">The core essence (20-60 min)</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {notes.middle.map((note, i) => (
                 <span key={i} className="px-4 py-1.5 bg-neutral-50 border border-neutral-200 text-neutral-600 rounded-full text-sm font-medium transition-colors group-hover:bg-amber-100 group-hover:border-amber-300 group-hover:text-amber-800">{note}</span>
              ))}
            </div>
            <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-amber-500" 
                 initial={{ width: 0 }}
                 whileInView={{ width: '60%' }}
                 transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
               />
            </div>
          </motion.div>
        )}

        {/* Base Notes */}
        {notes.base && notes.base.length > 0 && (
          <motion.div variants={itemVariants} className="relative group">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-3 gap-1">
              <h3 className="text-xl font-serif font-medium text-neutral-800">Base Notes</h3>
              <span className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">The lasting trail (6+ hours)</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {notes.base.map((note, i) => (
                 <span key={i} className="px-4 py-1.5 bg-neutral-50 border border-neutral-200 text-neutral-600 rounded-full text-sm font-medium transition-colors group-hover:bg-amber-900 group-hover:border-amber-900 group-hover:text-amber-50">{note}</span>
              ))}
            </div>
            <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-amber-700" 
                 initial={{ width: 0 }}
                 whileInView={{ width: '100%' }}
                 transition={{ duration: 1.2, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
               />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AnimatedScentProfile;
