import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { products } from "../utils/sampleData";
import { useAuth } from "../utils/AuthContext";
import { client } from "../utils/sanity";

// Dashboard Component
const Dashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-serif font-medium mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-neutral-200 shadow-sm">
          <div className="text-neutral-500 mb-2">Total Products</div>
          <div className="text-3xl font-medium">{products.length}</div>
          <div className="mt-4 text-sm">
            <Link
              to="/admin/products"
              className="text-blue-600 hover:underline"
            >
              View all products →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 border border-neutral-200 shadow-sm">
          <div className="text-neutral-500 mb-2">Total Orders</div>
          <div className="text-3xl font-medium">0</div>
          <div className="mt-4 text-sm">
            <Link to="/admin/orders" className="text-blue-600 hover:underline">
              View all orders →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 border border-neutral-200 shadow-sm">
          <div className="text-neutral-500 mb-2">Total Revenue</div>
          <div className="text-3xl font-medium">$0.00</div>
          <div className="mt-4 text-sm">
            <Link to="/admin/stats" className="text-blue-600 hover:underline">
              View stats →
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/products/new" className="btn-primary">
            Add New Product
          </Link>
          <Link to="/admin/orders" className="btn-secondary">
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

// Products List Component
const ProductsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-medium">Products</h2>
        <Link to="/admin/products/new" className="btn-primary">
          Add New Product
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-72 border border-neutral-300 p-3 focus:border-black outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-neutral-100">
              <th className="border border-neutral-200 p-3 text-left">ID</th>
              <th className="border border-neutral-200 p-3 text-left">Image</th>
              <th className="border border-neutral-200 p-3 text-left">Name</th>
              <th className="border border-neutral-200 p-3 text-left">
                Category
              </th>
              <th className="border border-neutral-200 p-3 text-left">Price</th>
              <th className="border border-neutral-200 p-3 text-left">Stock</th>
              <th className="border border-neutral-200 p-3 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-neutral-50">
                <td className="border border-neutral-200 p-3">{product.id}</td>
                <td className="border border-neutral-200 p-3">
                  <div className="w-12 h-12 bg-neutral-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="border border-neutral-200 p-3">
                  {product.name}
                </td>
                <td className="border border-neutral-200 p-3 capitalize">
                  {product.category}
                </td>
                <td className="border border-neutral-200 p-3">
                  ${product.price.toFixed(2)}
                </td>
                <td className="border border-neutral-200 p-3">
                  {product.stock}
                </td>
                <td className="border border-neutral-200 p-3">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-lg text-neutral-500">No products found.</p>
        </div>
      )}
    </div>
  );
};

// Orders List Component
const OrdersList = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-serif font-medium mb-6">Orders</h2>

      <div className="text-center py-12 border border-dashed border-neutral-300 rounded">
        <p className="text-lg text-neutral-500 mb-4">No orders yet.</p>
        <p className="text-neutral-500">
          Orders will appear here when customers make purchases.
        </p>
      </div>
    </div>
  );
};

