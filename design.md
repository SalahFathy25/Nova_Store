# NOVA Commerce — Locked Design System

> **Genre:** Modern-Minimal (e-commerce fits Stripe/Linear school)
> **Created:** Phase 0 Foundation
> **Lock Status:** 🔒 LOCKED — Do not modify without running Hallmark audit

---

## Brand Identity

| Property | Value |
| :--- | :--- |
| **Primary** | `#1A1A1A` (dark) |
| **Secondary** | `#D4AF37` (gold) |
| **Accent** | `#2E7D32` (success green) |
| **Error** | `#D32F2F` (error red) |
| **Warning** | `#F57C00` (warning orange) |
| **Font** | Cairo (Arabic-friendly) |
| **Currency** | EGP (Egyptian Pound) |
| **Locale** | ar (Arabic RTL support) |

---

## Theme Tokens (OKLCH)

### Colors

```dart
// Primary
static const Color primary = Color(0xFF1A1A1A);      // Dark
static const Color primaryLight = Color(0xFF2D2D2D);  // Lighter dark
static const Color primaryDark = Color(0xFF0D0D0D);   // Darker

// Secondary
static const Color secondary = Color(0xFFD4AF37);      // Gold
static const Color secondaryLight = Color(0xFFE8C84A); // Light gold
static const Color secondaryDark = Color(0xFFB8942E);  // Dark gold

// Neutrals
static const Color background = Color(0xFFFAFAFA);     // Off-white
static const Color surface = Color(0xFFFFFFFF);         // White
static const Color surfaceVariant = Color(0xFFF5F5F5); // Light gray
static const Color outline = Color(0xFFE0E0E0);        // Border
static const Color outlineVariant = Color(0xFFBDBDBD); // Light border

// Text
static const Color textPrimary = Color(0xFF1A1A1A);    // Primary text
static const Color textSecondary = Color(0xFF666666);  // Secondary text
static const Color textTertiary = Color(0xFF999999);   // Tertiary text
static const Color textInverse = Color(0xFFFFFFFF);    // On primary

// Status
static const Color success = Color(0xFF2E7D32);
static const Color error = Color(0xFFD32F2F);
static const Color warning = Color(0xFFF57C00);
static const Color info = Color(0xFF1976D2);
```

### Typography

```dart
// Font Family
static const String fontFamily = 'Cairo';

// Headings
static const TextStyle h1 = TextStyle(
  fontFamily: fontFamily,
  fontSize: 32,
  fontWeight: FontWeight.bold,
  color: textPrimary,
  height: 1.2,
);

static const TextStyle h2 = TextStyle(
  fontFamily: fontFamily,
  fontSize: 24,
  fontWeight: FontWeight.bold,
  color: textPrimary,
  height: 1.3,
);

static const TextStyle h3 = TextStyle(
  fontFamily: fontFamily,
  fontSize: 20,
  fontWeight: FontWeight.w600,
  color: textPrimary,
  height: 1.3,
);

static const TextStyle h4 = TextStyle(
  fontFamily: fontFamily,
  fontSize: 16,
  fontWeight: FontWeight.w600,
  color: textPrimary,
  height: 1.4,
);

// Body
static const TextStyle bodyLarge = TextStyle(
  fontFamily: fontFamily,
  fontSize: 16,
  fontWeight: FontWeight.normal,
  color: textPrimary,
  height: 1.5,
);

static const TextStyle bodyMedium = TextStyle(
  fontFamily: fontFamily,
  fontSize: 14,
  fontWeight: FontWeight.normal,
  color: textPrimary,
  height: 1.5,
);

static const TextStyle bodySmall = TextStyle(
  fontFamily: fontFamily,
  fontSize: 12,
  fontWeight: FontWeight.normal,
  color: textSecondary,
  height: 1.5,
);

// Labels
static const TextStyle labelLarge = TextStyle(
  fontFamily: fontFamily,
  fontSize: 14,
  fontWeight: FontWeight.w600,
  color: textPrimary,
  height: 1.4,
);

static const TextStyle labelMedium = TextStyle(
  fontFamily: fontFamily,
  fontSize: 12,
  fontWeight: FontWeight.w600,
  color: textPrimary,
  height: 1.4,
);

static const TextStyle labelSmall = TextStyle(
  fontFamily: fontFamily,
  fontSize: 10,
  fontWeight: FontWeight.w600,
  color: textSecondary,
  height: 1.4,
);
```

### Spacing

```dart
// Spacing Scale (8px base)
static const double spacing0 = 0;
static const double spacing1 = 4;   // 0.25rem
static const double spacing2 = 8;   // 0.5rem
static const double spacing3 = 12;  // 0.75rem
static const double spacing4 = 16;  // 1rem
static const double spacing5 = 20;  // 1.25rem
static const double spacing6 = 24;  // 1.5rem
static const double spacing8 = 32;  // 2rem
static const double spacing10 = 40; // 2.5rem
static const double spacing12 = 48; // 3rem
static const double spacing16 = 64; // 4rem

// Border Radius
static const double radiusSmall = 4;
static const double radiusMedium = 8;
static const double radiusLarge = 12;
static const double radiusXLarge = 16;
static const double radiusFull = 9999;
```

