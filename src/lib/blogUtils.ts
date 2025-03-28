import connectDB from '@/utils/database';
import Blog, { IBlog } from '@/models/Blog';
import User from '@/models/User'; // Import User model


interface BlogQueryOptions {
  page?: number;
  limit?: number;
  tag?: string;
}

export async function getBlogPosts(options: BlogQueryOptions = {}) {
  const {
    page = 1,
    limit = 10,
    tag
  } = options;

  try {
    await connectDB();

    const query = {
      isPublished: true,
      ...(tag ? { tags: tag } : {})
    };

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch blogs with pagination
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalCount = await Blog.countDocuments(query);

    // Get all unique tags
    const tags = await Blog.distinct('tags', { isPublished: true });

    // Add cache tag header for revalidation
    // This is a custom header we'll use for the fetch API
    const result = {
      blogs: JSON.parse(JSON.stringify(blogs)),
      totalPages: Math.ceil(totalCount / limit),
      tags
    };

    // Mark this data with a tag for revalidation
    fetch('/api/set-cache-tag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tag: 'blog-data' }),
    }).catch(err => console.error('Failed to set cache tag:', err));

    return result;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return {
      blogs: [],
      totalPages: 0,
      tags: []
    };
  }
}

export async function getBlogData(slug: string) {
  try {
    await connectDB();
    
    // Ensure User model is registered before using populate
    await User;
    
    const blog = await Blog.findOne({ slug, isPublished: true })
      .populate('author', 'name')
      .lean<IBlog>();
    
    if (!blog) {
      return { blog: null, relatedBlogs: [] };
    }
    
    // Fetch related blog posts based on shared tags
    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      isPublished: true,
      tags: { $in: blog.tags }
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('title slug excerpt coverImage')
      .lean();
    
    const result = {
      blog: JSON.parse(JSON.stringify(blog)),
      relatedBlogs: JSON.parse(JSON.stringify(relatedBlogs))
    };

    // Mark this data with a tag for revalidation
    fetch('/api/set-cache-tag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tag: `blog-${slug}` }),
    }).catch(err => console.error('Failed to set cache tag:', err));

    return result;
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return { blog: null, relatedBlogs: [] };
  }
}
