import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">

      <h1 className="text-8xl font-bold">
        404
      </h1>

      <h2 className="mt-6 text-3xl font-semibold">
        Page Not Found
      </h2>

      <p className="mt-4 max-w-md text-gray-500">
        Sorry, the page you're looking for doesn't exist.
      </p>

      <Link
        href="/"
        className="mt-10 rounded-lg bg-black px-8 py-4 text-white transition hover:bg-gray-800"
      >
        Back to Home
      </Link>

    </main>
  );
}