### Shadows

```dart
// Elevation
static const List<BoxShadow> shadowSmall = [
  BoxShadow(
    color: Color(0x0A000000),
    blurRadius: 4,
    offset: Offset(0, 1),
  ),
];

static const List<BoxShadow> shadowMedium = [
  BoxShadow(
    color: Color(0x14000000),
    blurRadius: 8,
    offset: Offset(0, 2),
  ),
];

static const List<BoxShadow> shadowLarge = [
  BoxShadow(
    color: Color(0x1E000000),
    blurRadius: 16,
    offset: Offset(0, 4),
  ),
];
```

---

## Macrostructure Picks (Per Screen Type)

### Customer App

| Screen | Macrostructure | Rationale |
| :--- | :--- | :--- |
| **Splash** | Typography-only | Clean brand reveal |
| **Login/Register** | Minimal form | Reduce cognitive load |
| **OTP Verification** | Minimal form | Focus on input |
| **Home** | Bento Grid | Organized sections |
| **Category List** | Grid layout | Visual browsing |
| **Product List** | Grid with filters | Scannable catalog |
| **Product Detail** | Gallery + details | Rich product view |
| **Cart** | List layout | Clear item management |
| **Checkout** | Step-by-step form | Guided flow |
| **Order Confirmation** | Success state | Positive feedback |
| **Order List** | List layout | Easy tracking |
| **Order Detail** | Timeline layout | Status visibility |
| **Profile** | Settings layout | Organized settings |
| **Address Management** | List + form | CRUD pattern |
| **Wishlist** | Grid layout | Visual collection |
| **Notifications** | List layout | Chronological |
| **Search** | Search + results | Instant feedback |

### Driver App

| Screen | Macrostructure | Rationale |
| :--- | :--- | :--- |
| **Dashboard** | Stats + Actions | Quick overview |
| **Order List** | Tabbed list | Status organization |
| **Order Detail** | Map + Info | Location-focused |
| **Shift Management** | Toggle + History | Time tracking |
| **Cash Ledger** | Summary + List | Financial clarity |

### Admin App

| Screen | Macrostructure | Rationale |
| :--- | :--- | :--- |
| **Dashboard** | Bento Grid | Data density |
| **Product Management** | Table + Filters | Bulk operations |
| **Order Management** | Table + Filters | Status tracking |
| **Customer Management** | Table + Search | User lookup |
| **Marketing** | Tabbed interface | Feature organization |

---

## Slop Test Checklist (58 Gates)

### Visual (15 Gates)
- [ ] No inline colors
- [ ] No italic headers
- [ ] No text shadows
- [ ] No gradients on text
- [ ] No outlines on cards
- [ ] Consistent border radius
- [ ] Proper spacing scale
- [ ] Correct font weights
- [ ] Status colors used correctly
- [ ] No visual clutter
- [ ] White space used effectively
- [ ] Grid alignment
- [ ] Consistent iconography
- [ ] Proper image aspect ratios
- [ ] No visual noise

### Interaction (12 Gates)
- [ ] Touch targets ≥ 44px
- [ ] Feedback on tap
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Success states
- [ ] Pull-to-refresh
- [ ] Infinite scroll
- [ ] Skeleton loading
- [ ] Haptic feedback
- [ ] Smooth transitions
- [ ] Keyboard handling

### Content (10 Gates)
- [ ] Arabic RTL support
- [ ] Number formatting (EGP)
- [ ] Date formatting
- [ ] Text truncation
- [ ] Line clamping
- [ ] Error messages
- [ ] Empty messages
- [ ] Accessibility labels
- [ ] Semantic structure
- [ ] Copy consistency

### Performance (8 Gates)
- [ ] Image lazy loading
- [ ] List virtualization
- [ ] State management
- [ ] Memory leaks
- [ ] Animation jank
- [ ] Scroll performance
- [ ] Network efficiency
- [ ] Cache strategy

### Accessibility (8 Gates)
- [ ] Color contrast (4.5:1)
- [ ] Screen reader labels
- [ ] Focus management
- [ ] Keyboard navigation
- [ ] Touch alternatives
- [ ] Text scaling
- [ ] Reduced motion
- [ ] Dark mode ready

### Technical (5 Gates)
- [ ] No print statements
- [ ] No TODOs in UI
- [ ] Proper error handling
- [ ] State cleanup
- [ ] Widget testing

---

## Design Decisions Log

| Date | Decision | Rationale |
| :--- | :--- | :--- |
| 2026-08-28 | Genre: modern-minimal | E-commerce fits Stripe/Linear school |
| 2026-08-28 | Primary: #1A1A1A | Professional, versatile |
| 2026-08-28 | Secondary: #D4AF37 | Premium, Egyptian market appeal |
| 2026-08-28 | Font: Cairo | Arabic-friendly, modern |
| 2026-08-28 | Currency: EGP | Egyptian market |

---

## Next Phase

**Phase 1** will:
1. Apply these tokens to Flutter theme
2. Build Customer App screens using macrostructure picks
3. Run slop test on all screens
4. Update this file with final design decisions
