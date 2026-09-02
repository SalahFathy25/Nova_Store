# 🚀 NOVA Commerce — White-Label E-Commerce & Delivery Platform

> **A Production-Grade, Multi-Tenant, Modular E-Commerce Platform & Integrated Delivery Engine built with Flutter & Clean Micro-services Architecture.**

---

## 📌 Executive Summary

**NOVA Commerce** is a enterprise-ready, white-label e-commerce ecosystem designed to empower businesses—ranging from single-brand boutiques to large-scale multi-vendor marketplaces—with a scalable, customizable, and instantly deployable digital store architecture.

Unlike single-use e-commerce templates, **NOVA Commerce** is built from the ground up as a **Productized Platform**. It operates on a dynamic **Multi-Tenant System** equipped with a real-time **Feature Flags Engine**, enabling rapid re-branding, selective feature enablement, and modular scalability without requiring codebase forks.

The platform provides a complete end-to-end commerce lifecycle through three tailored applications working in harmony with a high-performance backend API:
1. **Customer Mobile Application** (iOS & Android) — Highly responsive, dynamic UI driven by server-side JSON layouts.
2. **Delivery Agent Application** (iOS & Android) — Real-time logistics management, live map routing, cash drawer audits, and OTP confirmation.
3. **Admin Control Center** (Flutter Web / Tablet Layout) — Real-time business intelligence dashboard, inventory manager, order state machine orchestrator, and drag-and-drop homepage builder.

---

## 📑 Table of Contents

