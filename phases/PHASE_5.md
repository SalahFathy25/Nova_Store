# Phase 5: Advanced Features

> **Duration:** Weeks 17-20 | **Status:** ⏳ Pending | **Depends On:** Phase 1, Phase 3

---

## Objective

Add enterprise-grade features that enable multi-vendor marketplace and loyalty programs.

---

## Hallmark Design Integration

> **Design System:** Reference `design.md` from Phase 1
> **Focus:** Vendor app screens, loyalty/wallet UI
> **Macrostructure:** Pick for Vendor App (different from Customer/Delivery/Admin)

### Design Steps
1. Read `design.md` for existing tokens
2. Pick macrostructure for Vendor App screens
3. Build vendor dashboard, earnings, product management UI
4. Ensure consistency with existing app designs
5. Run slop test on new screens

---

## Dependencies

| From Phase | What's Needed |
| :--- | :--- |
| **Phase 1** | Core product, Orders |
| **Phase 3** | Reviews, Coupons, Search |

| This Phase Enables | What It Provides |
| :--- | :--- |
| Phase 6 | Vendor onboarding, Loyalty config |
| Phase 7 | Security for vendor payouts |

---

## Tasks

### 1. Multi-Vendor System (Days 1-8)

- [ ] Vendor registration & approval
- [ ] Vendor dashboard (orders, earnings, products)
- [ ] Vendor product management
- [ ] Order splitting (parent → sub-orders per vendor)
- [ ] Commission calculation
- [ ] Vendor payouts
- [ ] Vendor ratings

**Database Additions:**
```sql
-- Vendor-specific fields in users table
ALTER TABLE users ADD COLUMN vendor_profile JSONB;
ALTER TABLE users ADD COLUMN commission_rate DECIMAL(5,2);

-- New table: vendor_settings
CREATE TABLE vendor_settings (
    id UUID PRIMARY KEY,
    vendor_id UUID REFERENCES users(id),
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    payout_method VARCHAR(50),
    payout_details JSONB,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_at TIMESTAMP WITH TIME ZONE
);
```

**API Endpoints:**
```
POST   /api/v1/vendor/register
GET    /api/v1/vendor/dashboard
GET    /api/v1/vendor/orders
GET    /api/v1/vendor/products
POST   /api/v1/vendor/products
PUT    /api/v1/vendor/products/:id
GET    /api/v1/vendor/earnings
POST   /api/v1/vendor/payout/request
```

**Vendor App Screens:**
```
VendorDashboardScreen
├── TodayStats
├── PendingOrders
├── RevenueChart
└── QuickActions

VendorOrderListScreen
├── NewOrders
├── Processing
└── Completed

VendorProductListScreen
├── ProductGrid
├── AddProduct
└── EditProduct

VendorEarningsScreen
├── EarningsSummary
├── PayoutHistory
└── RequestPayout
```

### 2. Loyalty Program (Days 8-11)

- [ ] Points earning (per order)
- [ ] Points display (balance, history)
- [ ] Reward redemption (discount, free shipping)
- [ ] Tier system (Bronze, Silver, Gold, Platinum)
- [ ] Tier benefits

