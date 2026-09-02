# Phase 1: Core Product — Customer App MVP

> **Duration:** Weeks 4-7 | **Status:** ✅ Complete (100%) | **Depends On:** Phase 0

---

## Objective

Build the complete Customer App with browsing, cart, checkout, and order tracking — the core product that generates revenue.

---

## Hallmark Design System

This is the **first design phase**. All UI must be built using the **Hallmark** skill to ensure production-grade, anti-slop design.

### Design Steps (Run Before Any UI Code)

1. **Pre-flight scan** — Read existing `design.md` tokens, `nova_core/lib/src/core/theme/` tokens, Flutter theme, brand colors
2. **Genre confirmation** — E-commerce app → confirm **modern-minimal** genre
3. **Macrostructure pick** — Choose from Hallmark's 21 named structures for each screen type (reference `design.md`)
4. **Theme application** — Apply OKLCH palette from `design.md` to Flutter theme
5. **Build UI** — Use Hallmark tokens, no inline colors, no italic headers
6. **Slop test** — Run 58-gate check before marking design tasks complete
7. **Update `design.md`** — Add final design decisions for Customer App screens

### Brand Identity

- **Primary**: `#1A1A1A` (dark)
- **Secondary**: `#D4AF37` (gold)
- **Font**: Cairo (Arabic-friendly)
- **Currency**: EGP
- **Locale**: ar (Arabic RTL support)

---

## Dependencies

| From Phase | What's Needed |
| :--- | :--- |
| **Phase 0** | Database, Auth, Multi-Tenant API, Flutter skeleton |

| This Phase Enables | What It Provides |
| :--- | :--- |
| Phase 2 | Order models, Delivery assignment |
| Phase 3 | Reviews, Coupons (need orders to exist) |
| Phase 4 | Admin needs products/orders to manage |

---

## Tasks

### 0. Hallmark Design System Setup (Day 0)

- [x] ~~Create `design.md` at project root~~ (done in Phase 0)
- [x] ~~Create `design.lock`~~ (done in Phase 0)
- [x] ~~Define brand identity~~ (done in Phase 0)
- [x] ~~Define OKLCH theme tokens~~ (done in Phase 0)
- [x] ~~Define macrostructure picks~~ (done in Phase 0)
- [x] ~~Create 58-gate slop test checklist~~ (done in Phase 0)
- [x] Run Hallmark pre-flight scan on `nova_core/` theme
- [x] Apply tokens from `design.md` to Flutter theme
- [x] Update `nova_core/lib/src/core/theme/nova_theme.dart` with Hallmark tokens
- [x] Run slop test on theme setup

### 1. Product Catalog (Days 1-4)

- [x] Home screen with server-driven sections
- [x] Category grid (nested navigation)
- [x] Product list with filters (price, color, size, brand)
- [x] Product detail page (images, variants, stock)
- [x] Search with autocomplete
- [x] Search history (local)

**Screens:**
```
HomeScreen
├── BannerSlider
├── CategoryGrid
├── FlashSaleSection
├── BestSellersList
└── NewArrivalsGrid

CategoryScreen
├── SubCategoryList
└── ProductGrid

ProductListScreen
├── FilterBar
├── SortOptions
└── ProductGrid

ProductDetailScreen
├── ImageGallery
├── VariantSelector
├── PriceDisplay
├── StockStatus
├── AddToCartButton
├── ReviewsSection
└── RelatedProducts
```

### 2. Cart System (Days 4-6)

- [x] Add to cart (with variant selection)
- [x] Cart screen (items, quantities, totals)
- [x] Update quantity / Remove item
- [x] Real-time stock validation
- [x] Guest cart support
- [x] Cart persistence (local + sync)

**API Endpoints:**
```
GET    /api/v1/cart
POST   /api/v1/cart/items
PATCH  /api/v1/cart/items/:id
DELETE /api/v1/cart/items/:id
DELETE /api/v1/cart
```

### 3. Checkout Flow (Days 6-8)

- [x] Address management (CRUD)
- [x] Google Maps location picker
- [x] Payment method selection
- [x] Order summary with totals
- [x] Coupon application
- [x] Place order
- [x] Order confirmation screen

**API Endpoints:**
```
GET    /api/v1/addresses
POST   /api/v1/addresses
PUT    /api/v1/addresses/:id
DELETE /api/v1/addresses/:id
POST   /api/v1/checkout
POST   /api/v1/coupons/validate
```

### 4. Order Tracking (Days 8-10)

- [x] Order list (history)
- [x] Order detail with status timeline
- [x] Real-time status updates (WebSocket)
- [x] Cancel order (if allowed)

**API Endpoints:**
```
GET /api/v1/orders
GET /api/v1/orders/:id
PATCH /api/v1/orders/:id/cancel
```

### 5. User Profile (Days 10-11)

- [x] Profile screen (name, email, phone)
- [x] Edit profile
- [x] Address list management
- [x] Wishlist
- [x] Order history

### 6. Wishlist (Days 11-12)

- [x] Add/remove from wishlist
- [x] Wishlist screen
- [x] Move to cart

**API Endpoints:**
```
GET    /api/v1/wishlist
POST   /api/v1/wishlist
DELETE /api/v1/wishlist/:productId
```

### 7. Basic Notifications (Days 12-13)

- [x] Push notification setup (FCM)
- [x] Notification list screen
- [x] Deep linking from notifications
- [x] Order status push notifications

### 8. Hallmark Design Review & Polish (Days 13-14)

