import { Metadata } from "next";
import Link from "next/link";
import MainLayout from "@/components/Layout/MainLayout";
import SearchBar from "@/components/Search/SearchBar";
import BlogList from '@/components/blog/BlogList';
import { getBlogPosts } from "@/lib/blogUtils"; // This should now resolve correctly

export const metadata: Metadata = {
  title: "Blog - Online Daku",
  description: "Latest articles, guides, and updates from Online Daku",
};

export default async function BlogPage() {
  const { blogs, totalPages, tags } = await getBlogPosts();
  
  if (!blogs || blogs.length === 0) {
    return (
      <MainLayout>
         <SearchBar />
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold mb-8">Blog</h1>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No articles yet</h2>
            <p className="text-gray-600">
              Were working on adding some great content. Check back soon!
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SearchBar />
      <div className="container text-gray-900 mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-gray-600 mb-8">Latest articles, guides, and updates</p>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <BlogList initialBlogs={blogs} totalPages={totalPages} />
          </div>
          
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Topics</h3>
              <div className="space-y-2">
                {tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="block bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg text-gray-700"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