- [Executive Summary](#-executive-summary)
- [Platform Architecture](#-platform-architecture)
- [System Ecosystem Overview](#-system-ecosystem-overview)
- [Modular System Design](#-modular-system-design)
- [Core Features Matrix](#-core-features-matrix)
- [Multi-Tenancy & Feature Flags Engine](#-multi-tenancy--feature-flags-engine)
- [Theme System & White-Label Customization](#-theme-system--white-label-customization)
- [Order Lifecycle & State Machines](#-order-lifecycle--state-machines)
- [Database Entity-Relationship Schema](#-database-entity-relationship-schema)
- [Frontend (Flutter) Architecture](#-frontend-flutter-architecture)
- [Backend Infrastructure & API Specification](#-backend-infrastructure--api-specification)
- [Payment Gateway Abstraction](#-payment-gateway-abstraction)
- [Multi-Tenant Middleware](#-multi-tenant-middleware)
- [Authentication & Identity Flow](#-authentication--identity-flow)
- [Image Upload Pipeline](#-image-upload-pipeline)
- [Cart Management System](#-cart-management-system)
- [Search & Filtering Engine](#-search--filtering-engine)
- [WebSocket & Real-time Architecture](#-websocket--real-time-architecture)
- [Coupon Engine](#-coupon-engine)
- [Delivery Assignment Algorithm](#-delivery-assignment-algorithm)
- [Offline Support Strategy](#-offline-support-strategy)
- [Rate Limiting & API Versioning](#-rate-limiting--api-versioning)
- [Backup & Disaster Recovery](#-backup--disaster-recovery)
- [Delivery Configuration](#-delivery-configuration)
- [Client Onboarding — Setup Wizard](#-client-onboarding--setup-wizard)
- [Chat & Calls System](#chat--calls-system)
- [Scheduled Orders](#scheduled-orders)
- [Reorder System](#reorder-system)
- [Store Working Hours](#store-working-hours)
- [Print Orders](#print-orders)
- [Master Dashboard - Platform Admin](#master-dashboard--platform-admin)
- [Multi-Activity Product System](#multi-activity-product-system)
- [Full Arabic & RTL Support](#full-arabic--rtl-support)
- [Dark & Light Mode](#dark--light-mode)
- [Enhanced Live Driver Tracking](#enhanced-live-driver-tracking)
- [﻿## 🗨️ Chat & Calls System

NOVA Commerce includes a **real-time communication system** that connects customers, drivers, and store admins — all within the platform.

### Communication Channels

| Channel | Participants | Features |
| :--- | :--- | :--- |
| **Customer ↔ Driver** | Customer + Assigned Driver | Order-related chat, location sharing, delivery updates |
| **Customer ↔ Store** | Customer + Store Admin | Product inquiries, order issues, support |
| **Store ↔ Driver** | Store Admin + Driver | Pickup instructions, order status, coordination |

### Chat Features

| Feature | Description |
| :--- | :--- |
| **Text Messages** | Real-time text messaging with WebSocket delivery |
| **Image Sharing** | Send photos (product issues, delivery proof, etc.) |
| **File Sharing** | Send documents (invoices, receipts, etc.) |
| **Location Sharing** | Share live location on map |
| **Read Receipts** | Message delivered/read status indicators |
| **Typing Indicators** | Real-time typing status |
| **Message History** | Persistent chat history linked to orders |
| **Push Notifications** | New message alerts when app is in background |

### In-App Calling

| Feature | Description |
| :--- | :--- |
| **Voice Calls** | Masked VoIP calls between parties |
| **Call History** | Log of all calls with duration |
| **Caller ID Masking** | Phone numbers hidden for privacy |
| **Call Recording** | Optional recording for dispute resolution |

### Database Schema

`sql
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
`

### API Endpoints

`
GET    /api/v1/conversations
GET    /api/v1/conversations/:id/messages
POST   /api/v1/conversations/:id/messages
POST   /api/v1/conversations/:id/read
POST   /api/v1/calls/initiate
POST   /api/v1/calls/:id/answer
POST   /api/v1/calls/:id/end
`

### WebSocket Events

`
chat:message:send      → Server
chat:message:new       → Client
chat:typing:start      → Server
chat:typing:stop       → Server
chat:read:update       → Server
call:incoming          → Client
call:accepted          → Client
call:ended             → Client
`

---

## 📅 Scheduled Orders

NOVA Commerce supports **scheduled delivery** — customers can choose a specific date and time for their order delivery.

### How It Works

During checkout, customers can choose between **Deliver Now** or **Schedule for Later**. When scheduling, they pick a date and available time slot. Orders are created with delivery_type: "scheduled" and driver assignment happens closer to the scheduled time.

### Database Schema

`sql
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
`

### API Endpoints

`
GET  /api/v1/delivery/slots?date=2026-09-01
GET  /api/v1/delivery/available-dates
POST /api/v1/checkout (with delivery_type: scheduled)
`

### Customer App Flow

1. During checkout, customer sees two options: **Deliver Now** or **Schedule for Later**
2. If scheduled, customer picks a date from available dates
3. Available time slots appear for that date
4. Customer selects a slot and places order
5. Order is created with scheduled_timestamp
6. Driver assignment happens closer to the scheduled time
7. Customer receives reminder notification before delivery window

---

## 🔄 Reorder System

Customers can **reorder** previous orders with a single tap — adding all items from a past order directly to their cart.

### Features

| Feature | Description |
| :--- | :--- |
| **One-Tap Reorder** | Add all items from a past order to cart |
| **Partial Reorder** | Select specific items from a past order |
| **Stock Check** | Validates availability before adding |
| **Price Update** | Uses current prices (not historical) |
| **Variant Match** | Matches exact variants (size, color, etc.) |
| **Cart Merge** | Merges with existing cart items |

### API Endpoints

`
POST /api/v1/orders/:orderId/reorder
POST /api/v1/orders/:orderId/reorder/selective
`

### Request Body (Selective Reorder)

`json
{
  "items": [
    { "order_item_id": "item-1", "quantity": 2 },
    { "order_item_id": "item-3", "quantity": 1 }
  ]
}
`

### Customer App Flow

1. Customer views order history
2. Taps **Reorder** button on any past order
3. System validates stock for all items
4. Items added to cart (with current prices)
5. Customer proceeds to checkout
6. If some items unavailable, shows warning with alternatives

---

## 🏪 Store Working Hours

Store owners can define **working hours** — controlling when the store accepts orders and when it appears as closed to customers.

### Features

| Feature | Description |
| :--- | :--- |
| **Per-Day Configuration** | Different hours for each day of the week |
| **Multiple Shifts** | Morning/Evening shifts per day |
| **Holiday Schedule** | Special hours for holidays |
| **Auto-Close** | Store auto-closes outside working hours |
| **Timezone Aware** | Respects store timezone |
| **Buffer Time** | Prep time buffer before last order |

### Database Schema

`sql
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
`

### API Endpoints

`
GET  /api/v1/stores/:id/working-hours
PUT  /api/v1/stores/:id/working-hours
POST /api/v1/stores/:id/holidays
GET  /api/v1/stores/:id/holidays
DELETE /api/v1/stores/:id/holidays/:holidayId
GET  /api/v1/stores/:id/is-open
`

### Business Logic

When a customer browses a store, the system checks working hours. If the store is open, the customer can browse products. If closed, the store displays the closing message with next opening time.

### Admin Configuration

Store admins can:
- Set opening/closing times for each day
- Mark days as closed (e.g., Fridays)
- Add holiday schedules with custom hours
- Set minimum prep time buffer
- View store status in real-time

---

## 🖨️ Print Orders

Store admins can **print orders** directly from the dashboard — generating professional order receipts for fulfillment.

### Print Features

| Feature | Description |
| :--- | :--- |
| **Thermal Printer Support** | 58mm/80mm thermal receipt printers |
| **A4 Print** | Standard paper size for invoices |
| **Batch Print** | Print multiple orders at once |
| **Custom Templates** | Configurable print templates |
| **Auto-Print** | Auto-print on new order (configurable) |
| **Barcode/QR** | Include order barcode on printout |

### API Endpoints

`
GET  /api/v1/orders/:id/print
GET  /api/v1/orders/batch/print
POST /api/v1/print/preview
GET  /api/v1/print/templates
PUT  /api/v1/print/templates/:id
`

### Admin Flow

1. Admin views order list
2. Selects one or multiple orders
3. Clicks **Print** button
4. Preview appears (optional)
5. Send to connected printer
6. Receipt/invoice printed

---

## 👑 Master Dashboard — Platform Admin

NOVA Commerce includes a **Master Dashboard** — a separate admin interface for the **platform owner** (not store owners) to manage the entire ecosystem.

### Master vs Store Admin

| Aspect | Master Admin | Store Admin |
| :--- | :--- | :--- |
| **Scope** | All stores, all users | Single store only |
| **Access** | Platform owner only | Per-store admins |
| **Focus** | Business operations | Store operations |
| **Revenue** | Commissions, platform fees | Store revenue |
| **Users** | All users across platform | Store customers only |

### Master Dashboard Features

| Module | Features |
| :--- | :--- |
| **Store Management** | List all stores, approve/reject, activate/deactivate, view details |
| **User Management** | All users (customers, admins, drivers, vendors), ban/unban |
| **Driver Management** | All drivers, approval, performance, assignment |
| **Order Overview** | All orders across platform, filters, search |
| **Financial Overview** | Total revenue, commissions, payouts, platform fees |
| **Commission Config** | Set commission rates per store or category |
| **Payout Management** | Process vendor/driver payouts, history |
| **Coupon Management** | Platform-wide coupons, store-specific coupons |
| **Marketing** | Platform-wide promotions, banners, announcements |
| **Reports** | Platform analytics, store performance, growth metrics |
| **System Settings** | Platform config, payment gateways, SMS providers |
| **Audit Logs** | All admin actions across platform |

### API Endpoints (Super Admin)

`
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
`

### Master Dashboard Screens

`
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
`

---

## 🍎 Multi-Activity Product System

NOVA Commerce supports **multiple business activities** with **activity-specific product presentation** — each type of store can sell products in its own unique way.

### Activity Types and Product Presentation

| Activity | Selling Unit | Product Example | How It Is Sold |
| :--- | :--- | :--- | :--- |
| 🥬 Grocery | Weight / Unit / Pack / Carton | Tomato | 500g / 1kg / 2kg |
| 🌸 Perfumes | ML / Size | Chanel No. 5 | 30ml / 50ml / 100ml |
| 👕 Clothing | Size + Color | T-Shirt | S/M/L/XL + Black/White/Blue |
| 👟 Shoes | Size | Nike Air Max | 40 / 41 / 42 / 43 |
| 📱 Electronics | Specs / Version | iPhone 15 | Color / Storage / RAM |
| 🍔 Restaurants | Size + Add-ons | Burger Meal | S/M/L + Cheese + Extra Sauce |
| 🧸 Toys | Age Group / Type | Action Figure | 3+ / 6+ / 12+ |

### Product Type Configuration

Each store can define its product_type which determines how products are displayed and sold:

`json
{
  "store_id": "store-123",
  "product_type": "grocery",
  "selling_units": ["weight", "unit", "pack"],
  "weight_units": ["g", "kg"],
  "display_config": {
    "show_weight_selector": true,
    "show_quantity_selector": true,
    "default_unit": "kg",
    "min_weight": 0.5,
    "max_weight": 10,
    "weight_step": 0.5
  }
}
`

### Database Schema

`sql
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
`

### Customer App - Dynamic Product Display

For grocery products, customers see weight selectors. For clothing, they see size and color options. For restaurants, they see size options with add-ons. The product display adapts dynamically based on the store product_type.

### API Endpoints

`
GET  /api/v1/stores/:id/config (includes product_type, selling_config)
GET  /api/v1/products/:id (returns dynamic display based on product_type)
POST /api/v1/cart/items (handles weight/addons/specs)
GET  /api/v1/products/:id/addons
GET  /api/v1/products/:id/specs
`

---

## 🌍 Full Arabic and RTL Support

NOVA Commerce provides **complete Arabic language support** with proper RTL (Right-to-Left) layout across all applications.

### RTL Implementation

| Component | RTL Handling |
| :--- | :--- |
| **Layout** | Full RTL mirroring for all screens |
| **Typography** | Arabic fonts (Cairo, Tajawal, Almarai) |
| **Icons** | Directional icons flip for RTL |
| **Lists** | Horizontal scroll direction reversed |
| **Navigation** | Back button on right, forward on left |
| **Text Alignment** | Right-aligned by default in RTL |
| **Numbers** | Arabic-Indic numerals support (optional) |
| **Date/Time** | Arabic date format support |

### Multi-Language Support

| Language | Code | Direction | Status |
| :--- | :--- | :--- | :--- |
| **Arabic** | ar | RTL | Full Support |
| **English** | en | LTR | Full Support |
| **French** | fr | LTR | Planned |
| **Turkish** | tr | LTR | Planned |

### Flutter RTL Implementation

The app uses MaterialApp with locale set to Arabic, supported locales include Arabic and English, and localizations delegates handle Material, Widgets, and Cupertino localizations. Directionality widget ensures proper RTL layout.

### Translation Files

`
lib/
├── l10n/
│   ├── app_ar.arb
│   ├── app_en.arb
│   └── app_generated.dart
`

---

## 🌙 Dark and Light Mode

NOVA Commerce supports **Dark and Light themes** — users can switch between modes or follow system settings.

### Theme Modes

| Mode | Description |
| :--- | :--- |
| **Light** | Default mode, white backgrounds |
| **Dark** | Dark backgrounds, reduced eye strain |
| **System** | Follows device settings (auto) |

### Implementation

| Layer | Approach |
| :--- | :--- |
| **Backend** | Stores user preference in user profile |
| **Flutter** | ThemeMode switching with Bloc/Cubit |
| **Persistence** | Local storage (HydratedBloc) + API sync |
| **Per-Tenant** | Default mode configurable per store |

### Database Schema

`sql
ALTER TABLE users
ADD COLUMN theme_mode VARCHAR(20) DEFAULT 'system'
    CHECK (theme_mode IN ('light', 'dark', 'system'));
`

### Dark Mode Colors

`json
{
  "dark_theme": {
    "primary": "#D4AF37",
    "background": "#121212",
    "surface": "#1E1E1E",
    "card": "#2C2C2C",
    "text_primary": "#FFFFFF",
    "text_secondary": "#B0B0B0",
    "border": "#333333",
    "error": "#CF6679",
    "success": "#4CAF50"
  }
}
`

### Customer App Flow

1. User opens settings
2. Taps Appearance / Theme
3. Options: Light / Dark / System Default
4. Theme applies instantly
5. Preference saved to profile and local storage
6. Persists across app restarts

---

## 🗺️ Enhanced Live Driver Tracking

NOVA Commerce provides **real-time driver location tracking** — customers can watch their delivery driver on a live map during transit.

### Tracking Features

| Feature | Description |
| :--- | :--- |
| **Live Map** | Real-time driver position on Google Maps |
| **Route Display** | Shows driver route to customer |
| **ETA** | Estimated time of arrival |
| **Distance** | Remaining distance to customer |
| **Status Updates** | Driver status changes in real-time |
| **Arrival Alert** | Notification when driver is nearby |

### Tracking Flow

During delivery, the driver app shares location every 10 seconds via WebSocket. The backend receives the location and broadcasts it to the customer app. The customer app updates the map in real-time, shows the driver pin, and calculates ETA.

### Database Schema

`sql
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
`

### WebSocket Events

`
driver:location:report → Server (every 10 seconds during delivery)
delivery:location:update → Customer App
admin:drivers:locations → Admin App
`

### Customer App Display

The customer app shows a live map with the driver position, route to customer, ETA, remaining distance, driver info (name, vehicle), and buttons to call or chat with the driver.

### API Endpoints

`
POST /api/v1/driver/location          (driver reports location)
GET  /api/v1/orders/:id/tracking      (customer gets tracking data)
GET  /api/v1/admin/drivers/locations  (admin gets all driver locations)
`

---


Security Considerations](#-security-considerations)
- [Error Handling Strategy](#-error-handling-strategy)
- [Monitoring & Observability](#-monitoring--observability)
- [Commercial Models & Packages](#-commercial-models--packages)
- [Installation & Local Setup Guide](#-installation--local-setup-guide)
- [Deployment & CI/CD Pipelines](#-deployment--cicd-pipelines)
- [Demo & Portfolio Strategy](#-demo--portfolio-strategy)
- [Roadmap & Development Phases](#-roadmap--development-phases)
- [License & Commercial Support](#-license--commercial-support)

---

## 🏗 Platform Architecture

The architecture adheres strictly to **Clean Architecture** and **SOLID Principles** on the client side, while leveraging a **Modular Monolith / Microservices-Ready API** on the backend. Data separation across multiple stores is strictly enforced at the data layer to ensure multi-tenant isolation.

                              ┌──────────────────────────────────────────────┐
                              │            NOVA COMMERCE CORE                │
                              │    White-Label Backend API & DB Services     │
                              └──────────────────────┬───────────────────────┘
                                                     │
                               ┌─────────────────────┴─────────────────────┐
                               │  RESTful APIs / WebSockets / Push Engine  │
                               └─────────────────────┬─────────────────────┘
                                                     │
         ┌───────────────────────────────────────────┼───────────────────────────────────────────┐
         ▼                                           ▼                                           ▼
┌─────────────────────────┐                 ┌─────────────────────────┐                 ┌─────────────────────────┐
│      Customer App       │                 │      Delivery App         │                 │     Admin App (Web)     │
│  (Flutter Cross-Platform)│                 │  (Flutter Cross-Platform)│                 │  (Flutter Web / Desktop)│
└────────────┬────────────┘                 └────────────┬────────────┘                 └────────────┬────────────┘
│                                           │                                           │
▼                                           ▼                                           ▼
┌─────────────────────────┐                 ┌─────────────────────────┐                 ┌─────────────────────────┐
│ • Server-Driven UI      │                 │ • Real-time Location    │                 │ • Business Intelligence │
│ • Dynamic Branding Theme│                 │ • COD Cash Management   │                 │ • Home Page Drag-n-Drop │
│ • Multi-Payment Adapter │                 │ • OTP Delivery Verification               │ • Granular RBAC Control │
└─────────────────────────┘                 └─────────────────────────┘                 └─────────────────────────┘

---

## 🔄 System Ecosystem Overview

| Application | Core Audience | Key Value Proposition | Primary Technology Stack |
| :--- | :--- | :--- | :--- |
| **Customer App** | End Consumers | Seamless, personalized shopping experience with real-time order tracking. | Flutter (BLoC + Hydrated Storage) |
| **Delivery App** | Logistics & Drivers | Streamlined shift execution, navigation, cash ledger accuracy, and delivery proof. | Flutter (Geolocator + WebSockets) |
| **Admin Web App** | Store Operators & Admins | Central command center for catalogs, operational flows, tenant configs, and analytics. | Flutter Web (Responsive Grid Layouts) |
| **Backend Services**| Engine Platform | High-throughput data orchestration, multi-tenant middleware, and payment processing. | Node.js / NestJS / PostgreSQL |

---

## 🧩 Modular System Design

NOVA Commerce is built as a **Modular Product** — not a monolithic application. The system is divided into a **Core Engine** and **Optional Feature Modules** that can be independently enabled or disabled per tenant.

### Core Modules (Always Active)

```
NOVA COMMERCE CORE
├── Authentication & Authorization
├── User Management
├── Product Catalog
├── Category Management
├── Shopping Cart
├── Checkout Engine
├── Order Processing
├── Payment Processing
├── Delivery Management
├── Notification System
├── Store Configuration
├── Working Hours Management
├── Reorder System
├── Print Orders
├── Arabic & RTL Support
├── Dark/Light Mode
└── Live Driver Tracking
```

### Optional Feature Modules

| Module | Description | Package |
| :--- | :--- | :--- |
| **Multi-Vendor** | Vendor registration, vendor orders, commission engine, vendor dashboard | Marketplace |
| **Reviews & Ratings** | Product reviews, star ratings, photo reviews | Business+ |
| **Coupons & Discounts** | Percentage, flat rate, free shipping, BOGO coupons | Business+ |
| **Loyalty Program** | Points earning, tier system, reward redemption | Enterprise |
| **Wallet System** | Digital wallet, top-up, wallet payments, refund to wallet | Enterprise |
| **Flash Sales** | Time-limited deals, countdown timers, flash sale scheduling | Business+ |
| **Subscriptions** | Recurring orders, subscription plans, auto-renewal | Enterprise |
| **Returns & Refunds** | Return requests, refund processing, exchange management | Business+ |
| **Advanced Analytics** | Custom reports, exportable data, predictive analytics | Enterprise |
| **Dynamic Home Builder** | Admin drag-and-drop home page layout editor | Business+ |
| **Push Campaigns** | Bulk push notifications, scheduled campaigns | Enterprise |
| **Product Comparison** | Side-by-side product comparison | Business+ |
| **Chat & Calls** | Real-time messaging, VoIP calls, file sharing | Business+ |
| **Scheduled Orders** | Date/time slot selection for delivery | Business+ |
| **Reorder** | One-tap reorder from past orders | Core |
| **Store Working Hours** | Per-day hours, holidays, auto-close | Core |
| **Print Orders** | Thermal/A4 printing, batch print, templates | Core |
| **Multi-Activity Products** | Weight, ML, size, specs, add-ons per activity | Enterprise |
| **Arabic & RTL** | Full Arabic language and RTL layout support | Core |
| **Dark/Light Mode** | Theme switching with system default option | Core |
| **Enhanced Tracking** | Live driver map, ETA, distance, arrival alerts | Core |

### Package Composition

```
Starter Package
└── Core Only

Business Package
└── Core + Reviews + Coupons + Flash Sales + Returns + Dynamic Home Builder

Enterprise Package
└── Core + All Optional Modules

Custom Package
└── Core + Client-Selected Modules
```

This modular approach allows NOVA Commerce to serve a single-brand boutique and a full multi-vendor marketplace using the same codebase — without forking.

---

## ✨ Core Features Matrix

### 🛒 1. Customer Application
* **Server-Driven Dynamic Home Screen:** Sections (Banners, Categories, Flash Sales, Grid Lists) are constructed dynamically via backend JSON configurations.
* **White-Label Theme Adaptability:** Colors, typography, custom icons, and logo assets switch at runtime based on the targeted store profile.
* **Advanced Catalog Discovery:**
  * Multi-level nested category navigation.
  * Multi-attribute filtering (Price range, Colors, Sizes, Brands, Ratings).
  * Real-time search query suggestions with local history caching.
* **Product Detail Pages (PDP):**
  * High-resolution image dynamic gallery with pinch-to-zoom.
  * Real-time variant price & stock updates upon selecting specific attribute matrix (e.g., Red + XL).
  * Customer verified reviews and star-rating distribution breakdowns.
* **Smart Cart & Checkout Engine:**
  * Real-time stock validation during cart modification.
  * Coupon discount calculation engine (Percentage, Flat Rate, Free Shipping thresholds).
  * Interactive Google Maps location picker for pin-point shipping address setup.
  * Multi-Gateway Checkout: Integrated with Credit Cards, Cash on Delivery (COD), Mobile Wallets (Vodafone Cash, Orange Money), and InstaPay adapters.
* **Real-time Order Hub:**
  * Live status pipeline timeline (Pending $\rightarrow$ Preparing $\rightarrow$ Shipped $\rightarrow$ Delivered).
  * Unique 4-digit Delivery Verification OTP code generation.

---

### 🚚 2. Delivery Agent Application
* **Shift Management System:** One-tap online/offline toggle controlling availability for driver auto-assignment algorithms.
* **Interactive Logistics Dashboard:** Real-time counters showing Today's Earnings, Pending Pickups, Active Deliveries, and Completed Orders.
* **Order Dispatch & Acceptance Workflow:**
  * Instant Push Notifications via Firebase Cloud Messaging (FCM) when assigned a new package.
  * Detailed pick-up store location and drop-off customer location cards.
  * Accept/Reject order with reason selection.
* **In-App Navigation & Communication:**
  * Direct deep-linking to Google Maps / Apple Maps for optimized delivery routing.
  * Masked in-app calling or direct SMS action buttons to reach buyers or store admins.
* **Proof of Delivery (PoD) Engine:**
  * **OTP Handover Verification:** Delivery cannot be marked completed without entering the customer's secret OTP.
  * Optional digital signature capturing or photo proof uploading.
  * Customer confirmation button on driver's device.
* **Cash on Delivery (COD) Financial Ledger:**
  * Tracks total physical cash collected during active shifts.
  * Reconciliation screen comparing expected cash vs. physically submitted cash during shift closure audits.
  * Shift history with daily, weekly, and monthly cash summaries.
  * Discrepancy flagging with admin notification.

### Shift Workflow

```
Driver Opens App
       │
       ▼
  ┌─────────┐
  │  SHIFT   │
  │  START   │
  └────┬─────┘
       │
       ▼
  ┌─────────────────┐
  │  GO ONLINE      │◄─────── Start receiving order assignments
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │  ORDER ASSIGNED │──── Push Notification
  └────────┬────────┘
           │
       ┌───┴───┐
       ▼       ▼
   Accept    Reject
       │       │
       ▼       ▼
  ┌─────────┐  (Return to queue)
  │NAVIGATE │
  └────┬────┘
       │
       ▼
  ┌─────────┐
  │ PICKUP  │
  └────┬────┘
       │
       ▼
  ┌─────────────────┐
  │ CUSTOMER LOC    │
  └────────┬────────┘
           │
       ┌───┴───┐
       ▼       ▼
   OTP Enter  Photo/Sig
       │       │
       └───┬───┘
           ▼
  ┌─────────────────┐
  │    DELIVERED    │
  └────────┬────────┘
           │
       ┌───┴───┐
       ▼       ▼
   Next Order  End Shift
                   │
                   ▼
           ┌───────────────┐
           │ CASH RECONCILE│
           │ Expected: 3850│
           │ Submitted:3850│
           │ Diff:     0   │
           └───────────────┘
```

### COD Cash Ledger Details

| Metric | Description |
| :--- | :--- |
| **Cash Collected Today** | Total COD cash collected during current shift |
| **Pending Cash** | Orders delivered but cash not yet reconciled |
| **Expected Cash** | Sum of all COD orders in current shift |
| **Submitted Cash** | Physically submitted amount at shift end |
| **Discrepancy** | Difference between Expected and Submitted |
| **Shift History** | Past shifts with cash summaries |

---

### 🎛️ 3. Admin Control Center (Web & Desktop)
* **Real-time Executive Dashboard:**
  * Live revenue totals, active user sessions, top-selling items, and low-stock alerts.
  * Interactive map plotting active delivery drivers and pending delivery routes.
  * Conversion rate, average order value, customer acquisition cost.
* **Catalog & Inventory Management:**
  * Dynamic Attribute Builder: Create custom product attributes (Size, Color, Material) on the fly.
  * SKU Matrix Generator: Automatically generate unique SKUs, stock numbers, and price overrides per variant combination.
  * Category hierarchy tree manager with drag-and-drop reordering.
  * Bulk product import/export via CSV.
* **Operational Order Orchestrator:**
  * Granular status override options across Order, Payment, and Shipping pipelines.
  * Manual or rule-based driver assignment.
  * Parent Order + Sub-Order split view for multi-vendor orders.
* **Visual Home Page Builder (No-Code Layout Builder):**
  * Rearrange home screen widgets (Banners → Grid → Horizontal Lists) via a visual drag-and-drop interface.
  * Preview mode before publishing.
* **Tenant & Feature Flag Control:**
  * Toggle system capabilities (e.g., enable/disable Multi-Vendor mode, Reviews, Loyalty Points, Subscriptions) instantly without redeploying code.
  * Customize primary and secondary brand colors, store currency, language, and tax rules.

### Admin Module — Finance & Payments

| Feature | Description |
| :--- | :--- |
| **Payment Overview** | All transactions with status, method, and amount |
| **COD Management** | Track cash collections, reconcile driver submissions |
| **Refund Processing** | Approve/reject refund requests, process partial refunds |
| **Vendor Commissions** | View commission calculations per vendor per order |
| **Payout Management** | Schedule and execute vendor payouts |
| **Delivery Earnings** | Track driver earnings, bonuses, and deductions |
| **Revenue Reports** | Daily, weekly, monthly revenue breakdowns |
| **Export** | Export financial data to CSV/Excel |

### Admin Module — User & Role Management

| Feature | Description |
| :--- | :--- |
| **User List** | All users (customers, admins, drivers, vendors) |
| **Role Management** | Create custom roles with granular permissions |
| **Permission Matrix** | View/Edit/Delete per module per role |
| **Activity Logs** | Audit trail of all admin actions |
| **Account Status** | Activate/deactivate/ban users |

### Admin Module — Marketing & Promotions

| Feature | Description |
| :--- | :--- |
| **Coupons** | Create/manage coupon codes with rules |
| **Flash Sales** | Schedule time-limited sales with countdown |
| **Banners** | Upload/manage home page banners |
| **Home Sections** | Drag-and-drop home page layout builder |
| **Push Campaigns** | Send bulk push notifications to segments |
| **Featured Products** | Curate featured/seasonal product lists |
| **Offers** | Create product-specific or category-wide offers |

---

## 🎛 Multi-Tenancy & Feature Flags Engine

NOVA Commerce utilizes a **Single-Database, Logical Isolation Multi-Tenancy** approach. Every domain model query is scoped to a specific `tenant_id` injected via API headers (`X-Tenant-ID`).

### Tenant Configuration Payload Architecture

```json
{
  "tenant_id": "tenant_a8d79f-2026",
  "store_identity": {
    "name": "NOVA Luxury Fashion",
    "domain": "fashion.novacommerce.io",
    "currency": "EGP",
    "locale": "ar",
    "support_email": "support@novafashion.com"
  },
  "branding_theme": {
    "primary_color": "#1A1A1A",
    "secondary_color": "#D4AF37",
    "background_color": "#FAFAFA",
    "font_family": "Cairo",
    "logo_url": "[https://cdn.novacommerce.io/assets/logo_luxury.png](https://cdn.novacommerce.io/assets/logo_luxury.png)"
  },
  "feature_flags": {
    "multi_vendor_enabled": false,
    "delivery_app_integration": true,
    "loyalty_program_enabled": true,
    "wallet_system_enabled": false,
    "product_reviews_enabled": true,
    "coupons_enabled": true,
    "dynamic_home_builder": true
  },
  "payment_gateways": [
    { "provider": "cod", "is_enabled": true },
    { "provider": "stripe", "is_enabled": true, "public_key": "pk_test_..." },
    { "provider": "vodafone_cash", "is_enabled": true, "merchant_code": "VFC_9872" }
  ],
  "delivery_settings": {
    "fulfillment_mode": "platform_drivers",
    "fee_calculation": "distance_matrix",
    "require_otp_validation": true
  }
}
```

### Feature Flags — Full Capability Matrix

| Feature Flag | Default | Description |
| :--- | :--- | :--- |
| `multi_vendor_enabled` | `false` | Enable vendor registration, vendor products, and commission splitting |
| `delivery_app_integration` | `true` | Enable dedicated delivery agent application |
| `loyalty_program_enabled` | `false` | Enable points earning and reward redemption |
| `wallet_system_enabled` | `false` | Enable digital wallet for payments and refunds |
| `product_reviews_enabled` | `true` | Enable customer reviews and star ratings |
| `coupons_enabled` | `true` | Enable coupon creation and redemption |
| `flash_sales_enabled` | `false` | Enable time-limited flash sale campaigns |
| `subscriptions_enabled` | `false` | Enable recurring order subscriptions |
| `returns_enabled` | `true` | Enable return and refund request flow |
| `dynamic_home_builder` | `true` | Enable admin drag-and-drop home page editor |
| `push_campaigns_enabled` | `false` | Enable bulk push notification campaigns |
| `product_comparison_enabled` | `false` | Enable side-by-side product comparison |
| `wallet_topup_enabled` | `false` | Enable wallet top-up via payment gateways |
| `same_day_delivery` | `false` | Enable same-day delivery option |
| `scheduled_delivery` | `false` | Enable scheduled delivery time slots |
| chat_enabled | alse | Enable real-time chat between customers, drivers, and stores |
| calls_enabled | alse | Enable in-app VoIP calls |
| store_working_hours_enabled | 	rue | Enable store working hours and auto-close |
| print_orders_enabled | alse | Enable order printing from admin dashboard |
| multi_activity_products | alse | Enable activity-specific product types (grocery, clothing, etc.) |
| eorder_enabled | 	rue | Enable one-tap reorder from past orders |
| dark_mode_enabled | 	rue | Enable dark/light mode toggle |
| enhanced_tracking_enabled | alse | Enable live driver tracking with ETA |

### How Feature Flags Work

1. **Admin Dashboard** — Store admin toggles features on/off in real-time.
2. **Backend Middleware** — API checks flag status before exposing endpoints.
3. **Flutter Apps** — Apps fetch feature flags on startup and dynamically show/hide UI elements.
4. **No Redeployment** — Changes take effect immediately without code pushes.

---

## 🎨 Theme System & White-Label Customization

NOVA Commerce supports **runtime white-label theming** — each tenant can have a fully branded experience without code changes.

### Branding Configuration

```json
{
  "branding": {
    "app_name": "LUXE Fashion",
    "app_icon_url": "https://cdn.nova.io/icons/luxe_icon.png",
    "splash_logo_url": "https://cdn.nova.io/splash/luxe_splash.png",
    "primary_color": "#1A1A1A",
    "secondary_color": "#D4AF37",
    "accent_color": "#FF4081",
    "background_color": "#FAFAFA",
    "surface_color": "#FFFFFF",
    "error_color": "#B00020",
    "text_primary": "#212121",
    "text_secondary": "#757575",
    "font_family": "Cairo",
    "font_heading": "Playfair Display",
    "border_radius": 12,
    "logo_url": "https://cdn.nova.io/brands/luxe_logo.png",
    "splash_screen_config": {
      "background_color": "#1A1A1A",
      "logo_position": "center",
      "duration_ms": 2000
    }
  }
}
```

### Theme Presets

| Preset | Primary | Secondary | Font | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Minimal** | `#000000` | `#FFFFFF` | Inter | Fashion, Luxury |
| **Fresh** | `#4CAF50` | `#FFFFFF` | Roboto | Grocery, Organic |
| **Bold** | `#FF5722` | `#212121` | Poppins | Electronics, Tech |
| **Elegant** | `#1A1A1A` | `#D4AF37` | Playfair Display | Perfume, Jewelry |
| **Vibrant** | `#9C27B0` | `#FF4081` | Montserrat | Beauty, Cosmetics |

### Server-Driven UI — Dynamic Home Layout

The Customer App home screen is **100% server-driven**. The admin configures sections via the Admin Dashboard, and the app renders them dynamically.

**Admin Configures:**
```
Home Sections:
1. Banner Slider (Banner ID: 101, 102, 103)
2. Category Grid (Columns: 4)
3. Flash Sale (Timer: Enabled, Products: Auto)
4. Best Sellers (Limit: 10, Layout: Horizontal)
5. New Arrivals (Limit: 8, Layout: Grid)
6. Featured Brands (Layout: Carousel)
```

**Server Returns JSON:**
```json
{
  "home_layout": [
    { "type": "banner_slider", "banners": [...], "height": 200 },
    { "type": "category_grid", "categories": [...], "columns": 4 },
    { "type": "flash_sale", "products": [...], "countdown": true },
    { "type": "product_list", "title": "Best Sellers", "products": [...] },
    { "type": "product_grid", "title": "New Arrivals", "products": [...] }
  ]
}
```

**Flutter App Renders Dynamically** — No hardcoded layouts.

---

## 🔄 Order Lifecycle & State Machines
To eliminate business logic chaos and edge-case bugs, NOVA Commerce splits an order into Three Independent State Machines:

                       ┌─────────────────────────────────────────────────┐
                       │               ORDER SYSTEM MATRIX               │
                       └────────────────────────┬────────────────────────┘
                                                │
        ┌───────────────────────────────────────┼───────────────────────────────────────┐
        ▼                                       ▼                                       ▼
 ┌───────────────┐                       ┌───────────────┐                       ┌───────────────┐
 │ Order Status  │                       │ Payment Status│                       │Delivery Status│
 ├───────────────┤                       ├───────────────┤                       ├───────────────┤
 │ • Pending     │                       │ • Pending     │                       │ • Unassigned  │
 │ • Confirmed   │                       │ • Authorized  │                       │ • Assigned    │
 │ • Processing  │                       │ • Paid        │                       │ • Accepted    │
 │ • Ready       │                       │ • Failed      │                       │ • Picked Up   │
 │ • Shipped     │                       │ • Cash_Collect│                       │ • On The Way  │
 │ • Delivered   │                       │ • Refunded    │                       │ • Delivered   │
 │ • Cancelled   │                       │ • Part_Refund │                       │ • Failed      │
 └───────────────┘                       └───────────────┘                       └───────────────┘
---

## 🗄 Database Entity-Relationship Schema

Below is the complete, scalable Relational SQL Schema design for PostgreSQL. It natively supports Multi-Tenant scoping, Product Variants, and Parent/Sub Order structures for seamless Single-Vendor to Multi-Vendor evolution.

### Schema Overview

```
NOVA COMMERCE DATABASE (40+ Tables)
├── Tenant & Auth: stores, users, user_addresses, user_sessions, otp_codes
├── Catalog: categories, brands, attributes, attribute_values, products, product_variants, product_images, product_reviews, product_specifications, product_addons, product_addon_groups
├── Cart & Orders: carts, cart_items, wishlist_items, parent_orders, sub_orders, order_items, order_status_history
├── Payments: payments, refunds, vendor_payouts
├── Delivery: delivery_shifts, cash_ledger, delivery_zones, driver_location_history, delivery_time_slots
├── Marketing: coupons, coupon_usage, banners, home_sections, flash_sales, flash_sale_products
├── Chat & Calls: conversations, conversation_participants, messages, calls
├── Store Config: store_working_hours, store_holidays
├── Notifications: notifications
└── System: audit_logs, feature_flags
```

```sql
-- 1. STORES / TENANTS TABLE
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    configurations JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USERS & ROLES TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('customer', 'admin', 'driver', 'vendor_admin')),
    fcm_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_email_per_tenant UNIQUE (tenant_id, email)
);

-- 3. PRODUCT CATALOG STRUCTURE
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    display_order INT DEFAULT 0
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Nullable for Single-Vendor
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL UNIQUE,
    attributes JSONB NOT NULL, -- e.g. {"color": "Gold", "size": "42"}
    price_override DECIMAL(10, 2),
    stock_quantity INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ORDERS & SUB-ORDERS ARCHITECTURE
CREATE TABLE parent_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    shipping_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    shipping_address JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sub_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_order_id UUID NOT NULL REFERENCES parent_orders(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    delivery_status VARCHAR(50) NOT NULL DEFAULT 'Unassigned',
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_otp VARCHAR(6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sub_order_id UUID NOT NULL REFERENCES sub_orders(id) ON DELETE CASCADE,
    product_variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL
);

-- INDEXES FOR MULTI-TENANT QUERY OPTIMIZATION
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_products_tenant ON products(tenant_id);
CREATE INDEX idx_orders_tenant ON parent_orders(tenant_id);
```

> **Note:** The SQL schema above shows the original core tables. The complete schema with 30+ tables (carts, wishlist, addresses, OTP, sessions, brands, attributes, reviews, coupons, banners, home_sections, flash_sales, payments, refunds, vendor_payouts, delivery_shifts, cash_ledger, delivery_zones, notifications, audit_logs, feature_flags, order_status_history) is documented in the full schema appendix. See [Complete Database Schema](#complete-database-schema) below.

### Additional Tables Summary

| Table Group | Tables | Purpose |
| :--- | :--- | :--- |
| **Auth** | `user_addresses`, `otp_codes`, `user_sessions` | Address management, phone OTP verification, multi-device sessions |
| **Catalog** | `brands`, `attributes`, `attribute_values`, `product_images`, `product_reviews` | Brand management, dynamic attributes, product media, reviews |
| **Cart** | `carts`, `cart_items`, `wishlist_items` | Shopping cart (guest + registered), wishlist |
| **Orders** | `order_status_history` | Full audit trail for every status change |
| **Payments** | `payments`, `refunds`, `vendor_payouts` | Payment transactions, refund processing, vendor commission payouts |
| **Delivery** | `delivery_shifts`, `cash_ledger`, `delivery_zones` | Driver shift management, COD cash reconciliation, zone-based delivery |
| **Marketing** | `coupons`, `coupon_usage`, `banners`, `home_sections`, `flash_sales`, `flash_sale_products` | Coupon engine, visual promotions, dynamic home layout |
| **System** | `notifications`, `audit_logs`, `feature_flags` | Push/in-app notifications, admin audit trail, per-tenant feature toggles |
| **Chat & Calls** | conversations, conversation_participants, messages, calls | Real-time messaging, VoIP calls, file sharing |
| **Store Config** | store_working_hours, store_holidays | Store hours management, holiday schedules |
| **Delivery Extended** | driver_location_history, delivery_time_slots | Live driver tracking, scheduled delivery slots |
| **Catalog Extended** | product_specifications, product_addons, product_addon_groups | Product specs, add-ons for multi-activity |

### Complete Database Schema

<details>
<summary>Click to expand full 30+ table SQL schema</summary>

```sql
-- ============================================
-- 1. TENANT & AUTHENTICATION
-- ============================================

CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    configurations JSONB NOT NULL DEFAULT '{}',
    branding JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    password_hash VARCHAR(255),
    role VARCHAR(50) NOT NULL CHECK (role IN ('customer', 'admin', 'driver', 'vendor_admin')),
    avatar_url TEXT,
    fcm_token TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    auth_provider VARCHAR(50) DEFAULT 'email',
    provider_uid VARCHAR(255),
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_email_per_tenant UNIQUE (tenant_id, email),
    CONSTRAINT unique_phone_per_tenant UNIQUE (tenant_id, phone)
);

CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    label VARCHAR(100) DEFAULT 'Home',
    full_address TEXT NOT NULL,
    street VARCHAR(255),
    building VARCHAR(100),
    floor VARCHAR(50),
    apartment VARCHAR(50),
    landmark VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'EG',
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE otp_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(50) NOT NULL,
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    code VARCHAR(6) NOT NULL,
    purpose VARCHAR(50) NOT NULL CHECK (purpose IN ('login', 'register', 'verify', 'reset_password')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL,
    device_info JSONB,
    ip_address INET,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. PRODUCT CATALOG
-- ============================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_slug_per_tenant UNIQUE (tenant_id, slug)
);

CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    logo_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_brand_slug_tenant UNIQUE (tenant_id, slug)
);

CREATE TABLE attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'number', 'color', 'select', 'multi_select')),
    is_filterable BOOLEAN DEFAULT FALSE,
    is_variant BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_attr_name_tenant UNIQUE (tenant_id, name)
);

CREATE TABLE attribute_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attribute_id UUID NOT NULL REFERENCES attributes(id) ON DELETE CASCADE,
    value VARCHAR(255) NOT NULL,
    color_code VARCHAR(7),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_attr_value UNIQUE (attribute_id, value)
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    base_price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2),
    cost_price DECIMAL(10, 2),
    sku VARCHAR(100),
    barcode VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_digital BOOLEAN DEFAULT FALSE,
    weight DECIMAL(8, 2),
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    search_vector TSVECTOR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_product_slug_tenant UNIQUE (tenant_id, slug)
);

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255),
    attributes JSONB NOT NULL DEFAULT '{}',
    price_override DECIMAL(10, 2),
    compare_at_price DECIMAL(10, 2),
    cost_price DECIMAL(10, 2),
    stock_quantity INT NOT NULL DEFAULT 0,
    low_stock_threshold INT DEFAULT 5,
    weight DECIMAL(8, 2),
    barcode VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    variants JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    order_id UUID,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    images TEXT[],
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_review_per_user_order UNIQUE (user_id, product_id, order_id)
);

-- ============================================
-- 3. CART & WISHLIST
-- ============================================

CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    coupon_code VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_cart UNIQUE (user_id, tenant_id)
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE wishlist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_wishlist_item UNIQUE (user_id, product_id)
);

-- ============================================
-- 4. ORDERS
-- ============================================

CREATE TABLE parent_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) NOT NULL,
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    shipping_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    grand_total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    notes TEXT,
    coupon_code VARCHAR(50),
    coupon_discount DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_order_number_tenant UNIQUE (tenant_id, order_number)
);

CREATE TABLE sub_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_order_id UUID NOT NULL REFERENCES parent_orders(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    driver_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    delivery_status VARCHAR(50) NOT NULL DEFAULT 'Unassigned',
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
    commission_amount DECIMAL(10, 2) DEFAULT 0.00,
    net_amount DECIMAL(10, 2) NOT NULL,
    delivery_otp VARCHAR(6) NOT NULL,
    otp_expires_at TIMESTAMP WITH TIME ZONE,
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sub_order_id UUID NOT NULL REFERENCES sub_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    product_variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    product_title VARCHAR(255) NOT NULL,
    variant_title VARCHAR(255),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES parent_orders(id) ON DELETE CASCADE,
    sub_order_id UUID REFERENCES sub_orders(id) ON DELETE CASCADE,
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES users(id),
    reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. PAYMENTS & REFUNDS
-- ============================================

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES parent_orders(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EGP',
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    payment_method_details JSONB,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES parent_orders(id) ON DELETE CASCADE,
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    reason TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE vendor_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    commission_deducted DECIMAL(10, 2) NOT NULL,
    orders JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    payout_method VARCHAR(50),
    payout_details JSONB,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. DELIVERY
-- ============================================

CREATE TABLE delivery_shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'Offline',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    total_orders INT DEFAULT 0,
    total_delivered INT DEFAULT 0,
    total_failed INT DEFAULT 0,
    total_earnings DECIMAL(10, 2) DEFAULT 0.00,
    current_location JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cash_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shift_id UUID NOT NULL REFERENCES delivery_shifts(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    sub_order_id UUID REFERENCES sub_orders(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('collected', 'submitted', 'discrepancy', 'adjustment')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE delivery_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    coordinates JSONB NOT NULL,
    radius_km DECIMAL(5, 2),
    flat_fee DECIMAL(10, 2) DEFAULT 0.00,
    free_above DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 7. MARKETING
-- ============================================

CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_shipping', 'bogo')),
    value DECIMAL(10, 2) NOT NULL,
    minimum_order DECIMAL(10, 2) DEFAULT 0.00,
    maximum_discount DECIMAL(10, 2),
    usage_limit INT,
    usage_limit_per_user INT DEFAULT 1,
    current_usage INT DEFAULT 0,
    applicable_products UUID[],
    applicable_categories UUID[],
    starts_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_coupon_code_tenant UNIQUE (tenant_id, code)
);

CREATE TABLE coupon_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES parent_orders(id) ON DELETE CASCADE,
    discount_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    link_type VARCHAR(50) CHECK (link_type IN ('product', 'category', 'url', 'none')),
    link_value TEXT,
    position VARCHAR(100) DEFAULT 'home_top',
    display_order INT DEFAULT 0,
    starts_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE home_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('banner', 'category_grid', 'product_list', 'product_grid', 'flash_sale', 'brands', 'custom')),
    title VARCHAR(255),
    configuration JSONB NOT NULL DEFAULT '{}',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE flash_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(50) CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE flash_sale_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flash_sale_id UUID NOT NULL REFERENCES flash_sales(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    flash_price DECIMAL(10, 2) NOT NULL,
    stock_limit INT,
    sold_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 8. NOTIFICATIONS & SYSTEM
-- ============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    flag_name VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN DEFAULT FALSE,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_flag_per_tenant UNIQUE (tenant_id, flag_name)
);

-- ============================================
-- 9. PERFORMANCE INDEXES
-- ============================================

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_products_tenant ON products(tenant_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_vendor ON products(vendor_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_orders_tenant ON parent_orders(tenant_id);
CREATE INDEX idx_orders_customer ON parent_orders(customer_id);
CREATE INDEX idx_orders_status ON parent_orders(status);
CREATE INDEX idx_sub_orders_parent ON sub_orders(parent_order_id);
CREATE INDEX idx_sub_orders_driver ON sub_orders(driver_id);
CREATE INDEX idx_sub_orders_status ON sub_orders(delivery_status);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_otp_phone ON otp_codes(phone, purpose);
CREATE INDEX idx_delivery_shifts_driver ON delivery_shifts(driver_id);
CREATE INDEX idx_cash_ledger_shift ON cash_ledger(shift_id);
CREATE INDEX idx_products_search ON products USING GIN(search_vector);
```

</details>

## 📐 Frontend (Flutter) Architecture
The Flutter client applications are built using Feature-First Clean Architecture combined with the BLoC (Business Logic Component) state management pattern.

lib/
├── main.dart                   # Application entry point with flavor setup
├── core/                       # Shared platform components
│   ├── architecture/           # Base UseCases, Base BLoCs, Failure objects
│   ├── config/                 # Environment configs & Theme Engine
│   ├── network/                # Dio HTTP client, Interceptors, SSL Pinning
│   ├── services/               # Dynamic Feature Flags, Storage, Push Notifications
│   └── utils/                  # Input Validators, Formatters, Converters
├── features/                   # Self-contained domain modules
│   ├── auth/
│   ├── catalog/
│   ├── cart_checkout/
│   ├── delivery_tracking/
│   └── order_history/
│       ├── data/               # DTOs, DataSources, Repository Implementations
│       ├── domain/             # Entities, Value Objects, Repository Interfaces, UseCases
│       └── presentation/       # BLoCs, Screens, Widgets, Layout Builders
---

## 🔌 Backend Infrastructure & API Specification
### Core API Endpoints Overview
#### 🔐 Authentication & Identity (`/api/v1/auth`)
POST /login — Authenticate user and issue JWT Access Token + Refresh Token pair.

POST /register — Customer profile registration under current Tenant ID.

POST /refresh-token — Obtain a new JWT access token using dynamic refresh token logic.

#### 📦 Product Catalog (`/api/v1/catalog`)
GET /products — Fetch paginated product listing with dynamic backend filter params.

GET /products/:id — Detailed product view with variant stock matrix.

POST /products (Admin) — Create new product with variant combinations.

#### 🛒 Order Processing (`/api/v1/orders`)
POST /checkout — Validate cart item stock, execute promo codes, create parent_order and split sub_orders.

GET /my-orders — Customer fetch personal order history pipeline.

PATCH /sub-orders/:id/status (Admin/Driver) — Transition order state machine.

#### 🚚 Delivery Operations (`/api/v1/logistics`)
GET /driver/available-jobs — Fetch nearby unassigned orders based on geospatial metrics.

POST /sub-orders/:id/verify-otp — Verify 4-digit OTP code to transition order to Delivered and trigger payouts.

---

## 💳 Payment Gateway Abstraction

NOVA Commerce implements a **Provider-Agnostic Payment Adapter Pattern**. Payment gateways are treated as plugins — not hardcoded dependencies.

### Architecture

```
PaymentService (Core)
       │
  ┌────┼────────┬──────────┬──────────┐
  ▼    ▼        ▼          ▼          ▼
 COD  Stripe  Vodafone   InstaPay   PayPal
              Cash
```

### Supported Payment Methods

| Provider | Type | Regions | Features |
| :--- | :--- | :--- | :--- |
| **Cash on Delivery** | Offline | Global | Default fallback, no integration needed |
| **Stripe** | Card | Global | Credit/Debit cards, 3D Secure, Apple Pay, Google Pay |
| **Vodafone Cash** | Wallet | Egypt | Mobile wallet payments |
| **Orange Money** | Wallet | Egypt | Mobile wallet payments |
| **InstaPay** | Bank Transfer | Egypt | Instant bank transfers |
| **PayPal** | Global | Global | PayPal balance, cards, bank accounts |
| **Razorpay** | Card/UPI | India | Cards, UPI, Netbanking, Wallets |

### Per-Tenant Payment Configuration

```json
{
  "payment_gateways": [
    { "provider": "cod", "is_enabled": true },
    { "provider": "stripe", "is_enabled": true, "public_key": "pk_test_...", "secret_key": "sk_test_..." },
    { "provider": "vodafone_cash", "is_enabled": true, "merchant_code": "VFC_9872" },
    { "provider": "instapay", "is_enabled": false }
  ],
  "currency": "EGP",
  "tax_rate": 14.0,
  "allow_partial_payment": false
}
```

### Adding a New Payment Gateway

1. Implement `PaymentAdapter` interface in backend.
2. Add provider configuration to tenant settings.
3. Enable flag in admin dashboard.
4. No code changes required in Flutter apps.

---

## 🔐 Multi-Tenant Middleware

Every API request passes through a tenant isolation middleware that enforces data separation.

### How It Works

```
Request Arrives
       │
       ▼
┌──────────────────┐
│ Extract X-Tenant-ID│  ← From HTTP Header
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Validate Tenant   │  ← Check stores table, is_active
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Inject tenant_id  │  ← Into request context
│ into all queries  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Execute Query     │  ← WHERE tenant_id = ? (auto-injected)
└──────────────────┘
```

### Implementation

```typescript
// NestJS Middleware
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'];
    if (!tenantId) throw new BadRequestException('Missing tenant context');
    
    // Store in request-scoped context
    TenantContext.set(tenantId);
    next();
  }
}

// Query Auto-Scope (TypeORM Interceptor)
@Injectable()
export class TenantScopeInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const tenantId = TenantContext.get();
    // Automatically add tenant_id to all repository queries
    this.tenantScope.enable(tenantId);
    return next.handle();
  }
}
```

### Row-Level Security (PostgreSQL)

```sql
-- Enable RLS on all tenant-scoped tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY tenant_isolation ON products
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
```

### Security Guarantees

| Layer | Enforcement |
| :--- | :--- |
| **API Gateway** | X-Tenant-ID header required on all /api/v1/* routes |
| **Middleware** | Validates tenant exists and is active |
| **Database** | RLS policies prevent cross-tenant data access |
| **Flutter App** | Stores tenant_id, attaches to every API call |

---

## 📱 Authentication & Identity Flow

NOVA Commerce supports multiple authentication methods to maximize user accessibility.

### Supported Auth Methods

| Method | Use Case | Regions |
| :--- | :--- | :--- |
| **Email + Password** | Traditional registration | Global |
| **Phone OTP** | Primary method in MENA | Egypt, UAE, Saudi |
| **Google Sign-In** | Quick social login | Global |
| **Apple Sign-In** | iOS required, quick login | Global |
| **Guest Checkout** | Reduce cart abandonment | Global |

### Authentication Flows

#### Phone OTP Flow (Primary for Egypt)

```
User Enters Phone
       │
       ▼
┌──────────────────┐
│ POST /auth/otp   │
│ { phone }        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Generate 6-digit │
│ OTP code         │
│ Store in DB      │
│ (5 min expiry)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Send via SMS     │  ← Twilio / Vodafone Cash SMS API
│ Provider         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ User Enters OTP  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ POST /auth/      │
│ verify-otp       │
│ { phone, code }  │
└────────┬─────────┘
         │
     ┌───┴───┐
     ▼       ▼
  Valid   Invalid
     │       │
     ▼       ▼
  Issue    Return Error
  JWT      (max 5 attempts)
```

#### Guest Checkout Flow

```
Guest Browses Products
       │
       ▼
┌──────────────────┐
│ Add to Cart      │
│ Session ID only   │  ← No auth required
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Checkout         │
│ Enter:           │
│ - Name           │
│ - Phone          │
│ - Address        │
│ - Payment        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Auto-Create      │
│ Guest User       │
│ + Order          │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ SMS Confirmation │  ← "Track your order: #ORD-10284"
│ with Order #     │
└──────────────────┘
```

### JWT Token Architecture

```
Access Token (15 min)
├── Header: { "alg": "RS256", "typ": "JWT" }
├── Payload: {
│     "sub": "user_id",
│     "tenant_id": "tenant_id",
│     "role": "customer",
│     "iat": 1234567890,
│     "exp": 1234568790
│   }
└── Signature: RS256(private_key)

Refresh Token (30 days)
├── Stored in user_sessions table (hashed)
├── One refresh token per device
├── Rotated on each use
└── Revocable by admin
```

### Password Reset Flow

```
User Requests Reset
       │
       ▼
┌──────────────────┐
│ POST /auth/      │
│ forgot-password  │
│ { email }        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Generate reset   │
│ token (1 hour)   │
│ Send email       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ User clicks link │
│ Enters new pass  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ POST /auth/      │
│ reset-password   │
│ { token, pass }  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Update password  │
│ Invalidate all   │
│ sessions         │
└──────────────────┘
```

---

## 📸 Image Upload Pipeline

All images go through a processing pipeline before storage.

### Pipeline Architecture

```
Flutter App Uploads Image
       │
       ▼
┌──────────────────┐
│ Validate         │
│ - File type      │  ← jpg, png, webp only
│ - File size      │  ← Max 10MB
│ - Dimensions     │  ← Max 4000x4000
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Resize & Compress│
│ - Thumbnail      │  ← 200x200
│ - Medium         │  ← 600x600
│ - Large          │  ← 1200x1200
│ - Original       │  ← Keep but compress
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Convert to WebP  │  ← 30-50% smaller
│ (optional)       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Upload to S3/CDN │
│ - Bucket: nova-  │
│   commerce-images│
│ - Path: /{tenant}│
│   /{entity}/{id} │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Return URLs      │
│ - thumbnail_url  │
│ - medium_url     │
│ - large_url      │
│ - original_url   │
└──────────────────┘
```

### Upload Limits per Tenant

| Tier | Storage | Max File Size | Max Images/Product |
| :--- | :--- | :--- | :--- |
| Starter | 5 GB | 5 MB | 5 |
| Business | 25 GB | 10 MB | 10 |
| Enterprise | 100 GB | 15 MB | 20 |

### Image URL Structure

```
https://cdn.novacommerce.io/{tenant_id}/{entity}/{id}/{size}.{ext}

Example:
https://cdn.novacommerce.io/abc-123/products/prod-456/medium.webp
```

---

## 🛒 Cart Management System

### Cart Types

| Type | Auth Required | Persistence | Sync |
| :--- | :--- | :--- | :--- |
| **Guest Cart** | No | Session-based (localStorage) | N/A |
| **Registered Cart** | Yes | Database (carts table) | Cross-device |

### Cart Flow

```
Guest User                    Registered User
    │                              │
    ▼                              ▼
┌──────────┐                ┌──────────┐
│Session ID│                │ User ID  │
└────┬─────┘                └────┬─────┘
     │                           │
     ▼                           ▼
┌──────────┐                ┌──────────┐
│localStorage│              │Database  │
│cart_data  │                │carts     │
└────┬─────┘                └────┬─────┘
     │                           │
     └───────────┬───────────────┘
                 │
                 ▼
        ┌────────────────┐
        │ Add to Cart API│
        │ POST /cart     │
        │ { variant_id,  │
        │   quantity }   │
        └───────┬────────┘
                │
                ▼
        ┌────────────────┐
        │ Stock Check    │
        │ Real-time      │
        └───────┬────────┘
                │
            ┌───┴───┐
            ▼       ▼
        In Stock  Out of Stock
            │       │
            ▼       ▼
        Add Item  Show Error
        Update Qty
```

### Cart Merging (Guest → Registered)

```
Guest Logs In / Registers
       │
       ▼
┌──────────────────┐
│ Fetch Guest Cart │
│ (localStorage)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Fetch Registered │
│ Cart (database)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Merge Strategy:  │
│ - Same variant?  │
│   → Sum quantity │
│ - Different?     │
│   → Add both     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Save merged cart │
│ Clear localStorage│
└──────────────────┘
```

### Cart Expiry Rules

| Condition | Action |
| :--- | :--- |
| Guest cart, 7 days old | Auto-clear on next visit |
| Registered cart, 30 days | Send "Still interested?" email |
| Item out of stock | Mark item, show warning |
| Price changed | Update price, show notification |

---

## 🔍 Search & Filtering Engine

### Search Architecture

```
User Types Query
       │
       ▼
┌──────────────────┐
│ Flutter App      │
│ Debounce (300ms) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ GET /catalog/    │
│ search?q=shirt   │
│ &filters=...     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Backend          │
│ ┌──────────────┐ │
│ │ PostgreSQL   │ │  ← Primary: tsvector full-text search
│ │ Full-Text    │ │
│ │ Search       │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │ Meilisearch  │ │  ← Optional: Advanced search (Phase 2)
│ │ (Optional)   │ │
│ └──────────────┘ │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Results with:    │
│ - Products       │
│ - Categories     │
│ - Suggestions    │
│ - Facets         │
└──────────────────┘
```

### Search Features

| Feature | Implementation |
| :--- | :--- |
| **Full-Text Search** | PostgreSQL `tsvector` + `tsquery` |
| **Fuzzy Matching** | `similarity()` function with pg_trgm |
| **Autocomplete** | Debounced API calls, top 5 suggestions |
| **Search History** | Stored locally per user |
| **Popular Searches** | Cached from analytics |
| **Faceted Search** | Dynamic filters based on category |

### Filtering System

```
GET /api/v1/catalog/products?
  category=shoes&
  brand=nike&
  min_price=500&
  max_price=2000&
  color=red&
  size=xl&
  rating=4&
  sort=price_asc&
  page=1&
  limit=20
```

### Filter Types

| Filter | Type | Example |
| :--- | :--- | :--- |
| **Category** | Multi-select | `?category=shoes,boots` |
| **Brand** | Multi-select | `?brand=nike,adidas` |
| **Price Range** | Min/Max | `?min_price=100&max_price=500` |
| **Color** | Multi-select | `?color=red,blue` |
| **Size** | Multi-select | `?size=xl,l` |
| **Rating** | Min rating | `?rating=4` |
| **Availability** | Boolean | `?in_stock=true` |
| **Sort** | Enum | `?sort=price_asc,popularity,newest` |

---

## 🔌 WebSocket & Real-time Architecture

### Use Cases

| Feature | Channel | Direction |
| :--- | :--- | :--- |
| **Order Status Updates** | `order:{order_id}` | Server → Client |
| **Delivery Location** | `delivery:{driver_id}` | Driver → Server → Customer |
| **Stock Updates** | `product:{variant_id}` | Server → Client |
| **New Order Alert** | `vendor:{vendor_id}` | Server → Vendor Admin |
| **Driver Assignment** | `driver:{driver_id}` | Server → Driver |
| **Chat** | `conversation:{id}` | Bidirectional |

### Architecture

```
Flutter Apps (3)
       │
       ├── Customer App ─────┐
       ├── Delivery App ─────┤── Socket.io Client
       └── Admin App ────────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │ Socket.io Server │
                    │ (NestJS Gateway) │
                    └────────┬─────────┘
                             │
                    ┌────────┴─────────┐
                    │ Redis Adapter    │  ← For horizontal scaling
                    │ (Pub/Sub)        │
                    └────────┬─────────┘
                             │
                    ┌────────┴─────────┐
                    │ Room Management  │
                    │ - tenant:{id}    │
                    │ - order:{id}     │
                    │ - driver:{id}    │
                    │ - vendor:{id}    │
                    └──────────────────┘
```

### Connection Flow

```
App Starts
    │
    ▼
┌──────────────┐
│ Fetch JWT    │
│ from Storage │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Connect to   │
│ Socket.io    │
│ with JWT     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Authenticate │
│ Join rooms:  │
│ - tenant:X   │
│ - user:X     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Listen for   │
│ events       │
└──────────────┘
```

### Reconnection Strategy

```
Connection Lost
       │
       ▼
┌──────────────┐
│ Auto-retry   │
│ Attempt 1: 1s│
│ Attempt 2: 2s│
│ Attempt 3: 4s│
│ Max: 30s     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ On reconnect │
│ Sync missed  │
│ events       │
└──────────────┘
```

---

## 🎟️ Coupon Engine

### Coupon Types

| Type | Discount | Example |
| :--- | :--- | :--- |
| **Percentage** | X% off order | 10% off (max 50 EGP) |
| **Fixed Amount** | Fixed EGP off | 100 EGP off |
| **Free Shipping** | Waive delivery fee | Free delivery |
| **BOGO** | Buy X Get Y | Buy 2 Get 1 Free |

### Validation Rules

```typescript
interface CouponValidation {
  // Basic checks
  is_active: boolean;
  not_expired: boolean;
  within_usage_limit: boolean;
  per_user_limit_not_reached: boolean;
  
  // Order checks
  minimum_order_met: boolean;
  applicable_to_products: boolean;
  applicable_to_categories: boolean;
  
  // Stacking rules
  can_stack_with_other_coupons: boolean;
  not_already_applied: boolean;
}
```

### Coupon Application Flow

```
User Applies Coupon "SAVE20"
       │
       ▼
┌──────────────────┐
│ Validate Coupon  │
│ - Active? ✓      │
│ - Not expired? ✓ │
│ - Usage limit? ✓ │
│ - Min order? ✓   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Calculate Discount│
│                  │
│ Subtotal: 1000   │
│ Coupon: 10%      │
│ Discount: -100   │
│ New Total: 900   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Apply to Order   │
│ Store in:        │
│ - parent_orders  │
│   .coupon_code   │
│   .coupon_discount│
│ - coupon_usage   │
└──────────────────┘
```

### Coupon Stacking Rules

| Scenario | Allowed? |
| :--- | :--- |
| Two percentage coupons | No |
| Percentage + free shipping | Yes |
| Coupon + loyalty points | Yes (configurable per tenant) |
| Coupon on sale items | Configurable per tenant |

---

## 🚚 Delivery Assignment Algorithm

### Assignment Strategies

| Strategy | Description | Best For |
| :--- | :--- | :--- |
| **Nearest Driver** | Assign to closest available driver | Urban areas |
| **Least Busy** | Assign to driver with fewest active orders | Balanced load |
| **Rating-Based** | Prioritize higher-rated drivers | Quality focus |
| **Round Robin** | Rotate evenly among available drivers | Fair distribution |
| **Hybrid** | Weighted: 40% distance + 30% rating + 30% load | Default |

### Assignment Flow

```
New Sub-Order Created
       │
       ▼
┌──────────────────┐
│ Delivery Status: │
│ "Unassigned"     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Assignment Engine│
│ Runs every 30s   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Find Eligible    │
│ Drivers:         │
│ - Status: Online │
│ - Within zone    │
│ - Not on delivery│
│ - Shift active   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Score & Rank     │
│ Each driver      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Assign to Top    │
│ Driver           │
│ Send Push Notif  │
└────────┬─────────┘
         │
     ┌───┴───┐
     ▼       ▼
  Accept  Timeout (2 min)
     │       │
     ▼       ▼
  Start   Reassign to
  Delivery Next Driver
```

### Geospatial Query (PostGIS)

```sql
-- Find drivers within 10km of store location
SELECT d.id, d.full_name,
  ST_Distance(
    d.current_location::geography,
    store_location::geography
  ) / 1000 AS distance_km
FROM users d
JOIN delivery_shifts ds ON ds.driver_id = d.id
WHERE d.role = 'driver'
  AND d.tenant_id = $1
  AND ds.status = 'Online'
  AND ST_DWithin(
    d.current_location::geography,
    store_location::geography,
    10000  -- 10km in meters
  )
ORDER BY distance_km ASC
LIMIT 5;
```

### Assignment Timeout Rules

| Attempt | Timeout | Action |
| :--- | :--- | :--- |
| 1st Driver | 2 minutes | Auto-reject if no response |
| 2nd Driver | 2 minutes | Expand search radius by 5km |
| 3rd Driver | 2 minutes | Notify admin for manual assignment |
| All Failed | 5 minutes | Customer notified, order cancelled |

---

## 📴 Offline Support Strategy

### Offline Capabilities

| Feature | Offline Behavior | Sync Strategy |
| :--- | :--- | :--- |
| **Product Browsing** | Show cached products | Refresh on reconnect |
| **Cart** | Full offline support | Sync on reconnect |
| **Search** | Show cached results | Refresh on reconnect |
| **Order History** | Show cached orders | Refresh on reconnect |
| **Product Details** | Show cached details | Refresh on reconnect |
| **Place Order** | Queue for later | Auto-submit when online |
| **Add Review** | Queue for later | Auto-submit when online |
| **Delivery Status** | Show last known | WebSocket reconnect |

### Offline Queue Architecture

```
User Action (e.g., Place Order)
       │
       ▼
┌──────────────────┐
│ Check Network    │
│ Status           │
└────────┬─────────┘
         │
     ┌───┴───┐
     ▼       ▼
  Online  Offline
     │       │
     ▼       ▼
  Execute  Save to
  Immediately Local Queue
               │
               ▼
        ┌──────────────┐
        │ Queue Entry: │
        │ - action     │
        │ - payload    │
        │ - timestamp  │
        │ - retry_count│
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │ On Reconnect:│
        │ Process queue│
        │ in order     │
        └──────────────┘
```

### Cache Strategy

| Data | Cache Duration | Storage |
| :--- | :--- | :--- |
| Products | 1 hour | Hive / Isar |
| Categories | 24 hours | Hive / Isar |
| User Profile | 24 hours | Hive / Isar |
| Cart | Forever | Hive / Isar + API |
| Orders | 1 hour | Hive / Isar + API |
| Search Results | 30 minutes | Hive / Isar |

---

## ⚡ Rate Limiting & API Versioning

### Rate Limiting Rules

| Tier | Requests/min | Burst |
| :--- | :--- | :--- |
| **Anonymous** | 30 | 50 |
| **Customer** | 100 | 200 |
| **Admin** | 300 | 500 |
| **Driver** | 200 | 300 |
| **Internal** | 1000 | 2000 |

### Rate Limit Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 30 seconds.",
    "retry_after": 30
  }
}
```

### API Versioning Strategy

| Strategy | Example |
| :--- | :--- |
| **URL Path** | `/api/v1/products`, `/api/v2/products` |
| **Header** | `Accept-Version: v1` |
| **Deprecation** | `Sunset: Sat, 01 Jan 2027` header |

### Version Lifecycle

```
v1 (Current)
├── Stable
├── Full support
└── Documentation: Current

v2 (Planned)
├── Breaking changes
├── Migration guide provided
└── 6-month overlap with v1

v0.x (Deprecated)
├── Sunset header added
├── Logs warn of deprecation
└── Removed after v2 stable
```

---

## 💾 Backup & Disaster Recovery

### Backup Schedule

| Type | Frequency | Retention | Storage |
| :--- | :--- | :--- | :--- |
| **Full Database** | Daily 2 AM | 30 days | S3 + Local |
| **Incremental** | Every 6 hours | 7 days | S3 |
| **WAL Archival** | Continuous | 7 days | S3 |
| **Media Assets** | Real-time replication | Indefinite | S3 Multi-Region |
| **Config Files** | On change | Git history | GitHub |

### Recovery Objectives

| Metric | Target |
| :--- | :--- |
| **RPO (Recovery Point)** | 6 hours (max data loss) |
| **RTO (Recovery Time)** | 2 hours (max downtime) |
| **Availability Target** | 99.9% uptime |

### Disaster Recovery Procedures

```
Incident Detected
       │
       ▼
┌──────────────────┐
│ Assess Severity  │
│ P1: Full outage  │
│ P2: Major feature│
│ P3: Minor issue  │
└────────┬─────────┘
         │
     ┌───┴───┐
     ▼       ▼
   P1/P2    P3
     │       │
     ▼       ▼
┌─────────┐ ┌─────────┐
│Activate │ │Fix in   │
│DR Plan  │ │next     │
│         │ │sprint   │
└────┬────┘ └─────────┘
     │
     ▼
┌──────────────────┐
│ If DB issue:     │
│ 1. Failover to   │
│    read replica   │
│ 2. Restore from   │
│    latest backup  │
│ 3. Replay WAL     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ If App issue:    │
│ 1. Rollback to   │
│    last known    │
│    good deploy   │
│ 2. Scale up if   │
│    traffic surge │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Verify & Notify  │
│ - Health checks  │
│ - Customer email │
│ - Status page    │
└──────────────────┘
```

### Health Checks

| Check | Endpoint | Frequency |
| :--- | :--- | :--- |
| **API** | `GET /health` | Every 30s |
| **Database** | `SELECT 1` | Every 10s |
| **Redis** | `PING` | Every 10s |
| **S3** | HeadBucket | Every 60s |
| **Queue** | Queue depth | Every 30s |

---

## 🚚 Delivery Configuration

Each tenant can configure delivery settings independently.

### Delivery Types

| Type | Description | Use Case |
| :--- | :--- | :--- |
| **Platform Drivers** | NOVA manages the driver fleet | Marketplace, large stores |
| **Store Drivers** | Store has its own delivery team | Single-brand retail |
| **External Courier** | Third-party courier API integration | Small businesses |
| **Hybrid** | Mix of platform and store drivers | Growing businesses |

### Delivery Pricing Models

| Model | Description | Example |
| :--- | :--- | :--- |
| **Flat Rate** | Fixed fee per order | 50 EGP regardless of distance |
| **Distance-Based** | Fee calculated via Google Distance Matrix | 10 EGP/km |
| **Weight-Based** | Fee based on order weight | 5 EGP/kg |
| **Free Over Threshold** | Free delivery above minimum order | Free over 500 EGP |
| **Zone-Based** | Different rates per delivery zone | Cairo: 30, Giza: 40, Alex: 50 |

### Delivery Zones Configuration

```json
{
  "delivery_zones": [
    {
      "name": "Cairo",
      "coordinates": { "lat": 30.0444, "lng": 31.2357 },
      "radius_km": 25,
      "flat_fee": 30,
      "free_above": 400
    },
    {
      "name": "Giza",
      "coordinates": { "lat": 30.0131, "lng": 31.2089 },
      "radius_km": 20,
      "flat_fee": 35,
      "free_above": 500
    },
    {
      "name": "Alexandria",
      "coordinates": { "lat": 31.2001, "lng": 29.9187 },
      "radius_km": 30,
      "flat_fee": 40,
      "free_above": 600
    }
  ],
  "delivery_settings": {
    "fulfillment_mode": "platform_drivers",
    "fee_calculation": "zone_based",
    "require_otp_validation": true,
    "allow_scheduled_delivery": true,
    "allow_same_day_delivery": true,
    "max_delivery_distance_km": 50,
    "estimated_delivery_minutes": 60
  }
}
```

---

## 🧙 Client Onboarding — Setup Wizard

NOVA Commerce includes a ** guided onboarding flow** for new store tenants. This eliminates manual setup and allows instant store creation.

### Onboarding Steps

```
Step 1: Business Information
├── Business Name
├── Business Type (Fashion / Electronics / Grocery / etc.)
├── Contact Email
├── Contact Phone
├── Country & City
└── Timezone

Step 2: Branding & Identity
├── Upload Logo
├── Upload Splash Screen
├── Select Theme Preset (or Custom)
├── Primary Color
├── Secondary Color
├── Font Selection
└── App Icon

Step 3: Store Configuration
├── Currency
├── Language (AR / EN / FR / etc.)
├── Tax Rate
├── Timezone
└── Support Contact Info

Step 4: Categories Setup
├── Select from Predefined Templates
├── Or Create Custom Categories
├── Upload Category Images
└── Set Display Order

Step 5: Payment Setup
├── Enable/disable Payment Methods
├── Configure Stripe Keys
├── Configure Vodafone Cash
├── Configure COD
└── Set Currency & Tax

Step 6: Delivery Setup
├── Delivery Type (Platform / Store / External)
├── Delivery Zones
├── Pricing Model
├── Free Shipping Threshold
└── OTP Validation Toggle

Step 7: Admin Account
├── Admin Name
├── Admin Email
├── Admin Password
└── Role Assignment

Step 8: Store Content
├── Upload Home Banners
├── Set Home Sections Order
├── Configure Featured Products
└── Add Store Description

Step 9: Initial Products
├── Add Products Manually
├── Or Import via CSV
├── Set Pricing & Stock
└── Upload Images

Step 10: Review & Launch
├── Preview Store
├── Test Checkout Flow
├── Confirm Settings
└── 🚀 Publish Store
```

### Onboarding Benefits

- **Zero-Code Setup** — No developer needed for basic store creation.
- **Instant Deployment** — Store goes live in minutes.
- **Guided UX** — Step-by-step wizard with progress indicator.
- **Template Presets** — Pre-built category templates for common industries.
- **Draft Mode** — Store saved as draft until explicitly published.

## 💼 Commercial Models & Packages

NOVA Commerce is structured as a ready-to-sell solution offering freelance developers and software agencies flexible client packaging options.

### Pricing Tiers

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    NOVA COMMERCE COMMERCIAL MODEL                       │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
    ┌───────────────────────────┼───────────────────────────┐
    ▼                           ▼                           ▼
┌───────────┐            ┌───────────┐            ┌───────────┐
│  STARTER  │            │ BUSINESS  │            │ENTERPRISE │
├───────────┤            ├───────────┤            ├───────────┤
│  $999     │            │  $2,499   │            │  $5,999   │
│  one-time │            │  one-time │            │  one-time │
├───────────┤            ├───────────┤            ├───────────┤
│Customer App│           │Customer App│           │Customer App│
│Admin Web   │           │Admin Web   │           │Admin Web   │
│Single Store│           │Delivery App│           │Delivery App│
│Basic Stats │           │Live Routing│           │Multi-Vendor│
│COD Payment │           │Advanced BI │           │Custom SaaS │
│1 Theme     │           │3 Themes    │           │Unlimited   │
│Email Support│          │Priority    │           │Dedicated   │
│            │           │10 Coupons  │           │Unlimited   │
│            │           │Reviews     │           │All Modules │
│            │           │Returns     │           │White-Label │
└───────────┘            └───────────┘            └───────────┘
```

### Detailed Feature Comparison

| Feature | Starter | Business | Enterprise |
| :--- | :--- | :--- | :--- |
| **Customer App** | ✅ | ✅ | ✅ |
| **Admin Web** | ✅ | ✅ | ✅ |
| **Delivery App** | ❌ | ✅ | ✅ |
| **Multi-Vendor** | ❌ | ❌ | ✅ |
| **Products** | Unlimited | Unlimited | Unlimited |
| **Categories** | 20 | 100 | Unlimited |
| **Storage** | 5 GB | 25 GB | 100 GB |
| **Custom Themes** | 1 | 3 | Unlimited |
| **Payment Gateways** | COD + 1 | COD + 3 | All |
| **Coupons** | ❌ | ✅ | ✅ |
| **Reviews** | ❌ | ✅ | ✅ |
| **Returns/Refunds** | ❌ | ✅ | ✅ |
| **Flash Sales** | ❌ | ✅ | ✅ |
| **Loyalty Program** | ❌ | ❌ | ✅ |
| **Wallet System** | ❌ | ❌ | ✅ |
| **Subscriptions** | ❌ | ❌ | ✅ |
| **Advanced Analytics** | ❌ | ❌ | ✅ |
| **Dynamic Home Builder** | ❌ | ✅ | ✅ |
| **Push Campaigns** | ❌ | ❌ | ✅ |
| **Setup Wizard** | ✅ | ✅ | ✅ |
| **Support** | Email | Priority Email | Dedicated Manager |
| **Updates** | 1 Year | 2 Years | Lifetime |
| **Source Code** | ❌ | ❌ | ✅ |

### Revenue Model Options

| Model | Description | Best For |
| :--- | :--- | :--- |
| **One-Time License** | Client pays once, gets deployed instance | Freelance clients |
| **Setup + Monthly** | Initial setup + monthly hosting/maintenance | Long-term clients |
| **SaaS Subscription** | Monthly fee, hosted by you | Passive income |
| **White-Label + Custom** | Base product + custom features at extra cost | Enterprise clients |

### Add-On Modules (À La Carte)

| Module | Price |
| :--- | :--- |
| Multi-Vendor | +$500 |
| Loyalty Program | +$300 |
| Wallet System | +$400 |
| Subscriptions | +$350 |
| Advanced Analytics | +$250 |
| Push Campaigns | +$200 |
| Custom Theme | +$150 |
| Priority Support (Monthly) | +$100/mo |

---

## 🎯 Demo & Portfolio Strategy

NOVA Commerce is designed to be showcased as a **live, functional product** — not just screenshots.

### Demo Store: NOVA Fashion

A fully populated demo store showcasing all capabilities:

```
NOVA Fashion Demo
├── 150+ Products (Clothing, Shoes, Accessories)
├── 15 Categories with subcategories
├── Active Flash Sales with countdown
├── 20+ Coupons (various types)
├── 50+ Customer Reviews
├── 10 Delivery Agents with shift history
├── 200+ Orders in various states
├── Real-time Analytics Dashboard
└── Home Page configured with Dynamic Builder
```

### Live Demo URLs

| App | URL | Description |
| :--- | :--- | :--- |
| **Customer App** | `demo.novacommerce.io` | Full shopping experience |
| **Admin Dashboard** | `admin.novacommerce.io` | Complete admin panel |
| **Delivery App** | `delivery.novacommerce.io` | Driver interface |

### Case Study Format

When presenting to potential clients:

```
NOVA Commerce — Case Study
──────────────────────────

Challenge
Businesses need a complete commerce system without building
everything from scratch. Existing solutions are either too
generic (Shopify) or too expensive to custom-build.

Solution
White-label multi-tenant commerce platform with 3 apps:
Customer, Delivery, and Admin — fully customizable.

Technology
├── Flutter (Cross-Platform Mobile + Web)
├── Node.js / NestJS (Backend API)
├── PostgreSQL (Database)
├── Firebase (Push Notifications, Auth)
├── AWS S3 (Image Storage)
└── WebSockets (Real-time Updates)

Key Capabilities
├── Multi-Tenant Architecture
├── Multi-Vendor Marketplace (Optional)
├── 3 Independent Order State Machines
├── Real-time Delivery Tracking
├── OTP Verification Engine
├── COD Cash Ledger
├── Dynamic Home Page Builder
├── Feature Flags Engine
├── Server-Driven UI
└── White-Label Theming

Results
├── Time to Market: 3 months (vs 12+ custom)
├── Cost Reduction: 70% vs building from scratch
├── Scalability: 10+ stores on same codebase
└── Flexibility: Any industry, any branding
```

### Portfolio Presentation Strategy

1. **Live Demo** — Let client interact with working apps
2. **Case Study** — Technical deep-dive with architecture diagrams
3. **Video Walkthrough** — 3-minute screen recording of all 3 apps
4. **GitHub Repository** — Clean code with documentation (private repo)
5. **Before/After** — Show how same system serves different industries
---

## 🛠 Installation & Local Setup Guide
### Prerequisites
Flutter SDK: Version 3.22.0 or higher.

Dart SDK: Version 3.4.0 or higher.

Node.js: Version 20.x LTS (If using Node/NestJS backend).

Database: PostgreSQL 16.x installed locally or Docker containerized.

### 1. Repository Clone
```bash
git clone [https://github.com/your-username/nova-commerce.git](https://github.com/your-username/nova-commerce.git)
cd nova-commerce
```

### 2. Backend Engine Initialization
```bash
cd backend
npm install
cp .env.example .env
# Configure your PostgreSQL connection strings in .env
npm run migration:run
npm run start:dev
```

### 3. Flutter Client App Launch
```bash
cd ../frontend/customer_app
flutter pub get
flutter run --flavor dev -t lib/main.dart
```
---

## 🚢 Deployment & CI/CD Pipelines
The platform incorporates automated GitHub Actions workflows for continuous delivery:

Mobile Builds: Automated building of iOS .ipa and Android .aab (App Bundle) binaries attached to release tags.

Web Deployments: Admin Web App automatically builds and deploys to Vercel / Netlify / AWS S3 buckets.

Dockerized Backend: Automated Docker image generation pushed to DockerHub / AWS ECR, triggering auto-deployments to VPS or Kubernetes clusters.

```yaml
# Sample Deployment snippet
name: Deploy Admin Web Dashboard
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.22.0'
      - run: flutter pub get
      - run: flutter build web --release
      # Deployment step execution...
---

## 🛣 Roadmap & Development Phases

> **Detailed phase files are in the `phases/` directory.**

```
Phase 0: Foundation              → phases/PHASE_0.md
Phase 1: Core Product            → phases/PHASE_1.md
Phase 2: Delivery & Logistics    → phases/PHASE_2.md
Phase 3: Production Features     → phases/PHASE_3.md
Phase 4: Admin Dashboard         → phases/PHASE_4.md
Phase 5: Advanced Features       → phases/PHASE_5.md
Phase 6: White-Label Platform    → phases/PHASE_6.md
Phase 7: Production Hardening    → phases/PHASE_7.md
Phase 8: Demo & Launch           → phases/PHASE_8.md
```

### Phase Overview

```
Phase 0: Foundation (Weeks 1-3)
├── Database Schema (30+ tables)
├── Multi-Tenant Middleware
├── Authentication System
├── Image Upload Pipeline
└── Flutter Project Setup
         │
         ▼
Phase 1: Core Product (Weeks 4-7)
├── Customer App MVP
├── Products + Categories
├── Cart + Checkout
├── Orders + Tracking
└── Basic Notifications
         │
         ▼
Phase 2: Delivery & Logistics (Weeks 8-10)
├── Delivery App
├── Driver Shift Management
├── OTP Verification
├── COD Cash Ledger
├── Real-time Tracking
└── Enhanced Live Driver Tracking (NEW)
         │
         ▼
Phase 3: Production Features (Weeks 11-13)
├── Reviews & Ratings
├── Coupons Engine
├── Advanced Search
├── Push Notifications
├── Wishlist
├── Scheduled Orders (NEW)
└── Reorder System (NEW)
         │
         ▼
Phase 4: Admin Dashboard (Weeks 14-16)
├── Full Admin App
├── Product Management
├── Order Management (with Print Orders)
├── Marketing Module
├── Finance Module
└── Store Working Hours (NEW)
         │
         ▼
Phase 5: Advanced Features (Weeks 17-20)
├── Multi-Vendor
├── Loyalty Program
├── Wallet System
├── Returns & Refunds
├── Subscriptions
├── Chat & Calls System (NEW)
└── Multi-Activity Product System (NEW)
         │
         ▼
Phase 6: White-Label Platform (Weeks 21-23)
├── Theme System
├── Feature Flags
├── Client Onboarding
├── App Flavors
├── Super Admin
├── Master Dashboard — Platform Admin (NEW)
├── Full Arabic & RTL Support (NEW)
└── Dark & Light Mode (NEW)
         │
         ▼
Phase 7: Production Hardening (Weeks 24-26)
├── Security Hardening
├── Monitoring & Observability
├── Performance Optimization
├── Backup & Recovery
└── Load Testing
         │
         ▼
Phase 8: Demo & Launch (Weeks 27-28)
├── Demo Store Setup
├── Case Study
├── Video Walkthrough
├── Portfolio Preparation
└── Client Presentation Kit
```
---

## 📄 License & Commercial Support
NOVA Commerce is a proprietary product architecture template.

Portfolio & Demonstration Use: Permitted for individual portfolio demonstration, client pitch presentation, and technical competence evaluation.

Commercial Distribution: Re-selling or deploying instance clones under client branding requires a commercial license authorization.

Designed & Maintained with ❤️ by Salah Fathy — Full-Stack Mobile Developer.

---

## 🔒 Security Considerations

NOVA Commerce implements defense-in-depth security across all layers.

### Authentication & Authorization

| Layer | Implementation |
| :--- | :--- |
| **JWT Tokens** | Short-lived access tokens (15 min) + rotating refresh tokens |
| **Password Hashing** | bcrypt with salt rounds (12) |
| **Role-Based Access** | Granular RBAC per module per role |
| **Tenant Isolation** | Every query scoped to `tenant_id` via middleware |
| **Session Management** | Device tracking, remote logout, concurrent session limits |

### API Security

| Measure | Description |
| :--- | :--- |
| **Rate Limiting** | 100 requests/min per user, 1000/min per tenant |
| **Input Validation** | Server-side validation on all endpoints |
| **SQL Injection** | Parameterized queries, ORM-based data access |
| **CORS Policy** | Strict origin whitelist per tenant domain |
| **Request Signing** | HMAC signature for webhook callbacks |
| **API Versioning** | `/api/v1/` prefix for backward compatibility |

### Data Protection

| Measure | Description |
| :--- | :--- |
| **Encryption at Rest** | AES-256 for sensitive data (payment tokens, PII) |
| **Encryption in Transit** | TLS 1.3 for all API communication |
| **SSL Pinning** | Certificate pinning in Flutter apps |
| **PII Masking** | Phone numbers, emails masked in logs |
| **GDPR Compliance** | Data export, deletion, consent management |

### Payment Security

| Measure | Description |
| :--- | :--- |
| **PCI DSS** | Card data never touches our servers (tokenized via Stripe) |
| **Tokenization** | Payment tokens replace raw card numbers |
| **3D Secure** | Mandatory for card payments |
| **Fraud Detection** | Velocity checks, amount limits, geo-validation |

---

## ⚠️ Error Handling Strategy

### Backend Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "STOCK_INSUFFICIENT",
    "message": "Product variant 'SKU-123' has insufficient stock",
    "details": {
      "variant_id": "abc-123",
      "requested": 5,
      "available": 2
    },
    "timestamp": "2026-08-28T10:30:00Z",
    "request_id": "req_7f8g9h0i"
  }
}
```

### Error Categories

| Category | Examples | Handling |
| :--- | :--- | :--- |
| **Client Errors (4xx)** | Validation, not found, unauthorized | Show user-friendly message |
| **Server Errors (5xx)** | Database failure, service timeout | Retry with exponential backoff |
| **Network Errors** | No connection, timeout | Offline queue, show cached data |
| **Business Errors** | Out of stock, coupon expired | Specific business message |

### Flutter Error Handling

| Layer | Strategy |
| :--- | :--- |
| **Network** | Dio interceptor catches all HTTP errors, maps to `Failure` objects |
| **BLoC** | `ErrorState` emitted with failure message and retry action |
| **UI** | SnackBar / Dialog with contextual error message + retry button |
| **Offline** | Queue write operations, sync when online |
| **Global** | `FlutterError.onError` + zone error handler for uncaught exceptions |

### Retry Policy

```
Attempt 1: Immediate
Attempt 2: Wait 1s
Attempt 3: Wait 2s
Attempt 4: Wait 4s
Attempt 5: Show error, manual retry
```

---

## 📊 Monitoring & Observability

### Logging Stack

| Tool | Purpose |
| :--- | :--- |
| **Winston / Pino** | Structured JSON logging on backend |
| **Sentry** | Error tracking and crash reporting (Flutter + Backend) |
| **CloudWatch / Datadog** | Infrastructure and application metrics |
| **ELK Stack** | Centralized log aggregation and search |

### Metrics Tracked

| Category | Metrics |
| :--- | :--- |
| **API Performance** | Request latency (p50, p95, p99), error rate, throughput |
| **Database** | Query duration, connection pool usage, slow queries |
| **Business** | Orders/min, revenue/hour, conversion rate, cart abandonment |
| **Mobile** | App crash rate, ANR rate, screen load time, API call duration |
| **Delivery** | Driver availability, avg delivery time, failed deliveries |

### Alerting Rules

| Alert | Condition | Severity |
| :--- | :--- | :--- |
| **High Error Rate** | > 5% error rate for 5 min | Critical |
| **Slow API** | p95 latency > 2s for 10 min | Warning |
| **Database Down** | Connection refused | Critical |
| **Low Stock** | Variant stock < threshold | Info |
| **Driver Idle** | No available drivers for 15 min | Warning |

### Health Check Endpoint

```
GET /health
{
  "status": "healthy",
  "version": "1.2.3",
  "uptime": "14d 6h 32m",
  "database": "connected",
  "cache": "connected",
  "storage": "connected",
  "timestamp": "2026-08-28T10:30:00Z"
}
```
```