// New Product Form Component
const NewProduct = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "women",
    price: "",
    description: "",
    stock: "",
    featured: false,
    bestSeller: false,
    new: true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please select or snap a photo for the product image.");
      return;
    }
    setLoading(true);
    try {
      // 1. Upload image to Sanity
      const imageAsset = await client.assets.upload('image', imageFile, {
        filename: imageFile.name
      });
      
      // 2. Create product with the newly uploaded image
      await client.create({
        _type: "product",
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        category: formData.category,
        stock: Number(formData.stock),
        featured: formData.featured,
        bestSeller: formData.bestSeller,
        new: formData.new,
        image: imageAsset.url,
        images: [
          {
            _type: 'image',
            asset: {
              _type: "reference",
              _ref: imageAsset._id
            }
          }
        ]
      });
      
      // Clear cache so the new product shows up instantly on the live website
      sessionStorage.removeItem('products');
      sessionStorage.removeItem('products_timestamp');
      sessionStorage.removeItem('featured_products');
      sessionStorage.removeItem('bestsellers');
      sessionStorage.removeItem('home_cache_timestamp');

      // Reset form on success
      alert("Product created successfully! It is now live on the website.");
      setImageFile(null);
      const fileInput = document.getElementById('productImage');
      if (fileInput) fileInput.value = "";
      setFormData({
        name: "",
        category: "women",
        price: "",
        description: "",
        stock: "",
        featured: false,
        bestSeller: false,
        new: true,
      });
    } catch (error) {
      console.error("Failed to create product. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-medium">Add New Product</h2>
        <button
          onClick={() => navigate("/admin/products")}
          className="text-neutral-600 hover:text-neutral-900"
        >
          Cancel
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 border border-neutral-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-neutral-300 p-3 focus:border-black outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-2"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-neutral-300 p-3 focus:border-black outline-none"
              required
            >
              <option value="women">Women</option>
              <option value="men">Men</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-2">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full border border-neutral-300 p-3 focus:border-black outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium mb-2">
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="w-full border border-neutral-300 p-3 focus:border-black outline-none"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-2"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full border border-neutral-300 p-3 focus:border-black outline-none"
            required
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Product Image / Take Photo <span className="text-red-500">*</span>
          </label>
          <input
            id="productImage"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            required
            className="w-full border border-neutral-300 p-3 focus:border-black outline-none bg-neutral-50"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Snap a photo directly from your mobile camera to upload to your store.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Product Features
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Featured Product</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="bestSeller"
                checked={formData.bestSeller}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Best Seller</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="new"
                checked={formData.new}
                onChange={handleChange}
                className="mr-2"
              />
              <span>New Arrival</span>
            </label>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

// Stats Component
const Stats = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-serif font-medium mb-6">Statistics</h2>

      <div className="text-center py-12 border border-dashed border-neutral-300 rounded">
        <p className="text-lg text-neutral-500 mb-4">No stats available yet.</p>
        <p className="text-neutral-500">
          Stats will be available once you start receiving orders.
        </p>
      </div>
    </div>
  );
};

// Admin Layout Component
const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const checkAuth = () => {
    // TEMPORARILY BYPASSED FOR TESTING
    /* 
    if (!isAuthenticated) {
      navigate("/login");
      return false;
    }
    */
    return true;
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // TEMPORARILY BYPASSED
  // if (!isAuthenticated) return null;

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        <h1 className="text-3xl font-serif font-medium mb-8">Admin Panel</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-neutral-200 divide-y divide-neutral-200">
              <Link
                to="/admin"
                className={`block p-4 hover:bg-neutral-50 ${
                  location.pathname === "/admin"
                    ? "bg-neutral-100 font-medium"
                    : ""
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/products"
                className={`block p-4 hover:bg-neutral-50 ${
                  location.pathname.includes("/admin/products")
                    ? "bg-neutral-100 font-medium"
                    : ""
                }`}
              >
                Products
              </Link>
              <Link
                to="/admin/orders"
                className={`block p-4 hover:bg-neutral-50 ${
                  location.pathname.includes("/admin/orders")
                    ? "bg-neutral-100 font-medium"
                    : ""
                }`}
              >
                Orders
              </Link>
              <Link
                to="/admin/stats"
                className={`block p-4 hover:bg-neutral-50 ${
                  location.pathname.includes("/admin/stats")
                    ? "bg-neutral-100 font-medium"
                    : ""
                }`}
              >
                Statistics
              </Link>
              <button
                onClick={() => {
                  navigate("/login");
                }}
                className="block w-full text-left p-4 text-red-600 hover:bg-neutral-50"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 bg-white border border-neutral-200">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductsList />} />
              <Route path="products/new" element={<NewProduct />} />
              <Route path="orders" element={<OrdersList />} />
              <Route path="stats" element={<Stats />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Admin Component
const Admin = () => {
  return <AdminLayout />;
};

export default Admin;
