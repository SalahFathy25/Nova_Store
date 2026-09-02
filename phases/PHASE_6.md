# Phase 6: White-Label Platform

> **Duration:** Weeks 21-23 | **Status:** ⏳ Pending | **Depends On:** Phase 5

---

## Objective

Transform the product into a true white-label platform that can be sold to multiple clients.

---

## Hallmark Design Integration

> **Design System:** This phase creates the **brand customization system**
> **Focus:** Theme engine, white-label branding, onboarding wizard
> **Key Output:** Dynamic theme system that applies Hallmark principles per-tenant

### Design Steps
1. Read `design.md` — this becomes the "default" theme
2. Design theme preset system using Hallmark's 21 catalog themes as inspiration
3. Build onboarding wizard with Hallmark design flow
4. Ensure white-label themes pass slop test
5. Update `design.md` with theme system architecture

---

## Dependencies

| From Phase | What's Needed |
| :--- | :--- |
| **Phase 5** | Multi-Vendor, Loyalty, Wallet (to be configurable) |

| This Phase Enables | What It Provides |
| :--- | :--- |
| Phase 7 | Tenant config, Feature flags |
| Phase 8 | Demo store, Client onboarding |

---

## Tasks

### 1. Multi-Tenant Store Management (Days 1-3)

- [ ] Store creation API
- [ ] Store configuration API
- [ ] Store listing (super admin)
- [ ] Store activation/deactivation
- [ ] Store domain mapping

**API Endpoints (Super Admin):**
```
POST   /api/v1/stores
GET    /api/v1/stores
GET    /api/v1/stores/:id
PUT    /api/v1/stores/:id
PATCH  /api/v1/stores/:id/activate
PATCH  /api/v1/stores/:id/deactivate
```

### 2. Theme System (Days 3-5)

- [ ] Theme configuration API
- [ ] Color scheme management
- [ ] Font management
- [ ] Logo & splash screen upload
- [ ] Theme preview

**API Endpoints:**
```
GET  /api/v1/stores/:id/theme
PUT  /api/v1/stores/:id/theme
POST /api/v1/stores/:id/theme/preview
GET  /api/v1/themes/presets
```

**Theme Presets:**
```
Minimal     → Black/White, Inter font
Fresh       → Green/White, Roboto font
Bold        → Orange/Dark, Poppins font
Elegant     → Black/Gold, Playfair Display
Vibrant     → Purple/Pink, Montserrat
```

### 3. Feature Flags Engine (Days 5-7)

- [ ] Feature flag CRUD API
- [ ] Admin toggle UI
- [ ] Backend middleware check
- [ ] Flutter app flag fetching
- [ ] Dynamic UI rendering based on flags

**API Endpoints:**
```
GET  /api/v1/stores/:id/flags
PUT  /api/v1/stores/:id/flags/:flag
GET  /api/v1/feature-flags (public - for app startup)
```

**Flutter Integration:**
```dart
class FeatureFlags {
  static Map<String, bool> _flags = {};
  
  static Future<void> load() async {
    final response = await api.get('/feature-flags');
    _flags = response.data;
  }
  
  static bool isEnabled(String flag) => _flags[flag] ?? false;
}

// In widgets:
if (FeatureFlags.isEnabled('multi_vendor_enabled'))
  VendorSection(),
```

### 4. Client Onboarding Wizard (Days 7-10)

- [ ] 10-step setup wizard API
- [ ] Wizard UI (Flutter Web)
- [ ] Step validation
- [ ] Draft saving
- [ ] Store publishing

**Wizard Steps:**
```
Step 1: Business Information
Step 2: Branding & Identity
Step 3: Store Configuration
Step 4: Categories Setup
Step 5: Payment Setup
Step 6: Delivery Setup
Step 7: Admin Account
Step 8: Store Content
Step 9: Initial Products
Step 10: Review & Launch
```

**API Endpoints:**
```
POST /api/v1/onboarding/start
PUT  /api/v1/onboarding/:storeId/step/:stepNumber
GET  /api/v1/onboarding/:storeId/status
POST /api/v1/onboarding/:storeId/publish
```

### 5. App Flavors (Days 10-12)

- [ ] Flavor configuration (dev, staging, prod)
- [ ] Tenant-aware app initialization
- [ ] Dynamic API base URL
- [ ] Dynamic app name & icon
- [ ] Environment-specific configs

**Flutter Flavor Setup:**
```
customer_app/
├── lib/
│   ├── main_dev.dart
│   ├── main_staging.dart
│   └── main_prod.dart
├── android/
│   ├── build.gradle (flavorDimensions)
│   └── productFlavors/
└── ios/
    └── xcconfig/
```

### 6. Super Admin Panel (Days 12-14)

- [ ] Store management dashboard
- [ ] Tenant listing
- [ ] Usage analytics per tenant
- [ ] Billing management
- [ ] System health monitoring