- [x] Run `hallmark audit` on all screens
- [x] Fix any slop test failures
- [x] Loading states & shimmer effects
- [x] Error handling & retry UI
- [x] Empty states
- [x] Unit tests for BLoCs
- [x] Widget tests for key screens
- [x] Performance optimization
- [x] Update `design.md` with final design decisions

### 9. Dynamic Design System (Backend-Driven UI)

All app screens must read configuration from the backend `/api/v1/app-config` endpoint. **No hardcoded texts, colors, features, or auth options in Flutter code.**

#### Backend: `/api/v1/app-config`

Returns tenant-specific config in a single call:

```json
{
  "store": { "id": "...", "name": "...", "domain": "..." },
  "branding": {
    "primary_color": "#1A1A1A",
    "secondary_color": "#D4AF37",
    "font_family": "Cairo",
    "logo_url": "https://...",
    "splash_background": null
  },
  "auth": {
    "email_enabled": true,
    "phone_enabled": true,
    "otp_enabled": true,
    "google_login_enabled": false,
    "apple_login_enabled": false,
    "facebook_login_enabled": false,
    "password_min_length": 8,
    "require_email_verification": false
  },
  "texts": {
    "app_name": "NOVA Commerce",
    "tagline": "Your premium shopping destination",
    "login_title": "Welcome Back",
    "login_subtitle": "Sign in to continue shopping",
    "register_title": "Create Account",
    "register_subtitle": "Join us and start shopping",
    "otp_title": "Verify Your Phone",
    "otp_subtitle": "Enter the code sent to your phone"
  },
  "features": {
    "currency": "EGP",
    "locale": "ar",
    "tax_rate": 0.14,
    "dark_mode_enabled": false,
    "language_switcher_enabled": true,
    "returns_enabled": true,
    "loyalty_program_enabled": false
  }
}
```

#### Flutter: Dynamic UI Pattern

1. **`AppConfigRepository`** — fetches + caches config from API
2. **`AppConfigCubit`** — holds config in widget tree, available to all screens
3. **All auth/product/feature screens** use `BlocBuilder<AppConfigCubit, AppConfigState>` to read config
4. **Colors**: parsed from `branding.primary_color` / `branding.secondary_color` hex strings
5. **Texts**: read from `texts.*` fields — no hardcoded strings
6. **Features**: toggled via `auth.*` and `features.*` booleans

#### Rules

- **RULE D1:** Every Flutter app in the system MUST fetch `/api/v1/app-config` on startup
- **RULE D2:** All user-facing texts MUST come from `texts.*` config fields
- **RULE D3:** All brand colors MUST come from `branding.*` config fields
- **RULE D4:** All feature toggles MUST come from `auth.*` / `features.*` config fields
- **RULE D5:** Changing config in the backend MUST reflect in the app without code changes
- **RULE D6:** `AppConfigRepository` MUST cache config and only refresh on explicit request
- **RULE D7:** Password rules (`password_min_length`, validation patterns) MUST come from backend config

---

## Screens Summary

| Screen | App | Priority | Hallmark Macrostructure |
| :--- | :--- | :--- | :--- |
| Splash | Customer | P0 | Typography-only |
| Login / Register | Customer | P0 | Minimal form |
| OTP Verification | Customer | P0 | Minimal form |
| Home | Customer | P0 | Bento Grid / Marquee Hero |
| Category List | Customer | P0 | Grid layout |
| Product List | Customer | P0 | Grid with filters |
| Product Detail | Customer | P0 | Gallery + details |
| Cart | Customer | P0 | List layout |
| Checkout | Customer | P0 | Step-by-step form |
| Order Confirmation | Customer | P0 | Success state |
| Order List | Customer | P0 | List layout |
| Order Detail | Customer | P0 | Timeline layout |
| Profile | Customer | P0 | Settings layout |
| Address Management | Customer | P0 | List + form |
| Wishlist | Customer | P1 | Grid layout |
| Notifications | Customer | P1 | List layout |
| Search | Customer | P0 | Search + results |

---

## Deliverables

| Deliverable | Location |
| :--- | :--- |
| Design System | `design.md` (project root) |
| Theme Tokens | `nova_core/lib/src/core/theme/` |
| Customer App | `customer_app/` |
| Backend APIs | `backend/src/modules/` |
| API Tests | `backend/test/` |

---

## Acceptance Criteria

- [x] `design.md` created and locked (done in Phase 0)
- [x] `design.lock` created (done in Phase 0)
- [x] All screens built with Hallmark tokens
- [x] Slop test passed (58/58 gates)
- [x] User can register, login, and verify via OTP (real API)
- [x] User can browse products with filters (real API)
- [x] User can add to cart and checkout (real API)
- [x] User can track order status (real API)
- [x] Guest checkout works
- [x] Real-time status updates via WebSocket
- [x] All screens handle loading/error/empty states
- [x] RTL support works correctly
- [x] Repository layer with Either<Failure, T> error handling
- [x] BLoC state management for all features
- [x] Dependency injection with GetIt
- [x] All data sources connected to real API endpoints

---

## Estimated Effort

| Task | Hours |
| :--- | :--- |
| Hallmark Design System Setup | 0 (done in Phase 0) |
| Product Catalog | 32 |
| Cart System | 16 |
| Checkout Flow | 24 |
| Order Tracking | 20 |
| User Profile | 12 |
| Wishlist | 8 |
| Notifications | 12 |
| Design Review & Polish | 12 |
| BLoC/Repository Wiring | 8 |
| **Total** | **144** | **✅ Done** |
