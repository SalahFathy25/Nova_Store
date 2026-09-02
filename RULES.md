# NOVA Commerce — Project Rules & Standards

> This file is the **single source of truth** for all coding standards, architecture decisions, and quality gates across the entire project. Every line of code written in this project **MUST** comply with these rules. No exceptions.
>
> **Version:** 2.0 — Comprehensive Edition
> **Last Updated:** 2026-08-31

---

## Table of Contents

1. [General Principles](#1-general-principles)
2. [Flutter / Dart Rules](#2-flutter--dart-rules)
3. [Backend (NestJS / TypeScript) Rules](#3-backend-nestjs--typescript-rules)
4. [Database / TypeORM Rules](#4-database--typeorm-rules)
5. [API Design Rules](#5-api-design-rules)
6. [State Management (BLoC) Rules](#6-state-management-bloc-rules)
7. [Architecture & Clean Code Rules](#7-architecture--clean-code-rules)
8. [Testing Rules (QA)](#8-testing-rules-qa)
9. [Security Rules](#9-security-rules)
10. [Performance Rules](#10-performance-rules)
11. [Git & Version Control Rules](#11-git--version-control-rules)
12. [Documentation Rules](#12-documentation-rules)
13. [Design System Compliance](#13-design-system-compliance)
14. [Multi-Tenancy Rules](#14-multi-tenancy-rules)
15. [Error Handling Rules](#15-error-handling-rules)
16. [Accessibility (a11y) Rules](#16-accessibility-a11y-rules)
17. [Internationalization (i18n) Rules](#17-internationalization-i18n-rules)
18. [Responsive Design Rules](#18-responsive-design-rules)
19. [Animation Rules](#19-animation-rules)
20. [Logging & Monitoring Rules](#20-logging--monitoring-rules)
21. [Configuration Management Rules](#21-configuration-management-rules)
22. [DevOps & CI/CD Rules](#22-devops--cicd-rules)
23. [Code Quality & Linting Rules](#23-code-quality--linting-rules)
24. [Code Review Checklist](#24-code-review-checklist)
25. [Prohibited Practices](#25-prohibited-practices)

---

## 1. General Principles

### 1.1 Core Values

- **Zero tolerance for TODOs in production code.** Every feature must be fully implemented before merge. If something is blocked, create a tracked issue — do not leave `// TODO` in code.
- **No hardcoded values.** All magic numbers, strings, colors, URLs, timeouts, and configuration must be extracted to constants or config files.
- **No dead code.** If a function, variable, import, or file is unused, delete it immediately. Do not keep "just in case." Version control preserves history.
- **No code duplication.** If the same logic appears twice, extract it to a shared utility, helper, or base class. The rule of three: if you write it three times, refactor.
- **No commented-out code.** Delete it. Version control has the history. Commented code rots and confuses future developers.
- **No orphaned files.** Every file must be imported and used somewhere. If you create a file, it must be wired into the system.

### 1.2 Design Principles

- **Single Responsibility Principle (SRP).** Every class, function, and module must have one reason to change. If a class does two things, split it.
- **Open/Closed Principle (OCP).** Open for extension, closed for modification. Use interfaces and abstract classes for extensibility.
- **Liskov Substitution Principle (LSP).** Subtypes must be substitutable for their base types without altering correctness.
- **Interface Segregation Principle (ISP).** Many specific interfaces are better than one general-purpose interface. Don't force clients to depend on methods they don't use.
- **Dependency Inversion Principle (DIP).** High-level modules must not depend on low-level modules. Both must depend on abstractions.
- **DRY (Don't Repeat Yourself).** Applies to logic, configuration, UI patterns, error handling, and documentation.
- **KISS (Keep It Simple, Stupid).** Favor readability over cleverness. The simplest solution that works is the best solution.
- **YAGNI (You Ain't Gonna Need It).** Do not build functionality until it is actually needed. No speculative abstractions.
- **Explicit over implicit.** Always be explicit about types, return values, and side effects. Never rely on implicit behavior.
- **Consistency over perfection.** Follow the existing patterns in the codebase even if you'd do it differently. Consistency reduces cognitive load.
- **Fail fast, fail loud.** Validate inputs early, throw errors immediately, and never silently swallow exceptions.
- **Defense in depth.** Never rely on a single layer of validation. Validate at UI, API, service, and database layers.

### 1.3 Code Ownership

- **Every file must have a clear owner.** If you create it, you maintain it.
- **No cowboy refactoring.** If you see something that needs refactoring, create an issue first. Do not refactor unrelated code in a feature PR.
- **Every change must be tested.** No untested code reaches `develop`.

---

## 2. Flutter / Dart Rules

### 2.1 Language & Syntax

- **Null safety is mandatory.** Never use `!` (bang operator) unless you have verified the value is non-null in a guard clause above. Prefer `?.` and `??` operators.
- **Use `const` constructors everywhere possible.** This reduces widget rebuilds and improves performance. If a widget's parameters are all compile-time constants, the constructor MUST be `const`.
- **Prefer `final` over `var`.** Use `var` only when the variable will be reassigned. Use `final` for everything else.
- **Use `late` sparingly.** Only when initialization cannot happen in the constructor. Never use `late` for values that might remain uninitialized. If you use `late`, add a comment explaining why.
- **Prefer named parameters over positional parameters** for all function and constructor calls with more than 2 parameters.
- **Use `required` keyword** for mandatory named parameters. Never use custom assertions for required parameters.
- **Prefer `enum` over magic strings.** All status values, types, and categories must be enums. Use enhanced enums with properties when needed.
- **Use `Equatable` for all entity and state classes.** This prevents unnecessary rebuilds and comparisons.
- **No `print()` statements in production code.** Use `debugPrint()` or a logging package. Never log sensitive data.
- **Use `deepEqual` for comparing collections.** Never use `==` for List or Map comparison.
- **Prefer `Iterable` over `List` for method parameters** when you don't need random access. This allows lazy evaluation.
- **Use `ascade` (`..`) for method chaining on the same object.** Don't use it for building widgets.
- **Prefer `if` elements in collection literals** over `.where().toList()`. Example: `[if (condition) item]`.
- **Use `switch` expressions** (Dart 3+) when possible. They're more concise than switch statements.

### 2.2 Widget Architecture

- **Extract widgets into separate files** when they exceed 150 lines or are reused in 2+ places.
- **Prefer `StatelessWidget` over `StatefulWidget`.** Only use `StatefulWidget` when you genuinely need mutable state. Consider using BLoC/Cubit to manage state externally.
- **Never build widgets inside `build()` method that can be extracted.** Each `build()` method should be readable in under 50 lines. If it's longer, extract sub-widgets.
- **Use `const` constructors for all leaf widgets.** This is the single biggest performance optimization in Flutter.
- **Never use `Container` with only color/decoration.** Use `ColoredBox`, `DecoratedBox`, or `Card` instead.
- **Never use `SizedBox(height: 0)` or `SizedBox(width: 0)`.** Use `Spacer()` or remove the widget entirely.
- **Prefer `ListView.builder` over `ListView` with children.** Always use the builder for dynamic lists.
- **Use `Key` properly.** Every `ListView.builder`, `GridView.builder`, and `AnimatedList` item must have a unique key. Use `ValueKey` for simple cases, `ObjectKey` for complex objects.
- **Wrap `TextField` and `TextFormField` with `FocusNode`** when you need programmatic focus control.
- **Always handle keyboard appearance.** Use `SingleChildScrollView` + `ConstrainedBox` or `MediaQuery.of(context).viewInsets.bottom` to avoid keyboard overlap.
- **Never use `Stack` with `Positioned` for layouts that can be done with `Row`/`Column`/`Flex`.** Stack is for overlapping, not positioning.
- **Prefer `LayoutBuilder` over `MediaQuery.of(context).size`** for responsive layouts within a widget.
- **Use `IntrinsicHeight` / `IntrinsicWidth` sparingly** — they cause multiple layout passes.
- **Never put `Expanded` or `Flexible` inside `ListView` items** without a constrained parent.
- **Use `Sliver` variants** for custom scroll views. Never nest `ListView` inside `SingleChildScrollView`.
- **Prefer `AnimatedContainer`, `AnimatedOpacity`, `AnimatedPositioned`** for simple implicit animations over manual `AnimationController`.

### 2.3 Image Handling

- **Always use `CachedNetworkImage`** for network images. Never use `Image.network()`.
- **Always provide `placeholder` and `errorWidget`** for `CachedNetworkImage`. Use shimmer or a default icon.
- **Set explicit `width` and `height`** for all images. Never let images float without constraints.
- **Use `fit: BoxFit.cover`** for product images, banners, and avatars.
- **Compress and resize images before upload.** Max dimensions: 1200x1200 for products, 800x800 for avatars, 1920x600 for banners.
- **Use `precacheImage`** for images that will be shown immediately (hero images, product detail).
- **Implement `ImageCache` limits.** Default 100 images / 100MB. Configure based on device memory.
- **Use `MemoryImage` for base64-encoded images** from the API. Never decode base64 in the widget tree.
- **Prefer WebP format** for all network images. Fall back to JPEG for older devices.
- **Never store large images in SharedPreferences.** Use file storage or a dedicated cache.

### 2.4 Navigation

- **Use named routes with a centralized router.** Never use `Navigator.push(context, MaterialPageRoute(...))` inline. Always go through the router.
- **Pass data through route arguments.** Never use global state for navigation data.
- **Handle deep linking from the start.** Every route must work with deep linking.
- **Use `WillPopScope` / `PopScope`** to prevent accidental back navigation on critical screens (checkout, order confirmation).
- **Use `Navigator.pushReplacement` for auth flows.** Users should not go back to login after logging in.
- **Implement route guards** for protected routes. Check auth state before navigating.
- **Use `Hero` animations** for shared element transitions between list and detail screens.
- **Preserve scroll position** in list views when navigating back. Use `AutomaticKeepAliveClientMixin`.
- **Handle back button on Android** properly. Use `PopScope` with `canPop` and `onPopInvokedWithResult`.

### 2.5 Theming

- **NEVER use hardcoded colors.** Always use `NovaTheme.xxx` tokens. This is enforced by `design.lock`.
- **NEVER use hardcoded text styles.** Always use `NovaTheme.headingLarge`, `NovaTheme.bodyMedium`, etc.
- **NEVER use hardcoded padding/margin values.** Always use `NovaTheme.spacingXxx` constants.
- **NEVER use hardcoded border radius.** Always use `NovaTheme.radiusXxx` constants.
- **Use `Theme.of(context)`** when you need theme data inside widgets. Do not import `NovaTheme` directly in feature widgets — access through the context.
- **All new screens must pass the 58-gate slop test** before merging.
- **Use `MediaQuery.of(context).platformBrightness`** to support dark mode detection (future-proofing).
- **Use `TextTheme` extensions** for custom text styles. Register via `ThemeData(extensions: [...])`.
- **Use `ColorScheme` for semantic colors** (primary, secondary, error, surface). Avoid using raw color values.

### 2.6 Dependency Injection

- **Use `GetIt` for service location.** All repositories, data sources, and services must be registered.
- **Register as `LazySingleton`** unless the dependency needs to be a factory.
- **Never access `GetIt` directly in widgets.** Use `context.read<T>()` or `getIt<T>()` only in BLoC constructors.
- **Register dependencies in order:** Core → Data Sources → Repositories → BLoCs.
- **Use `ResetStream` for BLoC resets** when logging out. Ensure clean state on auth transitions.
- **Register environment-specific dependencies** using named instances or platform checks.

### 2.7 Asset Management

- **All assets must be declared in `pubspec.yaml`.** No dynamic asset paths.
- **Use Lottie for complex animations.** Prefer Lottie over manual animation controllers for loading states and success animations.
- **SVG for icons and simple graphics.** Use `flutter_svg` for all vector assets.
- **Organize assets in subdirectories:** `assets/images/`, `assets/icons/`, `assets/animations/`, `assets/fonts/`.
- **Use asset variants** for different pixel densities (1x, 2x, 3x).
- **Never hardcode asset paths in widgets.** Define them as constants in an `AppAssets` class.

### 2.8 Platform-Specific Code

- **Use platform checks** (`Platform.isAndroid`, `Platform.isIOS`) only for platform-specific behavior. Never for UI differences.
- **Create platform-specific files** (`file_android.dart`, `file_ios.dart`) for native integrations.
- **Use `MethodChannel`** for native feature access. Always handle `MissingPluginException`.
- **Test platform-specific code** on both platforms before merge.
- **Use `universal_html`** instead of `dart:html` for web compatibility.
- **Keep `pubspec.yaml` dependencies platform-aware** with conditional imports when needed.

### 2.9 Widget Lifecycle

- **Use `initState` for one-time setup** (subscriptions, controllers, animations).
- **Use `didChangeDependencies`** for context-dependent initializations.
- **Use `dispose` for cleanup** (cancel subscriptions, dispose controllers, remove listeners).
- **Never call `setState` after `dispose`.** Guard with `mounted` check.
- **Use `didUpdateWidget`** to react to parent widget changes.
- **Avoid heavy computation in `build()`.** Move to `initState` or a separate method.
- **Use `WidgetsBindingObserver`** for app lifecycle changes (pause, resume, inactive).

### 2.10 Memory Management

- **Dispose all `AnimationController`s, `TextEditingController`s, `ScrollController`s.**
- **Cancel all `StreamSubscription`s in `dispose`.**
- **Remove all `addListener`s in `dispose`.**
- **Use `WeakReference`** for cache entries that should be garbage collected.
- **Monitor memory with DevTools.** Check for memory leaks in long-running sessions.
- **Never store large objects in static variables.** They persist across screen navigations.
- **Use `imageCache.clear()`** when navigating away from image-heavy screens.

### 2.11 State Restoration

- **Implement `RestorationMixin`** for critical user state (cart, form inputs).
- **Use `RestorationBucket`** for nested restoration scopes.
- **Test state restoration** on Android (process death) and iOS (background termination).
- **Never restore sensitive data** (passwords, tokens) — re-authenticate instead.

### 2.12 Custom Painting

- **Use `CustomPainter` only when no existing widget suffices.**
- **Implement `shouldRepaint` correctly** — return `true` only when the painter's properties change.
- **Use `RepaintBoundary`** around `CustomPaint` widgets to isolate repaints.
- **Cache `Path` objects** when possible. Recreating paths on every frame is expensive.
- **Use `Canvas.save()` and `Canvas.restore()`** properly. Every save must have a restore.

---

## 3. Backend (NestJS / TypeScript) Rules

### 3.1 Language & Syntax

- **TypeScript strict mode is mandatory.** No `any` types. Ever. Use proper interfaces, types, or `unknown`.
- **Use `readonly` for all constructor-injected dependencies.** This prevents accidental reassignment.
- **Prefer `interface` over `type`** for object shapes. Use `type` only for unions, intersections, and mapped types.
- **Use optional chaining `?.` and nullish coalescing `??`** instead of manual null checks.
- **No `console.log()` in production.** Use NestJS Logger service with context.
- **Use `snake_case` for database columns** and `camelCase` for TypeScript properties. Use `@Column({ name: 'snake_case' })` to bridge them.
- **Use `.js` extensions in all relative imports.** This is required for ESM compatibility in NestJS.
- **Use `enum` for fixed sets of values.** Never use string literals for status fields.
- **Use `Partial<T>` for update operations** instead of creating separate update types.
- **Use `Pick<T, K>` and `Omit<T, K>`** for creating DTOs from entity types.
- **Prefer `Array<T>` over `T[]`** for consistency (both are valid, but be consistent).

### 3.2 Module Architecture

- **One module per domain entity group.** Each module must contain: entity, service, controller, DTO, and module file.
- **Modules must be self-contained.** A module should not import services from unrelated modules. Use event-driven communication (NestJS EventEmitter) for cross-module concerns.
- **Export services that other modules need.** Never import another module's entity directly — use the exported service.
- **Register all entities in `TypeOrmModule.forFeature()`** within the module that owns them.
- **Register all feature modules in `AppModule`.** Never forget to import new modules.
- **Use `DynamicModule`** for modules that need runtime configuration.
- **Use `@Global()` sparingly** — only for truly global services (Logger, Config).
- **Modules should be deletable.** If you can't remove a module without breaking unrelated features, the architecture is wrong.

### 3.3 Controllers

- **Controllers must NOT contain business logic.** They are thin wrappers that delegate to services.
- **Use proper HTTP methods.** GET for reads, POST for creates, PUT/PATCH for updates, DELETE for deletes.
- **Use `@UseGuards(JwtAuthGuard)`** on all endpoints that require authentication. Use class-level guards when all endpoints require auth.
- **Use `@CurrentTenantId()`** on every controller method that operates on tenant-scoped data.
- **Use `@CurrentUser('id')`** to get the authenticated user's ID. Never read it from the body.
- **Use Swagger decorators on every endpoint:** `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth`.
- **Validate all input.** Every `@Body()` must have a DTO with `class-validator` decorators. Every `@Query()` must have a DTO or be validated.
- **Return consistent response shapes.** Use `{ success, message, data }` pattern.
- **Handle pagination consistently.** Use `page` and `limit` query parameters. Return `{ data, total, page, limit }`.
- **Use `@HttpCode()`** for non-standard response codes (204 for deletes, etc.).
- **One controller method per route.** Never put conditional logic in a controller to handle different operations.
- **Use `@ApiQuery` for every query parameter** in Swagger documentation.
- **Use `@ApiParam` for every path parameter** in Swagger documentation.

### 3.4 Services

- **Services must contain ALL business logic.** No logic in controllers or entities.
- **Use `@InjectRepository()` for all TypeORM repositories.** Never instantiate repositories manually.
- **Use QueryBuilder for complex queries.** Avoid `find()` with deeply nested relations — use `createQueryBuilder` with explicit joins.
- **Always validate tenant isolation.** Every query must include `WHERE tenant_id = :tenantId`. Never trust the client.
- **Use transactions for multi-step operations.** Order creation, stock updates, and payment processing must be atomic.
- **Throw proper HTTP exceptions.** `NotFoundException` for missing resources, `BadRequestException` for validation errors, `ConflictException` for duplicates, `UnauthorizedException` for auth failures.
- **Never return raw database entities.** Sanitize sensitive fields (password_hash, fcm_token) before returning.
- **Use `class-transformer` for response transformation.** Apply `@Exclude()` on sensitive fields.
- **Inject `Logger` service** in every service. Log all significant operations.
- **Use `@Inject(DataSource)` for transaction management.** Create query runners for multi-step operations.
- **Services should be stateless.** Never store request-specific data in service properties.
- **Use `forwardRef()`** for circular module dependencies. Never restructure the entire app to avoid one circular dependency.

### 3.5 DTOs (Data Transfer Objects)

- **Every endpoint must have a DTO.** Even if it's a simple endpoint.
- **Use `class-validator` decorators on every field:** `@IsString()`, `@IsUUID()`, `@IsNumber()`, `@IsOptional()`, `@Min()`, `@MaxLength()`, `@IsEmail()`, `@IsIn()`, etc.
- **Use `class-transformer` for transformation:** `@Type()`, `@Transform()`.
- **Use `PartialType()` from `@nestjs/swagger`** for update DTOs that accept partial data.
- **Separate request DTOs from response DTOs.** Never reuse the same DTO for input and output.
- **DTOs must be in a `dto/` subdirectory** within the module folder.
- **Use `@ApiProperty()` on every DTO field** for Swagger documentation.
- **Use `@ApiPropertyOptional()`** for optional fields.
- **Validate nested objects** with `@ValidateNested()` and `@Type()`.
- **Use `@IsDateString()`** for date strings, `@IsEnum()` for enums, `@IsBoolean()` for booleans.
- **Add `@MaxLength()` on all string fields** to prevent unbounded input.

### 3.6 Error Handling

- **Use NestJS built-in exception filters.** Do not create custom exception filters unless absolutely necessary.
- **Always provide meaningful error messages.** "Bad request" is not acceptable. Say what went wrong.
- **Never expose internal error details to the client.** Log the full error, return a safe message.
- **Use the global `AllExceptionsFilter`** for consistent error responses.
- **Validate input at the DTO level** with class-validator. Do not write manual validation in services.
- **Log every error** with full context: timestamp, user ID, tenant ID, request ID, stack trace.
- **Use `HttpException` for business logic errors.** Never throw raw `Error` objects.
- **Implement error codes** for client-side error handling. Example: `PRODUCT_NOT_FOUND`, `INSUFFICIENT_STOCK`.
- **Handle database constraint violations** gracefully. Convert unique constraint errors to `ConflictException`.
- **Use `@Catch()` decorator** for custom exception filters when needed.

### 3.7 Middleware

- **Use middleware for cross-cutting concerns:** logging, authentication, tenant isolation, request transformation.
- **Middleware must be fast.** Do not perform database queries in middleware unless absolutely necessary.
- **Use `NestMiddleware` interface** for all middleware.
- **Register middleware** in module `configure()` method.
- **Use `apply().forRoutes()`** to specify which routes the middleware applies to.
- **Never modify the request body in middleware.** Use interceptors for response transformation.

### 3.8 Interceptors

- **Use interceptors for response transformation, logging, caching, and timeout handling.**
- **Use `CallHandler` properly.** Always call `handle()` unless you want to short-circuit the request.
- **Use RxJS operators** (`map`, `tap`, `catchError`, `timeout`) for stream manipulation.
- **Apply interceptors globally** for cross-cutting concerns, or per-controller/method for specific needs.
- **Use `@UseInterceptors()` decorator** to apply interceptors.

### 3.9 Guards

- **Use guards for authorization.** Authentication is handled by `AuthGuard`, authorization by custom guards.
- **Guards must be fast.** Do not perform expensive operations in guards.
- **Use `CanActivate` interface** for all guards.
- **Return `true`/`false` or throw `ForbiddenException`.**
- **Apply guards globally** for all authenticated routes, or per-route for specific authorization.
- **Use `@Roles()` decorator** with `RolesGuard` for role-based access control.

### 3.10 Pipes

- **Use pipes for input transformation and validation.**
- **NestJS `ValidationPipe` is applied globally.** Do not add per-endpoint validation pipes.
- **Use `ParseUUIDPipe`** for UUID path parameters.
- **Use `ParseIntPipe`** for integer query parameters.
- **Use `ParseBoolPipe`** for boolean query parameters.
- **Create custom pipes** for complex validation logic that can't be expressed with class-validator.

### 3.11 Decorators

- **Create custom decorators** for repeated patterns (current user, tenant, pagination).
- **Use `createParamDecorator()`** for custom parameter decorators.
- **Use `SetMetadata()`** for attaching metadata to handlers/classes.
- **Use `applyDecorators()`** to combine multiple decorators into one.
- **Document all custom decorators** with JSDoc comments.

### 3.12 WebSocket (Real-time)

- **Use `@nestjs/websockets`** for real-time features (order status, notifications).
- **Use `@nestjs/platform-socket.io`** as the WebSocket adapter.
- **Implement authentication** for WebSocket connections. Validate JWT on `handleConnection`.
- **Use rooms** for tenant-scoped broadcasting. Never broadcast to all connections.
- **Handle disconnections gracefully.** Clean up subscriptions and resources.
- **Use `@SubscribeMessage()`** for message handlers.
- **Validate WebSocket messages** with DTOs and class-validator.
- **Implement heartbeat/ping** to detect stale connections.

### 3.13 File Upload/Download

- **Use `@nestjs/platform-express`** with `multer` for file uploads.
- **Validate file types** with MIME type checks. Never trust the file extension.
- **Validate file size** before processing. Enforce limits: 5MB for images, 50MB for documents.
- **Store files outside the application directory.** Use cloud storage (S3, GCS) in production.
- **Generate unique filenames** to prevent conflicts. Use UUID + original extension.
- **Serve uploaded files** via a static file server, not through NestJS.
- **Scan uploaded files** for malware in production.
- **Use `@UploadedFile()` and `@UploadedFiles()`** decorators with proper typing.

### 3.14 Email & Notifications

- **Use `@nestjs-modules/mailer`** for email sending.
- **Use templates** for all emails. Never construct HTML in code.
- **Send emails asynchronously.** Use a queue (Bull) for email delivery.
- **Implement retry logic** for failed email deliveries.
- **Use `nodemailer` transport** configured via environment variables.
- **Log all email deliveries** for debugging and auditing.
- **Implement unsubscribe** for marketing emails.

### 3.15 Queue Management

- **Use `@nestjs/bull`** with Redis for job queues.
- **Create separate queues** for different job types: email, notifications, reports, image processing.
- **Implement job retry logic** with exponential backoff.
- **Monitor queue health** with Bull Dashboard.
- **Handle failed jobs** with dead letter queues.
- **Use job priorities** for critical operations.
- **Set job timeouts** to prevent stuck jobs.

### 3.16 Caching

- **Use `@nestjs/cache-manager`** for in-memory caching.
- **Cache frequently accessed, rarely changed data:** categories, brands, settings, feature flags.
- **Set appropriate TTL** for cached data: 5 minutes for volatile data, 1 hour for stable data.
- **Invalidate cache** when underlying data changes. Use cache-aside pattern.
- **Use `@CacheInterceptor()`** for automatic caching on endpoints.
- **Implement cache warming** for critical data on application start.
- **Use Redis** for distributed caching in production.

### 3.17 Health Checks

- **Implement `/health` endpoint** using `@nestjs/terminus`.
- **Check database connectivity** in health checks.
- **Check Redis connectivity** if using Redis.
- **Check external service dependencies** (payment gateway, SMS provider).
- **Return proper HTTP status codes:** 200 for healthy, 503 for unhealthy.
- **Implement readiness and liveness probes** for Kubernetes deployment.
- **Monitor health check response times.**

### 3.18 Graceful Shutdown

- **Implement graceful shutdown** in `main.ts` using `app.enableShutdownHooks()`.
- **Close database connections** before exiting.
- **Close Redis connections** before exiting.
- **Drain in-flight requests** before shutting down.
- **Complete pending queue jobs** before shutting down.
- **Log shutdown events** for debugging.

### 3.19 Configuration Management

- **Use `@nestjs/config`** for environment variable management.
- **Never hardcode configuration values.** Always use environment variables.
- **Use `.env` files** for local development. Never commit `.env` to version control.
- **Use `ConfigModule.forRoot({ isGlobal: true })`** for global configuration.
- **Validate configuration** at startup using `joi` or `zod`.
- **Use typed configuration** with interfaces. Never access `process.env` directly.
- **Document all environment variables** in a `.env.example` file.

### 3.20 API Versioning

- **Use URI versioning:** `/api/v1/...`, `/api/v2/...`
- **Never modify existing API versions.** Create new versions for breaking changes.
- **Deprecate old versions** with proper headers and documentation.
- **Maintain backward compatibility** for at least 2 versions.
- **Use `@nestjs/mapped-types`** for versioned DTOs.

### 3.21 Docker & Deployment

- **Use multi-stage Docker builds** for smaller images.
- **Never run as root** in Docker containers.
- **Use `.dockerignore`** to exclude unnecessary files.
- **Set `NODE_ENV=production`** in production containers.
- **Use health checks** in Docker Compose and Kubernetes.
- **Implement proper logging** to stdout/stderr for container log aggregation.
- **Use environment-specific configuration** via environment variables.
- **Never store secrets in Docker images.** Use Docker secrets or environment variables.

---

## 4. Database / TypeORM Rules

### 4.1 Entity Design

- **Every entity MUST have `id` (UUID), `tenant_id`, `created_at`, and `updated_at`.** No exceptions.
- **Use `@PrimaryGeneratedColumn('uuid')`** for all primary keys. Never use auto-increment integers.
- **Use `@CreateDateColumn` and `@UpdateDateColumn`** for timestamps. Never manage timestamps manually.
- **Every tenant-scoped entity MUST have a `@ManyToOne(() => Store)`** relation on `tenant_id`.
- **Use `@Index()` on frequently queried columns.** Especially `tenant_id`, `user_id`, `status`, and foreign keys.
- **Use `@Index(['tenant_id', 'xxx'], { unique: true })`** for unique constraints within a tenant.
- **Use `@Column({ type: 'uuid' })`** for all foreign key columns. Do not use the relation decorator for the column type.
- **Use `@Column({ type: 'jsonb' })`** for flexible data structures. Always provide a default value of `'{}'` or `'[]'`.
- **Use `@Column({ type: 'text', array: true })`** for arrays. Never use comma-separated strings.
- **Use `@Column({ type: 'decimal', precision: 10, scale: 2 })`** for money values. Never use `float`.
- **Use `@Column({ type: 'boolean', default: true })`** for flags. Always provide a default.
- **Use `@Column({ type: 'varchar', length: N })`** for strings with known max length. Use `text` only for unlimited content.
- **Add `onDelete` strategy** to every relation. Use `'CASCADE'` for owned data, `'SET NULL'` for optional references, `'RESTRICT'` for critical references.
- **Use `@Column({ type: 'timestamptz' })`** for all date/time columns. Never use `timestamp` without timezone.

### 4.2 Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Tables | snake_case, plural | `order_items`, `product_variants` |
| Columns | snake_case | `tenant_id`, `created_at`, `base_price` |
| Primary keys | `id` | `id` |
| Foreign keys | `{referenced_table}_id` | `user_id`, `product_id` |
| Indexes | `idx_{table}_{column}` | `idx_products_tenant_id` |
| Unique indexes | `uniq_{table}_{column}` | `uniq_users_email` |
| Foreign key constraints | `fk_{table}_{referenced}` | `fk_orders_users` |

### 4.3 Relationships

- **One-to-Many:** Use `@ManyToOne` on the many side, `@OneToMany` on the one side.
- **Many-to-Many:** Use `@ManyToMany` with a join table. Never create manual join tables.
- **Self-referencing:** Use the same entity for `@ManyToOne` and `@OneToMany` (e.g., Category parent/children).
- **Always set `onDelete` strategy.** Never leave it as default (`NO ACTION`).
- **Use `eager: false`** (default) for all relations. Load relations explicitly when needed.
- **Use `@JoinColumn`** to customize foreign key column names when needed.

### 4.4 Indexing Strategy

- **Index all foreign keys.** TypeORM does this automatically for `@ManyToOne`.
- **Index all `tenant_id` columns.** This is the most common query filter.
- **Index status columns** that are frequently filtered.
- **Use composite indexes** for queries that filter on multiple columns simultaneously.
- **Use partial indexes** for filtered queries (e.g., `WHERE is_active = true`).
- **Avoid over-indexing.** Each index slows down writes. Only index what you query.
- **Use `EXPLAIN ANALYZE`** to verify index usage.
- **Monitor index usage** with PostgreSQL `pg_stat_user_indexes`.

### 4.5 Migrations

- **Never use `synchronize: true` in production.** Always use migrations.
- **Create migrations for every schema change.** No manual database modifications.
- **Migrations must be reversible.** Every `up()` must have a matching `down()`.
- **Test migrations on a copy of production data** before applying.
- **Never delete columns in migrations** without a deprecation period.
- **Never rename columns** — create new column, migrate data, drop old column.
- **Use `type: 'varchar'`** instead of `type: 'text'` in new migrations for better performance.
- **Add `NOT NULL` constraints** only after backfilling existing data.

### 4.6 Query Patterns

- **Always scope queries by `tenant_id`.** This is the #1 security requirement.
- **Use `createQueryBuilder` for complex queries.** Avoid ORM shortcuts for anything beyond simple CRUD.
- **Always use `@InjectRepository()`** for repository access. Never use `dataSource.getRepository()`.
- **Paginate all list queries.** Never return unbounded result sets.
- **Use `select()` to limit returned columns.** Never `SELECT *` in production queries.
- **Add `orderBy` to all queries.** Unordered queries return inconsistent results.
- **Use `take` and `skip`** for pagination instead of `limit` and `offset` (TypeORM 0.3+).
- **Use `loadRelationCountAndMap`** for counting relations without loading them.
- **Use `getRawMany` and `getRawOne`** for aggregate queries.
- **Avoid `findAndCount`** for large tables — use separate `count()` and `find()` calls.

### 4.7 Soft Deletes

- **Use `@DeleteDateColumn()`** for soft deletes on critical entities.
- **Never hard-delete** user data, orders, or financial records.
- **Filter out soft-deleted records** in all queries by default.
- **Use `withDeleted()`** to include soft-deleted records when needed (admin views).
- **Implement restoration** for soft-deleted records.

### 4.8 Audit Trail

- **Log all data changes** in an `audit_logs` table.
- **Store old and new values** for each change.
- **Record the user who made the change.**
- **Record the timestamp and IP address.**
- **Never audit sensitive data** (passwords, tokens).
- **Implement audit log retention** policy (e.g., 1 year).

### 4.9 Connection Management

- **Use connection pooling.** Configure pool size based on expected load: 10-20 for small apps, 50-100 for large apps.
- **Set `connectionTimeout`** to prevent hanging connections.
- **Set `acquireTimeout`** for connection acquisition.
- **Implement connection health checks** in the database config.
- **Use `synchronize: false`** in production. Always use migrations.
- **Close connections gracefully** on application shutdown.

### 4.10 Transactions

- **Use transactions** for multi-step operations that must be atomic.
- **Use `QueryRunner`** for manual transaction control.
- **Keep transactions short.** Never hold transactions for user interaction.
- **Use `SAVEPOINT`** for nested transactions.
- **Handle deadlocks** with retry logic.
- **Never nest transactions** unless using savepoints.

### 4.11 Data Types

| Data | PostgreSQL Type | TypeORM Type |
|------|----------------|--------------|
| UUID | `uuid` | `'uuid'` |
| String (short) | `varchar(N)` | `'varchar'` with `length` |
| String (long) | `text` | `'text'` |
| Integer | `integer` | `'int'` |
| Decimal | `decimal(P, S)` | `'decimal'` |
| Boolean | `boolean` | `'boolean'` |
| Date only | `date` | `'date'` |
| Date + Time | `timestamptz` | `'timestamptz'` |
| JSON | `jsonb` | `'jsonb'` |
| Array | `text[]` | `'text', { array: true }` |
| Enum | `varchar` or native enum | `'varchar'` with application-level validation |
| Binary | `bytea` | `'bytea'` |

---

## 5. API Design Rules

### 5.1 URL Conventions

- **Use plural nouns for resources:** `/products`, `/orders`, `/users`. Never `/product`, `/order`, `/user`.
- **Use kebab-case for multi-word resources:** `/flash-sales`, `/order-items`.
- **Nest related resources:** `/orders/:id/items`, `/products/:id/variants`.
- **Use query parameters for filtering, sorting, pagination:** `?page=1&limit=20&sort=price:asc&category_id=xxx`.
- **Version the API:** All endpoints start with `/api/v1/`.
- **Never put actions in URLs.** Use HTTP methods instead: `POST /orders/:id/cancel` not `GET /cancel-order`.

### 5.2 HTTP Methods

- `GET /resource` — List resources (paginated, filterable, sortable)
- `GET /resource/:id` — Get single resource
- `POST /resource` — Create resource (returns 201)
- `PUT /resource/:id` — Replace resource (full update, returns 200)
- `PATCH /resource/:id` — Update resource (partial update, returns 200)
- `DELETE /resource/:id` — Delete resource (returns 204 or 200)

### 5.3 Request Format

```json
// POST /api/v1/products
{
  "title": "Product Name",
  "base_price": 99.99,
  "category_id": "uuid-here"
}
```

### 5.4 Response Format

```json
// Success (single resource)
{
  "success": true,
  "message": "Product created successfully",
  "data": { "id": "...", "title": "..." }
}

// Success (list with pagination)
{
  "success": true,
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}

// Error
{
  "success": false,
  "message": "Product not found",
  "error": "PRODUCT_NOT_FOUND"
}
```

### 5.5 Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| `200` | OK | Successful GET, PUT, PATCH |
| `201` | Created | Successful POST |
| `204` | No Content | Successful DELETE (no body) |
| `400` | Bad Request | Validation errors, malformed input |
| `401` | Unauthorized | Not authenticated, invalid/expired token |
| `403` | Forbidden | Authenticated but not authorized |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate resource, state conflict |
| `422` | Unprocessable Entity | Business logic error |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Unexpected server error |
| `503` | Service Unavailable | Server overloaded or down for maintenance |

### 5.6 Authentication & Headers

- **JWT Bearer token** for authenticated endpoints: `Authorization: Bearer <token>`
- **`X-Tenant-ID` header** for tenant scoping. Required on ALL endpoints.
- **`Content-Type: application/json`** for all JSON requests.
- **`Accept: application/json`** for all API requests.
- **`X-Request-ID`** for request tracing (generated by server).

### 5.7 Pagination

```
GET /api/v1/products?page=1&limit=20&sort=created_at:desc
```

Response:
```json
{
  "data": [...],
  "total": 150,
  "page": 1,
  "limit": 20,
  "total_pages": 8
}
```

### 5.8 Filtering

```
GET /api/v1/products?category_id=xxx&brand_id=yyy&min_price=10&max_price=100&is_active=true
```

### 5.9 Sorting

```
GET /api/v1/products?sort=price:asc
GET /api/v1/products?sort=created_at:desc
GET /api/v1/products?sort=-created_at (shorthand for desc)
```

### 5.10 Rate Limiting

- **Auth endpoints:** 5 requests per minute per IP.
- **Read endpoints:** 100 requests per minute per user.
- **Write endpoints:** 30 requests per minute per user.
- **Return `429 Too Many Requests`** with `Retry-After` header.
- **Use `@nestjs/throttler`** for rate limiting implementation.

---

## 6. State Management (BLoC) Rules

### 6.1 Structure

- **One BLoC per feature.** `AuthBloc`, `CartBloc`, `OrderBloc`, etc.
- **BLoC must NOT contain UI logic.** No `BuildContext` access, no navigation, no `showDialog`.
- **BLoC must NOT depend on UI packages.** No `flutter/material.dart` imports.
- **Use Equatable for all events and states.** This prevents duplicate events and unnecessary rebuilds.
- **BLoC files must be in `feature/bloc/` directory.** One file for events, one for states, one for bloc (or combined for small features).

### 6.2 Events

- **Events must be immutable.** Use `const` constructor and `final` fields.
- **Events must extend `Equatable`.**
- **One event per user action.** `CartAddItem`, `CartRemoveItem`, `CartUpdateQuantity`. Never combine actions.
- **Event names must be past-tense or imperative:** `CartLoad`, `CartAddItem`, `CartRemoveItem`.
- **Events must contain all data needed** by the handler. No fetching data inside event handlers.
- **Use separate events for load and refresh.** `CartLoad` and `CartRefresh`.

### 6.3 States

- **States must be immutable.** Use `const` constructor and `final` fields.
- **States must extend `Equatable`.**
- **One state per possible UI condition:** `Initial`, `Loading`, `Loaded`, `Error`.
- **Loaded states must contain ALL data needed by the UI.** The UI should never need to call additional APIs after receiving a Loaded state.
- **Error states must contain a user-friendly message.** Never expose technical errors to the UI.
- **Include metadata in states** when needed: `hasReachedMax`, `currentPage`, `isLoadingMore`.

### 6.4 Handlers

- **Always emit `Loading` before async operations.**
- **Use `emit.isDone` check** before emitting after async operations to avoid state errors.
- **Handle errors with `try-catch` or `Either.fold`.** Never let exceptions propagate unhandled.
- **Use `await` for sequential operations.** Use `Future.wait` only for independent parallel operations.
- **Never modify state after `emit()`** in the same handler. Each `emit()` is a terminal operation for that handler.
- **Use `add` for adding multiple events** in sequence. Don't call handlers directly.
- **Implement `on<EventType>`** for each event type. Never use a single handler for multiple events.

### 6.5 Integration

- **BLoCs are created in `main.dart` or screen-level `BlocProvider`.** Never create BLoCs inside other BLoCs.
- **Use `context.read<T>()` to dispatch events.** Never call `bloc.add()` directly from widgets.
- **Use `BlocBuilder` for simple state-dependent UI.** Use `BlocListener` for side effects (navigation, snackbar). Use `BlocConsumer` when you need both.
- **Never use `BlocBuilder` with `listenWhen` — use `BlocListener` instead.**
- **Use `BlocSelector`** when you only need to rebuild on a specific part of the state.
- **Implement `buildWhen`** to prevent unnecessary rebuilds.
- **Use `MultiBlocProvider`** to provide multiple BLoCs to a widget subtree.
- **Use `BlocProvider.value`** when passing an existing BLoC to a new widget subtree.
- **Never use `context.watch()` in BLoC handlers.** BLoCs must be independent.
- **Dispose BLoCs properly.** Use `BlocProvider` with `create` and let it handle disposal.

### 6.6 Testing BLoCs

- **Use `bloc_test` package** for testing BLoCs.
- **Test all event/state transitions.**
- **Mock all repositories** with `mockito` or `mocktail`.
- **Test error scenarios** (network error, server error, empty data).
- **Test edge cases** (concurrent events, rapid state changes).
- **Use `blocTest` function** with `act`, `expect`, `verify` parameters.

---

## 7. Architecture & Clean Code Rules

### 7.1 Layer Architecture

```
┌─────────────────────────────────────────┐
│  Presentation (UI + BLoC)               │
│  - Widgets, Pages, Screens              │
│  - BLoC (Events, States, Handlers)      │
│  - Formatters, Validators               │
├─────────────────────────────────────────┤
│  Domain (Business Logic)                │
│  - Entities (Equatable models)          │
│  - Repository Interfaces                │
│  - Use Cases (optional)                 │
├─────────────────────────────────────────┤
│  Data (Data Access)                     │
│  - DataSources (API, Local)             │
│  - Repository Implementations           │
│  - Models (DTOs, Mappers)               │
└─────────────────────────────────────────┘
```

- **Domain layer must NOT depend on Data or Presentation layers.**
- **Data layer must NOT depend on Presentation layer.**
- **Presentation layer can depend on Domain and Data layers.**
- **Use dependency inversion:** Domain defines repository interfaces, Data implements them.
- **Each layer has its own folder** within each feature module.

### 7.2 File Organization (Flutter)

```
customer_app/lib/
├── src/
│   ├── app/
│   │   ├── app.dart
│   │   └── main_shell.dart
│   ├── core/
│   │   ├── constants/
│   │   ├── router/
│   │   ├── di/
│   │   ├── theme/ (deprecated, use nova_core)
│   │   └── utils/
│   └── features/
│       └── {feature}/
│           ├── bloc/
│           │   ├── {feature}_bloc.dart
│           │   ├── {feature}_event.dart
│           │   └── {feature}_state.dart
│           ├── pages/
│           │   └── {feature}_page.dart
│           └── widgets/
│               └── {widget_name}.dart
```

### 7.3 File Organization (Backend)

```
backend/src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/
│   ├── guards/
│   └── strategies/
├── common/
│   ├── decorators/
│   ├── dto/
│   ├── filters/
│   ├── interceptors/
│   └── middleware/
├── config/
│   ├── app.config.ts
│   ├── database.config.ts
│   └── jwt.config.ts
├── modules/
│   └── {module}/
│       ├── {module}.module.ts
│       ├── {module}.controller.ts
│       ├── {module}.service.ts
│       ├── {module}.entity.ts
│       └── dto/
└── database/
    └── seeds/
```

### 7.4 Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Classes | PascalCase | `ProductBloc`, `CartRepository` |
| Abstract classes | PascalCase with prefix | `BaseEntity`, `AbstractService` |
| Interfaces | PascalCase | `IProductRepository` (optional) |
| Methods | camelCase | `getProducts()`, `addToCart()` |
| Getters | camelCase with `get` | `get isLoading`, `get itemCount` |
| Setters | camelCase with `set` | `set selectedProduct()` |
| Variables | camelCase | `productList`, `isLoading` |
| Private vars | camelCase with `_` | `_currentValue`, `_isLoading` |
| Constants | camelCase or SCREAMING_CAPS | `defaultPageSize` or `MAX_PAGE_SIZE` |
| Files (Dart) | snake_case | `product_bloc.dart`, `cart_page.dart` |
| Files (TS) | kebab-case or camelCase | `product.entity.ts`, `auth.service.ts` |
| Database columns | snake_case | `tenant_id`, `base_price` |
| API endpoints | kebab-case | `/api/v1/flash-sales` |
| Environment vars | SCREAMING_SNAKE_CASE | `DATABASE_URL`, `JWT_SECRET` |
| Enums | PascalCase type, camelCase values | `OrderStatus.pending` |
| Type parameters | Single uppercase letter | `T`, `E`, `K`, `V` |

### 7.5 Import Rules (Flutter)

- **Group imports in this order:**
  1. `dart:` SDK imports
  2. `package:flutter/` imports
  3. Third-party packages (`package:xxx/`)
  4. `package:nova_core/` imports
  5. Relative imports (`./`, `../`)
- **Separate groups with blank lines.**
- **Never use `import 'dart:io'` in Flutter widgets.**
- **Avoid relative imports crossing feature boundaries.** Use package imports for cross-feature references.
- **Use `show` and `hide` sparingly.** Only when there are naming conflicts.
- **Sort imports alphabetically** within each group.

### 7.6 Import Rules (Backend)

- **Group imports in this order:**
  1. Node.js built-in modules
  2. Third-party packages (`@nestjs/`, `typeorm/`, etc.)
  3. Local modules with `.js` extensions
- **Always use `.js` extensions** in relative imports.
- **Never use barrel imports** (`./modules`) in NestJS — import specific files.

### 7.7 Code Formatting

- **Use `dart format` / `prettier` for all formatting.** No manual formatting.
- **Max line length: 100 characters.** Break long lines.
- **Use trailing commas** on all parameter lists and collection literals. This improves formatting.
- **One blank line between methods.** No multiple blank lines.
- **No trailing whitespace.**
- **Use consistent indentation:** 2 spaces for Dart, 2 spaces for TypeScript.
- **No more than 3 blank lines** between code sections.
- **End files with a newline.**

### 7.8 Comments

- **No code comments explaining "what"** — the code should be self-explanatory.
- **Use comments only for "why"** — explain business logic, workarounds, and non-obvious decisions.
- **Use `///` for documentation comments** on public APIs (Dart).
- **Use `/** */` for documentation comments** on public APIs (TypeScript).
- **Document all public methods** with parameter descriptions and return values.
- **Use `TODO(username): description`** format for TODOs (with linked issue).
- **Never comment out code.** Delete it. Use version control.

### 7.9 Technical Debt

- **Track all technical debt** in the issue tracker. Never leave undocumented.
- **Limit tech debt per PR.** If a PR introduces tech debt, create a follow-up issue.
- **Pay down tech debt regularly.** Allocate 20% of sprint capacity to tech debt.
- **Never let tech debt block feature development.** If it does, prioritize fixing it.

---

## 8. Testing Rules (QA)

### 8.1 Test Types & Coverage

| Type | Coverage Target | Tools | When |
|------|----------------|-------|------|
| Unit Tests | 80%+ for business logic | `test`, `bloc_test`, `mockito` | Every BLoC, Service, Repository |
| Widget Tests | Key screens and components | `flutter_test` | Every screen |
| Integration Tests | Critical user flows | `integration_test` | Auth, Cart, Checkout, Orders |
| API Tests | All endpoints | `supertest`, Jest | Every controller |
| E2E Tests | Full user journeys | `puppeteer`, `cypress` | Critical paths |
| Performance Tests | Load handling | `k6`, `artillery` | Before production launch |
| Security Tests | Vulnerability scan | `OWASP ZAP`, `npm audit` | Monthly |

### 8.2 Unit Test Rules

- **Test file must be next to the source file:** `product_bloc.dart` → `product_bloc_test.dart`.
- **One test file per class.** `ProductBlocTest`, `CartServiceTest`, etc.
- **Use `bloc_test` package for BLoC testing.** Never test BLoCs manually.
- **Mock all external dependencies.** Use `mockito` or `mocktail`.
- **Test all possible states:** Initial, Loading, Loaded, Error.
- **Test error scenarios:** Network error, server error, empty data, unauthorized.
- **Test edge cases:** Empty lists, null values, boundary values, concurrent operations.
- **Use descriptive test names:** `test('should emit error state when server returns 500')`.
- **Follow AAA pattern:** Arrange, Act, Assert.
- **One assertion per test** when possible. Each test should verify one behavior.
- **Test both success and failure paths.** Never skip error scenarios.
- **Mock at the boundary.** Mock repositories, not internal services.

### 8.3 Widget Test Rules

- **Test widget rendering.** Verify all expected widgets are present.
- **Test user interactions.** Tap buttons, enter text, scroll, swipe.
- **Test navigation.** Verify screen transitions happen correctly.
- **Use `pumpWidget` with `MaterialApp` wrapper.** All widgets need a MaterialApp ancestor.
- **Use `find.byType()`, `find.byKey()`, `find.text()`** for widget selection.
- **Verify state changes.** After interaction, verify the UI updates correctly.
- **Test accessibility.** Verify semantic labels and roles.
- **Test responsive layouts.** Verify widgets render correctly at different screen sizes.
- **Use `pumpAndSettle()`** for animations and async operations.
- **Never test implementation details.** Test behavior, not internal state.

### 8.4 API Test Rules

- **Test every endpoint.** Both success and error paths.
- **Test authentication.** Verify protected endpoints reject unauthenticated requests.
- **Test tenant isolation.** Verify cross-tenant data access is blocked.
- **Test validation.** Verify invalid input is rejected with proper error messages.
- **Test pagination.** Verify page/limit parameters work correctly.
- **Use `supertest` for HTTP testing in NestJS.**
- **Test rate limiting.** Verify rate limits are enforced.
- **Test CORS.** Verify cross-origin requests are handled correctly.
- **Use test database.** Never run tests against production database.
- **Clean up test data** after each test. Use transactions with rollback.

### 8.5 Integration Test Rules

- **Test complete user flows.** Login → Browse → Add to Cart → Checkout → Order.
- **Test critical paths first.** Authentication, payment, order creation.
- **Use real dependencies** where possible (test database, mock external services).
- **Test error recovery.** What happens when a step fails mid-flow?
- **Test state persistence.** Does the cart survive app restart?
- **Test deep linking.** Can users navigate directly to a screen?

### 8.6 E2E Test Rules

- **Test on real devices** or emulators/simulators.
- **Test both platforms** (Android and iOS).
- **Test different screen sizes** (phone, tablet).
- **Test with slow network** conditions.
- **Test with background/foreground transitions.**
- **Use `integration_test` package** for Flutter E2E tests.

### 8.7 Performance Test Rules

- **Measure app startup time.** Target: < 2 seconds on mid-range devices.
- **Measure frame rendering time.** Target: < 16ms (60fps).
- **Measure memory usage.** Target: < 200MB for normal usage.
- **Measure API response times.** Target: < 200ms for read, < 500ms for write.
- **Load test critical endpoints.** Target: 100 concurrent users.
- **Monitor for memory leaks** in long sessions (30+ minutes).

### 8.8 Security Test Rules

- **Test SQL injection.** Verify all inputs are parameterized.
- **Test XSS attacks.** Verify user input is sanitized.
- **Test CSRF.** Verify CSRF tokens are validated.
- **Test authentication bypass.** Verify protected endpoints require valid tokens.
- **Test tenant isolation.** Verify cross-tenant data access is blocked.
- **Test rate limiting.** Verify brute force attacks are mitigated.
- **Run `npm audit`** regularly. Fix all high/critical vulnerabilities.

### 8.9 Test Data Management

- **Use factories/builders** for test data creation. Never hardcode test data.
- **Use UUID-based test data** to avoid conflicts.
- **Reset test database** before each test suite.
- **Use transactions with rollback** for test isolation.
- **Never use production data** in tests.
- **Create realistic test data** that covers edge cases.

### 8.10 Test Documentation

- **Document test strategy** in each module's README.
- **Comment complex test setups.** Explain why specific mocks are needed.
- **Keep test code clean** as production code. Tests are code too.
- **Review test code** in PRs. Bad tests are worse than no tests.

---

## 9. Security Rules

### 9.1 Authentication

- **Never store passwords in plain text.** Always hash with bcrypt (12+ rounds).
- **Never log sensitive data.** No passwords, tokens, credit cards, or PII in logs.
- **Implement rate limiting** on auth endpoints. Max 5 login attempts per minute.
- **Implement account lockout** after 5 failed login attempts. Lock for 15 minutes.
- **Use short-lived access tokens** (15 minutes). Implement refresh token rotation.
- **Validate JWT on every request.** Never trust client-side auth state alone.
- **Use strong JWT secrets.** Minimum 256 bits, randomly generated.
- **Implement token blacklisting** for logout. Use Redis for blacklist storage.
- **Use HTTPS everywhere.** Never allow HTTP for API communication.
- **Implement session management.** Allow users to view and revoke active sessions.

### 9.2 Authorization

- **Implement role-based access control (RBAC).** Define roles: customer, vendor, driver, admin, super_admin.
- **Check authorization at the service level.** Never rely only on controller guards.
- **Validate ownership** before allowing resource modification. Users can only modify their own data.
- **Use principle of least privilege.** Grant minimum required permissions.
- **Audit authorization decisions.** Log all access control events.

### 9.3 Data Protection

- **Never return `password_hash` in API responses.** Always sanitize user objects.
- **Never expose `fcm_token` in API responses.** This is server-only data.
- **Sanitize all user input.** Prevent XSS and SQL injection.
- **Use parameterized queries.** Never concatenate user input into SQL strings.
- **Encrypt sensitive data at rest.** Credit cards, SSNs, etc. Use AES-256.
- **Use HTTPS in production.** Never allow HTTP for API communication.
- **Implement data masking** for sensitive fields in logs.
- **Use secure headers.** `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Strict-Transport-Security`.
- **Implement data retention policies.** Delete old data automatically.

### 9.4 Multi-Tenant Security

- **Every query must include `tenant_id` filter.** This is non-negotiable.
- **Never trust the client to provide tenant_id in the body.** Always read it from the middleware/interceptor.
- **Test cross-tenant access** in every integration test.
- **Use Row-Level Security (RLS)** in PostgreSQL as a second line of defense.
- **Isolate tenant data** at the database level. Consider separate schemas for high-security tenants.
- **Audit cross-tenant access attempts.** Log and alert on any violations.

### 9.5 API Security

- **Validate Content-Type** on all requests.
- **Limit request body size.** Max 10MB for general requests, 50MB for file uploads.
- **Implement CORS properly.** Never use `origin: '*'` in production. Whitelist specific origins.
- **Use Helmet middleware** for HTTP security headers.
- **Sanitize error messages.** Never return stack traces or internal paths to the client.
- **Implement request signing** for critical operations (payments, webhooks).
- **Validate webhook signatures** from external services.
- **Use API keys** for service-to-service communication. Rotate keys regularly.

### 9.6 OWASP Top 10 Mitigation

| Risk | Mitigation |
|------|-----------|
| A01: Broken Access Control | RBAC + tenant isolation + ownership validation |
| A02: Cryptographic Failures | bcrypt, AES-256, HTTPS, secure key management |
| A03: Injection | Parameterized queries, input validation, ORM |
| A04: Insecure Design | Threat modeling, security reviews, defense in depth |
| A05: Security Misconfiguration | Hardened defaults, minimal attack surface, regular audits |
| A06: Vulnerable Components | Regular `npm audit`, dependency updates |
| A07: Auth Failures | Rate limiting, account lockout, MFA |
| A08: Data Integrity Failures | Input validation, serialization, code signing |
| A09: Logging Failures | Comprehensive logging, monitoring, alerting |
| A10: SSRF | Input validation, allowlisting, network segmentation |

### 9.7 Secret Management

- **Never commit secrets to version control.** Use `.env` files (gitignored) and secret managers.
- **Use environment variables** for all configuration.
- **Rotate secrets regularly.** JWT keys, API keys, database passwords.
- **Use a secrets manager** in production (AWS Secrets Manager, HashiCorp Vault).
- **Never log secrets.** Mask them in all log output.
- **Use different secrets** for development, staging, and production.

### 9.8 Dependency Security

- **Run `npm audit` / `dart pub outdated`** before every deployment.
- **Fix all high and critical vulnerabilities** immediately.
- **Pin dependency versions** in `package.json` / `pubspec.yaml`.
- **Use lock files** (`package-lock.json`, `pubspec.lock`) for reproducible builds.
- **Review new dependencies** before adding. Check for known vulnerabilities.
- **Remove unused dependencies** regularly.

---

## 10. Performance Rules

### 10.1 Flutter Performance

- **Use `const` constructors everywhere.** This is the #1 performance optimization.
- **Use `ListView.builder` for all lists.** Never `ListView(children: [...])` for dynamic data.
- **Use `RepaintBoundary`** for complex widgets that rarely change.
- **Avoid `setState` in large widgets.** Use BLoC for state management.
- **Use `AutomaticKeepAliveClientMixin`** for tabs that should preserve state.
- **Lazy load images.** Use `CachedNetworkImage` with proper cache configuration.
- **Minimize widget rebuilds.** Use `const`, `Equatable`, and proper BLoC `buildWhen`.
- **Profile with DevTools.** Check for jank, memory leaks, and unnecessary rebuilds.
- **Use `compute()`** for heavy computations. Never block the UI thread.
- **Use `Isolate`** for CPU-intensive operations (image processing, data parsing).
- **Minimize widget depth.** Flat widget trees are faster than deep ones.
- **Use `Sliver` variants** for custom scroll views. Never nest `ListView` inside `SingleChildScrollView`.
- **Cache expensive computations** with `memoize` pattern.
- **Use `itemExtent`** in `ListView` when all items have the same height.
- **Use `addAutomaticKeepAlives: false`** in `ListView.builder` when keep-alive is not needed.

### 10.2 Backend Performance

- **Use database indexes** on all frequently queried columns.
- **Paginate all list queries.** Never return more than 100 items at once.
- **Use `select()` to limit returned columns.** Never `SELECT *`.
- **Use connection pooling.** Configure TypeORM pool size appropriately.
- **Implement caching** for frequently accessed, rarely changed data (categories, brands).
- **Use `Promise.all` for independent async operations.** Avoid sequential awaits when possible.
- **Compress responses.** Enable gzip compression in NestJS.
- **Use `@nestjs/throttler`** for rate limiting.
- **Implement response caching** with `CacheInterceptor`.
- **Use `class-transformer` with `excludeExtraneousValues`** to limit response size.
- **Batch database operations.** Use `save()` with arrays instead of individual saves.
- **Use `QueryBuilder`** for complex queries instead of ORM relation loading.

### 10.3 Database Performance

- **Add indexes on foreign keys.** TypeORM does this automatically for `@ManyToOne`.
- **Add composite indexes** for frequently combined query filters.
- **Use `EXPLAIN ANALYZE`** to verify query performance.
- **Avoid N+1 queries.** Use `QueryBuilder` with `leftJoinAndSelect` instead of lazy loading.
- **Use bulk operations** for batch inserts/updates. Never loop individual inserts.
- **Implement connection pooling.** Never open/close connections per request.
- **Use `SELECT ... FOR UPDATE`** for concurrent updates to prevent race conditions.
- **Implement query result caching** for expensive queries.
- **Monitor slow queries.** Log queries taking > 100ms.
- **Use database explain plans** to optimize query execution.

### 10.4 Network Performance

- **Enable HTTP/2** for backend services.
- **Implement response compression** (gzip/brotli).
- **Use CDN** for static assets and images.
- **Minimize API response sizes.** Use field selection and pagination.
- **Implement request deduplication** on the client.
- **Use connection pooling** for HTTP clients.
- **Set appropriate timeouts** for all network requests.
- **Implement retry with exponential backoff** for failed requests.

### 10.5 Memory Management

- **Dispose all controllers, subscriptions, and streams** in Flutter.
- **Close all database connections** on application shutdown.
- **Implement cache eviction** for in-memory caches.
- **Monitor memory usage** in production.
- **Set memory limits** for Node.js process (`--max-old-space-size`).
- **Use weak references** for cache entries.

---

## 11. Git & Version Control Rules

### 11.1 Branch Strategy

- `main` — Production-ready code. Never push directly. Protected branch.
- `develop` — Integration branch. All features merge here first.
- `feature/*` — Feature branches. One feature per branch.
- `fix/*` — Bug fix branches.
- `hotfix/*` — Emergency production fixes.
- `release/*` — Release preparation branches.

### 11.2 Branch Naming

- `feature/cart-checkout-flow`
- `fix/login-validation-error`
- `hotfix/payment-timeout`
- `refactor/order-service`
- `docs/api-documentation`
- `test/cart-bloc-tests`

### 11.3 Commit Messages

- **Use Conventional Commits format:**
  ```
  type(scope): description

  [optional body]

  [optional footer]
  ```
- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`
- **Scope:** Module or feature name (e.g., `cart`, `auth`, `orders`)
- **Description:** Imperative mood, lowercase, no period, max 72 chars
- **Body:** Explain what and why, not how. Wrap at 72 chars.
- **Footer:** Reference issues: `Closes #123`, `Fixes #456`
- **Examples:**
  - `feat(cart): add coupon validation`
  - `fix(orders): resolve stock decrement race condition`
  - `docs(api): update Swagger documentation for orders`
  - `perf(products): add index on category_id for faster queries`

### 11.4 Pull Request Rules

- **One feature per PR.** Never mix unrelated changes.
- **PR title must match commit format.**
- **Description must explain what and why, not how.**
- **All tests must pass before merge.**
- **Code review required before merge.** Minimum 1 approval.
- **No force pushes to `main` or `develop`.**
- **Resolve all review comments** before merging.
- **Update documentation** if API or behavior changes.
- **Add screenshots/videos** for UI changes.
- **Link related issues** in PR description.

### 11.5 Code Review

- **Review within 24 hours.** Don't block team progress.
- **Check for logic errors,** not just style (use linters for style).
- **Verify test coverage** for new functionality.
- **Check for security issues** (hardcoded secrets, SQL injection, etc.).
- **Verify documentation** is updated.
- **Be constructive.** Suggest improvements, not just problems.
- **Approve when satisfied.** Don't nitpick on minor style issues.

---

## 12. Documentation Rules

### 12.1 Code Documentation

- **Every module must have a README.md** explaining its purpose, structure, and usage.
- **Every API endpoint must have Swagger documentation.** No undocumented endpoints.
- **Every entity must have column descriptions** via `@Column({ comment: '...' })`.
- **Document all public methods** with JSDoc (TypeScript) or `///` (Dart).
- **No code comments explaining "what"** — the code should be self-explanatory.
- **Use comments only for "why"** — explain business logic, workarounds, and non-obvious decisions.

### 12.2 Project Documentation

- **Update `design.md`** when adding new screens or changing design tokens.
- **Update `phases/*.md`** when completing phase tasks.
- **Maintain `system_explain.md`** with architecture overview.
- **Document all environment variables** in `.env.example`.
- **Document all API endpoints** in Swagger/OpenAPI.
- **Keep `README.md` updated** with setup instructions, architecture, and contribution guidelines.

### 12.3 API Documentation

- **Use Swagger/OpenAPI** for all API documentation.
- **Document every endpoint** with request/response examples.
- **Document all error codes** and their meanings.
- **Provide code examples** for common operations.
- **Keep documentation in sync** with code changes.

---

## 13. Design System Compliance

- **All UI must reference `design.md` tokens.** No inline colors, fonts, or spacing. Enforced by `design.lock`.
- **No modifications to `design.md` without Hallmark audit.** Run `hallmark audit` before changes.
- **New screens must pick from the macrostructure catalog.** No ad-hoc layouts.
- **58-gate slop test must pass** before marking any design task complete.
- **Currency format:** `ج.م` (EGP) — never use `$` or `USD`.
- **RTL support is mandatory.** All layouts must work in Arabic RTL direction.
- **Font: Cairo** — use throughout the app. No other fonts.
- **All interactive elements must have minimum 44x44 touch target** (WCAG 2.1).
- **Color contrast must meet WCAG AA** (4.5:1 for normal text, 3:1 for large text).
- **All images must have `altText`** for accessibility.
- **All form fields must have labels** (visible or semantic).
- **Use consistent spacing scale:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
- **Use consistent border radius scale:** 4, 8, 12, 16, 24, 999 (pill).
- **Use consistent shadow scale:** elevation 1, 2, 4, 8, 16.

---

## 14. Multi-Tenancy Rules

- **Every entity must have `tenant_id`.** No exceptions.
- **Every query must filter by `tenant_id`.** Enforced by middleware + service-level checks.
- **Never share data between tenants.** This is the #1 security rule.
- **Test cross-tenant isolation** in every integration test.
- **Use Row-Level Security** as a defense-in-depth measure.
- **Tenant context is set via `X-Tenant-ID` header.** Never from the request body.
- **Default tenant for development:** Use the seeded demo tenant ID.
- **Never expose tenant_id in client-side code** unless necessary for API calls.
- **Validate tenant exists** before processing requests.
- **Implement tenant-specific configuration** (name, branding, settings).
- **Log tenant_id in all audit logs** for traceability.

---

## 15. Error Handling Rules

### 15.1 Frontend (Flutter)

- **Every API call must handle errors.** Use `try-catch` or `Either.fold`.
- **Show user-friendly error messages.** Never show raw error codes or stack traces.
- **Implement retry mechanisms** for network errors. Show "Retry" button.
- **Handle empty states gracefully.** Show appropriate illustrations and messages.
- **Handle loading states.** Show shimmer/skeleton during async operations.
- **Never crash the app.** Catch all exceptions and show fallback UI.
- **Implement global error handler** with `FlutterError.onError` and `runZonedGuarded`.
- **Log errors** to a crash reporting service (Firebase Crashlytics, Sentry).
- **Handle network connectivity changes.** Show offline indicator when no connection.
- **Implement timeout handling** for all network requests.

### 15.2 Backend (NestJS)

- **Use NestJS exception classes.** `NotFoundException`, `BadRequestException`, `ConflictException`, etc.
- **Never throw raw `Error` objects.** Always use HTTP exceptions.
- **Provide meaningful error messages.** "Product not found" not "Error".
- **Log all errors** with context (user ID, tenant ID, request ID, stack trace).
- **Never expose internal errors to clients.** Return safe messages, log the details.
- **Use the global exception filter** for consistent error responses.
- **Implement error codes** for client-side error handling.
- **Handle database constraint violations** gracefully.
- **Use `@Catch()` decorator** for custom exception filters when needed.
- **Implement circuit breaker** for external service calls.

### 15.3 Error Codes

| Code | HTTP Status | Description |
|------|------------|-------------|
| `AUTH_INVALID_CREDENTIALS` | 401 | Email or password is incorrect |
| `AUTH_TOKEN_EXPIRED` | 401 | Access token has expired |
| `AUTH_ACCOUNT_LOCKED` | 423 | Account is temporarily locked |
| `AUTH_INSUFFICIENT_PERMISSIONS` | 403 | User lacks required role |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource does not exist |
| `RESOURCE_ALREADY_EXISTS` | 409 | Resource already exists (duplicate) |
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `TENANT_NOT_FOUND` | 404 | Invalid tenant ID |
| `TENANT_ACCESS_DENIED` | 403 | Cross-tenant access attempted |
| `PAYMENT_FAILED` | 422 | Payment processing failed |
| `INSUFFICIENT_STOCK` | 422 | Product out of stock |
| `COUPON_INVALID` | 400 | Coupon code is invalid or expired |
| `ORDER_CANNOT_CANCEL` | 422 | Order cannot be cancelled in current status |

---

## 16. Accessibility (a11y) Rules

### 16.1 General

- **Follow WCAG 2.1 AA guidelines.** This is the minimum standard.
- **Test with screen readers** (VoiceOver on iOS, TalkBack on Android).
- **All interactive elements must be reachable** via keyboard/accessibility navigation.
- **Provide alternatives** for non-text content (images, icons, animations).
- **Never rely solely on color** to convey information. Use icons, text, or patterns.

### 16.2 Flutter Accessibility

- **Use `Semantics` widget** for custom widgets that need screen reader labels.
- **Set `semanticLabel`** on all `Image` widgets. Describe the image content.
- **Set `semanticLabel`** on all `Icon` widgets. Describe the icon meaning.
- **Use `ExcludeSemantics`** for decorative images and redundant content.
- **Wrap interactive widgets** in `Semantics` with `button: true`, `tapAction`, etc.
- **Use `MergeSemantics`** to combine related semantics nodes.
- **Test with `SemanticsDebugger`** during development.
- **Ensure all text meets contrast ratio** (4.5:1 minimum).
- **Use `MediaQuery.textScaleFactor`** to respect user text size preferences.
- **Provide `tooltip`** for icon-only buttons.

### 16.3 Touch Targets

- **Minimum touch target: 44x44 logical pixels** (iOS) / 48x48 dp (Android).
- **Add padding** around small interactive elements to meet minimum size.
- **Ensure adequate spacing** between interactive elements (minimum 8dp).
- **Test on small screens** to verify touch targets are usable.

### 16.4 Color & Contrast

- **Normal text:** Minimum 4.5:1 contrast ratio against background.
- **Large text (18pt+ or 14pt+ bold):** Minimum 3:1 contrast ratio.
- **Interactive elements:** Minimum 3:1 contrast ratio against adjacent colors.
- **Focus indicators:** Minimum 3:1 contrast ratio against background.
- **Never use color alone** to convey status. Add icons or text labels.

### 16.5 Motion & Animation

- **Respect `MediaQuery.disableAnimations`** for users who prefer reduced motion.
- **Provide alternatives** to auto-playing animations.
- **Use `AnimatedOpacity` or `AnimatedSize`** for subtle transitions.
- **Avoid flashing content** (3+ flashes per second can trigger seizures).
- **Allow users to pause/stop** any auto-playing content.

### 16.6 Forms

- **Associate labels with form fields** using `Semantics` or `Label` widget.
- **Provide clear error messages** that describe how to fix the issue.
- **Indicate required fields** with both visual and semantic markers.
- **Group related fields** using `Semantics` containers.
- **Support autofill** with proper `autofillHints`.

---

## 17. Internationalization (i18n) Rules

### 17.1 RTL Support

- **All layouts must work in Arabic RTL direction.** This is a core requirement.
- **Use `Directionality` widget** when you need to force a specific direction.
- **Use `TextDirection` parameter** in all text-related widgets.
- **Test all screens** in RTL mode before merge.
- **Use `EdgeInsets.symmetric`** instead of `EdgeInsets.only(left/right)` to support both directions.
- **Use `AlignmentDirectional`** instead of `Alignment.centerLeft/centerRight`.
- **Mirror icons** that indicate direction (arrows, chevrons) in RTL.

### 17.2 String Externalization

- **Never hardcode user-facing strings** in widgets. Extract to a strings file.
- **Use a localization package** (`flutter_localizations`, `intl`).
- **Support Arabic (ar) as primary language.**
- **Support English (en) as fallback language.**
- **Use `ARB` format** for translation files.
- **Use ICU message format** for plurals and gender.
- **Test string overflow** with longer translations (German, Arabic).

### 17.3 Date & Time Formatting

- **Use `DateFormat` from `intl` package** for date formatting.
- **Respect locale** for date/time display order.
- **Use `Intl.DateTimeFormat`** for consistent formatting across platforms.
- **Support both 12-hour and 24-hour** time formats based on locale.
- **Use relative time** ("2 hours ago") for recent events.

### 17.4 Number Formatting

- **Use `NumberFormat` from `intl` package** for number formatting.
- **Respect locale** for decimal separators (1,234.56 vs 1.234,56).
- **Use `NumberFormat.currency`** for currency display with proper symbol.
- **Format EGP as `ج.م 1,234.56`** — never `$1,234.56`.
- **Use `NumberFormat.compact`** for large numbers (1.2K, 1.3M).

### 17.5 Pluralization & Gender

- **Use ICU message format** for pluralization:
  ```
  {count, plural, =0{No items} one{1 item} other{{count} items}}
  ```
- **Handle gender** where applicable in Arabic.
- **Test pluralization** with edge cases (0, 1, 2, 100, 1000).

---

## 18. Responsive Design Rules

### 18.1 Breakpoints

| Breakpoint | Width | Device |
|-----------|-------|--------|
| xs | 0-359 | Small phones |
| sm | 360-599 | Standard phones |
| md | 600-959 | Large phones / small tablets |
| lg | 960-1279 | Tablets |
| xl | 1280+ | Desktop / large tablets |

### 18.2 Layout Rules

- **Use `LayoutBuilder`** for responsive layouts within a widget.
- **Use `MediaQuery.of(context).size.width`** for screen-level responsiveness.
- **Never hardcode pixel values** for widths/heights that should be responsive.
- **Use `Flexible` and `Expanded`** for flexible layouts.
- **Use `Wrap`** for layouts that should flow to the next line.
- **Use `GridView` with `CrossAxisCount.fromWidth()`** for responsive grids.
- **Test on all breakpoints** before merge.

### 18.3 Adaptive Layouts

- **Phone:** Single column, bottom navigation, stacked layouts.
- **Tablet:** Two-column layouts, side navigation, expanded cards.
- **Desktop:** Multi-column layouts, sidebar navigation, detailed views.
- **Use `Navigator` for phone, `Router` for tablet/desktop** (adaptive navigation).
- **Show/hide elements** based on available space, not just screen size.

### 18.4 Orientation

- **Support both portrait and landscape** orientations.
- **Use `OrientationBuilder`** to adapt layouts.
- **Never lock orientation** unless absolutely necessary (camera, games).
- **Test in both orientations** before merge.

### 18.5 Safe Area

- **Always use `SafeArea`** for screens with interactive content.
- **Handle notch and camera cutouts** properly.
- **Use `MediaQuery.of(context).viewPadding`** for custom safe areas.
- **Never overlap with system UI** (status bar, navigation bar).

---

## 19. Animation Rules

### 19.1 Implicit Animations

- **Use `AnimatedContainer`** for animating size, color, padding, margin.
- **Use `AnimatedOpacity`** for fade transitions.
- **Use `AnimatedPositioned`** for position changes in `Stack`.
- **Use `AnimatedSwitcher`** for cross-fade between widgets.
- **Use `TweenAnimationBuilder`** for custom implicit animations.
- **Set appropriate `duration`** (200-350ms for UI, 500-1000ms for page transitions).

### 19.2 Explicit Animations

- **Use `AnimationController`** for complex, controllable animations.
- **Always `dispose` AnimationControllers** in widget's `dispose` method.
- **Use `TickerProviderStateMixin`** or `SingleTickerProviderStateMixin`** for AnimationController.
- **Use `CurvedAnimation`** for natural-feeling motion. Default: `Curves.easeInOut`.
- **Avoid `vsync: this`** in `AnimationController` — use `TickerProviderStateMixin` instead.

### 19.3 Lottie Animations

- **Use Lottie for complex animations** (loading, success, error states).
- **Prefer Lottie over manual AnimationController** for standard animations.
- **Use `Lottie.asset()`** for local assets.
- **Set `repeat: true`** for loading animations.
- **Set `repeat: false`** for one-shot animations (success, error).
- **Provide `errorBuilder`** for failed Lottie loads.

### 19.4 Hero Animations

- **Use `Hero` widget** for shared element transitions between screens.
- **Use consistent `tag`** across source and destination widgets.
- **Never use `Hero` with dynamic tags** without proper wrapping.
- **Test Hero animations** on both platforms.

### 19.5 Page Transitions

- **Use `PageRouteBuilder`** for custom page transitions.
- **Default transition:** `FadeTransition` for forward, `FadeTransition` for back.
- **Use `SlideTransition`** for horizontal navigation.
- **Set `transitionDuration`** to 300ms for standard transitions.
- **Match platform conventions:** slide from right on iOS, fade on Android.

### 19.6 Performance

- **Avoid animations during build.** Start animations in `initState` or with controllers.
- **Use `RepaintBoundary`** around animated widgets.
- **Profile animations with DevTools.** Target: consistent 60fps.
- **Avoid animating large widgets.** Animate only the changing parts.
- **Use `Transform` instead of position/size animation** when possible (GPU-accelerated).

---

## 20. Logging & Monitoring Rules

### 20.1 Logging Standards

- **Use structured logging** with consistent format: `[LEVEL] [timestamp] [context] message`.
- **Log levels:**
  - `ERROR` — System errors, exceptions, failures
  - `WARN` — Unexpected conditions, degraded performance
  - `INFO` — Significant events, business operations
  - `DEBUG` — Debugging information (development only)
- **Never log sensitive data.** Mask passwords, tokens, credit cards, PII.
- **Include context** in all logs: user ID, tenant ID, request ID.
- **Use correlation IDs** to trace requests across services.
- **Log to stdout/stderr** in containers. Use log aggregation services.

### 20.2 Frontend Logging

- **Use `debugPrint()`** instead of `print()` in Flutter.
- **Implement a logging service** with levels and destinations.
- **Log critical errors** to crash reporting (Firebase Crashlytics, Sentry).
- **Log user actions** for analytics (screen views, button taps).
- **Never log in production** except for errors and analytics.
- **Use `FlutterError.onError`** for uncaught Flutter errors.
- **Use `runZonedGuarded`** for uncaught Dart errors.

### 20.3 Backend Logging

- **Use NestJS `Logger` service** for all logging.
- **Inject Logger** with context in every service and controller.
- **Log HTTP requests** with method, path, status, duration.
- **Log database queries** in debug mode.
- **Log external service calls** with request/response.
- **Log security events:** failed logins, unauthorized access, tenant violations.
- **Use Winston or Pino** for production logging with JSON format.

### 20.4 Monitoring & Alerting

- **Monitor API response times.** Alert if > 500ms average.
- **Monitor error rates.** Alert if > 1% of requests fail.
- **Monitor database connection pool.** Alert if > 80% utilized.
- **Monitor memory usage.** Alert if > 80% of available memory.
- **Monitor disk usage.** Alert if > 80% full.
- **Monitor queue lengths.** Alert if jobs are backing up.
- **Implement health check endpoints** for load balancers.
- **Use APM tools** (New Relic, Datadog, or Sentry) for distributed tracing.

### 20.5 Metrics

- **Track request count** per endpoint.
- **Track response time** per endpoint (p50, p95, p99).
- **Track error rate** per endpoint.
- **Track active users** per tenant.
- **Track feature usage** for product analytics.
- **Track business metrics:** orders/day, revenue, conversion rate.
- **Use Prometheus or similar** for metrics collection.
- **Create dashboards** for real-time visibility.

---

## 21. Configuration Management Rules

### 21.1 Environment Variables

- **All configuration must be environment-specific.** Never hardcode values.
- **Use `.env` files** for local development. Never commit `.env`.
- **Provide `.env.example`** with all required variables documented.
- **Use `@nestjs/config`** for backend configuration.
- **Use `--dart-define`** for Flutter build-time configuration.
- **Validate all environment variables** at startup. Fail fast on missing values.

### 21.2 Environment-Specific Config

| Variable | Development | Staging | Production |
|----------|------------|---------|------------|
| `DATABASE_URL` | localhost:5432/nova_dev | staging-db-url | production-db-url |
| `JWT_SECRET` | dev-secret | staging-secret | production-secret |
| `CORS_ORIGINS` | `*` | staging-domain | production-domain |
| `LOG_LEVEL` | debug | info | warn |
| `NODE_ENV` | development | staging | production |

### 21.3 Feature Flags

- **Use feature flags** for gradual rollouts and A/B testing.
- **Store feature flags** in database or dedicated service (LaunchDarkly, Firebase Remote Config).
- **Default flags to disabled** for safety.
- **Remove old feature flags** after full rollout.
- **Document all active feature flags** with purpose and owner.

### 21.4 Secrets Management

- **Never commit secrets** to version control.
- **Use environment variables** for all secrets.
- **Use a secrets manager** in production (AWS Secrets Manager, HashiCorp Vault).
- **Rotate secrets regularly.** JWT keys quarterly, API keys monthly.
- **Audit secret access.** Log who reads secrets and when.
- **Use different secrets** per environment.

### 21.5 Dynamic Design System (Backend-Driven UI)

All Flutter apps in the NOVA system MUST read UI configuration from the backend. This ensures any visual, text, or feature change can be made server-side without app updates.

#### Backend

- **`/api/v1/app-config`** endpoint returns tenant-specific config: `store`, `branding`, `auth`, `texts`, `features`
- Config is stored in the `stores` table `configurations` and `branding` JSONB columns
- No separate config table needed — it's part of the tenant store entity

#### Flutter

- **`AppConfigRepository`** — fetches + caches config from `/api/v1/app-config`
- **`AppConfigCubit`** — provides config globally via `BlocProvider` at app root
- **All screens** read config via `BlocBuilder<AppConfigCubit, AppConfigState>`

#### Rules

| Rule | Description |
|------|-------------|
| **D1** | Every Flutter app MUST fetch `/api/v1/app-config` on startup |
| **D2** | All user-facing texts MUST come from `texts.*` config fields — no hardcoded strings |
| **D3** | All brand colors MUST come from `branding.*` config fields — parse hex to Color |
| **D4** | All feature toggles MUST come from `auth.*` / `features.*` config booleans |
| **D5** | Changing config in backend MUST reflect in app without code changes or rebuild |
| **D6** | `AppConfigRepository` MUST cache config; only refresh on explicit `forceRefresh` |
| **D7** | Password rules (`password_min_length`, patterns) MUST come from backend `auth.*` config |
| **D8** | Social login buttons MUST be conditionally shown/hidden based on `auth.*_enabled` flags |
| **D9** | Logo/branding images MUST use `branding.logo_url` with fallback to default icon |
| **D10** | All apps in the system (Customer, Admin, Driver, Vendor) MUST follow this same pattern |

---

## 22. DevOps & CI/CD Rules

### 22.1 CI/CD Pipeline

- **Automate everything.** Build, test, lint, deploy — all automated.
- **Run all tests** on every PR. No merge without passing tests.
- **Run linting** on every PR. No merge with lint errors.
- **Run type checking** on every PR. No merge with type errors.
- **Build Docker images** on merge to `develop`.
- **Deploy to staging** automatically on merge to `develop`.
- **Deploy to production** manually after QA approval.

### 22.2 Pipeline Stages

```
PR Created → Lint → Type Check → Unit Tests → Build → Integration Tests → Review → Merge
Merge to develop → Build Docker → Deploy to Staging → E2E Tests → Smoke Tests
Release → Build Docker → Deploy to Production → Health Check → Monitor
```

### 22.3 Docker

- **Use multi-stage builds** for smaller images.
- **Use official base images** (node:18-alpine, flutter:stable).
- **Never run as root** in containers.
- **Use `.dockerignore`** to exclude unnecessary files.
- **Set `NODE_ENV=production`** in production containers.
- **Use health checks** in Docker Compose and Kubernetes.
- **Minimize image layers** by combining RUN commands.
- **Use specific image tags** — never `latest` in production.

### 22.4 Deployment

- **Use blue-green deployment** for zero-downtime releases.
- **Implement rollback capability** for every deployment.
- **Run health checks** after deployment.
- **Monitor error rates** after deployment.
- **Have a rollback plan** before every deployment.
- **Deploy during low-traffic hours.**
- **Notify team** before and after deployments.

### 22.5 Infrastructure as Code

- **Use Terraform or Pulumi** for infrastructure management.
- **Version control all infrastructure** code.
- **Review infrastructure changes** like application code.
- **Test infrastructure changes** in staging first.
- **Document infrastructure** architecture and decisions.

---

## 23. Code Quality & Linting Rules

### 23.1 Flutter Linting

- **Use `analysis_options.yaml`** with strict rules.
- **Enable all lint rules** by default. Disable only with justification.
- **Required rules:**
  - `prefer_const_constructors`
  - `prefer_const_declarations`
  - `avoid_print`
  - `prefer_single_quotes`
  - `require_trailing_commas`
  - `prefer_relative_imports`
  - `avoid_unnecessary_containers`
  - `sized_box_for_whitespace`
  - `use_key_in_widget_constructors`
  - `prefer_final_locals`
  - `sort_child_properties_last`
  - `use_build_context_synchronously`
  - `no_leading_underscores_for_local_identifiers`

### 23.2 Backend Linting

- **Use `eslint`** with strict TypeScript rules.
- **Enable all recommended rules** by default.
- **Required rules:**
  - `@typescript-eslint/no-explicit-any`
  - `@typescript-eslint/no-unused-vars`
  - `@typescript-eslint/explicit-function-return-type`
  - `@typescript-eslint/explicit-module-boundary-types`
  - `no-console` (use NestJS Logger)
  - `prefer-const`
  - `no-var`
  - `eqeqeq`

### 23.3 Complexity Limits

- **Maximum function length:** 50 lines. If longer, extract helpers.
- **Maximum class length:** 500 lines. If longer, split into smaller classes.
- **Maximum file length:** 1000 lines. If longer, split into multiple files.
- **Maximum nesting depth:** 4 levels. If deeper, extract methods.
- **Maximum parameters per function:** 5. If more, use an options object/DTO.
- **Maximum lines per file:** 500. If longer, split.

### 23.4 Code Smells to Avoid

- **God class:** A class that does too many things. Split it.
- **Long parameter list:** Use an options object or builder pattern.
- **Duplicated code:** Extract to a shared utility.
- **Long method:** Extract to smaller methods.
- **Deep nesting:** Use early returns or extract methods.
- **Magic numbers/strings:** Extract to named constants.
- **Dead code:** Delete it immediately.
- **Feature envy:** Move the method to the class it operates on.
- **Data clumps:** Create a class to group related data.
- **Primitive obsession:** Use value objects instead of primitives.

### 23.5 Refactoring Rules

- **Refactor only when you understand the code fully.**
- **Refactor in small, incremental steps.** Never rewrite from scratch.
- **Keep tests passing** during refactoring.
- **Refactor in a separate PR** from feature work.
- **Document refactoring decisions** in PR description.
- **Never refactor and add features** in the same PR.

---

## 24. Code Review Checklist

### Flutter

- [ ] No hardcoded colors (uses NovaTheme tokens)
- [ ] No hardcoded text styles
- [ ] No hardcoded padding/spacing
- [ ] All images use CachedNetworkImage with placeholder and errorWidget
- [ ] All lists use ListView.builder / GridView.builder
- [ ] Const constructors used everywhere possible
- [ ] No print() statements
- [ ] No TODO comments without linked issue
- [ ] Error handling for all API calls
- [ ] Loading states for all async operations
- [ ] Empty states handled with appropriate UI
- [ ] RTL compatibility verified
- [ ] Accessibility: Semantics labels on interactive elements
- [ ] Touch targets meet minimum 44x44
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] No memory leaks (controllers, subscriptions disposed)
- [ ] Keyboard handling (no overlap with form fields)
- [ ] SafeArea used properly
- [ ] Responsive layout tested on multiple screen sizes
- [ ] Animation duration appropriate (200-350ms)
- [ ] All strings externalized (no hardcoded user-facing text)

### Backend

- [ ] All queries scoped by tenant_id
- [ ] DTOs with class-validator decorators on all fields
- [ ] Swagger decorators on all endpoints (@ApiTags, @ApiOperation, @ApiResponse)
- [ ] JwtAuthGuard on all protected routes
- [ ] @CurrentTenantId() on all tenant-scoped methods
- [ ] Proper HTTP status codes (201 for POST, 204 for DELETE)
- [ ] Error messages are user-friendly (no technical details exposed)
- [ ] No console.log() in production code (use Logger)
- [ ] No sensitive data in responses (password_hash, fcm_token)
- [ ] Pagination on all list endpoints
- [ ] Input validation on all endpoints
- [ ] Transactions for multi-step operations
- [ ] Error handling with proper exception classes
- [ ] Logging with context (user ID, tenant ID)
- [ ] No N+1 queries (use QueryBuilder with joins)
- [ ] Indexes on frequently queried columns

### General

- [ ] No dead code
- [ ] No code duplication
- [ ] Follows naming conventions
- [ ] All tests pass
- [ ] Documentation updated
- [ ] design.md compliance
- [ ] No security vulnerabilities
- [ ] Performance acceptable
- [ ] Error handling comprehensive
- [ ] Logging appropriate

---

## 25. Prohibited Practices

The following are **strictly prohibited** in this project:

### Code

1. ❌ `print()` statements in production code
2. ❌ `// TODO` comments without a linked issue
3. ❌ `any` type in TypeScript
4. ❌ `!` (bang operator) in Dart without null check guard
5. ❌ Hardcoded colors, URLs, or magic numbers
6. ❌ `Image.network()` — use CachedNetworkImage
7. ❌ `ListView(children: [...])` for dynamic data — use builder
8. ❌ `console.log()` in NestJS production code
9. ❌ Commented-out code
10. ❌ Dead code (unused functions, variables, imports)
11. ❌ Code duplication (same logic in 3+ places)
12. ❌ Nested ternary operators
13. ❌ `setTimeout` / `setInterval` for animations — use AnimationController
14. ❌ `setState` after `dispose` without `mounted` check

### Architecture

15. ❌ Business logic in controllers (NestJS)
16. ❌ UI logic in BLoCs
17. ❌ Direct database access from controllers
18. ❌ Circular dependencies between modules
19. ❌ God classes (doing too many things)
20. ❌ Global mutable state for navigation

### Security

21. ❌ Unscoped database queries (missing tenant_id filter)
22. ❌ Sensitive data in API responses (passwords, tokens)
23. ❌ Unvalidated input in API endpoints
24. ❌ Hardcoded secrets or credentials
25. ❌ `synchronize: true` in production database config
26. ❌ Passwords in plain text anywhere
27. ❌ SQL string concatenation
28. ❌ Missing CORS configuration
29. ❌ `origin: '*'` in production CORS

### Testing

30. ❌ Skipping tests in PRs
31. ❌ Testing implementation details instead of behavior
32. ❌ Using production database for tests
33. ❌ `sleep()` in tests (use pump/pumpAndSettle)
34. ❌ Test dependencies (tests depending on each other)

### Git

35. ❌ Direct push to `main` or `develop`
36. ❌ Force push to shared branches
37. ❌ Committing `.env` files
38. ❌ Committing node_modules or build artifacts
39. ❌ Mixing unrelated changes in one PR

---

## Enforcement

- **This file is enforced by the AI assistant.** Every code generation and modification must comply.
- **CI/CD pipeline** must run linting, formatting, and tests before merge.
- **Code review** must verify compliance with these rules.
- **Any violation** must be fixed before the code is merged.
- **Violations in production** must be tracked as technical debt and fixed within 2 sprints.

---

> **Last Updated:** 2026-08-31
> **Version:** 2.0
> **Maintained by:** NOVA Commerce Engineering Team
