import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { client } from "../utils/sanity";
import LoadingSpinner from "../components/LoadingSpinner";

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [writeMode, setWriteMode] = useState(false);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    categories: "",
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "blogPost"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        mainImage{
          asset->{url}
        },
        excerpt,
        publishedAt,
        author,
        categories
      }`
      )
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((e) => {
        setError("Could not load blog posts");
        setLoading(false);
      });
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const postData = {
        _type: "blogPost",
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        categories: form.categories.split(",").map((cat) => cat.trim()),
        publishedAt: new Date().toISOString(),
        author: {
          _type: "reference",
          _ref: "author-id", // You'll need to replace this with the actual author ID
        },
      };

      await client.create(postData);
      // console.log("Post created successfully!");
      setForm({ title: "", excerpt: "", content: "", categories: "" });
      setWriteMode(false);
      // Refresh posts
      const updatedPosts = await client.fetch(
        `*[_type == "blogPost"] | order(publishedAt desc) {
          _id,
          title,
          slug,
          mainImage{
            asset->{url}
          },
          excerpt,
          publishedAt,
          author,
          categories
        }`
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Failed to create post. Please try again.", error);
    } finally {
      setCreating(false);
    }
  };

  const handlePublish = async (postId) => {
    try {
      await client.patch(postId).set({ published: true }).commit();
      fetchPosts();
    } catch (err) {
      console.error("Error publishing post:", err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-center text-red-600 py-10">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Essmey Blog</h1>
      <div className="grid gap-8">
        {posts.map((post) => (
          <div
            key={post._id}
            className="border rounded-xl overflow-hidden bg-white shadow"
          >
            {post.mainImage?.asset?.url && (
              <img
                src={post.mainImage.asset.url}
                alt={post.title}
                className="w-full h-64 object-cover object-center"
              />
            )}
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <div className="text-sm text-gray-500 mb-3">
                {new Date(post.publishedAt).toLocaleDateString()} &middot;{" "}
                {post.author?.name || "Unknown"}
              </div>
              <p className="mb-4 text-gray-700">
                {post.excerpt || "No excerpt available."}
              </p>
              <Link
                className="inline-block px-5 py-2 mt-2 bg-black text-white rounded hover:bg-gray-800 transition"
                to={`/blog/${post.slug?.current}`}
              >
                Read More
              </Link>
              {post.categories?.length && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.categories.map((cat) => (
                    <span
                      key={cat}
                      className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mb-4">
        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded shadow"
          onClick={() => setWriteMode((v) => !v)}
        >
          {writeMode ? "Cancel" : "Write a Blog"}
        </button>
      </div>
      {writeMode && (
        <form
          onSubmit={handleCreatePost}
          className="mb-8 bg-gray-50 p-4 rounded shadow"
        >
          <div className="mb-3">
            <label className="block text-sm font-semibold">Title</label>
            <input
              className="border mt-1 px-3 py-2 rounded w-full"
              type="text"
              name="title"
              required
              value={form.title}
              onChange={handleFormChange}
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-semibold">Excerpt</label>
            <textarea
              className="border mt-1 px-3 py-2 rounded w-full"
              name="excerpt"
              rows="2"
              required
              value={form.excerpt}
              onChange={handleFormChange}
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-semibold">
              Categories (comma separated)
            </label>
            <input
              className="border mt-1 px-3 py-2 rounded w-full"
              type="text"
              name="categories"
              value={form.categories}
              onChange={handleFormChange}
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-semibold">Content</label>
            <textarea
              className="border mt-1 px-3 py-2 rounded w-full"
              name="content"
              required
              rows="5"
              value={form.content}
              onChange={handleFormChange}
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="bg-black hover:bg-gray-800 transition text-white px-6 py-2 mt-2 rounded"
          >
            {creating ? "Publishing..." : "Publish Blog"}
          </button>
        </form>
      )}
    </div>
  );
}

export default Blog;
