import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom max-w-3xl mx-auto text-center">
        <h1 className="text-6xl font-serif font-bold mb-6">404</h1>
        <h2 className="text-3xl font-serif mb-4">Page Not Found</h2>
        <p className="text-neutral-600 mb-8">
          We couldn't find the page you're looking for. The page may have been
          moved, deleted, or never existed.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/"
            className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-neutral-800 transition"
          >
            Return to Homepage
          </Link>
          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
            className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-neutral-800 transition"
          >
            Return to Previous Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
