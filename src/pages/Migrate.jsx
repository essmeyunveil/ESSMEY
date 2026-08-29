import { useState } from "react";
import { Link } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "../utils/firebase";

// Import JSON backups
import productsBackup from "../sanity_backup/product_backup.json";
import blogsBackup from "../sanity_backup/blogPost_backup.json";
import testimonialsBackup from "../sanity_backup/testimonial_backup.json";
import newsletterBackup from "../sanity_backup/newsletter_backup.json";

function getSanityCdnUrl(ref, projectId = "g7s2wujj", dataset = "production") {
  if (!ref || typeof ref !== "string" || !ref.startsWith("image-")) return null;
  const parts = ref.split("-");
  if (parts.length < 4) return null;
  const assetId = parts[1];
  const dimensions = parts[2];
  const extension = parts[3];
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}-${dimensions}.${extension}`;
}

export default function Migrate() {
  const [logs, setLogs] = useState([]);
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [currentSchema, setCurrentSchema] = useState("");

  const addLog = (message, type = "info") => {
    setLogs((prev) => [{ time: new Date().toLocaleTimeString(), message, type }, ...prev]);
  };

  const migrateTestimonials = async () => {
    if (isMigrating) return;
    setIsMigrating(true);
    setCurrentSchema("Testimonials");
    setProgress({ current: 0, total: testimonialsBackup.length });
    setLogs([]);
    addLog(`Starting migration of ${testimonialsBackup.length} testimonials...`);

    try {
      if (db.__isMock) {
        throw new Error("Firebase is running in local MOCK mode. Please set valid Firebase env variables in .env.local to write to Firestore.");
      }

      for (let i = 0; i < testimonialsBackup.length; i++) {
        const item = testimonialsBackup[i];
        addLog(`Migrating testimonial from ${item.name || "Unknown"}...`);

        // Construct standard data
        const testimonialData = {
          name: item.name || "Anonymous",
          location: item.location || "",
          rating: Number(item.rating) || 5,
          text: item.text || "",
          imageUrl: item.imageUrl || null,
          createdAt: item._createdAt || new Date().toISOString(),
        };

        // Write to Firestore
        await setDoc(doc(db, "testimonials", item._id), testimonialData);
        setProgress((prev) => ({ ...prev, current: i + 1 }));
        addLog(`Successfully migrated testimonial: ${item.name}`, "success");
      }
      addLog("Testimonials migration completed successfully!", "success");
    } catch (error) {
      addLog(`Migration failed: ${error.message}`, "error");
    } finally {
      setIsMigrating(false);
    }
  };

  const migrateBlogs = async () => {
    if (isMigrating) return;
    setIsMigrating(true);
    setCurrentSchema("Blogs");
    setProgress({ current: 0, total: blogsBackup.length });
    setLogs([]);
    addLog(`Starting migration of ${blogsBackup.length} blogs...`);

    try {
      if (db.__isMock) {
        throw new Error("Firebase is running in local MOCK mode. Please configure Firebase env variables in .env.local.");
      }

      for (let i = 0; i < blogsBackup.length; i++) {
        const item = blogsBackup[i];
        addLog(`Migrating blog: ${item.title}...`);

        let mainImageUrl = null;
        if (item.mainImage?.asset?._ref) {
          const cdnUrl = getSanityCdnUrl(item.mainImage.asset._ref);
          if (cdnUrl) {
            addLog(`Downloading image for blog: ${item.title}...`);
            try {
              const res = await fetch(cdnUrl);
              const blob = await res.blob();
              const storageRef = ref(storage, `blogs/${item.slug?.current || item._id}/mainImage.jpg`);
              addLog(`Uploading image to Firebase Storage...`);
              await uploadBytes(storageRef, blob);
              mainImageUrl = await getDownloadURL(storageRef);
              addLog(`Uploaded image: ${mainImageUrl}`, "success");
            } catch (imgErr) {
              addLog(`Failed to migrate image for blog ${item.title}: ${imgErr.message}`, "warning");
            }
          }
        }

        const blogData = {
          title: item.title,
          slug: item.slug?.current || "",
          excerpt: item.excerpt || "",
          content: item.content || [],
          publishedAt: item.publishedAt || new Date().toISOString(),
          categories: item.categories || [],
          mainImage: mainImageUrl,
          author: item.author || { name: "Essmey Editor" },
          featured: item.featured || false,
          readTime: Number(item.readTime) || 3,
        };

        await setDoc(doc(db, "blogs", item._id), blogData);
        setProgress((prev) => ({ ...prev, current: i + 1 }));
        addLog(`Successfully migrated blog: ${item.title}`, "success");
      }
      addLog("Blogs migration completed successfully!", "success");
    } catch (error) {
      addLog(`Migration failed: ${error.message}`, "error");
    } finally {
      setIsMigrating(false);
    }
  };

  const migrateProducts = async () => {
    if (isMigrating) return;
    setIsMigrating(true);
    setCurrentSchema("Products");
    setProgress({ current: 0, total: productsBackup.length });
    setLogs([]);
    addLog(`Starting migration of ${productsBackup.length} products...`);

    try {
      if (db.__isMock) {
        throw new Error("Firebase is running in local MOCK mode. Configure real Firebase credentials to write to Firestore.");
      }

      for (let i = 0; i < productsBackup.length; i++) {
        const item = productsBackup[i];
        const productSlug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        addLog(`[${i + 1}/${productsBackup.length}] Migrating product: ${item.name}...`);

        const imageUrls = [];
        if (item.images && item.images.length > 0) {
          for (let j = 0; j < item.images.length; j++) {
            const imgRefObj = item.images[j];
            if (imgRefObj.asset?._ref) {
              const cdnUrl = getSanityCdnUrl(imgRefObj.asset._ref);
              if (cdnUrl) {
                addLog(`Downloading image ${j + 1}/${item.images.length} from Sanity CDN...`);
                try {
                  const res = await fetch(cdnUrl);
                  const blob = await res.blob();
                  const extension = imgRefObj.asset._ref.endsWith("png") ? "png" : "jpg";
                  const storageRef = ref(storage, `products/${productSlug}/image-${j + 1}.${extension}`);
                  addLog(`Uploading image ${j + 1} to Firebase Storage...`);
                  await uploadBytes(storageRef, blob);
                  const url = await getDownloadURL(storageRef);
                  imageUrls.push(url);
                  addLog(`Uploaded image ${j + 1} successfully`, "success");
                } catch (imgErr) {
                  addLog(`Failed to migrate image ${j + 1} for ${item.name}: ${imgErr.message}`, "warning");
                }
              }
            }
          }
        }

        const productData = {
          name: item.name,
          slug: productSlug,
          category: item.category || "unisex",
          price: Number(item.price) || 0,
          mrp: Number(item.mrp) || Number(item.price) || 0,
          description: item.description || "",
          shortDescription: item.description?.slice(0, 120) + "..." || "",
          images: imageUrls,
          thumbnail: imageUrls[0] || "/images/product-1.jpg",
          stock: Number(item.stock) || 0,
          sku: item.sku || `ESS-${productSlug.slice(0, 8).toUpperCase()}-${i + 1}`,
          featured: !!item.featured,
          bestSeller: !!item.bestSeller,
          newArrival: !!item.new,
          status: "published",
          notes: item.notes || { top: [], middle: [], base: [] },
          createdAt: item._createdAt || new Date().toISOString(),
        };

        await setDoc(doc(db, "products", item._id), productData);
        setProgress((prev) => ({ ...prev, current: i + 1 }));
        addLog(`Successfully migrated product: ${item.name}`, "success");
      }
      addLog("Products migration completed successfully!", "success");
    } catch (error) {
      addLog(`Migration failed: ${error.message}`, "error");
    } finally {
      setIsMigrating(false);
    }
  };

  const migrateNewsletter = async () => {
    if (isMigrating) return;
    setIsMigrating(true);
    setCurrentSchema("Newsletter");
    setProgress({ current: 0, total: newsletterBackup.length });
    setLogs([]);
    addLog(`Starting migration of ${newsletterBackup.length} newsletter subscribers...`);

    try {
      if (db.__isMock) {
        throw new Error("Firebase is running in local MOCK mode. Configure real Firebase credentials.");
      }

      for (let i = 0; i < newsletterBackup.length; i++) {
        const item = newsletterBackup[i];
        addLog(`Migrating newsletter subscriber: ${item.email}...`);

        const subscriberData = {
          email: item.email,
          subscribedAt: item._createdAt || new Date().toISOString(),
        };

        await setDoc(doc(db, "newsletter", item._id), subscriberData);
        setProgress((prev) => ({ ...prev, current: i + 1 }));
        addLog(`Successfully migrated newsletter: ${item.email}`, "success");
      }
      addLog("Newsletter migration completed successfully!", "success");
    } catch (error) {
      addLog(`Migration failed: ${error.message}`, "error");
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md p-8 border">
          <h1 className="text-3xl font-serif font-bold text-neutral-800 mb-2">
            ESSMEY Data Migration Panel
          </h1>
          <p className="text-neutral-500 mb-8">
            Hum Sanity se direct data aur images ko aapke Firebase Firestore aur Storage bucket me migrate karenge.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <button
              onClick={migrateTestimonials}
              disabled={isMigrating}
              className="py-4 px-3 bg-white hover:bg-neutral-50 border rounded-lg shadow-sm font-medium transition text-center disabled:opacity-50"
            >
              <div className="text-2xl mb-1">⭐</div>
              <div className="text-sm font-semibold">Testimonials</div>
              <div className="text-xs text-neutral-400 mt-1">{testimonialsBackup.length} docs</div>
            </button>
            <button
              onClick={migrateBlogs}
              disabled={isMigrating}
              className="py-4 px-3 bg-white hover:bg-neutral-50 border rounded-lg shadow-sm font-medium transition text-center disabled:opacity-50"
            >
              <div className="text-2xl mb-1">✍️</div>
              <div className="text-sm font-semibold">Blog Posts</div>
              <div className="text-xs text-neutral-400 mt-1">{blogsBackup.length} docs</div>
            </button>
            <button
              onClick={migrateProducts}
              disabled={isMigrating}
              className="py-4 px-3 bg-white hover:bg-neutral-50 border rounded-lg shadow-sm font-medium transition text-center disabled:opacity-50"
            >
              <div className="text-2xl mb-1">🏺</div>
              <div className="text-sm font-semibold">Products</div>
              <div className="text-xs text-neutral-400 mt-1">{productsBackup.length} docs</div>
            </button>
            <button
              onClick={migrateNewsletter}
              disabled={isMigrating}
              className="py-4 px-3 bg-white hover:bg-neutral-50 border rounded-lg shadow-sm font-medium transition text-center disabled:opacity-50"
            >
              <div className="text-2xl mb-1">✉️</div>
              <div className="text-sm font-semibold">Newsletter</div>
              <div className="text-xs text-neutral-400 mt-1">{newsletterBackup.length} docs</div>
            </button>
          </div>

          {isMigrating && (
            <div className="mb-8 p-4 bg-neutral-50 border rounded-lg">
              <div className="flex justify-between items-center text-sm font-medium mb-2">
                <span>Migrating {currentSchema}...</span>
                <span>
                  {progress.current} / {progress.total} (
                  {Math.round((progress.current / progress.total) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber h-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="border rounded-lg bg-neutral-900 text-neutral-200 p-4 h-80 overflow-y-auto font-mono text-xs flex flex-col-reverse">
            {logs.length === 0 ? (
              <div className="text-neutral-500 text-center py-20 font-sans">
                Select a migration category to start logging.
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={`mb-1 ${
                    log.type === "success"
                      ? "text-green-400"
                      : log.type === "error"
                      ? "text-red-400"
                      : log.type === "warning"
                      ? "text-yellow-400"
                      : "text-neutral-200"
                  }`}
                >
                  <span className="text-neutral-500">[{log.time}]</span> {log.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
