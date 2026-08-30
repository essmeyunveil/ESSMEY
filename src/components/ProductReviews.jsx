import { useState, useEffect } from "react";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useAuth } from "../utils/AuthContext";
import { db } from "../utils/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import toast from "react-hot-toast";

const ProductReviews = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Fetch reviews from Firestore
  useEffect(() => {
    if (!productId || db.__isMock) {
      setLoadingReviews(false);
      return;
    }

    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const q = query(
          collection(db, "reviews"),
          where("productId", "==", productId)
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map((doc) => {
          const data = doc.data();
          const parsedDate = data.createdAt?.toDate?.()
            ? data.createdAt.toDate().toISOString()
            : typeof data.createdAt === "string"
              ? data.createdAt
              : new Date().toISOString();
          return {
            id: doc.id,
            ...data,
            date: parsedDate,
          };
        });
        fetched.sort((a, b) => new Date(b.date) - new Date(a.date));
        setReviews(fetched);
        if (user) {
          setHasReviewed(fetched.some((r) => r.userId === user.uid));
        }
      } catch (err) {
        console.warn("Reviews load fallback:", err.message);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [productId, user]);

  // Pre-fill name from user profile
  useEffect(() => {
    if (user?.displayName) setName(user.displayName);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to submit a review.");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (hasReviewed) {
      toast.error("You have already reviewed this product.");
      return;
    }

    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticReview = {
      id: optimisticId,
      productId,
      userId: user.uid,
      name: name.trim(),
      rating,
      text: reviewText.trim(),
      date: new Date().toISOString(),
    };

    // Optimistic UI: show immediately
    setReviews((prev) => [optimisticReview, ...prev]);
    setHasReviewed(true);
    setRating(0);
    setReviewText("");
    setSubmitting(true);

    try {
      if (db.__isMock) {
        toast.success("Review submitted! (Mock mode — not saved to database)");
        return;
      }

      await addDoc(collection(db, "reviews"), {
        productId,
        userId: user.uid,
        name: optimisticReview.name,
        rating,
        text: optimisticReview.text,
        createdAt: serverTimestamp(),
      });

      toast.success("Thank you for your review!");
    } catch (err) {
      console.error("Failed to submit review:", err);
      // Roll back on failure
      setReviews((prev) => prev.filter((r) => r.id !== optimisticId));
      setHasReviewed(false);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div className="mt-16 border-t pt-10">
      <h2 className="text-2xl font-serif font-bold mb-8">Customer Reviews</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Left Col: Review List */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          {loadingReviews ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="animate-pulse border-b pb-6">
                  <div className="h-4 bg-neutral-200 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-neutral-100 rounded w-1/4 mb-3" />
                  <div className="h-3 bg-neutral-100 rounded w-full mb-1" />
                  <div className="h-3 bg-neutral-100 rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
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
                          className={`h-5 w-5 ${
                            star <= review.rating ? "text-amber-400" : "text-neutral-200"
                          }`}
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

        {/* Right Col: Summary + Form */}
        <div className="lg:col-span-1 order-1 lg:order-2">

          {/* Average Rating Summary */}
          {reviews.length > 0 && (
            <div className="bg-neutral-50 p-6 rounded-lg mb-8 text-center">
              <h3 className="text-lg font-medium mb-2">Average Rating</h3>
              <div className="text-4xl font-serif font-bold text-amber-600 mb-2">
                {avgRating}
              </div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIconSolid
                    key={star}
                    className={`h-6 w-6 ${
                      star <= Math.round(avgRating) ? "text-amber-400" : "text-neutral-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-neutral-500">
                Based on {reviews.length} review{reviews.length !== 1 && "s"}
              </p>
            </div>
          )}

          {/* Review Form */}
          <div className="bg-white border rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-serif font-bold mb-4">Write a Review</h3>

            {!user ? (
              <div className="text-center py-4">
                <p className="text-sm text-neutral-500 mb-4">
                  Please log in to leave a review.
                </p>
                <a href="/login" className="btn-primary text-sm px-5 py-2">
                  Log in to review
                </a>
              </div>
            ) : hasReviewed ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <StarIconSolid className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-800">
                  You have already reviewed this product.
                </p>
                <p className="text-xs text-green-600 mt-1">Thank you for your feedback!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Your Rating *
                  </label>
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
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Review (Optional)
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none min-h-[100px]"
                    placeholder="Share your thoughts about this fragrance..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
