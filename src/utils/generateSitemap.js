import { client } from "./sanity";

export const generateSitemap = async () => {
  try {
    // Fetch all products
    const products = await client.fetch(`
      *[_type == "product"] {
        "slug": slug.current,
        _updatedAt
      }
    `);

    // Fetch all blog posts if you have them
    const blogPosts = await client.fetch(`
      *[_type == "post"] {
        "slug": slug.current,
        _updatedAt
      }
    `);

    // Base URL
    const baseUrl = "https://essmey.com";

    // Static pages
    const staticPages = [
      { url: "/", priority: 1.0 },
      { url: "/shop", priority: 0.9 },
      { url: "/about", priority: 0.8 },
      { url: "/contact", priority: 0.7 },
    ];

    // Generate sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static pages
    staticPages.forEach((page) => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Add products
    products.forEach((product) => {
      sitemap += `
  <url>
    <loc>${baseUrl}/product/${product.slug}</loc>
    <lastmod>${new Date(product._updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Add blog posts if they exist
    blogPosts.forEach((post) => {
      sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post._updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    sitemap += "\n</urlset>";

    return sitemap;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return null;
  }
};
