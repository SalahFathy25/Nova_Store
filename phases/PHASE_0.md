# Phase 0: Foundation

> **Duration:** Weeks 1-3 | **Status:** ✅ Complete (100%) | **Depends On:** None

---

## Objective

Build the complete backend infrastructure and database schema that all subsequent phases depend on.

---

## Hallmark Design Integration

> **Genre:** modern-minimal (e-commerce fits Stripe/Linear school)
> **Status:** Design system created and locked
> **Design System:** `design.md` + `design.lock` at project root

### Completed in This Phase
- [x] Created `design.md` with locked design system
- [x] Created `design.lock` with lock rules
- [x] Defined brand identity (Primary: #1A1A1A, Secondary: #D4AF37, Font: Cairo)
- [x] Defined OKLCH theme tokens (colors, typography, spacing, shadows)
- [x] Defined macrostructure picks for all screen types
- [x] Created 58-gate slop test checklist

### Design Files
| File | Purpose |
| :--- | :--- |
| `design.md` | Locked design system (tokens, macrostructures, decisions) |
| `design.lock` | Lock rules and violation log |
| `nova_core/lib/src/core/theme/` | Flutter theme tokens |

---

## Dependencies

| From Phase | What's Needed |
| :--- | :--- |
| None | This is the first phase |

| This Phase Enables | What It Provides |
| :--- | :--- |
| Phase 1 | Database, Auth, Multi-Tenant API |
| Phase 2 | Delivery models, Driver auth |
| Phase 3 | Coupon, Review, Notification models |

---

## Tasks

### 1. Database Setup ✅

- [x] Initialize NestJS project (`backend/`)
- [x] Configure PostgreSQL connection (TypeORM)
- [x] Run complete 30+ table schema migration
- [x] Seed default data (demo tenant, admin user)

**Tables Created:**
```
stores, users, user_addresses, otp_codes, user_sessions,
categories, brands, attributes, attribute_values,
products, product_variants, product_images, product_specifications,
product_addons, product_addon_groups,
carts, cart_items, wishlist_items,
parent_orders, sub_orders, order_items, order_status_history,
payments, refunds, vendor_payouts,
delivery_shifts, cash_ledger, delivery_zones, driver_location_history,
delivery_time_slots,
coupons, coupon_usage, banners, home_sections,
flash_sales, flash_sale_products,
conversations, conversation_participants, messages, calls,
store_working_hours, store_holidays,
notifications, audit_logs, feature_flags
```

### 2. Multi-Tenant Middleware ✅

- [x] Create `TenantMiddleware` (extract `X-Tenant-ID` header)
- [x] Create `TenantContext` (request-scoped storage)
- [x] Create `TenantScopeInterceptor` (auto-inject tenant_id)
- [x] Enable Row-Level Security on all tables
- [x] Test cross-tenant isolation

### 3. Authentication System ✅

- [x] JWT Token generation (Access + Refresh)
- [x] Phone OTP flow (send via SMS provider)
- [x] Email + Password registration/login
- [x] Password reset flow
- [x] Session management (multi-device)
- [x] Auth guards (role-based)

**API Endpoints:**
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/otp/send
POST /api/v1/auth/otp/verify
POST /api/v1/auth/refresh-token
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
GET  /api/v1/auth/me
```

### 4. Core API Foundation ✅

- [x] CRUD for Categories
- [x] CRUD for Brands
- [x] CRUD for Attributes & Values
- [x] CRUD for Products (with variants)
- [x] Image upload pipeline (local storage)
- [x] Pagination helper
- [x] Error handling middleware
- [x] Request validation (class-validator)

**API Endpoints:**
```
GET/POST/PUT/DELETE /api/v1/categories
GET/POST/PUT/DELETE /api/v1/brands
GET/POST/PUT/DELETE /api/v1/attributes
GET/POST/PUT/DELETE /api/v1/products
POST /api/v1/upload/image
POST /api/v1/upload/images
```

### 5. Flutter Project Setup ✅

- [x] Set up shared package (`nova_core/`)
- [x] Set up Dio HTTP client with interceptors
- [x] Create base BLoC, UseCase, Failure classes
- [x] Configure environment configs
- [x] Theme engine (NovaTheme)

### 6. Customer App Skeleton ✅

- [x] App initialization with flavor setup
- [x] Theme engine (NovaTheme)
- [x] Navigation setup (GoRouter)
- [x] Auth screens (Login, Register, OTP)
- [x] Basic Home screen (placeholder)
- [x] Products page with grid view
- [x] Cart page (empty state)
- [x] Profile page with menu items

### 7. Testing & Documentation ✅

- [x] API documentation (Swagger at `/docs`)
- [x] Error handling middleware
- [x] Request validation (class-validator)

---

## Deliverables

| Deliverable | Location | Status |
| :--- | :--- | :--- |
| Backend API | `backend/` | ✅ Complete |
| Database Schema | `backend/src/modules/*/` | ✅ 30+ entities |
| Shared Flutter Package | `nova_core/` | ✅ Complete |
| Customer App Skeleton | `customer_app/` | ✅ Complete |
| API Docs | `http://localhost:3000/docs` | ✅ Swagger |
| Design System | `design.md` | ✅ Locked |
| Design Lock | `design.lock` | ✅ Created |

---

## Acceptance Criteria

- [x] All 40+ tables created and migratable
- [x] Tenant isolation verified (cross-tenant queries blocked)
- [x] Auth flow works (register, login, OTP, refresh, password reset)
- [x] Image upload works (resize, compress, store)
- [x] Flutter apps compile and run
- [x] API documentation generated
- [x] Design system created (`design.md`, `design.lock`)
- [x] 58-gate slop test checklist defined
- [x] Google Maps API key configured

---

## Estimated Effort

| Task | Hours | Status |
| :--- | :--- | :--- |
| Database Setup | 16 | ✅ Done |
| Multi-Tenant Middleware | 20 | ✅ Done |
| Authentication System | 32 | ✅ Done |
| Core API Foundation | 40 | ✅ Done |
| Flutter Project Setup | 16 | ✅ Done |
| Customer App Skeleton | 20 | ✅ Done |
| Testing & Documentation | 16 | ✅ Done |
| **Total** | **160** | **100%** |

---

## Next Steps

Phase 0 is now complete. The project is ready for Phase 1: Core Product (Customer App MVP).

Key features ready for Phase 1:
- Multi-tenant architecture with row-level security
- JWT authentication with OTP support
- Product catalog with variants and images
- Category and brand management
- Image upload pipeline
- Shared Flutter package with API client
- Customer app skeleton with auth screens
- **Locked design system** (`design.md`) — ready for UI work

**Phase 1 will:**
1. Use Hallmark skill to apply design tokens to Flutter theme
2. Build Customer App screens using macrostructure picks from `design.md`
3. Run 58-gate slop test on all screens
4. Update `design.md` with final design decisions
