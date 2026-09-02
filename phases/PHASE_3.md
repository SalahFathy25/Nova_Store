# Phase 3: Production Features

> **Duration:** Weeks 11-13 | **Status:** ⏳ Pending | **Depends On:** Phase 1

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

- [ ] Submit review (rating + comment + photos)
- [ ] View product reviews
- [ ] Review verification (only from orders)
- [ ] Helpful vote on reviews
- [ ] Admin moderation

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

- [ ] Coupon validation at checkout
- [ ] Apply coupon to order
- [ ] Track coupon usage
- [ ] Coupon types: percentage, fixed, free_shipping, bogo
- [ ] Usage limits (per user, total, date range)

**API Endpoints:**
```
POST /api/v1/coupons/validate
POST /api/v1/coupons/apply
GET  /api/v1/my-coupons (customer)
```

### 3. Advanced Search & Filtering (Days 5-7)

- [ ] Full-text search (PostgreSQL tsvector)
- [ ] Autocomplete suggestions
- [ ] Faceted filtering (price, brand, color, size, rating)
- [ ] Search history (local)
- [ ] Popular searches

**API Endpoints:**
```
GET /api/v1/catalog/search?q=shirt&filters=...
GET /api/v1/catalog/suggestions?q=sh
GET /api/v1/catalog/popular-searches
```

### 4. Push Notifications (Days 7-8)

- [ ] Order status notifications
- [ ] Promotional notifications
- [ ] Low stock alerts (admin)
- [ ] Notification preferences

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

- [ ] Add/remove from wishlist
- [ ] Wishlist screen with grid view
- [ ] Move to cart
- [ ] Wishlist count badge
- [ ] Sync across devices

**API Endpoints:**
```
GET    /api/v1/wishlist
POST   /api/v1/wishlist
DELETE /api/v1/wishlist/:productId
POST   /api/v1/wishlist/:productId/move-to-cart
```

### 6. Order Enhancements (Days 9-10)

- [ ] Order cancellation (before shipping)
- [ ] Reorder - one-tap reorder from past orders
- [ ] Partial reorder - select specific items from past order
- [ ] Reorder with stock validation
- [ ] Reorder with current prices (not historical)
- [ ] Cart merge on reorder
- [ ] Order sharing (screenshot)
- [ ] Estimated delivery time

### 7. Scheduled Orders (Days 10-12)

- [ ] Deliver Now vs Schedule for Later toggle
- [ ] Date picker for scheduled delivery
- [ ] Time slot selection (configurable per store)
- [ ] delivery_type field on orders (instant/scheduled)
- [ ] scheduled_date, scheduled_time_slot, scheduled_timestamp fields
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

- [ ] Google Maps autocomplete
- [ ] Save multiple addresses
- [ ] Set default address
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

- [ ] Customer can leave verified reviews
- [ ] Coupons apply correctly at checkout
- [ ] Search returns relevant results
- [ ] Push notifications work end-to-end
- [ ] Wishlist syncs across devices
- [ ] Order cancellation works
- [ ] Address autocomplete works

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
