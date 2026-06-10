# Farm AI Frontend — Complete End-to-End Report

> **Project:** Farmlyt AI — AI-Powered Smart Agriculture Platform  
> **Stack:** React 19 + Vite 8 + Tailwind CSS v4 + Framer Motion + React Router 7  
> **Backend:** Flask API @ `https://aislynajay-product-development.hf.space`  
> **State:** `localStorage` (auth, theme), `sessionStorage` (OTP), component-local state  

---

## 1. Project Structure

```
farm-ai-frontend/
├── app.py                     # Flask backend (same repo)
├── index.html                 # Entry HTML (Inter font, favicon)
├── vite.config.js             # Vite + React + Tailwind plugins
├── package.json               # React 19, framer-motion, lucide-react, react-router-dom
├── src/
│   ├── main.jsx               # ReactDOM.createRoot → <App />
│   ├── App.jsx                # useTheme → createAppRouter → RouterProvider
│   ├── index.css              # Tailwind v4 imports, CSS vars, utilities
│   ├── constants/index.js     # APP_NAME, ROUTES, NAV_LINKS, HERO
│   ├── hooks/useTheme.js      # Dark mode hook (localStorage + matchMedia)
│   ├── utils/cn.js            # Classname joiner utility
│   ├── services/api.js        # All API calls (BASE_URL = hf.space)
│   ├── data/                  # Static data: services, features, stats, testimonials, navigation
│   ├── routes/index.jsx       # createBrowserRouter with all routes
│   ├── layouts/RootLayout.jsx # Navbar + Outlet + Footer
│   ├── components/
│   │   ├── layout/            # Navbar, Footer, PageHeader
│   │   ├── common/            # Button, SectionTitle, ThemeToggle, ScrollToTop, Skeleton, EmptyState
│   │   ├── ui/                # ServiceCard, FeatureCard, StatCard, TestimonialCard, DashboardCard
│   │   ├── dashboard/         # Sidebar, WelcomeBanner, RecentPredictions
│   │   └── home/              # HeroSection, StatsSection, AboutSection, ServicesSection, etc.
│   └── pages/
│       ├── Home.jsx           # Public landing page (8 sections composed)
│       ├── About.jsx          # Mission/Vision, Benefits, Timeline
│       ├── Services.jsx       # Static services + API-driven agri resources
│       ├── Features.jsx       # Feature cards + highlights
│       ├── Contact.jsx        # Contact info + form
│       ├── Login.jsx          # Email → send OTP
│       ├── Register.jsx       # Name + Email + Phone → send OTP
│       ├── VerifyOtp.jsx      # 6-digit OTP input, auto-fill + auto-verify
│       ├── Dashboard.jsx      # Welcome banner, agri resources, farming tips
│       ├── Profile.jsx        # User info, wallet, recharge (Razorpay), edit profile
│       ├── Predict.jsx        # Category selector + upload + prediction results
│       ├── Services.jsx       # Static service cards + agri resources from API
│       ├── AgricultureDetail.jsx  # Agri category detail (/agriculture/:id)
│       ├── SubCropDetail.jsx  # Sub-crop detail with inline upload + tips (/crop/:id)
│       ├── PrivacyPolicy.jsx  # Static policy content
│       ├── TermsOfService.jsx # Static terms content
│       └── CookiePolicy.jsx   # Static cookie policy content
```

---

## 2. Routing Architecture

**File:** `src/routes/index.jsx`

```
createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,       // Navbar + Footer wrapper
    errorElement: <ErrorPage />,   // Catches all render errors
    children: [
      { index: true,        → Home },
      { path: 'about',      → About },
      { path: 'services',   → Services },
      { path: 'features',   → Features },
      { path: 'contact',    → Contact },
      { path: 'login',      → Login },
      { path: 'register',   → Register },
      { path: 'verify-otp', → VerifyOtp },
      { path: 'privacy',    → PrivacyPolicy },
      { path: 'terms',      → TermsOfService },
      { path: 'cookies',    → CookiePolicy },
      { path: 'agriculture/:id', → AgricultureDetail },
      { path: 'crop/:id',   → SubCropDetail },
    ],
  },
  // Standalone (no Navbar/Footer):
  { path: '/dashboard', → Dashboard },
  { path: '/profile',   → Profile },
  { path: '/predict',   → Predict },
])
```

