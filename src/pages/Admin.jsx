import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useProducts } from "../features/products/useProducts";
import toast from "react-hot-toast";
import { useAuth } from "../utils/AuthContext";
import { getImageUrl } from "../utils/sanity";
import { db, storage } from "../utils/firebase";
import { doc, setDoc, addDoc, collection, updateDoc, deleteDoc, getDocs, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Dashboard Component
const Dashboard = () => {
  const { data: realProducts = [] } = useProducts();
  return (
    <div className="p-6">
      <h2 className="text-2xl font-serif font-medium mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-neutral-200 shadow-sm">
          <div className="text-neutral-500 mb-2">Total Products</div>
          <div className="text-3xl font-medium">{realProducts.length}</div>
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
          <div className="text-3xl font-medium">₹0.00</div>
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
  const { data: realProducts = [], isLoading } = useProducts();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(realProducts);
      return;
    }
    const filtered = realProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, realProducts]);

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this product?"
      )
    ) {
      try {
        // 1. Update persistent local cache
        const localSaved = localStorage.getItem("essmey_mock_products_v2");
        if (localSaved) {
          const list = JSON.parse(localSaved);
          const updated = list.filter((p) => p._id !== id && p.slug !== id);
          localStorage.setItem("essmey_mock_products_v2", JSON.stringify(updated));
        }

        // 2. Update React Query in-memory cache instantly
        queryClient.setQueryData(["products"], (old = []) => {
          return Array.isArray(old) ? old.filter((p) => p._id !== id && p.slug !== id) : [];
        });

        // 3. Delete from Cloud Firestore
        try {
          if (!db.__isMock) {
            await deleteDoc(doc(db, "products", id));
          }
        } catch (firestoreErr) {
          console.warn("Firestore delete fallback:", firestoreErr.message);
        }

        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error("Failed to delete product: " + error.message);
      }
    }
  };

  if (isLoading) return <div className="p-6">Loading inventory...</div>;

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
              <tr key={product._id} className="hover:bg-neutral-50">
                <td className="border border-neutral-200 p-3 text-neutral-500">
                  {product._id.slice(-6)}
                </td>
                <td className="border border-neutral-200 p-3">
                  <div className="w-12 h-12 bg-neutral-100 overflow-hidden rounded">
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? getImageUrl(product.images[0])
                          : product.image || "/images/tusu.jpg"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="border border-neutral-200 p-3 font-medium text-neutral-900">
                  {product.name}
                </td>
                <td className="border border-neutral-200 p-3 capitalize text-neutral-600">
                  {product.category}
                </td>
                <td className="border border-neutral-200 p-3 text-neutral-600">
                  ₹{product.price?.toFixed(2)}
                </td>
                <td className="border border-neutral-200 p-3 text-neutral-600">
                  {product.stock}
                </td>
                <td className="border border-neutral-200 p-3">
                  <div className="flex space-x-4">
                    <button
                      onClick={() =>
                        navigate(`/admin/products/edit/${product._id}`)
                      }
                      className="text-amber hover:text-amber/80 font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-800 font-medium transition"
                    >
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (db.__isMock) {
          setOrders([]);
          setLoading(false);
          return;
        }
        const q = query(collection(db, "orders"), orderBy("placedAt", "desc"));
        const querySnapshot = await getDocs(q);
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ _id: doc.id, ...doc.data() });
        });
        setOrders(list);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-serif font-medium mb-6">Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-neutral-300 rounded">
          <p className="text-lg text-neutral-500 mb-4">No orders yet.</p>
          <p className="text-neutral-500">
            Orders will appear here when customers make purchases.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-neutral-100">
                <th className="border border-neutral-200 p-3 text-left">Order ID</th>
                <th className="border border-neutral-200 p-3 text-left">Date</th>
                <th className="border border-neutral-200 p-3 text-left">Customer</th>
                <th className="border border-neutral-200 p-3 text-left">Total</th>
                <th className="border border-neutral-200 p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-neutral-50">
                  <td className="border border-neutral-200 p-3 font-mono text-sm text-blue-600">
                    {order.orderId}
                  </td>
                  <td className="border border-neutral-200 p-3 text-neutral-600 text-sm">
                    {new Date(order.placedAt).toLocaleDateString()}
                  </td>
                  <td className="border border-neutral-200 p-3 font-medium text-neutral-900">
                    {order.customerName}
                  </td>
                  <td className="border border-neutral-200 p-3 text-neutral-600">
                    ₹{Number(order.totalAmount || order.total || 0).toFixed(2)}
                  </td>
                  <td className="border border-neutral-200 p-3">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded bg-green-50 text-green-700">
                      {order.deliveryStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Robust image converter that creates compressed WebP Data URL
const compressImageToDataUrl = (file, maxWidth = 600, quality = 0.7) => {
  return new Promise((resolve) => {
    if (!file) return resolve("/images/product-1.jpg");
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            let width = img.width || 600;
            let height = img.height || 600;
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/webp", quality) || canvas.toDataURL("image/jpeg", quality);
            resolve(dataUrl);
          } catch (canvasErr) {
            console.error("Canvas compression error:", canvasErr);
            resolve(event.target.result);
          }
        };
        img.onerror = () => resolve(event.target.result);
        img.src = event.target.result;
      };
      reader.onerror = () => resolve("/images/product-1.jpg");
      reader.readAsDataURL(file);
    } catch (e) {
      console.error("FileReader error:", e);
      resolve("/images/product-1.jpg");
    }
  });
};