### 7. Master Dashboard — Platform Admin (Days 14-18)

- [ ] Platform overview (total revenue, active stores, active drivers, total orders)
- [ ] Store management (list, approve/reject, activate/deactivate)
- [ ] User management (all users across platform, ban/unban)
- [ ] Driver management (all drivers, approval, performance)
- [ ] Order overview (all orders across platform)
- [ ] Financial overview (total revenue, commissions, payouts, platform fees)
- [ ] Commission configuration (per store or category)
- [ ] Payout management (process vendor/driver payouts)
- [ ] Platform-wide coupon management
- [ ] Platform-wide marketing (promotions, banners, announcements)
- [ ] Platform analytics and reports
- [ ] Store performance comparison
- [ ] Growth metrics
- [ ] Audit logs (all admin actions across platform)

**API Endpoints (Super Admin):**
```
GET    /api/v1/master/stores
GET    /api/v1/master/stores/:id
PATCH  /api/v1/master/stores/:id/approve
PATCH  /api/v1/master/stores/:id/deactivate
GET    /api/v1/master/users
GET    /api/v1/master/drivers
GET    /api/v1/master/orders
GET    /api/v1/master/finance/overview
POST   /api/v1/master/payouts/process
GET    /api/v1/master/reports/platform
GET    /api/v1/master/audit-logs
```

**Screens:**
```
MasterDashboardScreen
├── PlatformOverview
│   ├── TotalRevenue
│   ├── ActiveStores
│   ├── ActiveDrivers
│   └── TotalOrders
├── StoreManagement
│   ├── StoreList (with status)
│   ├── StoreDetail
│   └── ApproveReject
├── UserManagement
│   ├── AllUsers
│   ├── UserDetail
│   └── BanUnban
├── Finance
│   ├── RevenueChart
│   ├── CommissionReport
│   └── PayoutManagement
├── Reports
│   ├── PlatformAnalytics
│   ├── StorePerformance
│   └── GrowthMetrics
└── Settings
    ├── PlatformConfig
    └── AuditLogs
```

### 8. Full Arabic and RTL Support (Days 18-20)

- [ ] Full RTL layout mirroring for all screens
- [ ] Arabic fonts (Cairo, Tajawal, Almarai)
- [ ] Directional icons flip for RTL
- [ ] Horizontal scroll direction reversed
- [ ] Navigation back/forward buttons flipped
- [ ] Right-aligned text by default in RTL
- [ ] Arabic-Indic numerals support (optional)
- [ ] Arabic date format support
- [ ] Translation files (app_ar.arb, app_en.arb)
- [ ] Multi-language toggle in settings

**Flutter Implementation:**
```dart
MaterialApp(
  locale: const Locale('ar', 'EG'),
  supportedLocales: const [
    Locale('ar', 'EG'),
    Locale('en', 'US'),
  ],
  localizationsDelegates: const [
    AppLocalizations.delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
  ],
)
```

### 9. Dark and Light Mode (Days 20-22)

- [ ] ThemeMode switching (Light/Dark/System)
- [ ] Theme persistence (HydratedBloc + API sync)
- [ ] Dark theme color scheme
- [ ] Light theme color scheme
- [ ] System default following
- [ ] Per-tenant default theme configuration
- [ ] Theme toggle in settings

**Database:**
```sql
ALTER TABLE users
ADD COLUMN theme_mode VARCHAR(20) DEFAULT 'system'
    CHECK (theme_mode IN ('light', 'dark', 'system'));
```

**Dark Theme Colors:**
```json
{
  "primary": "#D4AF37",
  "background": "#121212",
  "surface": "#1E1E1E",
  "card": "#2C2C2C",
  "text_primary": "#FFFFFF",
  "text_secondary": "#B0B0B0",
  "border": "#333333"
}
```

**Screens:**
```
AppearanceSettingsScreen → Theme mode selector
ThemePreviewScreen → Preview before applying
```

---

## Deliverables

| Deliverable | Location |
| :--- | :--- |
| Theme System | `backend/src/modules/theme/` |
| Feature Flags | `backend/src/modules/feature-flags/` |
| Onboarding | `backend/src/modules/onboarding/` |
| Super Admin | `admin_app/` (super admin view) |

---

## Acceptance Criteria

- [ ] New stores can be created via API or wizard
- [ ] Themes apply correctly across all apps
- [ ] Feature flags toggle features per tenant
- [ ] Onboarding wizard guides new clients
- [ ] App flavors work correctly
- [ ] Super admin can manage all tenants

---

## Estimated Effort

| Task | Hours |
| :--- | :--- |
| Multi-Tenant Management | 20 |
| Theme System | 20 |
| Feature Flags | 20 |
| Client Onboarding | 32 |
| App Flavors | 16 |
| Super Admin Panel | 24 |
| Master Dashboard | 32 |
| Arabic & RTL Support | 16 |
| Dark & Light Mode | 12 |
| **Total** | **236 hours** |
