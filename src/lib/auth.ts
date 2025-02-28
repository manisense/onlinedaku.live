// ...existing code...

// Add blog-related paths to protected routes
export const protectedPaths = [
  '/admin',
  '/admin/deals',
  '/admin/blogs',     // Add this line
  '/admin/settings',
];

// Add blog API paths to protected API routes
export const protectedApiPaths = [
  '/api/admin/deals',
  '/api/admin/blogs', // Add this line
  '/api/admin/settings',
];

// ...existing code...
