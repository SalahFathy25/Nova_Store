# Phase 2: Delivery & Logistics

> **Duration:** Weeks 8-10 | **Status:** ✅ Complete | **Depends On:** Phase 0, Phase 1

---

## Objective

Build the complete Delivery App and driver management system — a key differentiator for the platform.

---

## Hallmark Design Integration

> **Genre:** modern-minimal (delivery/logistics fits utilitarian school)
> **Design System:** Reference `design.md` from Phase 1
> **Macrostructure:** Pick from Hallmark catalog for each screen type (driver dashboard, order list, map views)
> **Theme:** Must differ from Phase 1 on at least one axis (paper band / display style / accent hue)

### Design Steps
1. Pre-flight scan: Read `design.md` and `nova_core/` theme tokens
2. Pick macrostructure for Driver App screens (different from Customer App)
3. Build UI using existing Hallmark tokens from `design.md`
4. Run slop test on all driver screens
5. Update `design.md` with driver app design decisions

---

## Dependencies

| From Phase | What's Needed |
| :--- | :--- |
| **Phase 0** | Database, Auth, Multi-Tenant API |
| **Phase 1** | Orders (to deliver), Customer App (for tracking) |

| This Phase Enables | What It Provides |
| :--- | :--- |
| Phase 3 | Delivery status for reviews |
| Phase 4 | Delivery management in admin |

---

## Tasks

### 1. Driver Auth & Profile (Days 1-2)

- [ ] Driver registration with vehicle info
- [ ] Driver profile screen
- [ ] Document upload (license, vehicle registration)
- [ ] Admin approval flow

### 2. Delivery App Core (Days 2-5)

