import { useState, useEffect } from "react";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useAuth } from "../utils/AuthContext";
import { useToastContext } from "../utils/ToastContext";

const ProductReviews = ({ productId }) => {
  const { user } = useAuth();
  const { addToast } = useToastContext();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    // Load reviews specific to this product from localStorage
    const loadedReviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];
    setReviews(loadedReviews);
    if (user && user.displayName) {
      setName(user.displayName);
    }
  }, [productId, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      addToast?.({
        title: "Missing Rating",
        description: "Please select a star rating",
        status: "error"
      }) || alert("Please select a star rating");
      return;
    }
    if (!name.trim()) {
      addToast?.({
        title: "Missing Name",
        description: "Please enter your name",
        status: "error"
      }) || alert("Please enter your name");
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      rating,
      text: reviewText,
      name: name.trim(),
      date: new Date().toISOString(),
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));

    setRating(0);
    setReviewText("");
    
    addToast?.({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
      status: "success"
    }) || alert("Review submitted successfully!");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-16 border-t pt-10">
      <h2 className="text-2xl font-serif font-bold mb-8">Customer Reviews</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Col: Review List */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          {reviews.length === 0 ? (
            <div className="bg-neutral-50 p-8 rounded-lg text-center text-neutral-500">
              <p>No reviews yet. Be the first to review this fragrance!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{review.name}</h4>
                      <p className="text-sm text-neutral-500">{formatDate(review.date)}</p>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIconSolid
                          key={star}
                          className={`h-5 w-5 ${star <= review.rating ? "text-amber-400" : "text-neutral-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.text && (
                    <p className="text-neutral-700 mt-3 leading-relaxed">{review.text}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Review Form & Summary */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          {reviews.length > 0 && (
            <div className="bg-neutral-50 p-6 rounded-lg mb-8 text-center">
              <h3 className="text-lg font-medium mb-2">Average Rating</h3>
              <div className="text-4xl font-serif font-bold text-amber-600 mb-2">{avgRating}</div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIconSolid
                    key={star}
                    className={`h-6 w-6 ${star <= Math.round(avgRating) ? "text-amber-400" : "text-neutral-200"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-neutral-500">Based on {reviews.length} review{reviews.length !== 1 && 's'}</p>
            </div>
          )}

          <div className="bg-white border rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-serif font-bold mb-4">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Your Rating *</label>
                <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className="focus:outline-none transition-transform hover:scale-110"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                    >
                      {star <= (hoverRating || rating) ? (
                        <StarIconSolid className="h-8 w-8 text-amber-400 transition-colors" />
                      ) : (
                        <StarIconOutline className="h-8 w-8 text-neutral-300 transition-colors" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Review (Optional)</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[100px]"
                  placeholder="Share your thoughts about this fragrance..."
                />
              </div>

              <button type="submit" className="btn-primary w-full shadow-sm">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
