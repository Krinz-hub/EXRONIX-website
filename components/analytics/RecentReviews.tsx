"use client";

type Review = {
  id: number;
  rating: number;
  review: string;
  created_at: string;
  products?: {
    name: string;
    image: string;
  };
};

export default function RecentReviews({
  reviews,
}: {
  reviews: Review[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0e1219] p-6 text-white shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Recent Reviews
      </h2>

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center text-gray-400">
          No reviews yet.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-white/10 bg-white/5 p-4 text-white"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">
                  {review.products?.name}
                </h3>

                <span className="text-amber-400">
                  {"⭐".repeat(review.rating)}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-300">
                {review.review}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}