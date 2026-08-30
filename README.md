# ✨ ESSMEY — Luxury Indian Artisanal Perfumery

<div align="center">

<img src="public/images/essmey-brand-logo.jpg" alt="Essmey Logo" width="120" style="border-radius: 50%; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" />

### *"Scent is the quietest signature."*

[![Live Website](https://img.shields.io/badge/🌐_Live_Store-essmey.com-b8860b?style=for-the-badge)](https://essmey.com)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Google_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay_Payments-0C2340?style=for-the-badge&logo=razorpay&logoColor=3395FF)](https://razorpay.com/)

[Explore Store](https://essmey.com) • [Shop Fragrances](https://essmey.com/shop) • [Admin Portal](https://essmey.com/admin) • [Scent Finder](https://essmey.com/scent-finder)

---

</div>

## 🌟 Overview

**ESSMEY** is a luxury direct-to-consumer (D2C) e-commerce storefront crafted for artisanal Indian perfumes. Engineered with React 18, Vite, Tailwind CSS, Google Cloud Firestore, Clerk Authentication, and Razorpay Payments, ESSMEY delivers a sensory, high-performance shopping experience with sub-second page loads, real-time cloud inventory, interactive scent pyramids, and multi-volume decant options.

---

## 💎 Key Features

```
  ┌────────────────────────────────────────────────────────────────────────┐
  │                           ESSMEY ECOSYSTEM                             │
  └────────────────────────────────────────────────────────────────────────┘
         │                                    │
   🛒 CUSTOMER STOREFRONT               👑 ADMIN MANAGEMENT
   ├── 🌿 Scent Pyramid Breakdown       ├── ➕ 0ms Manual Product Creator
   ├── 🧴 Multi-Volume Decants Selector ├── 🖼️ In-Browser WebP Image Optimizer
   ├── ⚡ Cache-First Instant Loading   ├── 📊 Cloud Firestore Sync
   ├── 💳 Instant Razorpay Checkout     ├── 📦 Real-Time Order Manager
   └── 🔐 Clerk Authentication          └── 🛡️ Dedicated Credential Guard
```

### 🛍️ Customer Experience
- **🌿 Interactive Fragrance Pyramid:** Visual breakdown of Top Notes (5–15 min), Heart Notes (20–60 min), and Base Notes (6+ hours).
- **🧴 Multi-Volume Decants & Bottles:** Seamlessly switch between sample discovery decants (`2 ml`, `4 ml`, `5 ml`, `10 ml`) and full luxury bottles (`50 ml`, `100 ml`).
- **⚡ 0ms Instant Product Resolution:** Cache-first architecture backed by React Query and persistent storage.
- **💳 Instant Razorpay Gateway:** Preloaded SDK for fast payment popup.
- **🔍 Scent Finder & Discovery:** Intuitive quiz guiding users to their signature fragrance.
- **❤️ Wishlist & Cart System:** Persistent local state synchronized across browser sessions.

### 👑 Admin Management Portal (`/admin`)
- **📦 Cloud Inventory Management:** Real-time synchronization with **Google Cloud Firestore**.
- **🖼️ Automatic WebP Image Optimization:** Client-side image compression with zero CORS latency.
- **🛡️ Secure Access:** Protected by dedicated admin credentials (`VITE_ADMIN_EMAIL` & `VITE_ADMIN_PASSWORD`).

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18 + Vite | Lightning-fast development & production bundles |
| **Styling & UI** | Tailwind CSS + Framer Motion | High-end luxury typography, glassmorphism & smooth animations |
| **State & Cache** | TanStack React Query + Zustand | In-memory data caching & instant optimistic UI updates |
| **Cloud Database** | Google Cloud Firestore | Real-time global database for products, stock & orders |
| **Authentication** | Clerk Auth | Secure multi-device user sign-in & session management |
| **Payments** | Razorpay SDK | Instant UPI, Cards, Netbanking & Wallet processing |
| **Hosting & CI/CD** | Hostinger Node Git Deploy | Automatic continuous deployment on `git push` |

---

## 📁 Project Structure

```bash
ESSMEY/
├── api/                   # Serverless backend functions & Razorpay verification
│   └── index.js
├── public/                # Public static assets & brand images
│   ├── images/
│   └── .htaccess          # Apache rewrite rules for React Router
├── src/
│   ├── components/        # Reusable UI components (Navbar, Footer, ProductCard, etc.)
│   ├── features/          # Feature hooks & data providers (useProducts, useTestimonials)
│   ├── pages/             # Route pages
│   │   ├── Home.jsx       # Luxury editorial landing page
│   │   ├── Shop.jsx       # Filterable fragrance collection
│   │   ├── ProductDetails.jsx # Scent notes, size decants & gallery
│   │   ├── Cart.jsx       # Shopping bag & volume breakdown
│   │   ├── Checkout.jsx   # Accelerated Razorpay checkout
│   │   └── Admin.jsx      # Inventory, orders & manual product creator
│   ├── store/             # Zustand stores (useCartStore, useWishlistStore)
│   ├── utils/             # Firebase, Clerk, Razorpay & Sanity utilities
│   ├── App.jsx            # Routing, providers & error boundaries
│   └── main.jsx           # Application entry point
├── .env.example           # Template of all required environment variables
├── package.json           # Scripts & project dependencies
├── tailwind.config.js     # Custom luxury color palette & typography
└── vite.config.js         # Build configuration & code-splitting
```

---

## 🚀 Quick Start Guide

### 1. Clone Repository
```bash
git clone https://github.com/essmeyunveil/ESSMEY.git
cd ESSMEY
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory:
```env
# Google Cloud Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Razorpay Payments
VITE_RAZORPAY_KEY=rzp_live_your_key_id
RAZORPAY_KEY=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_live_or_test_key

# Dedicated Admin Portal
VITE_ADMIN_EMAIL=admin@essmey.com
VITE_ADMIN_PASSWORD=YourSecurePassword
```

### 4. Start Local Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 📦 Production Build & Deployment

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Continuous Deployment on Hostinger
This repository is configured for automatic Git deployments on Hostinger:
1. Every commit pushed to `main` branch automatically triggers Hostinger's build pipeline.
2. Build command: `npm run build`
3. Output directory: `dist`

---

## 🛡️ License

Private & Proprietary © 2026 **Essmey Perfumes**. All Rights Reserved.
