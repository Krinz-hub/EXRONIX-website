"use client";

type Props = {
  status: string;
};

const steps = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
];

export default function OrderTimeline({
  status,
}: Props) {
  const current = steps.indexOf(status);
  const isCancelled = status === "Cancelled";

  return (
    <div className="w-full">

      <h2 className="mb-6 text-xl font-bold sm:mb-8 sm:text-2xl">
        Order Progress
      </h2>

      {/* Cancelled Order */}
      {isCancelled ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 sm:p-6">
          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500 text-lg text-white">
              ×
            </div>

            <div>
              <h3 className="font-bold text-red-700">
                Order Cancelled
              </h3>

              <p className="mt-1 text-sm leading-6 text-red-600">
                This order has been cancelled. Any applicable
                stock has been restored.
              </p>
            </div>

          </div>
        </div>
      ) : (
        <>
          {/* Mobile Timeline */}
          <div className="overflow-x-auto pb-3 sm:hidden">
            <div className="flex min-w-[620px] items-start">

              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex flex-1 items-start"
                >

                  <div className="flex min-w-[90px] flex-col items-center">

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold ${
                        index <= current
                          ? "border-black bg-black text-white"
                          : "border-gray-300 bg-white text-gray-400"
                      }`}
                    >
                      {index < current
                        ? "✓"
                        : index + 1}
                    </div>

                    <p
                      className={`mt-2 whitespace-nowrap text-xs font-medium ${
                        index <= current
                          ? "text-black"
                          : "text-gray-400"
                      }`}
                    >
                      {step}
                    </p>

                  </div>

                  {index !== steps.length - 1 && (
                    <div
                      className={`mt-5 h-1 min-w-[35px] flex-1 ${
                        index < current
                          ? "bg-black"
                          : "bg-gray-300"
                      }`}
                    />
                  )}

                </div>
              ))}

            </div>
          </div>

          {/* Desktop / Tablet Timeline */}
          <div className="hidden items-start sm:flex">

            {steps.map((step, index) => (
              <div
                key={step}
                className="flex flex-1 items-start"
              >

                <div className="flex min-w-[80px] flex-col items-center">

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-bold ${
                      index <= current
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    {index < current
                      ? "✓"
                      : index + 1}
                  </div>

                  <p
                    className={`mt-3 whitespace-nowrap text-sm font-medium ${
                      index <= current
                        ? "text-black"
                        : "text-gray-400"
                    }`}
                  >
                    {step}
                  </p>

                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={`mt-6 h-1 flex-1 ${
                      index < current
                        ? "bg-black"
                        : "bg-gray-300"
                    }`}
                  />
                )}

              </div>
            ))}

          </div>

          {/* Mobile Hint */}
          <p className="mt-2 text-xs text-gray-400 sm:hidden">
            Swipe left or right to view order progress →
          </p>
        </>
      )}

    </div>
  );
}