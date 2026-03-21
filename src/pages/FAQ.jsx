import { useState } from "react";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-5">
      <button
        className="flex justify-between items-center w-full text-left font-medium focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{question}</span>
        <svg
          className={`w-5 h-5 text-amber transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div
        className={`mt-2 text-gray-700 overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="pb-4">{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const productFAQs = [
    {
      question: "How long does the fragrance typically last?",
      answer:
        "Our perfumes are crafted with high-quality ingredients that ensure longevity. Most fragrances last 6-8 hours, with some of our more intense formulations lasting up to 12 hours. Longevity may vary based on skin type, climate, and application method.",
    },
    {
      question: "Are your perfumes tested on animals?",
      answer:
        "No, Essmey is proudly cruelty-free. We never test our products on animals, and we work only with suppliers who adhere to the same ethical standards.",
    },
    {
      question: "What ingredients do you use in your perfumes?",
      answer:
        "We use a blend of natural and safe synthetic ingredients. Our natural ingredients include essential oils, absolutes, and botanical extracts. Each perfume has a unique formulation designed to create a specific olfactory experience. All ingredients are listed on each product page.",
    },
    {
      question: "Do you offer samples of your fragrances?",
      answer:
        "Yes! We offer sample sets that include small vials of our most popular scents. This allows you to explore our different fragrances before committing to a full-size bottle. Sample sets can be found in our 'Shop' section.",
    },
    {
      question: "How should I store my perfume?",
      answer:
        "To maintain the quality of your fragrance, store it in a cool, dry place away from direct sunlight and heat. Avoid bathroom storage as humidity can alter the scent. Properly stored, our perfumes have a shelf life of approximately 3 years from opening.",
    },
  ];

  const orderFAQs = [
    {
      question: "How do I track my order?",
      answer:
        "Once your order ships, you'll receive a confirmation email with tracking information. You can also track your order by visiting the 'Track Order' page on our website and entering your order number and email address.",
    },
    {
      question: "Can I modify or cancel my order?",
      answer:
        "Orders can be modified or canceled within 2 hours of placement. Please contact our customer service team immediately if you need to make changes. Once an order has been processed, we cannot make changes.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. Please note that customers are responsible for any customs fees or import duties that may apply.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and Apple Pay. All transactions are securely processed and your payment information is never stored on our servers.",
    },
    {
      question: "Do you offer gift wrapping?",
      answer:
        "Yes, we offer elegant gift wrapping for an additional $5. During checkout, you'll have the option to add gift wrapping and include a personalized message. Your gift will be beautifully presented in our signature packaging.",
    },
  ];

  const returnFAQs = [
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for unused items in their original packaging. Custom or personalized items cannot be returned unless damaged or defective. Please visit our 'Shipping & Returns' page for complete details.",
    },
    {
      question: "How do I start the return process?",
      answer:
        "To initiate a return, please email returns@essmey.com with your order number and reason for return. Our team will provide you with a Return Authorization Number (RAN) and detailed instructions on how to proceed.",
    },
    {
      question: "How long does it take to process a refund?",
      answer:
        "Once we receive your return, it takes 2-3 business days to inspect the item and process the refund. After processing, it may take an additional 5-10 business days for the refund to appear in your account, depending on your financial institution.",
    },
    {
      question: "Can I exchange my product instead of returning it?",
      answer:
        "Yes, we're happy to exchange your product for a different fragrance if you're not completely satisfied. Please follow the same process as returns, but specify that you'd like an exchange and indicate which product you'd prefer instead.",
    },
  ];

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative bg-[#1a1208] text-white py-20 mb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/images/essmeybg.jpg')] bg-cover bg-center"></div>
        <div className="container-custom text-center max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-amber">
            Frequently Asked Questions
          </h1>
          <p className="text-xl font-light">
            Find answers to our most commonly asked questions
          </p>
          <div className="w-24 h-1 bg-amber mx-auto mt-8"></div>
        </div>
      </section>

      <div className="container-custom max-w-4xl mx-auto">
        {/* Search and Categories */}
        <div className="bg-sand p-8 rounded-lg mb-16">
          <h2 className="text-2xl font-serif text-center mb-6">
            How can we help you?
          </h2>
          <div className="max-w-xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search for answers..."
                className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:border-amber focus:ring-1 focus:ring-amber/30 outline-none transition-colors"
              />
              <button className="bg-amber text-white px-6 py-3 rounded-md hover:bg-amber/90 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Products FAQs */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-medium mb-6 text-amber">
            About Our Products
          </h2>
          <div className="w-16 h-1 bg-amber mb-8"></div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            {productFAQs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </section>

        {/* Orders FAQs */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-medium mb-6 text-amber">
            Orders & Shipping
          </h2>
          <div className="w-16 h-1 bg-amber mb-8"></div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            {orderFAQs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </section>

        {/* Returns FAQs */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-medium mb-6 text-amber">
            Returns & Exchanges
          </h2>
          <div className="w-16 h-1 bg-amber mb-8"></div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            {returnFAQs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center bg-sand p-8 rounded-lg">
          <h2 className="text-2xl font-serif font-medium mb-4">
            Didn't Find Your Answer?
          </h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Our customer service team is here to help with any questions you may
            have.
          </p>
          <a href="/contact" className="btn-primary bg-amber hover:bg-amber/90">
            Contact Our Team
          </a>
        </section>
      </div>
    </div>
  );
};

export default FAQ;
