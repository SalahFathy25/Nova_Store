# Phase 3: Production Features

> **Duration:** Weeks 11-13 | **Status:** ✅ Complete (88%) | **Depends On:** Phase 1 | **Progress:** 88%

---

## Objective

Add production-critical features that increase conversion, retention, and operational quality.

---

## Hallmark Design Integration

> **Design System:** Reference `design.md` from Phase 1
> **Focus:** Polish existing screens, micro-interactions, loading states
> **Macrostructure:** Keep existing; focus on component-level refinement

### Design Steps
1. Run `hallmark audit` on all Phase 1 screens
2. Fix any slop test failures found
3. Add micro-interactions (buttons, toasts, transitions)
4. Polish loading/error/empty states with Hallmark tokens
5. Ensure mobile responsiveness at 320/375/414/768px

---

## Dependencies

| From Phase | What's Needed |
| :--- | :--- |
| **Phase 1** | Products, Orders, Customer App |

| This Phase Enables | What It Provides |
| :--- | :--- |
| Phase 4 | Reviews, Coupons data for admin |
| Phase 5 | Loyalty points from orders |

---

## Tasks

### 1. Reviews & Ratings (Days 1-3)

- [x] Submit review (rating + comment + photos)
- [x] View product reviews
- [x] Review verification (only from orders)
- [x] Helpful vote on reviews
- [x] Admin moderation

**API Endpoints:**
```
GET  /api/v1/products/:id/reviews
POST /api/v1/reviews
PATCH /api/v1/reviews/:id/helpful
DELETE /api/v1/reviews/:id (admin)
```

**Customer App Screens:**
```
ProductDetailScreen → ReviewsSection
ReviewSubmitScreen → Rating + Comment + Photos
ReviewsListScreen → All reviews with filters
```

### 2. Coupon Engine (Days 3-5)

- [x] Coupon validation at checkout
- [x] Apply coupon to order
- [x] Track coupon usage
- [x] Coupon types: percentage, fixed, free_shipping, bogo
- [x] Usage limits (per user, total, date range)

**API Endpoints:**
```
POST /api/v1/coupons/validate
POST /api/v1/coupons/apply
GET  /api/v1/my-coupons (customer)
```

### 3. Advanced Search & Filtering (Days 5-7)

- [x] Full-text search (PostgreSQL tsvector)
- [x] Autocomplete suggestions
- [x] Faceted filtering (price, brand, color, size, rating)
- [x] Search history (local)
- [x] Popular searches

**API Endpoints:**
```
GET /api/v1/catalog/search?q=shirt&filters=...
GET /api/v1/catalog/suggestions?q=sh
GET /api/v1/catalog/popular-searches
```

### 4. Push Notifications (Days 7-8)

- [x] Order status notifications
- [x] Promotional notifications
- [x] Low stock alerts (admin)
- [x] Notification preferences

**Notification Types:**
```
order_confirmed    → "Your order #ORD-10284 is confirmed"
order_preparing    → "Your order is being prepared"
order_shipped      → "Your order is on the way!"
order_delivered    → "Your order has been delivered"
promo_new          → "New arrivals in your favorite category"
promo_sale         → "Flash sale: 50% off on shoes"
low_stock          → "Product X is running low"
```

### 5. Wishlist (Days 8-9)

- [x] Add/remove from wishlist
- [x] Wishlist screen with grid view
- [x] Move to cart
- [x] Wishlist count badge
- [x] Sync across devices

**API Endpoints:**
```
GET    /api/v1/wishlist
POST   /api/v1/wishlist
DELETE /api/v1/wishlist/:productId
POST   /api/v1/wishlist/:productId/move-to-cart
```

### 6. Order Enhancements (Days 9-10)

- [x] Order cancellation (before shipping)
- [x] Reorder - one-tap reorder from past orders
- [x] Partial reorder - select specific items from past order
- [x] Reorder with stock validation
- [x] Reorder with current prices (not historical)
- [x] Cart merge on reorder
- [x] Order sharing (screenshot)
- [x] Estimated delivery time

### 7. Scheduled Orders (Days 10-12)

- [x] Deliver Now vs Schedule for Later toggle
- [x] Date picker for scheduled delivery
- [x] Time slot selection (configurable per store)
- [x] delivery_type field on orders (instant/scheduled)
- [x] scheduled_date, scheduled_time_slot, scheduled_timestamp fields
- [ ] delivery_time_slots table
- [ ] Driver assignment closer to scheduled time
- [ ] Reminder notification before delivery window

**Database:**
```sql
ALTER TABLE parent_orders
ADD COLUMN delivery_type VARCHAR(50) DEFAULT 'instant'
    CHECK (delivery_type IN ('instant', 'scheduled')),
ADD COLUMN scheduled_date DATE,
ADD COLUMN scheduled_time_slot VARCHAR(50),
ADD COLUMN scheduled_timestamp TIMESTAMP WITH TIME ZONE;

CREATE TABLE delivery_time_slots (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES stores(id),
    day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_orders INT DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**API Endpoints:**
```
GET  /api/v1/delivery/slots?date=2026-09-01
GET  /api/v1/delivery/available-dates
POST /api/v1/checkout (with delivery_type: scheduled)
```

### 7. Address Enhancements (Days 10-11)

- [x] Google Maps autocomplete
- [x] Save multiple addresses
- [x] Set default address
- [ ] Address validation

---

## Deliverables

| Deliverable | Location |
| :--- | :--- |
| Reviews Module | `backend/src/modules/reviews/` |
| Coupons Module | `backend/src/modules/coupons/` |
| Search Service | `backend/src/services/search/` |
| Customer App Updates | `customer_app/` |

---

## Acceptance Criteria

- [x] Customer can leave verified reviews
- [x] Coupons apply correctly at checkout
- [x] Search returns relevant results
- [x] Push notifications work end-to-end
- [x] Wishlist syncs across devices
- [x] Order cancellation works
- [x] Address autocomplete works

---

## Estimated Effort

| Task | Hours |
| :--- | :--- |
| Reviews & Ratings | 24 |
| Coupon Engine | 24 |
| Advanced Search | 24 |
| Push Notifications | 16 |
| Wishlist | 12 |
| Order Enhancements | 12 |
| Scheduled Orders | 20 |
| Address Enhancements | 8 |
| **Total** | **160 hours** |
