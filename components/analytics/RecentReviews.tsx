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
    <div className="rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">
        Recent Reviews
      </h2>

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
          No reviews yet.
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {review.products?.name}
                </h3>

                <span className="text-yellow-500">
                  {"⭐".repeat(review.rating)}
                </span>
              </div>

              <p className="mt-3 text-gray-600">
                {review.review}
              </p>

              <p className="mt-3 text-sm text-gray-400">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}