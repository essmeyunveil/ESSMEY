import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { client } from "../utils/sanity";
import ProductCard from "../components/ProductCard";
import { trackError } from "../utils/analytics";

const QUESTIONS = [
  {
    id: "category",
    question: "Who are you shopping for?",
    subtitle: "Let's start by narrowing down the options.",
    options: [
      { id: "women", label: "For Her", icon: "🌸" },
      { id: "men", label: "For Him", icon: "👔" },
      { id: "unisex", label: "Unisex", icon: "✨" },
      { id: "all", label: "Surprise Me!", icon: "🎁" }
    ]
  },
  {
    id: "scentProfile",
    question: "What kind of scent profile do you prefer?",
    subtitle: "Select the notes that appeal to you the most.",
    options: [
      { id: "floral", label: "Floral & Sweet", description: "Jasmine, Rose, Vanilla", icon: "🌺" },
      { id: "fresh", label: "Fresh & Citrus", description: "Lemon, Ocean, Mint", icon: "🍋" },
      { id: "woody", label: "Woody & Earthy", description: "Cedar, Sandalwood, Pine", icon: "🌲" },
      { id: "spicy", label: "Dark & Spicy", description: "Oud, Amber, Black Pepper", icon: "🌶️" }
    ]
  },
  {
    id: "occasion",
    question: "When will you wear this fragrance?",
    subtitle: "The perfect scent matches the perfect moment.",
    options: [
      { id: "everyday", label: "Everyday & Work", description: "Subtle and approachable", icon: "☀️" },
      { id: "evening", label: "Evening & Special", description: "Bold and memorable", icon: "🌙" },
      { id: "outdoor", label: "Active & Outdoor", description: "Invigorating and crisp", icon: "🏃" }
    ]
  }
];

const ScentFinder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isComputing, setIsComputing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products once component mounts
    const fetchProducts = async () => {
      try {
        const cachedProducts = sessionStorage.getItem('products');
        if (cachedProducts) {
          setAllProducts(JSON.parse(cachedProducts));
          return;
        }

        const data = await client.fetch(`*[_type == "product"] {
          _id, name, description, price, stock, category, featured, bestSeller, new,
          notes,
          "images": images[].asset->url
        }`);
        
        setAllProducts(data || []);
      } catch (error) {
        trackError(error, "ScentFinder.fetchProducts");
        setAllProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleOptionSelect = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    
    // Automatically proceed to next step after a short delay
    setTimeout(() => {
      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        computeResults({ ...answers, [questionId]: optionId });
      }
    }, 400);
  };

  const computeResults = (finalAnswers) => {
    setIsComputing(true);
    setCurrentStep(QUESTIONS.length); // Move past last question

    setTimeout(() => {
      // Very basic recommendation engine
      const { category, scentProfile, occasion } = finalAnswers;
      
      let scoredProducts = allProducts.map(product => {
        let score = 0;
        
        // Category match
        if (category !== "all" && product.category === category) score += 5;
        if (category === "all") score += 1;

        // Profile match (simplified check against description or notes)
        const profileKeywords = {
          floral: ["floral", "jasmine", "rose", "sweet", "vanilla"],
          fresh: ["fresh", "citrus", "lemon", "mint", "ocean", "sea", "marine"],
          woody: ["wood", "cedar", "sandalwood", "pine", "earth"],
          spicy: ["spice", "dark", "oud", "amber", "pepper", "mysterious"]
        };
        const keywords = profileKeywords[scentProfile] || [];
        const descText = (product.description || "").toLowerCase();
        
        let profileMatch = false;
        keywords.forEach(kw => {
          if (descText.includes(kw)) {
            score += 3;
            profileMatch = true;
          }
        });

        return { product, score };
      });

      // Sort by score
      scoredProducts.sort((a, b) => b.score - a.score);

      // Get top 3 recommended
      setRecommendedProducts(scoredProducts.slice(0, 3).map(sp => sp.product));
      setIsComputing(false);
    }, 2000); // 2 seconds artificial loading for dramatic effect
  };

  const restartQuiz = () => {
    setAnswers({});
    setCurrentStep(0);
    setRecommendedProducts([]);
  };

  // Render Logic
  const renderQuestion = () => {
    const question = QUESTIONS[currentStep];
    return (
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="text-center mb-10">
          <p className="text-amber text-sm font-medium tracking-widest uppercase mb-3">Step {currentStep + 1} of {QUESTIONS.length}</p>
          <h2 className="text-3xl md:text-4xl font-serif mb-4">{question.question}</h2>
          <p className="text-neutral-600">{question.subtitle}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(question.id, option.id)}
              className={`p-6 rounded-lg border-2 text-left transition-all duration-300 hover:border-black hover:shadow-md ${
                answers[question.id] === option.id ? 'border-black bg-neutral-50 shadow-sm' : 'border-neutral-200 bg-white'
              }`}
            >
              <div className="text-4xl mb-4">{option.icon}</div>
              <h3 className="text-xl font-medium mb-2">{option.label}</h3>
              {option.description && <p className="text-sm text-neutral-500">{option.description}</p>}
            </button>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderComputing = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center w-full max-w-lg mx-auto py-20"
    >
      <div className="inline-block mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 border-4 border-amber border-t-transparent rounded-full"
        />
      </div>
      <h2 className="text-3xl font-serif mb-4">Finding your signature scent...</h2>
      <p className="text-neutral-600">We are analyzing your preferences against our curated collection.</p>
    </motion.div>
  );

  const renderResults = () => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif mb-4">Your Perfect Match</h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Based on your preferences, we've selected these exquisite fragrances to complement your unique essence.
        </p>
      </div>

      {recommendedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {recommendedProducts.map((product) => (
            <motion.div 
              key={product._id || product.id}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="mb-6">Sorry, we couldn't find an exact match. Please try selecting different options or browse our full collection.</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <button onClick={restartQuiz} className="btn-secondary">
          Retake Quiz
        </button>
        <Link to="/shop" className="btn-primary">
          Browse All Perfumes
        </Link>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="container-custom">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] flex items-center justify-center p-8 md:p-12 relative">
          
          {/* Progress Bar */}
          {currentStep < QUESTIONS.length && (
            <div className="absolute top-0 left-0 w-full h-2 bg-neutral-100">
              <motion.div 
                className="h-full bg-amber"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep) / QUESTIONS.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            {currentStep < QUESTIONS.length && renderQuestion()}
            {currentStep === QUESTIONS.length && isComputing && renderComputing()}
            {currentStep === QUESTIONS.length && !isComputing && renderResults()}
          </AnimatePresence>

          {/* Back Button */}
          {currentStep > 0 && currentStep < QUESTIONS.length && (
            <button 
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="absolute top-6 left-6 text-sm text-neutral-500 hover:text-black hover:underline"
            >
              &larr; Back
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default ScentFinder;
