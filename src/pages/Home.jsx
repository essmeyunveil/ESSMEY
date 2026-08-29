import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../features/products/useProducts";
import { useTestimonials } from "../features/testimonials/useTestimonials";

const categories = [
  { name: "For her", caption: "Soft, luminous, unforgettable", image: "/images/forher_essmey.png", href: "/shop?category=women", number: "01" },
  { name: "For him", caption: "Depth with a distinct point of view", image: "/images/forhim_essmey.png", href: "/shop?category=men", number: "02" },
  { name: "Unisex", caption: "Made to be worn your way", image: "/images/unisex_essmey.png", href: "/shop?category=unisex", number: "03" },
];

export default function Home() {
  const { data: products = [], isLoading } = useProducts();
  const { data: testimonials = [] } = useTestimonials();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const featured = products.filter((product) => product.featured);
  const bestSellers = products.filter((product) => product.bestSeller);
  const editorialProducts = products.length ? products.slice(0, 8) : [];
  const lovedProducts = bestSellers.length ? bestSellers.slice(0, 4) : products.slice(0, 4);
  const testimonial = testimonials[activeTestimonial];

  useEffect(() => {
    if (testimonials.length < 2) return undefined;
    const interval = window.setInterval(() => setActiveTestimonial((current) => (current + 1) % testimonials.length), 5500);
    return () => window.clearInterval(interval);
  }, [testimonials.length]);

  return (
    <main className="overflow-hidden bg-[#fcfbf8] text-[#251a12]">
      <section className="relative min-h-[740px] pt-20 md:min-h-[780px]">
        <div className="absolute inset-0 bg-[#291b12]" />
        <div className="absolute inset-y-0 right-0 w-full md:w-[64%] bg-[url('/images/essmey_custom_bottle.png')] bg-cover bg-center opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#291b12] via-[#291b12]/85 to-[#291b12]/10" />
        <div className="container-custom relative flex min-h-[660px] items-center py-20 md:min-h-[700px]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }} className="max-w-2xl text-white">
            <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#d9b477]"><span className="h-px w-10 bg-[#d9b477]" /> Indian artisanal perfumery</p>
            <h1 className="font-serif text-5xl leading-[0.96] tracking-[-0.04em] sm:text-6xl md:text-8xl">Scent is the<br /><em className="font-normal text-[#e4c58f]">quietest</em> signature.</h1>
            <p className="mt-7 max-w-md text-base leading-7 text-stone-200 md:text-lg">Essmey creates intimate fragrances for the moments you want to be remembered by.</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row"><Link to="/shop" className="group inline-flex items-center justify-center gap-3 bg-[#e4c58f] px-6 py-4 text-sm font-semibold text-[#2b1d12] transition hover:bg-white">Discover the collection <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link><Link to="/about" className="inline-flex items-center justify-center border border-white/35 px-6 py-4 text-sm font-medium text-white transition hover:border-white hover:bg-white/10">Our story</Link></div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/15"><div className="container-custom grid grid-cols-3 divide-x divide-white/15 text-center text-xs text-stone-200"><div className="py-5"><strong className="block font-serif text-lg text-white">Small batch</strong> crafted with care</div><div className="py-5"><strong className="block font-serif text-lg text-white">Long lasting</strong> made for your skin</div><div className="py-5"><strong className="block font-serif text-lg text-white">Made in India</strong> for everywhere</div></div></div>
      </section>

      <section className="container-custom py-20 md:py-28"><div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9c6c36]">Choose your mood</p><h2 className="mt-3 max-w-xl font-serif text-4xl leading-tight md:text-5xl">A fragrance wardrobe for every version of you.</h2></div><Link to="/shop" className="group inline-flex items-center gap-2 text-sm font-semibold underline decoration-[#c99a57] underline-offset-8">Shop all fragrances <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></div><div className="grid gap-5 md:grid-cols-3">{categories.map((category) => <Link key={category.name} to={category.href} className="group relative isolate h-[440px] overflow-hidden bg-stone-200"><img src={category.image} alt={category.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#21140c]/80 via-transparent to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6 text-white"><span className="text-xs tracking-[.2em] text-[#e4c58f]">{category.number}</span><div className="mt-2 flex items-end justify-between"><div><h3 className="font-serif text-3xl">{category.name}</h3><p className="mt-1 text-sm text-stone-200">{category.caption}</p></div><ArrowRightIcon className="mb-1 h-5 w-5 transition-transform group-hover:translate-x-1" /></div></div></Link>)}</div></section>

      <section className="border-y border-[#e7ded1] bg-[#f4eee4] py-20 md:py-28"><div className="container-custom"><div className="mb-10 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9c6c36]">Curated by Essmey</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">The current edit.</h2></div><Link to="/shop" className="hidden text-sm font-semibold underline decoration-[#c99a57] underline-offset-8 sm:block">View all</Link></div>{isLoading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="aspect-[3/4] animate-pulse bg-stone-200" />)}</div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{editorialProducts.map((product) => <ProductCard key={product._id} product={product} />)}</div>}</div></section>

      <section className="container-custom grid gap-10 py-20 md:grid-cols-2 md:items-center md:py-28"><div className="relative"><div className="aspect-[4/5] overflow-hidden bg-stone-200"><img src="/images/hero_essmey.png" alt="Essmey perfumery craft" className="h-full w-full object-cover" /></div><div className="absolute -bottom-5 -right-3 max-w-[210px] bg-[#2b1d12] p-5 text-white shadow-xl md:-right-8"><SparklesIcon className="h-5 w-5 text-[#e4c58f]" /><p className="mt-3 font-serif text-xl">Blended with intention. Worn with instinct.</p></div></div><div className="md:pl-10"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9c6c36]">The Essmey ritual</p><h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">A little more personal than perfume.</h2><p className="mt-6 max-w-lg leading-7 text-stone-600">Every Essmey fragrance begins with a feeling—then is shaped into a composition of notes that develops uniquely on your skin. No noise. Just presence.</p><div className="mt-8 grid grid-cols-2 gap-6 border-t border-[#ddd0bf] pt-6"><div><strong className="block font-serif text-3xl">01</strong><span className="mt-1 block text-sm text-stone-500">Choose a mood</span></div><div><strong className="block font-serif text-3xl">02</strong><span className="mt-1 block text-sm text-stone-500">Let it become yours</span></div></div><Link to="/scent-finder" className="mt-9 inline-flex items-center gap-3 bg-[#2b1d12] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#55351f]">Find your scent <ArrowRightIcon className="h-4 w-4" /></Link></div></section>

      <section className="bg-[#2b1d12] py-20 text-white md:py-28"><div className="container-custom"><div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d9b477]">Most loved</p><h2 className="mt-3 font-serif text-4xl md:text-5xl">The ones people ask about.</h2></div><Link to="/shop?sort=bestselling" className="text-sm font-semibold text-[#e4c58f] underline underline-offset-8">See best sellers</Link></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{lovedProducts.map((product) => <ProductCard key={product._id} product={product} />)}</div></div></section>

      <section className="container-custom py-20 text-center md:py-28"><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9c6c36]">Worn and remembered</p>{testimonial ? <><blockquote className="mx-auto mt-6 max-w-4xl font-serif text-3xl leading-tight md:text-5xl">“{testimonial.text}”</blockquote><p className="mt-6 text-sm font-semibold">{testimonial.name} <span className="font-normal text-stone-500">· {testimonial.location}</span></p>{testimonials.length > 1 && <div className="mt-8 flex justify-center gap-2">{testimonials.map((item, index) => <button key={item._id} onClick={() => setActiveTestimonial(index)} aria-label={`Show review ${index + 1}`} className={`h-2 rounded-full transition-all ${index === activeTestimonial ? "w-8 bg-[#9c6c36]" : "w-2 bg-stone-300"}`} />)}</div>}</> : <blockquote className="mx-auto mt-6 max-w-3xl font-serif text-3xl leading-tight md:text-5xl">“A scent should feel like a memory you have not lived yet.”</blockquote>}</section>
    </main>
  );
}
