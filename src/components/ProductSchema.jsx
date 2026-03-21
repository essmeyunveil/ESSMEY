import { Helmet } from "react-helmet-async";

const logError = (error, context) => {
  console.error(`[ProductSchema Error] ${context}:`, error);
  if (process.env.NODE_ENV === "production") {
    // Example: sendToErrorTracking(error, context);
  }
};

const ProductSchema = ({ product }) => {
  try {
    if (!product) {
      logError("No product data provided", "Validation");
      return null;
    }

    const requiredFields = ["name", "description", "image", "price", "inStock"];
    const missingFields = requiredFields.filter((field) => !product[field]);

    if (missingFields.length > 0) {
      logError(
        `Missing required fields: ${missingFields.join(", ")}`,
        "Validation"
      );
      return null;
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.image,
      brand: {
        "@type": "Brand",
        name: "Essmey",
      },
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "INR",
        availability: product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        url: window.location.href,
      },
      aggregateRating: product.rating
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount || 0,
          }
        : undefined,
      review: product.reviews
        ? product.reviews.map((review) => ({
            "@type": "Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: review.rating,
            },
            author: {
              "@type": "Person",
              name: review.author,
            },
            reviewBody: review.text,
            datePublished: review.date,
          }))
        : undefined,
    };

    return (
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
    );
  } catch (error) {
    logError(error, "Schema generation");
    return null;
  }
};

export default ProductSchema;