**3 layout modes:**
| Mode | Pages | Navigation |
|------|-------|-----------|
| Public (RootLayout) | Home, About, Services, Features, Contact, auth pages, policies | Navbar + Footer |
| Standalone auth | Dashboard, Profile, Predict | Sidebar only (no Navbar/Footer) |
| Public nested | AgricultureDetail, SubCropDetail | RootLayout (Navbar + Footer) |

---

## 3. UI Components & Alignment

### 3.1 Layout Components

**Navbar** (`src/components/layout/Navbar.jsx`)
- Fixed top, changes to glass style on scroll (`bg-white/80` backdrop-blur)
- `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` — centered container
- Left: Logo + "Farmlyt AI" brand
- Center: Nav links with active underline animation (framer-motion `layoutId`)
- Right: ThemeToggle + Login/Register buttons OR Dashboard/Logout (reads `localStorage`)
- Mobile: Hamburger → overlay menu with `AnimatePresence` slide-down

**Footer** (`src/components/layout/Footer.jsx`)
- `bg-gray-900` dark background with white text
- 4-column grid: Brand + Social → Quick Links → Services → Contact
- Bottom bar: Copyright + Privacy/Terms/Cookies links

**PageHeader** (`src/components/layout/PageHeader.jsx`)
- Gradient radial background, centered text
- `max-w-2xl mx-auto text-center` — content width restricted to 2xl
- Animated title + description via `whileInView`

### 3.2 Common Components

| Component | Alignment | Key Props |
|-----------|-----------|-----------|
| `SectionTitle` | `text-center` or `text-left`, `max-w-2xl`, animated on scroll | `subtitle`, `title`, `description`, `align`, `light` |
| `Button` | Inline-flex, variants: primary/secondary/outline/ghost, sizes: sm/md/lg | `variant`, `size`, `icon`, `iconPosition`, `href`/`onClick` |
| `Skeleton` | Variants: text/title/avatar/card/button | `variant`, `className` |
| `EmptyState` | Centered column (flex-col items-center), icon circle + text + action | `icon`, `title`, `description`, `action` |
| `ScrollToTop` | No UI — scrolls to top on route change | — |
| `ThemeToggle` | Pill-shaped, sliding circle animation | `isDark`, `toggle` |

### 3.3 Card Components

| Component | Grid | Hover Effect |
|-----------|------|-------------|
| `ServiceCard` | `grid sm:grid-cols-2 lg:grid-cols-3 gap-4` | Border color, shadow, translateY, background tint |
| `FeatureCard` | `grid sm:grid-cols-2 lg:grid-cols-4 gap-5` | Same + icon scale+rotate |
| `StatCard` | `grid sm:grid-cols-2 lg:grid-cols-4 gap-6` | Centered text, gradient value |
| `TestimonialCard` | `grid sm:grid-cols-2 lg:grid-cols-4 gap-4` | Border + shadow on hover |
| `DashboardCard` | N/A (single card) | "Soon" disabled state |

### 3.4 Responsive Breakpoints Used
- `sm:` (640px) — 2-column grids
- `lg:` (1024px) — 3 or 4-column grids
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Sidebar: `w-60` expanded, `w-16` collapsed (desktop), full overlay (mobile)

---

## 4. Authentication Flow (End-to-End)

```
[Login/Register] → [VerifyOtp] → [Dashboard]
```

### Step 1: Login (`/login`)
```
Input: Email
POST /auth/login → { user_id, name, email, otp, profile_image }
        ↓
stores in sessionStorage: pending_user_id, pending_email, pending_otp (for auto-fill)
        ↓
navigates to /verify-otp?email=xxx
```

### Step 1b: Register (`/register`)
```
Input: Name + Email + Phone
POST /auth/register → { user_id, otp }
        ↓
same sessionStorage flow → /verify-otp
```

### Step 2: Verify OTP (`/verify-otp`)
```
Reads pending_otp from sessionStorage
  → After 3s, auto-fills 6 digit boxes with staggered animation
  → Auto-submits after fill completes
        ↓
POST /auth/verify-otp → { user_id, otp }
        ↓
On success:
  localStorage.setItem('user', JSON.stringify({ user_id, name, email, phone, profile_image }))
  localStorage.setItem('token', '')  // (empty for now, but extensible)
  sessionStorage cleared
  navigate('/dashboard')
```

### Step 3: Auth-protected pages
```
Predict.jsx:     if (!profile?.user_id) return <Navigate to="/login" replace />
SubCropDetail:   if (!profile?.user_id) return <Navigate to="/login" replace />
Dashboard:       reads user from localStorage (no redirect, but relies on data being present)
Profile:         same as Dashboard
```

