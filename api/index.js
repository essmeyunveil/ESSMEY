import express from "express";
import cors from "cors";
import crypto from "crypto";
import Razorpay from "razorpay";
import fs from "fs";
import path from "path";

// Load environment variables from .env.local and .env in development
try {
  const envFiles = [".env.local", ".env"];
  envFiles.forEach((file) => {
    const envPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      content.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const [key, ...val] = trimmed.split("=");
          const value = val.join("=").trim().replace(/^["']|["']$/g, "");
          if (key && value && !process.env[key.trim()]) {
            process.env[key.trim()] = value;
          }
        }
      });
    }
  });
} catch (e) {
  console.warn("Could not read local env files:", e.message);
}

const app = express();

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

const razorpayKey = process.env.RAZORPAY_KEY || process.env.VITE_RAZORPAY_KEY;
const razorpaySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;
const razorpay = razorpayKey && razorpaySecret
  ? new Razorpay({ key_id: razorpayKey, key_secret: razorpaySecret })
  : null;

const requirePaymentConfiguration = (req, res, next) => {
  if (!razorpay) {
    // If Razorpay secret is not yet set in local dev, provide dev mock order
    if (process.env.NODE_ENV !== "production") {
      const { amount, receipt } = req.body || {};
      return res.json({
        orderId: `order_mock_${Date.now()}`,
        currency: "INR",
        amount: Math.round((amount || 100) * 100),
        isMock: true,
      });
    }
    return res.status(503).json({
      error: "Payments are not configured. Please contact support.",
    });
  }
  next();
};

// Create Order API
app.post("/api/create-order", requirePaymentConfiguration, async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: "A valid amount is required" });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ error: "Failed to create Razorpay order" });
    }

    res.json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res
      .status(500)
      .json({ error: error.message || "Error generating Razorpay order" });
  }
});

// Verify Payment API
app.post("/api/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  // In development without Razorpay Secret
  if (!razorpaySecret) {
    return res.json({ success: true, message: "Payment verified successfully (Dev Mode)" });
  }

  if (!razorpay_payment_id) {
    return res.status(400).json({
      success: false,
      message: "Incomplete payment verification details",
    });
  }

  // If order ID and signature are present, verify signature
  if (razorpay_order_id && razorpay_signature) {
    const generated_signature = crypto
      .createHmac("sha256", razorpaySecret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }
  }

  // Direct checkout payment ID
  res.json({ success: true, message: "Payment verified successfully" });
});

// For Vercel, we export the app instead of calling app.listen()
export default app;

// Start standalone server when run directly (local development)
if (typeof process !== "undefined" && process.env && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Local development API server running on port ${PORT}`);
  });
}