- [ ] Dashboard (today's stats)
- [ ] Order list (pending, active, completed)
- [ ] Order detail with navigation
- [ ] Accept/Reject order
- [ ] Status updates (picked up, on the way, delivered)

**Screens:**
```
DashboardScreen
├── TodayStats (orders, earnings)
├── ShiftToggle (online/offline)
└── QuickActions

OrderListScreen
├── PendingOrders
├── ActiveOrders
└── CompletedOrders

OrderDetailScreen
├── CustomerInfo
├── StoreLocation
├── CustomerLocation
├── OrderItems
├── NavigationButton
├── CallCustomerButton
└── StatusUpdateButton
```

### 3. Shift Management (Days 5-7)

- [ ] Go Online / Go Offline toggle
- [ ] Shift history
- [ ] Active shift tracking
- [ ] Location tracking during shift

**API Endpoints:**
```
POST /api/v1/driver/shift/start
POST /api/v1/driver/shift/end
GET  /api/v1/driver/shift/current
GET  /api/v1/driver/shift/history
PATCH /api/v1/driver/location
```

### 4. OTP Verification Engine (Days 7-8)

- [ ] Generate OTP per sub-order
- [ ] Display OTP to customer
- [ ] Driver enters OTP to confirm delivery
- [ ] OTP expiry handling
- [ ] Failed OTP attempts tracking

**API Endpoints:**
```
GET  /api/v1/orders/:id/otp
POST /api/v1/sub-orders/:id/verify-otp
```

### 5. COD Cash Ledger (Days 8-9)

- [ ] Track cash collected per order
- [ ] Shift cash summary (expected vs collected)
- [ ] Cash reconciliation screen
- [ ] Discrepancy flagging
- [ ] Admin notification on discrepancy

**API Endpoints:**
```
GET  /api/v1/driver/cash/today
GET  /api/v1/driver/cash/shift/:id
POST /api/v1/driver/cash/submit
```

### 6. Navigation Integration (Days 9-10)

- [ ] Google Maps integration
- [ ] Directions to store (pickup)
- [ ] Directions to customer (delivery)
- [ ] Distance & time estimation
- [ ] Deep link to Google Maps / Apple Maps

### 7. Real-time Location Tracking (Days 10-11)

- [ ] Send driver location to server
- [ ] Customer can see driver location on map
- [ ] Admin can see all active drivers
- [ ] Location history for analytics

**WebSocket Events:**
```
driver:location:update  → Server
delivery:location:customer → Customer App
admin:drivers:locations → Admin App
```

### 8. Push Notifications for Drivers (Days 11-12)

- [ ] New order assignment notification
- [ ] Order cancelled notification
- [ ] Shift reminder notifications
- [ ] Earnings summary notification

### 9. Enhanced Live Driver Tracking (Days 12-14)

- [ ] Real-time location sharing (every 10 seconds during delivery)
- [ ] Driver location history table
- [ ] Live map view for customers
- [ ] ETA calculation
- [ ] Distance remaining display
- [ ] Driver arrival notifications
- [ ] Admin map view (all active drivers)

**Database:**
```sql
CREATE TABLE driver_location_history (
    id UUID PRIMARY KEY,
    driver_id UUID REFERENCES users(id),
    tenant_id UUID REFERENCES stores(id),
    sub_order_id UUID REFERENCES sub_orders(id),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed DECIMAL(5, 2),
    heading DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_location_history_driver ON driver_location_history(driver_id);
CREATE INDEX idx_location_history_order ON driver_location_history(sub_order_id);
```

**WebSocket Events:**
```
driver:location:report → Server (every 10 seconds during delivery)
delivery:location:update → Customer App
admin:drivers:locations → Admin App
```

**API Endpoints:**
```
POST /api/v1/driver/location
GET  /api/v1/orders/:id/tracking
GET  /api/v1/admin/drivers/locations
```

---

## Deliverables

| Deliverable | Location |
| :--- | :--- |
| Delivery App | `delivery_app/` |
| Driver APIs | `backend/src/modules/delivery/` |
| Location Service | `backend/src/services/location/` |

---

## Acceptance Criteria

- [ ] Driver can register and get approved
- [ ] Driver can start/end shift
- [ ] Driver receives order assignments
- [ ] Driver can navigate to pickup and delivery
- [ ] OTP verification works end-to-end
- [ ] COD cash ledger is accurate
- [ ] Customer sees real-time driver location
- [ ] All status transitions are tracked

---

## Estimated Effort

| Task | Hours |
| :--- | :--- |
| Driver Auth & Profile | 12 |
| Delivery App Core | 32 |
| Shift Management | 16 |
| OTP Verification | 16 |
| COD Cash Ledger | 16 |
| Navigation Integration | 12 |
| Real-time Location | 16 |
| Push Notifications | 12 |
| Enhanced Live Driver Tracking | 24 |
| **Total** | **156 hours** |

---

## Progress

```
[████████████████████████████████████████████] 100% Complete
```

### Completed
- Backend: Delivery Module (controller, service, module, DTOs)
- Backend: Driver Auth & Profile endpoints
- Backend: Shift Management endpoints
- Backend: OTP Verification for delivery
- Backend: COD Cash Ledger endpoints
- Backend: Order Assignment & Status endpoints
- Backend: Location Tracking endpoints
- Backend: WebSocket Gateway for real-time updates
- Backend: Roles Guard & Decorator
- Nova Core: Delivery entities (Driver, DeliveryOrder, DeliveryShift, CashLedger, DeliveryZone)
- Nova Core: DeliveryRemoteDataSource
- Nova Core: API constants updated
- Delivery App: Foundation (pubspec, DI, router, main.dart)
- Delivery App: Auth & Profile screens
- Delivery App: Dashboard screen
- Delivery App: Order List & Detail screens
- Delivery App: Unassigned Orders screen
- Delivery App: Shift Management screen
- Delivery App: Cash Ledger screen
- Delivery App: OTP Verification screen
- Delivery App: Location tracking service
- Delivery App: WebSocket service

### Remaining (Phase 3/7)
- Google Maps navigation integration (requires API key setup)
- Push Notifications (Firebase setup)
- Enhanced Live Driver Tracking (admin map view)