**Auto-fill OTP mechanism** (`VerifyOtp.jsx` lines ~66-98):
```javascript
useEffect(() => {
  const pendingOtp = sessionStorage.getItem('pending_otp');
  if (!pendingOtp || pendingOtp.length !== 6) return;
  const timer = setTimeout(() => {
    pendingOtp.split('').forEach((digit, i) => {
      setTimeout(() => {
        const input = document.getElementById(`otp-${i}`);
        if (input) { input.value = digit; input.dispatchEvent(new Event('input', { bubbles: true })); }
      }, i * 100);
    });
    // auto-submit 300ms after last digit
    setTimeout(() => formRef.current?.requestSubmit(), pendingOtp.length * 100 + 300);
  }, 3000);
  return () => clearTimeout(timer);
}, []);
```

---

## 5. Data Fetching Architecture

### 5.1 Base API Service (`src/services/api.js`)

```javascript
const BASE_URL = 'https://aislynajay-product-development.hf.space';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.detail || data.error || 'Request failed');
  return data;
}
```

### 5.2 All API Endpoints

**Auth:** `POST /auth/login`, `POST /auth/register`, `POST /auth/verify-otp`, `POST /auth/update-profile`, `POST /auth/update-profile-pic`

**Prediction** (all POST with FormData: `user_id` + `image`):
| Category | Endpoint Pattern | Example |
|----------|-----------------|---------|
| Leaf | `/leafs/{crop}` | tomato, potato, brinjal, chili, ladyfinger |
| Vegetable | `/vegtables/{crop}` | brinjal, cauliflower, cucumber, ridge, bitter_gourd |
| Fruit | `/fruits/{crop}` | custard_apple, guava, pomegranate, lemon, tomato |
| Flower | `/flowers/{crop}` | jasmine, rose, marigold, chrysanthemums |
| Special | `/potted_plant`, `/plant_idetification`, `/food_identification` | — |

**Farming Data** (GET):
| Endpoint | Response | Used By |
|----------|----------|---------|
| `/get_agri_titles` | `[{id, title, image_url}]` | Services, Dashboard, AgricultureDetail, Predict |
| `/get_crops` | `[{id, title, agri_id, agri_title, image_url}]` | Same |
| `/get_crop_sub` | `[{id, crop_id, title, image_url, crop_name}]` | Same |
| `/get_farming_tips` | `[{id, crop_sub_id, tip_title, tip_description, crop_sub_name}]` | SubCropDetail, Dashboard |
| `/get_leaf_predictions` | `[{id, crop, original_image, predicted_image, prediction, disease, fertilizers, pesticides, care_points}]` | (not currently used) |
| `/get_crop_with_products` | `[{id, title, products[]}]` | (not currently used) |
| `/user/wallet/{userId}` | `{coins}` | Profile, Dashboard |

**Payment:** `POST /create-order`, `POST /verify-payment`

### 5.3 Fetch Pattern — `Promise.allSettled`

Every page that loads multiple independent API calls uses `Promise.allSettled` for resilience:

```javascript
const [agriRes, cropsRes, subsRes] = await Promise.allSettled([
  api.farming.agriTitles(),
  api.farming.allCrops(),
  api.farming.crops(),
]);
const agri = agriRes.status === 'fulfilled' && Array.isArray(agriRes.value) ? agriRes.value : [];
const crops = cropsRes.status === 'fulfilled' ? ... : [];
const subs = subsRes.status === 'fulfilled' ? ... : [];
```

This ensures that if one endpoint fails, the others still render.

### 5.4 Prediction Fetch — Direct `fetch()` with FormData

SubCropDetail, Predict, and any prediction page use direct `fetch()` (not the `api.request()` helper) because the api helper auto-sets JSON `Content-Type` which is incompatible with FormData:

```javascript
const fd = new FormData();
fd.append('user_id', userId);
fd.append('image', file);
const res = await fetch(`${BASE_URL}${endpoint}`, {
  method: 'POST',
  body: fd,
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});
const data = await res.json();
```

---

## 6. Page-by-Page UI & Data Flow

### 6.1 Home (`/`)
```
HeroSection (full screen, gradient bg, 2 CTAs → /dashboard, /services)
StatsSection (4 stat cards from static data)
AboutSection (2-col: decorative card + 4 highlights)
ServicesSection (3-col service cards)
HowItWorksSection (3 steps with connecting line)
FeaturesSection (4-col feature cards)
TestimonialsSection (4-col testimonial cards)
CTASection (contact form with validation)
```
**Fetches:** Nothing from API (all static data).

