"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  addReview,
  getReviews,
  hasPurchasedProduct,
} from "@/lib/reviewService";

type Props = {
  productId: number;
};

export default function ProductReviews({
  productId,
}: Props) {
  const { user } = useAuth();

const [reviews, setReviews] = useState<any[]>([]);
const [rating, setRating] = useState(5);
const [review, setReview] = useState("");
const [canReview, setCanReview] = useState(false);

  async function loadReviews() {
    const data = await getReviews(productId);
    setReviews(data);
  }

 useEffect(() => {
  async function checkPurchase() {
    if (!user) return;

    const purchased = await hasPurchasedProduct(
      user.id,
      productId
    );

    setCanReview(purchased);
  }

  checkPurchase();
}, [user, productId]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;

    return (
      reviews.reduce(
        (sum, item) => sum + item.rating,
        0
      ) / reviews.length
    );
  }, [reviews]);

  async function submitReview() {
    if (!user) {
      toast.error("Please login first.");
      return;
    }

    if (!review.trim()) {
      toast.warning("Please write a review.");
      return;
    }

    try {
      await addReview(
        user.id,
        productId,
        rating,
        review
      );

      setReview("");
      setRating(5);

      loadReviews();

      toast.success("Review submitted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review.");
    }
  }

  return (
    <section className="mt-24">

      <h2 className="text-4xl font-bold">
        Customer Reviews
      </h2>

      <div className="mt-6 rounded-2xl bg-white p-8 shadow">

        <div className="flex items-center gap-4">

          <span className="text-5xl font-bold">
            {averageRating.toFixed(1)}
          </span>

          <div>

            <div className="text-2xl text-yellow-500">
              {"★".repeat(Math.round(averageRating))}
              {"☆".repeat(5 - Math.round(averageRating))}
            </div>

            <p className="text-gray-500">
              {reviews.length} Reviews
            </p>

          </div>

        </div>

      </div>

      <div className="mt-10 rounded-2xl bg-white p-8 shadow">

        <h3 className="mb-6 text-2xl font-bold">
          Write a Review
        </h3>

        {canReview ? (
          <p className="text-sm text-gray-500">
            You have purchased this product. You can now write a review.
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            You have not purchased this product. You cannot write a review.
          </p>
        )}

        <select
          value={rating}
          onChange={(e) =>
            setRating(Number(e.target.value))
          }
          className="mb-5 w-full rounded-lg border p-3"
        >
          <option value={5}>★★★★★</option>
          <option value={4}>★★★★☆</option>
          <option value={3}>★★★☆☆</option>
          <option value={2}>★★☆☆☆</option>
          <option value={1}>★☆☆☆☆</option>
        </select>

        <textarea
  rows={5}
  value={review}
  onChange={(e) => setReview(e.target.value)}
  placeholder="Share your experience..."
  className="w-full rounded-lg border p-4"
/>
        <button
          onClick={submitReview}
          className="mt-6 rounded-xl bg-black px-8 py-3 text-white hover:bg-gray-800"
        >
          Submit Review
        </button>

      </div>

      <div className="mt-10 space-y-6">

        {reviews.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            No reviews yet.
          </div>
        ) : (
          reviews.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white p-8 shadow"
            >
              <div className="mb-3 text-yellow-500">
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </div>

              <p className="text-lg">
                {item.review}
              </p>

              <p className="mt-4 text-sm text-gray-500">
                {new Date(
                  item.created_at
                ).toLocaleDateString()}
              </p>
              <span className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                ✔ Verified Purchase
                </span>

            </div>
          ))
        )}

      </div>

    </section>
  );
}