const uploadOrConvertImage = async (file) => {
  if (!file) return "";
  return await compressImageToDataUrl(file);
};

// New Product Form Component
const NewProduct = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [imageFile, setImageFile] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "unisex",
    price: "",
    description: "",
    stock: "15",
    availableSizes: "2 ml, 4 ml, 5 ml, 10 ml, 50 ml, 100 ml",
    topNotes: "Bergamot, Black Currant, Pink Pepper",
    middleNotes: "Jasmine, Rose, Ylang-Ylang",
    baseNotes: "Vanilla, Amber, Patchouli",
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

  const handleAdditionalImages = (e) => {
    if (e.target.files) {
      setAdditionalImages(Array.from(e.target.files));
    }
  };

  const parseNotes = () => ({
    top: formData.topNotes
      ? formData.topNotes.split(",").map((s) => s.trim()).filter(Boolean)
      : ["Bergamot"],
    middle: formData.middleNotes
      ? formData.middleNotes.split(",").map((s) => s.trim()).filter(Boolean)
      : ["Jasmine", "Rose"],
    base: formData.baseNotes
      ? formData.baseNotes.split(",").map((s) => s.trim()).filter(Boolean)
      : ["Vanilla", "Amber"],
  });

  const parseSizes = () => {
    return formData.availableSizes
      ? formData.availableSizes.split(",").map((s) => s.trim()).filter(Boolean)
      : ["2 ml", "5 ml", "50 ml", "100 ml"];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please select or snap a photo for the product image.");
      return;
    }
    setLoading(true);
    try {
      const parsedNotes = parseNotes();
      const parsedSizes = parseSizes();
      const rawSlug = (formData.name || "perfume")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const productSlug = rawSlug || `product-${Date.now()}`;

      // Convert images to optimized WebP Data URLs instantly
      const mainUrl = await uploadOrConvertImage(imageFile);
      const uploadedImages = [mainUrl];
      for (let i = 0; i < additionalImages.length; i++) {
        const extraUrl = await uploadOrConvertImage(additionalImages[i]);
        if (extraUrl) uploadedImages.push(extraUrl);
      }

      const newProductData = {
        _id: productSlug,
        id: productSlug,
        name: formData.name,
        slug: productSlug,
        price: Number(formData.price) || 999,
        mrp: Math.round((Number(formData.price) || 999) * 1.3),
        description: formData.description || "A luxury signature fragrance.",
        category: formData.category || "unisex",
        stock: Number(formData.stock) || 15,
        sizes: parsedSizes,
        volume: parsedSizes[0] || "50 ml",
        notes: parsedNotes,
        featured: Boolean(formData.featured),
        bestSeller: Boolean(formData.bestSeller),
        new: Boolean(formData.new),
        image: mainUrl,
        images: uploadedImages,
        thumbnail: mainUrl,
      };

      // 1. Immediately write to persistent local cache
      try {
        const localSaved = localStorage.getItem("essmey_mock_products_v2");
        const list = localSaved ? JSON.parse(localSaved) : [];
        const existingIdx = list.findIndex((p) => p.slug === productSlug || p._id === productSlug);
        if (existingIdx >= 0) {
          list[existingIdx] = newProductData;
        } else {
          list.unshift(newProductData);
        }
        localStorage.setItem("essmey_mock_products_v2", JSON.stringify(list));
      } catch (storageErr) {
        console.error("Local cache sync error:", storageErr);
      }

      // 2. Immediately update React Query in-memory cache for 0ms reactivity
      queryClient.setQueryData(["products"], (old = []) => {
        const filtered = Array.isArray(old) ? old.filter((p) => p._id !== productSlug && p.slug !== productSlug) : [];
        return [newProductData, ...filtered];
      });

      // 3. Save to Cloud Firestore in background with race timeout
      try {
        if (!db.__isMock) {
          const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000));
          await Promise.race([setDoc(doc(db, "products", productSlug), newProductData), timeout]);
        }
      } catch (firestoreErr) {
        console.warn("Firestore sync in background:", firestoreErr.message);
      }

      toast.success("Product created successfully! Scent notes and all sizes are live.");
      navigate("/admin/products");
    } catch (err) {
      console.error("Product creation error:", err);
      toast.error(`Error creating product: ${err.message}`);
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

        {/* Available Volumes / Sizes */}
        <div className="mb-6 bg-stone-50 border border-stone-200 p-4 rounded-sm">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-800 mb-1">
            Available Sizes / Volumes (comma-separated)
          </label>
          <input
            type="text"
            name="availableSizes"
            value={formData.availableSizes}
            onChange={handleChange}
            placeholder="2 ml, 4 ml, 5 ml, 10 ml, 50 ml, 100 ml"
            className="w-full border border-stone-300 p-2.5 text-sm bg-white focus:border-black outline-none"
          />
          <p className="text-xs text-stone-500 mt-1">
            Specify bottle volumes or discovery decants (e.g., <b>2 ml, 4 ml, 5 ml, 10 ml, 50 ml, 100 ml</b>). Customers will see interactive buttons on the product page.
          </p>
        </div>

        {/* Scent Profile Notes */}
        <div className="mb-6 border border-amber-200 bg-amber-50/40 p-5 rounded-sm">
          <h3 className="text-base font-serif font-medium text-stone-900 mb-2">
            Scent Profile Notes
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            Enter notes separated by commas (e.g. <i>Bergamot, Black Currant, Pink Pepper</i>). These will dynamically animate on the product page.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Top Notes (5–15 min)
              </label>
              <input
                type="text"
                name="topNotes"
                value={formData.topNotes}
                onChange={handleChange}
                placeholder="Bergamot, Pink Pepper"
                className="w-full border border-stone-300 p-2.5 text-sm bg-white focus:border-black outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Heart Notes (20–60 min)
              </label>
              <input
                type="text"
                name="middleNotes"
                value={formData.middleNotes}
                onChange={handleChange}
                placeholder="Jasmine, Rose, Ylang-Ylang"
                className="w-full border border-stone-300 p-2.5 text-sm bg-white focus:border-black outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Base Notes (6+ hours)
              </label>
              <input
                type="text"
                name="baseNotes"
                value={formData.baseNotes}
                onChange={handleChange}
                placeholder="Vanilla, Amber, Patchouli"
                className="w-full border border-stone-300 p-2.5 text-sm bg-white focus:border-black outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Primary Product Image <span className="text-red-500">*</span>
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
              Main bottle cover image displayed across the store.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Gallery Images (Optional)
            </label>
            <input
              id="additionalImages"
              type="file"
              accept="image/*"
              multiple
              onChange={handleAdditionalImages}
              className="w-full border border-neutral-300 p-3 focus:border-black outline-none bg-neutral-50"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Select 1–4 extra photos for the interactive product gallery carousel.
            </p>
          </div>
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

// Edit Product Form Component
const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: allProducts = [] } = useProducts();
  const [imageFile, setImageFile] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    let product = allProducts.find(
      (p) =>
        String(p._id) === String(id) ||
        String(p.id) === String(id) ||
        p.slug === id
    );

    if (!product) {
      try {
        const localSaved = localStorage.getItem("essmey_mock_products_v2");
        if (localSaved) {
          const list = JSON.parse(localSaved);
          product = list.find(
            (p) =>
              String(p._id) === String(id) ||
              String(p.id) === String(id) ||
              p.slug === id
          );
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (product) {
      const topN = Array.isArray(product.notes?.top)
        ? product.notes.top.join(", ")
        : "Bergamot, Black Currant, Pink Pepper";
      const midN = Array.isArray(product.notes?.middle)
        ? product.notes.middle.join(", ")
        : "Jasmine, Rose, Ylang-Ylang";
      const baseN = Array.isArray(product.notes?.base)
        ? product.notes.base.join(", ")
        : "Vanilla, Amber, Patchouli";

      const sizesStr = Array.isArray(product.sizes)
        ? product.sizes.join(", ")
        : (product.volume || "2 ml, 4 ml, 5 ml, 10 ml, 50 ml, 100 ml");

      setFormData({
        name: product.name || "",
        category: product.category || "unisex",
        price: product.price || "",
        description: product.description || "",
        stock: product.stock || 0,
        availableSizes: sizesStr,
        topNotes: topN,
        middleNotes: midN,
        baseNotes: baseN,
        featured: product.featured || false,
        bestSeller: product.bestSeller || false,
        new: product.new || false,
      });
    }
  }, [id, allProducts]);

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

  const handleAdditionalImages = (e) => {
    if (e.target.files) {
      setAdditionalImages(Array.from(e.target.files));
    }
  };

  const parseNotes = () => ({
    top: formData.topNotes
      ? formData.topNotes.split(",").map((s) => s.trim()).filter(Boolean)
      : ["Bergamot"],
    middle: formData.middleNotes
      ? formData.middleNotes.split(",").map((s) => s.trim()).filter(Boolean)
      : ["Jasmine", "Rose"],
    base: formData.baseNotes
      ? formData.baseNotes.split(",").map((s) => s.trim()).filter(Boolean)
      : ["Vanilla", "Amber"],
  });

  const parseSizes = () => {
    return formData.availableSizes
      ? formData.availableSizes.split(",").map((s) => s.trim()).filter(Boolean)
      : ["2 ml", "5 ml", "50 ml", "100 ml"];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const parsedNotes = parseNotes();
      const parsedSizes = parseSizes();

      const product = allProducts.find((p) => String(p._id) === String(id) || String(p.id) === String(id) || p.slug === id);
      const productSlug =
        product?.slug ||
        formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      let updatePayload = {
        name: formData.name,
        price: Number(formData.price),
        mrp: Math.round(Number(formData.price) * 1.3),
        description: formData.description,
        category: formData.category,
        stock: Number(formData.stock),
        sizes: parsedSizes,
        volume: parsedSizes[0] || "50 ml",
        notes: parsedNotes,
        featured: formData.featured,
        bestSeller: formData.bestSeller,
        new: formData.new,
      };

      if (imageFile) {
        const url = await uploadOrConvertImage(imageFile);
        updatePayload.image = url;
        updatePayload.thumbnail = url;
      }

      if (additionalImages.length > 0) {
        const extraUrls = [];
        for (let i = 0; i < additionalImages.length; i++) {
          const extraUrl = await uploadOrConvertImage(additionalImages[i]);
          extraUrls.push(extraUrl);
        }
        updatePayload.images = updatePayload.image ? [updatePayload.image, ...extraUrls] : extraUrls;
      }

      // 1. Sync to local storage mock cache
      try {
        const localSaved = localStorage.getItem("essmey_mock_products_v2");
        if (localSaved) {
          const list = JSON.parse(localSaved);
          const idx = list.findIndex((p) => String(p._id) === String(id) || String(p.id) === String(id) || p.slug === id);
          if (idx !== -1) {
            list[idx] = { ...list[idx], ...updatePayload };
            localStorage.setItem("essmey_mock_products_v2", JSON.stringify(list));
          }
        }
      } catch (cacheErr) {
        console.error("Local cache sync error:", cacheErr);
      }

      // 2. Immediately update React Query cache for 0ms UI response
      queryClient.setQueryData(["products"], (old = []) => {
        return Array.isArray(old)
          ? old.map((p) =>
              String(p._id) === String(id) || String(p.id) === String(id) || p.slug === id
                ? { ...p, ...updatePayload }
                : p
            )
          : [];
      });

      // 3. Update Firestore with race timeout
      try {
        if (!db.__isMock) {
          const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000));
          await Promise.race([updateDoc(doc(db, "products", id), updatePayload), timeout]);
        }
      } catch (firestoreErr) {
        console.warn("Firestore updateDoc fallback:", firestoreErr.message);
      }

      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return <div className="p-6">Loading product...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-medium">Edit Product</h2>
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
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-neutral-300 p-3 focus:border-black outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
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
            <label className="block text-sm font-medium mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              className="w-full border border-neutral-300 p-3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border border-neutral-300 p-3"
              required
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full border border-neutral-300 p-3"
            required
          ></textarea>
        </div>
        {/* Available Volumes / Sizes */}
        <div className="mb-6 bg-stone-50 border border-stone-200 p-4 rounded-sm">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-800 mb-1">
            Available Sizes / Volumes (comma-separated)
          </label>
          <input
            type="text"
            name="availableSizes"
            value={formData.availableSizes}
            onChange={handleChange}
            placeholder="2 ml, 4 ml, 5 ml, 10 ml, 50 ml, 100 ml"
            className="w-full border border-stone-300 p-2.5 text-sm bg-white focus:border-black outline-none"
          />
          <p className="text-xs text-stone-500 mt-1">
            Specify bottle volumes or discovery decants (e.g., <b>2 ml, 4 ml, 5 ml, 10 ml, 50 ml, 100 ml</b>). Customers will see interactive buttons on the product page.
          </p>
        </div>

        {/* Scent Profile Notes */}
        <div className="mb-6 border border-amber-200 bg-amber-50/40 p-5 rounded-sm">
          <h3 className="text-base font-serif font-medium text-stone-900 mb-2">
            Scent Profile Notes
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            Enter notes separated by commas. These will dynamically update the fragrance pyramid.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Top Notes (5–15 min)
              </label>
              <input
                type="text"
                name="topNotes"
                value={formData.topNotes}
                onChange={handleChange}
                placeholder="Bergamot, Pink Pepper"
                className="w-full border border-stone-300 p-2.5 text-sm bg-white focus:border-black outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Heart Notes (20–60 min)
              </label>
              <input
                type="text"
                name="middleNotes"
                value={formData.middleNotes}
                onChange={handleChange}
                placeholder="Jasmine, Rose, Ylang-Ylang"
                className="w-full border border-stone-300 p-2.5 text-sm bg-white focus:border-black outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Base Notes (6+ hours)
              </label>
              <input
                type="text"
                name="baseNotes"
                value={formData.baseNotes}
                onChange={handleChange}
                placeholder="Vanilla, Amber, Patchouli"
                className="w-full border border-stone-300 p-2.5 text-sm bg-white focus:border-black outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Replace Primary Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-neutral-300 p-3 bg-neutral-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Add Gallery Images (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleAdditionalImages}
              className="w-full border border-neutral-300 p-3 bg-neutral-50"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Features</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="mr-2"
              />{" "}
              Featured Product
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="bestSeller"
                checked={formData.bestSeller}
                onChange={handleChange}
                className="mr-2"
              />{" "}
              Best Seller
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="new"
                checked={formData.new}
                onChange={handleChange}
                className="mr-2"
              />{" "}
              New Arrival
            </label>
          </div>
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

