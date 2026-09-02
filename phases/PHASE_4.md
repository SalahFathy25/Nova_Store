# Phase 4: Admin Dashboard Enhancement

> **Duration:** Weeks 14-16 | **Status:** ⏳ Pending | **Depends On:** Phase 1, Phase 3

---

## Objective

Build the complete Admin Control Center — not just CRUD, but a real business operations hub.

---

## Hallmark Design Integration

> **Genre:** modern-minimal (admin dashboard fits Linear/Stripe school)
> **Design System:** Reference `design.md` from Phase 1
> **Macrostructure:** New pick for dashboard — different from Customer App (e.g., Workbench or Bento Grid)
> **Theme:** Must differ from Phase 1/2 on at least one axis

### Design Steps
1. Pre-flight scan: Read `design.md` + existing admin UI
2. Pick new macrostructure for admin dashboard
3. Build admin components with Hallmark tokens
4. Run slop test on all admin screens
5. Update `design.md` with admin design decisions

---

## Dependencies

| From Phase | What's Needed |
| :--- | :--- |
| **Phase 1** | Products, Orders, Users |
| **Phase 3** | Reviews, Coupons, Search data |

| This Phase Enables | What It Provides |
| :--- | :--- |
| Phase 5 | Vendor management, Loyalty config |
| Phase 6 | Tenant settings, Feature flags |

---

## Tasks

### 1. Admin App Foundation (Days 1-2)

- [ ] Admin Flutter Web project setup
- [ ] Responsive layout system
- [ ] Navigation sidebar
- [ ] Auth & role-based access

### 2. Dashboard (Days 2-4)

- [ ] Revenue cards (today, week, month)
- [ ] Orders chart (line graph)
- [ ] Top products list
- [ ] Low stock alerts
- [ ] Active drivers map
- [ ] Recent orders table

**Dashboard Widgets:**
```
DashboardScreen
├── RevenueCard
│   ├── Today: 12,500 EGP
│   ├── This Week: 85,000 EGP
│   └── This Month: 320,000 EGP
├── OrdersChart
│   └── Line graph (7 days / 30 days)
├── TopProducts
│   └── Top 10 by revenue
├── LowStockAlerts
│   └── Products below threshold
├── ActiveDrivers
│   └── Map with driver locations
└── RecentOrders
    └── Last 20 orders table
```

### 3. Product Management (Days 4-6)

- [ ] Product list with search/filter
- [ ] Add/Edit product form
- [ ] Variant management (add/remove/edit)
- [ ] Image upload (multiple, reorder)
- [ ] Bulk import/export (CSV)
- [ ] Category management (tree view)
- [ ] Brand management
- [ ] Attribute management

**Screens:**
```
ProductListScreen → Search + Filter + Table
ProductFormScreen → Add/Edit product
VariantManagerScreen → Manage variants
CategoryTreeScreen → Drag-drop categories
BrandListScreen → CRUD brands
```

### 4. Order Management (Days 6-8)

- [ ] Order list with filters (status, date, customer)
- [ ] Order detail view
- [ ] Status override (admin can change any status)
- [ ] Manual driver assignment
- [ ] Order notes
- [ ] Print order (single)
- [ ] Batch print orders
- [ ] Print templates (thermal 58mm/80mm, A4)
- [ ] Barcode/QR on printout
- [ ] Auto-print on new order (configurable)

**Screens:**
```
OrderListScreen → Filter + Sort + Table
OrderDetailScreen → Full order info + actions
DriverAssignmentScreen → Select driver
PrintPreviewScreen → Preview before printing
```

### 5. Customer Management (Days 8-9)

- [ ] Customer list with search
- [ ] Customer detail (orders, spending, reviews)
- [ ] Account status (activate/deactivate/ban)
- [ ] Customer notes

### 6. Delivery Management (Days 9-10)

- [ ] Driver list
- [ ] Add/Remove drivers
- [ ] Activate/Deactivate drivers
- [ ] Driver earnings report
- [ ] Shift history
- [ ] COD reconciliation

### 7. Marketing Module (Days 10-12)

- [ ] Coupon management (CRUD)
- [ ] Banner management (upload, position, schedule)
- [ ] Flash sale management
- [ ] Home sections builder (drag-drop)
- [ ] Featured products curation

**Screens:**
```
CouponListScreen → CRUD coupons
BannerListScreen → Upload & manage banners
FlashSaleListScreen → Create flash sales
HomeBuilderScreen → Drag-drop sections
FeaturedProductsScreen → Curate featured items
```

### 8. Finance Module (Days 12-13)

- [ ] Payment transactions list
- [ ] COD management
- [ ] Refund processing
- [ ] Revenue reports
- [ ] Export to CSV/Excel

### 9. System Module (Days 13-14)

- [ ] User management (all roles)
- [ ] Role management (custom roles)
- [ ] Permission matrix
- [ ] Audit logs
- [ ] Store settings

### 10. Store Working Hours (Days 14-16)

- [ ] Per-day working hours configuration
- [ ] Holiday schedule management
- [ ] Auto-close outside working hours
- [ ] Timezone-aware working hours
- [ ] Buffer time before last order
- [ ] Store open/close status display

**Database:**
```sql
CREATE TABLE store_working_hours (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_day_per_store UNIQUE (tenant_id, day_of_week)
);

CREATE TABLE store_holidays (
    id UUID PRIMARY KEY,
    tenant_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    holiday_date DATE NOT NULL,
    is_closed BOOLEAN DEFAULT TRUE,
    custom_open_time TIME,
    custom_close_time TIME,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_holiday_per_store UNIQUE (tenant_id, holiday_date)
);
```

**API Endpoints:**
```
GET  /api/v1/stores/:id/working-hours
PUT  /api/v1/stores/:id/working-hours
POST /api/v1/stores/:id/holidays
GET  /api/v1/stores/:id/holidays
DELETE /api/v1/stores/:id/holidays/:holidayId
GET  /api/v1/stores/:id/is-open
```

**Screens:**
```
WorkingHoursScreen → Per-day configuration
HolidayListScreen → Manage holidays
StoreStatusWidget → Real-time open/close status
```

---

## Deliverables

| Deliverable | Location |
| :--- | :--- |
| Admin App | `admin_app/` |
| Admin APIs | `backend/src/modules/admin/` |

---

## Acceptance Criteria

- [ ] Dashboard shows real-time business data
- [ ] Products can be fully managed (CRUD + variants + images)
- [ ] Orders can be managed with status overrides
- [ ] Drivers can be assigned manually
- [ ] Coupons and banners can be managed
- [ ] Home page can be configured via drag-drop
- [ ] Financial reports are accurate
- [ ] Audit trail captures all admin actions

---

## Estimated Effort

| Task | Hours |
| :--- | :--- |
| Admin App Foundation | 16 |
| Dashboard | 24 |
| Product Management | 32 |
| Order Management | 24 |
| Customer Management | 12 |
| Delivery Management | 16 |
| Marketing Module | 24 |
| Finance Module | 16 |
| System Module | 16 |
| Store Working Hours | 20 |
| **Total** | **200 hours** |
