import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../utils/sanity";
import { PortableText } from "@portabletext/react";
import LoadingSpinner from "../components/LoadingSpinner";

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await client.fetch(
          `*[_type == "post" && slug.current == $slug][0]`,
          { slug }
        );
        setPost(post);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-center text-red-600 py-10">{error}</div>;
  if (!post)
    return <div className="text-center py-10">No blog post found.</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="text-sm text-gray-500 mb-6">
        {new Date(post.publishedAt).toLocaleDateString()} &middot;{" "}
        {post.author?.name || "Unknown"}
      </div>
      {post.mainImage?.asset?.url && (
        <img
          src={post.mainImage.asset.url}
          alt={post.title}
          className="w-full rounded-lg mb-4 object-cover h-72"
        />
      )}
      <div className="prose prose-yellow max-w-none pb-4">
        <PortableText value={post.content} />
      </div>
      {post.categories?.length && (
        <div className="mt-6 flex flex-wrap gap-2">
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
  );
}

export default BlogPost;