### 6.2 Services (`/services`)
```
PageHeader ("Our Services")
Static services grid (3-col ServiceCard from services.js data)

API-driven section:
  Agricultural Resources (3-col cards)
    ├── If sub-crops exist → links to /crop/:id
    └── If no sub-crops → "Upload & Detect" button → /predict

Stats section (3 static metrics: 95% Accuracy, Under 2s, 24/7)
```
**Fetches:** `agriTitles()`, `allCrops()`, `crops()` (sub-crops)  
**Nested data structure:** `agri → crops → subs`

### 6.3 Login (`/login`)
```
Centered card (max-w-md mx-auto)
  Logo + "Farmlyt AI"
  Email input
  "Send OTP" button
  "or continue with" divider + Google placeholder
  Link to Register
```
**Fetches:** `POST /auth/login` → stores OTP in sessionStorage

### 6.4 Register (`/register`)
```
Centered card (max-w-md mx-auto)
  Name + Email + Phone inputs
  Terms checkbox
  Client-side validation (name length, email regex, phone regex)
  Submit button
  Link to Login
```
**Fetches:** `POST /auth/register` → stores OTP in sessionStorage

### 6.5 Verify OTP (`/verify-otp`)
```
6 individual digit boxes (centered, gap-2)
  Auto-fill after 3s from sessionStorage (staggered 100ms per digit)
  Auto-verify after fill
  Manual submit + resend with 30s cooldown
  Back to Login link
```
**Fetches:** `POST /auth/verify-otp` → saves user to localStorage → redirect to `/dashboard`

### 6.6 Dashboard (`/dashboard`)
```
Sidebar (collapsible, menu items highlight on active)
  |
  Mobile hamburger (lg:hidden)

Main content (max-w-7xl mx-auto):
  Welcome Banner
    ├── User name from localStorage
    └── Coin badge (links to /profile)
  
  Agricultural Resources (3-col grid)
    Card per agri category (image + title)
      Crops with sub-crops → link to /crop/:id
      Crops without sub-crops → "Detect" button → /predict
      Category without ANY crops → "Upload & Detect" button → /predict

  Farming Tips (3-col grid, max 9)
    ├── Tip title
    └── Tip description (line-clamp-2)
```
**Fetches:** `tips()`, `agriTitles()`, `allCrops()`, `crops()`, `wallet(userId)`  
**Auth:** reads `localStorage('user')` but no redirect (relies on data presence)

### 6.7 Profile (`/profile`)
```
Sidebar + Main layout

User Banner:
  Profile image (click camera → upload via /auth/update-profile-pic)
  Name + Email
  Coin badge with amount

Wallet Section:
  Coin balance display
  Preset amounts: ₹1, ₹10, ₹50, ₹100, ₹200, ₹500
  Custom amount input (min ₹1)
  "Recharge" button → loads Razorpay SDK → create order → checkout → verify

Edit Profile Form:
  Name (editable) → POST /auth/update-profile (name + phone)
  Email (read-only)
  Phone (editable)
  "Save Changes" button
```
**Fetches:** `wallet(userId)`, loads Razorpay SDK dynamically via `<script>`  
**Payment flow:** `createOrder` → Razorpay checkout → `verifyPayment({ payment_id, order_id, signature })` → add coins

### 6.8 Predict (`/predict` — login required)
```
Sidebar + Main layout

Left Panel (lg:col-span-1):
  Accordion-style category groups
  Built from API: agri titles → crops → sub-crops (mapped to endpoints)
  + Standalone: Potted Plant, Plant Identification, Food Identification
  Each sub-crop button selects it for prediction

Right Panel (lg:col-span-2):
  Shows selected category path
  Upload area: dashed border, click to upload, preview
  "Detect" button → POST to endpoint with FormData
  Results:
    ├── Original image
    ├── Predicted/detection image
    ├── Prediction text + confidence %
    ├── Disease name (red card)
    ├── Fertilizers (green tags)
    ├── Pesticides (orange tags)
    ├── Care points (blue list)
    └── Recommended products (linked cards with images)
```
**Fetches:** `agriTitles()`, `allCrops()`, `crops()` for categories  
**URL params:** `?type=plant|food` pre-selects standalone type, `?sub=...` pre-selects sub-crop  
**Auth:** redirects to `/login` if no `user_id` in localStorage