**Database:**
```sql
CREATE TABLE loyalty_points (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    tenant_id UUID REFERENCES stores(id),
    points INT NOT NULL DEFAULT 0,
    lifetime_points INT NOT NULL DEFAULT 0,
    tier VARCHAR(50) DEFAULT 'bronze',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE loyalty_transactions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) CHECK (type IN ('earned', 'redeemed', 'expired', 'adjusted')),
    points INT NOT NULL,
    order_id UUID REFERENCES parent_orders(id),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**API Endpoints:**
```
GET  /api/v1/loyalty/balance
GET  /api/v1/loyalty/history
POST /api/v1/loyalty/redeem
GET  /api/v1/loyalty/tier
```

### 3. Wallet System (Days 11-14)

- [ ] Wallet balance display
- [ ] Top-up via payment gateway
- [ ] Pay with wallet at checkout
- [ ] Refund to wallet
- [ ] Transaction history

**Database:**
```sql
CREATE TABLE wallets (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    tenant_id UUID REFERENCES stores(id),
    balance DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY,
    wallet_id UUID REFERENCES wallets(id),
    type VARCHAR(50) CHECK (type IN ('topup', 'payment', 'refund', 'withdrawal')),
    amount DECIMAL(10,2) NOT NULL,
    reference_type VARCHAR(50),
    reference_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Returns & Refunds (Days 14-17)

- [ ] Return request (customer)
- [ ] Return approval/rejection (admin)
- [ ] Refund processing
- [ ] Exchange option
- [ ] Return status tracking

**Database:**
```sql
CREATE TABLE returns (
    id UUID PRIMARY KEY,
    order_id UUID REFERENCES parent_orders(id),
    sub_order_id UUID REFERENCES sub_orders(id),
    customer_id UUID REFERENCES users(id),
    tenant_id UUID REFERENCES stores(id),
    reason TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    refund_amount DECIMAL(10,2),
    return_items JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**API Endpoints:**
```
POST /api/v1/returns
GET  /api/v1/returns/:id
PATCH /api/v1/returns/:id/approve
PATCH /api/v1/returns/:id/reject
POST /api/v1/returns/:id/refund
```

### 5. Subscriptions (Days 17-19)

- [ ] Subscription plans (monthly, quarterly, yearly)
- [ ] Subscribe to products
- [ ] Auto-renewal
- [ ] Subscription management (pause, cancel)
- [ ] Subscription orders (auto-generated)

### 6. Chat and Calls System (Days 19-24)

- [ ] Conversations table (order-linked)
- [ ] Messages table (text, image, file, location, system)
- [ ] Calls table (VoIP calls)
- [ ] Customer ↔ Driver chat
- [ ] Customer ↔ Store chat
- [ ] Store ↔ Driver chat
- [ ] Real-time messaging via WebSocket
- [ ] Image and file sharing
- [ ] Location sharing
- [ ] Read receipts and typing indicators
- [ ] Push notifications for new messages
- [ ] In-app VoIP calls with caller ID masking
- [ ] Call history and duration tracking
- [ ] Message history linked to orders

**Database:**
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES stores(id),
    order_id UUID REFERENCES parent_orders(id),
    type VARCHAR(50) CHECK (type IN ('customer_driver', 'customer_store', 'store_driver')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id),
    user_id UUID REFERENCES users(id),
    last_read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE messages (
    id UUID PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id),
    sender_id UUID REFERENCES users(id),
    type VARCHAR(50) CHECK (type IN ('text', 'image', 'file', 'location', 'system')),
    content TEXT NOT NULL,
    metadata JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE calls (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES stores(id),
    conversation_id UUID REFERENCES conversations(id),
    caller_id UUID REFERENCES users(id),
    receiver_id UUID REFERENCES users(id),
    status VARCHAR(50) CHECK (status IN ('ringing', 'answered', 'missed', 'ended')),
    duration_seconds INT,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**API Endpoints:**
```
GET    /api/v1/conversations
GET    /api/v1/conversations/:id/messages
POST   /api/v1/conversations/:id/messages
POST   /api/v1/conversations/:id/read
POST   /api/v1/calls/initiate
POST   /api/v1/calls/:id/answer
POST   /api/v1/calls/:id/end
```

**WebSocket Events:**
```
chat:message:send      → Server
chat:message:new       → Client
chat:typing:start      → Server
chat:typing:stop       → Server
chat:read:update       → Server
call:incoming          → Client
call:accepted          → Client
call:ended             → Client
```

**Screens:**
```
ConversationListScreen → All conversations
ChatScreen → Messages + input + actions
CallScreen → In-call UI
```

### 7. Multi-Activity Product System (Days 24-28)

- [ ] Product type configuration per store (standard, grocery, perfume, clothing, shoes, electronics, restaurant)
- [ ] Weight-based selling (grocery)
- [ ] ML-based selling (perfumes)
- [ ] Size + Color matrix (clothing)
- [ ] Size-only matrix (shoes)
- [ ] Specs/Versions (electronics)
- [ ] Size + Add-ons (restaurants)
- [ ] Product specifications table
- [ ] Product addons table
- [ ] Product addon groups table
- [ ] Dynamic product display based on product_type
- [ ] Selling config per store (units, weight ranges, etc.)

**Database:**
```sql
ALTER TABLE stores
ADD COLUMN product_type VARCHAR(50) DEFAULT 'standard'
    CHECK (product_type IN ('standard', 'grocery', 'perfume', 'clothing', 'shoes', 'electronics', 'restaurant')),
ADD COLUMN selling_config JSONB DEFAULT '{}';

ALTER TABLE product_variants
ADD COLUMN weight_value DECIMAL(8,2),
ADD COLUMN weight_unit VARCHAR(10),
ADD COLUMN selling_unit VARCHAR(50);

CREATE TABLE product_specifications (
    id UUID PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    spec_name VARCHAR(100) NOT NULL,
    spec_value VARCHAR(255) NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE product_addons (
    id UUID PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) DEFAULT 0.00,
    is_required BOOLEAN DEFAULT FALSE,
    max_quantity INT DEFAULT 1,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE product_addon_groups (
    id UUID PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    min_selections INT DEFAULT 0,
    max_selections INT DEFAULT 1,
    is_required BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**API Endpoints:**
```
GET  /api/v1/stores/:id/config
GET  /api/v1/products/:id
POST /api/v1/cart/items
GET  /api/v1/products/:id/addons
GET  /api/v1/products/:id/specs
```

**Screens:**
```
ProductTypeConfigScreen → Admin configures store product type
WeightProductWidget → Grocery weight selector
ClothingProductWidget → Size + Color selector
RestaurantProductWidget → Size + Add-ons selector
ElectronicsProductWidget → Specs display
```

---

## Deliverables

| Deliverable | Location |
| :--- | :--- |
| Multi-Vendor Module | `backend/src/modules/vendor/` |
| Loyalty Module | `backend/src/modules/loyalty/` |
| Wallet Module | `backend/src/modules/wallet/` |
| Returns Module | `backend/src/modules/returns/` |
| Subscriptions Module | `backend/src/modules/subscriptions/` |

---

## Acceptance Criteria

- [ ] Vendors can register and manage products
- [ ] Orders split correctly per vendor
- [ ] Commission is calculated accurately
- [ ] Vendor payouts work
- [ ] Loyalty points earn and redeem correctly
- [ ] Wallet top-up and payment work
- [ ] Return requests process correctly
- [ ] Subscriptions auto-renew

---

## Estimated Effort

| Task | Hours |
| :--- | :--- |
| Multi-Vendor System | 64 |
| Loyalty Program | 24 |
| Wallet System | 24 |
| Returns & Refunds | 24 |
| Subscriptions | 20 |
| Chat and Calls System | 40 |
| Multi-Activity Product System | 32 |
| **Total** | **248 hours** |
