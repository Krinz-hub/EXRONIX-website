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
    <div className="w-full text-white">

      <h2 className="mb-6 text-xl font-bold text-white sm:mb-8 sm:text-2xl">
        Order Progress
      </h2>

      {/* Cancelled Order */}
      {isCancelled ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 sm:p-6 backdrop-blur-md">
          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500 text-lg font-bold text-white">
              ×
            </div>

            <div>
              <h3 className="font-bold text-red-300">
                Order Cancelled
              </h3>

              <p className="mt-1 text-sm leading-6 text-red-300/80">
                This order has been cancelled. Any applicable stock has been restored.
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
                      className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold transition-all ${
                        index <= current
                          ? "border-[#1677FF] bg-[#1677FF] text-white shadow-[0_0_15px_rgba(22,119,255,0.45)]"
                          : "border-white/20 bg-white/5 text-gray-500"
                      }`}
                    >
                      {index < current
                        ? "✓"
                        : index + 1}
                    </div>

                    <p
                      className={`mt-2 whitespace-nowrap text-xs font-semibold ${
                        index <= current
                          ? "text-[#1677FF]"
                          : "text-gray-500"
                      }`}
                    >
                      {step}
                    </p>

                  </div>

                  {index !== steps.length - 1 && (
                    <div
                      className={`mt-5 h-1 min-w-[35px] flex-1 ${
                        index < current
                          ? "bg-[#1677FF] shadow-[0_0_8px_rgba(22,119,255,0.4)]"
                          : "bg-white/10"
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
                    className={`flex h-12 w-12 items-center justify-center rounded-full border text-base font-bold transition-all ${
                      index <= current
                        ? "border-[#1677FF] bg-[#1677FF] text-white shadow-[0_0_18px_rgba(22,119,255,0.45)]"
                        : "border-white/20 bg-white/5 text-gray-500"
                    }`}
                  >
                    {index < current
                      ? "✓"
                      : index + 1}
                  </div>

                  <p
                    className={`mt-3 whitespace-nowrap text-sm font-semibold ${
                      index <= current
                        ? "text-[#1677FF]"
                        : "text-gray-500"
                    }`}
                  >
                    {step}
                  </p>

                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={`mt-6 h-1 flex-1 ${
                      index < current
                        ? "bg-[#1677FF] shadow-[0_0_8px_rgba(22,119,255,0.4)]"
                        : "bg-white/10"
                    }`}
                  />
                )}

              </div>
            ))}

          </div>

          {/* Mobile Hint */}
          <p className="mt-2 text-xs text-gray-500 sm:hidden">
            Swipe left or right to view order progress →
          </p>
        </>
      )}

    </div>
  );
}