### 6.9 AgricultureDetail (`/agriculture/:id`)
```
Gradient header with agri image + title
Grid of crop cards (2-col sm, 3-col lg)
  Each card:
    ├── Crop image
    ├── Crop title
    ├── If sub-crops exist → links to /crop/:id
    ├── If no sub-crops → "Upload & Detect" → /predict
    └── Link wraps to /login if not authenticated

If ZERO crops in category:
  ── "No sub-crops listed yet" message
  ── "Upload & Detect" button → /predict (with auth gate)
```
**Fetches:** `agriTitles()`, `allCrops()`, `crops()`

### 6.10 SubCropDetail (`/crop/:id` — login required)
```
Hero banner (gradient): sub-crop image + name + crop name

Upload & Detect Disease section:
  Upload area → preview → "Detect" button
  Maps sub-crop title to API endpoint via titleEndpoint map
  POST with FormData (user_id + image)
  Results:
    ├── Original image
    ├── Detection output image (predicted_image)
    ├── Prediction text
    ├── Disease (red)
    ├── Fertilizers (green tags)
    ├── Pesticides (orange tags)
    ├── Care points (blue list)
    └── Recommended products (linked cards)

Farming Tips section (if any):
  Amber cards with tip_title + tip_description
  Filtered by crop_sub_id = current sub-crop id
```
**Fetches:** `crops()`, `tips()` (filtered client-side by `crop_sub_id`)  
**Auth:** redirects to `/login` if not logged in

---

## 7. UI Logic: Empty/Error States

| Scenario | Where | UI |
|----------|-------|----|
| API call fails | All dynamic sections | `Promise.allSettled` → empty array fallback → section not rendered |
| No sub-crops for a crop | Services, Dashboard, AgricultureDetail | "Upload & Detect" button → `/predict` |
| No crops in a category | AgricultureDetail | "No sub-crops listed yet" + "Upload & Detect" button |
| No tips for sub-crop | SubCropDetail | Tips section not rendered |
| Not logged in | Predict, SubCropDetail | `Navigate` redirect to `/login` |
| Not logged in (click link) | AgricultureDetail | `authLink()` checks → redirects to `/login` |
| Error during prediction | Predict, SubCropDetail | Red error card with message |
| Image not selected for prediction | Predict, SubCropDetail | Error: "Please upload an image" |
| Loading state | All pages with fetch | Loading spinner or "Loading..." text |
| Crop not found | SubCropDetail | "Sub-crop not found" message |

---

## 8. State Management Summary

| State Type | Storage | Example |
|-----------|---------|---------|
| Auth user | `localStorage('user')` | `{ user_id, name, email, phone, profile_image }` |
| Auth token | `localStorage('token')` | Bearer token (currently `''`) |
| OTP data | `sessionStorage` | `pending_user_id`, `pending_email`, `pending_otp` |
| Theme | `localStorage('theme')` | `'dark'` or `'light'` |
| UI state | React useState | Modals, loading, errors, form inputs, predictions |
| Dynamic data | React useState | API results (resources, tips, crops, etc.) |

---

## 9. Key Data Mappings

### titleEndpoint (sub-crop title → API endpoint)
```javascript
'tomato'       → '/leafs/tomato'
'potato'       → '/leafs/potato'
'brinjal'      → '/leafs/brinjal'
'chilli'       → '/leafs/chili'
'lady finger'  → '/leafs/ladyfinger'
'brinjal veg'  → '/vegtables/brinjal'
'cauliflower'  → '/vegtables/cauliflower'
'cucumber'     → '/vegtables/cucumber'
'ridge gourd'  → '/vegtables/ridge'
'bitter gourd' → '/vegtables/bitter_gourd'
'custard apple' → '/fruits/custard_apple'
'guava'        → '/fruits/guava'
'pomegranate'  → '/fruits/pomegranate'
'lemon'        → '/fruits/lemon'
'tomato fruit' → '/fruits/tomato'
'jasmine'       → '/flowers/jasmine'
'rose'          → '/flowers/rose'
'marigold'      → '/flowers/marigold'
'chrysanthemum' → '/flowers/chrysanthemums'
```

### Category Icons (agri title → icon)
```javascript
'Leaf Detection'       → Leaf icon
'Fruit Detection'      → Apple icon
'Vegetable Detection'   → Sprout icon
'Flower Detection'     → Flower2 icon
'(anything else)'      → Sprout (fallback)
```

