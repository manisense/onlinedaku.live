'use client';

import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import BlogEditor from '@/components/admin/BlogEditor';
import { FaSave, FaArrowLeft, FaTags, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Loader from '@/components/ui/Loader';


interface BlogForm {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
  isPublished: boolean;
}


// Use the correct type for client components in App Router
export default function EditBlogPost({params}:{ params: Promise<{ id: string }>}) {

  const [formData, setFormData] = useState<BlogForm>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: [],
    isPublished: false
  });
  const [originalBlog, setOriginalBlog] = useState<BlogForm | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/admin/blogs/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch blog post');
      }
      
      const blog = data.data;
      setFormData({
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        excerpt: blog.excerpt,
        coverImage: blog.coverImage || '',
        tags: blog.tags || [],
        isPublished: blog.isPublished
      });
      setOriginalBlog({
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        excerpt: blog.excerpt,
        coverImage: blog.coverImage || '',
        tags: blog.tags || [],
        isPublished: blog.isPublished
      });
      
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to load blog post');
      setError('Could not load blog post. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const generateSlugFromTitle = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    if (!formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
    }
    
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.slug || !formData.content || !formData.excerpt) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update blog post');
      }
      
      toast.success('Blog post updated successfully');
      
      // Update original blog state with current data
      setOriginalBlog({ ...formData });
      
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast.error('Failed to update blog post');
    } finally {
      setSubmitting(false);
    }
  };

  const hasUnsavedChanges = () => {
    if (!originalBlog) return false;
    
    return (
      formData.title !== originalBlog.title ||
      formData.slug !== originalBlog.slug ||
      formData.content !== originalBlog.content ||
      formData.excerpt !== originalBlog.excerpt ||
      formData.coverImage !== originalBlog.coverImage ||
      formData.isPublished !== originalBlog.isPublished ||
      JSON.stringify(formData.tags) !== JSON.stringify(originalBlog.tags)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
      <Loader size='medium' text='Loading blog post...' />
      </div>
    );
  }

  if (error) {
    return (

        <div className="p-6 flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">Error</div>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/admin/blogs" className="bg-indigo-600 text-white px-4 py-2 rounded">
              Back to Blogs
            </Link>
          </div>
        </div>

    );
  }

  return (
    
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/admin/blogs" className="text-gray-500 hover:text-gray-700 mr-4">
              <FaArrowLeft />
            </Link>
            <h1 className="text-2xl font-bold">Edit Blog Post</h1>
          </div>
          <div className="flex items-center">
            <span className={`mr-4 text-sm ${hasUnsavedChanges() ? 'text-amber-600' : 'text-green-600'}`}>
              {hasUnsavedChanges() ? 'Unsaved changes' : 'All changes saved'}
            </span>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !hasUnsavedChanges()}
              className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="animate-spin mr-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateSlugFromTitle}
                    className="bg-gray-200 px-4 py-2 rounded-r-md hover:bg-gray-300"
                  >
                    Generate
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  The slug will be used in the URL: /blog/{formData.slug || 'example-slug'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt <span className="text-red-500">*</span>
                  <span className="text-xs font-normal text-gray-500 ml-1">(Brief summary, shown in blog lists)</span>
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <BlogEditor initialContent={formData.content} onChange={handleContentChange} />
              </div>
            </div>
            
            <div className="lg:col-span-1 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                {formData.coverImage && (
                  <div className="mt-2 border p-2 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <img
                      src={formData.coverImage}
                      alt="Cover preview"
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaTags className="mr-1" /> Tags
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add tag and press Enter"
                    className="w-full px-3 py-2 border rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-gray-200 px-4 py-2 rounded-r-md hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <div
                        key={tag}
                        className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md text-sm flex items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-indigo-600 hover:text-indigo-800"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleCheckboxChange}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span className="ml-2 text-sm text-gray-700">Published</span>
                </label>
                <p className="mt-1 text-sm text-gray-500">
                  Toggle to publish or unpublish this blog post.
                </p>
              </div>

              <div className="pt-4 border-t">
                <Link
                  href={`/blog/${formData.slug}`}
                  target="_blank"
                  className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                >
                  <FaEye className="mr-1" /> View on site
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
  );
}