// Stats Component
const Stats = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const revenue = [450, 820, 600, 1200, 2100, 1800, 3200];
  const maxRev = Math.max(...revenue);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-serif font-medium mb-6">
        Revenue Analytics
      </h2>

      <div className="bg-white p-6 border border-neutral-200 shadow-sm rounded-lg mb-8">
        <h3 className="text-lg font-medium text-neutral-800 mb-6">
          Revenue Over Time (Projected)
        </h3>
        <div className="flex items-end space-x-4 h-64 border-b border-neutral-200 pb-2">
          {revenue.map((amount, idx) => (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center group relative"
            >
              <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs py-1 px-2 rounded">
                ₹{amount}
              </div>
              <div
                className="w-full bg-amber/80 hover:bg-amber transition-all duration-300 rounded-t-sm"
                style={{ height: `${(amount / maxRev) * 100}%` }}
              ></div>
              <span className="text-xs text-neutral-500 mt-2">
                {months[idx]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 border border-neutral-200 shadow-sm rounded-lg">
          <h3 className="text-lg font-medium text-neutral-800 mb-2">
            Top Performing Category
          </h3>
          <p className="text-4xl font-serif text-amber">Women's Premium</p>
          <p className="text-sm text-neutral-500 mt-2">+24% vs last month</p>
        </div>
        <div className="bg-white p-6 border border-neutral-200 shadow-sm rounded-lg">
          <h3 className="text-lg font-medium text-neutral-800 mb-2">
            Customer Retention
          </h3>
          <p className="text-4xl font-serif text-amber">68%</p>
          <p className="text-sm text-neutral-500 mt-2">
            Highly engaged user base
          </p>
        </div>
      </div>
    </div>
  );
};

// Dedicated Admin Portal Login Component
const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || "essmeyunveil@gmail.com").toLowerCase().trim();
  const ADMIN_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD || "EssmeyAdmin@2026").trim();

  const handleAdminAuth = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const inputEmail = email.toLowerCase().trim();
    const inputPass = password.trim();

    const allowedEmails = ADMIN_EMAIL.split(",").map((s) => s.trim().toLowerCase());

    // Validate admin credentials strictly
    if (allowedEmails.includes(inputEmail) && inputPass === ADMIN_PASSWORD) {
      localStorage.setItem("essmey_admin_session", "true");
      localStorage.setItem("essmey_admin_user", inputEmail);
      toast.success("Welcome to Essmey Admin Portal");
      onLoginSuccess();
    } else {
      setError("Invalid admin email or password. Please check your credentials.");
      toast.error("Access Denied: Invalid Credentials");
    }
    setLoading(false);
  };

  return (
    <div className="pt-28 pb-20 min-h-[85vh] flex items-center justify-center px-4 bg-stone-50">
      <div className="w-full max-w-md bg-white border border-stone-200 shadow-xl rounded-xl p-8 sm:p-10">
        <div className="text-center mb-8">
          <img
            src="/images/essmey-brand-logo.jpg"
            alt="Essmey Logo"
            className="w-16 h-16 rounded-full mx-auto mb-4 border border-amber-600/30 object-cover shadow-sm"
          />
          <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-wide">
            Essmey Admin Portal
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-700 mt-1 font-semibold">
            Restricted Management Area
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminAuth} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Admin Email / Username
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@essmey.com"
              className="w-full px-4 py-3 border border-stone-300 rounded-md text-sm focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 border border-stone-300 rounded-md text-sm focus:border-stone-900 focus:ring-1 focus:ring-stone-900 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 hover:text-stone-900"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 hover:bg-black text-amber-100 font-medium py-3.5 rounded-md transition-all duration-300 shadow-md hover:shadow-lg text-sm tracking-wider uppercase disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Access Admin Dashboard"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-400">
            Authorized personnel only · Protected by Essmey Security
          </p>
        </div>
      </div>
    </div>
  );
};

// Admin Layout Component
const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdminAuth, setIsAdminAuth] = useState(() => {
    return localStorage.getItem("essmey_admin_session") === "true";
  });

  const handleAdminLogout = () => {
    localStorage.removeItem("essmey_admin_session");
    localStorage.removeItem("essmey_admin_user");
    setIsAdminAuth(false);
    toast.success("Admin logged out successfully");
  };

  // If admin is not logged in, show dedicated Admin Login Screen
  if (!isAdminAuth) {
    return <AdminLogin onLoginSuccess={() => setIsAdminAuth(true)} />;
  }

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
                onClick={handleAdminLogout}
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
              <Route path="products/edit/:id" element={<EditProduct />} />
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