---

## 10. Responsive Design Rules

| Breakpoint | Grid Columns | Sidebar | Container |
|-----------|-------------|---------|-----------|
| Default (<640px) | 1 column | Hidden (hamburger) | `px-4` |
| `sm:` (640px) | 2 columns | Hidden (hamburger) | `px-6` |
| `lg:` (1024px) | 3-4 columns | Visible (w-60 or w-16) | `px-8` |

---

## 11. Special Features

### Razorpay Payment (Profile.jsx)
```javascript
// 1. Load SDK dynamically
const script = document.createElement('script');
script.src = 'https://checkout.razorpay.com/v1/checkout.js';
script.onload = () => setRazorpayLoaded(true);

// 2. Create order
const order = await api.payment.createOrder(userId, amount);

// 3. Open checkout
const rzp = new Razorpay({ key: import.meta.env.VITE_RAZORPAY_KEY_ID, ... });
rzp.open();

// 4. Verify
await api.payment.verifyPayment({ payment_id, order_id, signature, amount, user_id });
```

### Coin System
- New users start with 50 coins
- Each prediction costs 10 coins (deducted server-side via `deduct_coins()`)
- Recharge: ₹1 = 1 coin (via Razorpay)
- Wallet: `GET /user/wallet/{user_id}` returns `{ coins }`

### Dark Mode
```javascript
// useTheme.js
const isDark = localStorage.getItem('theme') === 'dark'
  || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
// Apply: document.documentElement.classList.toggle('dark', isDark)
// Persist: localStorage.setItem('theme', isDark ? 'dark' : 'light')
```

---

## 12. Backend Endpoints (app.py)

All endpoints hosted alongside frontend in `app.py` (Flask, port 7860):

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/register` | POST | Register user (name, email, phone) → OTP |
| `/auth/login` | POST | Login by email → OTP |
| `/auth/verify-otp` | POST | Verify OTP → activate user |
| `/auth/update-profile` | POST | Update name/phone/email |
| `/auth/update-profile-pic` | POST | Upload profile image |
| `/user/wallet/<id>` | GET | Get user coin balance |
| `/create-order` | POST | Create Razorpay order |
| `/verify-payment` | POST | Verify Razorpay payment & add coins |
| `/get_agri_titles` | GET | List agricultural categories |
| `/get_crops` | GET | List crops |
| `/get_crop_sub` | GET | List sub-crops |
| `/get_farming_tips` | GET | List farming tips |
| `/get_leaf_predictions` | GET | List predictions (optional `?user_id=` filter) |
| `/add_farming_tips` | POST | Add farming tip (admin) |
| `/leafs/*` | POST | Leaf disease detection (5 crops) |
| `/vegtables/*` | POST | Vegetable detection (5 crops) |
| `/fruits/*` | POST | Fruit detection (5 crops) |
| `/flowers/*` | POST | Flower detection (4 crops) |
| `/potted_plant` | POST | Potted plant detection |
| `/plant_idetification` | POST | Plant species identification |
| `/food_identification` | POST | Food grain identification |

---

## 13. Data Schema (MySQL)

**`users`:** `user_id (PK)`, `name`, `email`, `phone`, `coins`, `is_verified`, `profile_image`, `created_at`  
**`otp_verification`:** `id (PK)`, `user_id (FK)`, `otp`, `expiry`, `created_at`  
**`agri`:** `id (PK)`, `title`, `image_url`, `created_date`  
**`crop`:** `id (PK)`, `title`, `agri_id (FK)`, `image_url`, `created_date`  
**`crop_sub`:** `id (PK)`, `crop_id (FK)`, `title`, `image_url`, `created_date`  
**`crop_products`:** `id (PK)`, `crop_sub_id (FK)`, `disease_name`, `product1-4_name/url/image`, `fertilizers`, `pesticides`, `care_points`  
**`leaf_predictions`:** `id (PK)`, `user_id`, `crop`, `original_image_url`, `predicted_image_url`, `prediction_result`, `disease_name`, `created_at`, `fertilizers`, `pesticides`, `care_points`  
**`sub_crop_tips`:** `id (PK)`, `crop_sub_id (FK)`, `tip_title`, `tip_description`, `created_date`  
**`farming_tips`:** `id (PK)`, `title`, `description`, `created_at`  
**`payments`:** `id (PK)`, `user_id`, `order_id`, `payment_id`, `amount`, `coins_added`, `status`, `created_at`
