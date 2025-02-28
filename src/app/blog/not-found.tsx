import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Blog Post Not Found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldnt find the blog post you were looking for. It may have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/blog"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" />
            Back to Blog
          </Link>
          <Link
            href="/"
            className="bg-white text-gray-800 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
