import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import ShareButtons from '@/components/blog/ShareButtons';
import { getBlogData } from '@/lib/blogUtils';

interface RelatedPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
}

export async function generateMetadata({ params }: { params: Promise<{slug: string}>}): Promise<Metadata> {
  const { slug } = await params;
  const { blog } = await getBlogData(slug);
  
  if (!blog) {
    return {
      title: 'Blog Post Not Found - Online Daku',
      description: 'The requested blog post could not be found.',
    };
  }
  
  return {
    title: `${blog.title} - Online Daku Blog`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage ? [{ url: blog.coverImage }] : [],
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{slug: string}>} ) {
  const { slug } = await params;
  const { blog, relatedBlogs } = await getBlogData(slug);
  
  if (!blog) {
    notFound();
  }

  return (
    <div className="bg-gray-50">
      {/* Hero section */}
      <div className="relative w-full h-96 bg-gray-800">
        {blog.coverImage ? (
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover opacity-70"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-90"></div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{blog.title}</h1>
            <div className="flex items-center justify-center text-sm space-x-4 mt-6">
              <span>
                {dayjs(blog.createdAt).format('MMMM D, YYYY')}
              </span>
              <span>•</span>
              <span>
                {blog.author?.name || 'Online Daku Team'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 flex flex-wrap gap-2">
            {blog.tags.map((tag: string) => (
              <Link 
                key={tag} 
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
          
          <article className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </article>
          
          {/* Share buttons */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <p className="text-gray-600 mb-4 sm:mb-0">Share this article:</p>
              <ShareButtons title={blog.title} />
            </div>
          </div>
          
          {/* Author section */}
          <div className="mt-12 p-6 bg-gray-100 rounded-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {blog.author?.name?.charAt(0) || 'A'}
              </div>
              <div className="ml-4">
                <h3 className="font-semibold">{blog.author?.name || 'Online Daku Team'}</h3>
                <p className="text-gray-600 text-sm">Content Creator</p>
              </div>
            </div>
          </div>
          
          {/* Related posts section */}
          {relatedBlogs.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog: RelatedPost) => (
                  <Link 
                    key={relatedBlog._id} 
                    href={`/blog/${relatedBlog.slug}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative w-full h-40">
                      {relatedBlog.coverImage ? (
                        <Image
                          src={relatedBlog.coverImage}
                          alt={relatedBlog.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white text-lg font-bold">Online Daku</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{relatedBlog.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{relatedBlog.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Back to blog listing */}
          <div className="mt-12 text-center">
            <Link 
              href="/blog"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to all articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
