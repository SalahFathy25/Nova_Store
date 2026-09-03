import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Store } from '../../modules/stores/store.entity.js';
import { User } from '../../modules/users/user.entity.js';
import { Category } from '../../modules/categories/category.entity.js';
import { Brand } from '../../modules/brands/brand.entity.js';
import { FeatureFlag } from '../../modules/feature-flags/feature-flag.entity.js';
import { Product } from '../../modules/products/product.entity.js';
import { ProductImage } from '../../modules/products/product-image.entity.js';
import { ProductVariant } from '../../modules/products/product-variant.entity.js';
import { Banner } from '../../modules/marketing/banner.entity.js';
import { HomeSection } from '../../modules/marketing/home-section.entity.js';
import { FlashSale } from '../../modules/marketing/flash-sale.entity.js';
import { FlashSaleProduct } from '../../modules/marketing/flash-sale-product.entity.js';

export async function seedDatabase(dataSource: DataSource): Promise<void> {
  const storeRepo = dataSource.getRepository(Store);
  const userRepo = dataSource.getRepository(User);
  const categoryRepo = dataSource.getRepository(Category);
  const brandRepo = dataSource.getRepository(Brand);
  const featureFlagRepo = dataSource.getRepository(FeatureFlag);
  const productRepo = dataSource.getRepository(Product);
  const productImageRepo = dataSource.getRepository(ProductImage);
  const productVariantRepo = dataSource.getRepository(ProductVariant);
  const bannerRepo = dataSource.getRepository(Banner);
  const homeSectionRepo = dataSource.getRepository(HomeSection);
  const flashSaleRepo = dataSource.getRepository(FlashSale);
  const flashSaleProductRepo = dataSource.getRepository(FlashSaleProduct);

  const existingStore = await storeRepo.findOne({ where: { domain: 'demo.novacommerce.io' } });
  if (existingStore) {
    console.log('Store already exists, skipping seed.');
    return;
  }

  console.log('Seeding database...');

  // ── Store ──
  const store = await storeRepo.save(
    storeRepo.create({
      id: 'a0000000-0000-0000-0000-000000000001',
      name: 'NOVA Demo Store',
      domain: 'demo.novacommerce.io',
      configurations: {
        currency: 'EGP',
        locale: 'ar',
        tax_rate: 0.14,
        dark_mode_enabled: false,
        language_switcher_enabled: true,
        returns_enabled: true,
        loyalty_program_enabled: false,
        auth: {
          email_enabled: true,
          phone_enabled: true,
          otp_enabled: true,
          google_login_enabled: false,
          apple_login_enabled: false,
          facebook_login_enabled: false,
          password_min_length: 8,
          require_email_verification: false,
        },
        texts: {
          app_name: 'NOVA Commerce',
          tagline: 'Your premium shopping destination',
          login_title: 'Welcome Back',
          login_subtitle: 'Sign in to continue shopping',
          register_title: 'Create Account',
          register_subtitle: 'Join us and start shopping',
          otp_title: 'Verify Your Phone',
          otp_subtitle: 'Enter the code sent to your phone',
        },
      },
      branding: {
        primary_color: '#1A1A1A',
        secondary_color: '#D4AF37',
        font_family: 'Cairo',
        logo_url: null,
        splash_background: null,
      },
    }),
  );

  const tenantId = store.id;

  // ── Admin User ──
  const adminPasswordHash = await bcrypt.hash('admin123', 12);
  await userRepo.save(
    userRepo.create({
      tenant_id: tenantId,
      full_name: 'Admin User',
      email: 'admin@novacommerce.io',
      password_hash: adminPasswordHash,
      role: 'admin',
      is_verified: true,
      is_active: true,
    }),
  );

  // ── Categories ──
  const categoryData = [
    { name: 'Electronics', slug: 'electronics', display_order: 1, image_url: 'https://picsum.photos/seed/electronics/200/200' },
    { name: 'Fashion', slug: 'fashion', display_order: 2, image_url: 'https://picsum.photos/seed/fashion/200/200' },
    { name: 'Home & Living', slug: 'home-living', display_order: 3, image_url: 'https://picsum.photos/seed/homeliving/200/200' },
    { name: 'Beauty', slug: 'beauty', display_order: 4, image_url: 'https://picsum.photos/seed/beauty/200/200' },
    { name: 'Sports', slug: 'sports', display_order: 5, image_url: 'https://picsum.photos/seed/sports/200/200' },
  ];

  const savedCategories: Category[] = [];
  for (const cat of categoryData) {
    const saved = await categoryRepo.save(categoryRepo.create({ tenant_id: tenantId, ...cat }));
    savedCategories.push(saved);
  }

  // ── Brands ──
  const brandData = [
    { name: 'Apple', slug: 'apple' },
    { name: 'Samsung', slug: 'samsung' },
    { name: 'Nike', slug: 'nike' },
    { name: 'Adidas', slug: 'adidas' },
    { name: 'Zara', slug: 'zara' },
  ];

  const savedBrands: Brand[] = [];
  for (const brand of brandData) {
    const saved = await brandRepo.save(brandRepo.create({ tenant_id: tenantId, ...brand, is_active: true }));
    savedBrands.push(saved);
  }

  // ── Products ──
  const productSeeds = [
    {
      title: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      description: 'The most powerful iPhone ever. A17 Pro chip, titanium design, 48MP camera system.',
      short_description: 'Apple iPhone 15 Pro Max - Titanium, A17 Pro',
      base_price: 74999,
      compare_at_price: 79999,
      sku: 'APL-IP15PM-256',
      category_id: savedCategories[0].id,
      brand_id: savedBrands[0].id,
      is_featured: true,
      images: ['https://picsum.photos/seed/iphone15pro/600/600', 'https://picsum.photos/seed/iphone15pro2/600/600'],
      variants: [
        { sku: 'APL-IP15PM-256-BLK', title: '256GB Black', attributes: { color: 'Black', storage: '256GB' }, stock_quantity: 25 },
        { sku: 'APL-IP15PM-256-WHT', title: '256GB White', attributes: { color: 'White', storage: '256GB' }, stock_quantity: 20 },
        { sku: 'APL-IP15PM-512-BLU', title: '512GB Blue', attributes: { color: 'Blue', storage: '512GB' }, stock_quantity: 15, price_override: 89999 },
      ],
    },
    {
      title: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'Galaxy AI is here. Search like never before, intuitively edit photos, and more.',
      short_description: 'Samsung Galaxy S24 Ultra with Galaxy AI',
      base_price: 64999,
      compare_at_price: 69999,
      sku: 'SAM-S24U-256',
      category_id: savedCategories[0].id,
      brand_id: savedBrands[1].id,
      is_featured: true,
      images: ['https://picsum.photos/seed/galaxys24/600/600', 'https://picsum.photos/seed/galaxys242/600/600'],
      variants: [
        { sku: 'SAM-S24U-256-GRY', title: '256GB Titanium Gray', attributes: { color: 'Titanium Gray', storage: '256GB' }, stock_quantity: 30 },
        { sku: 'SAM-S24U-512-BLK', title: '512GB Titanium Black', attributes: { color: 'Titanium Black', storage: '512GB' }, stock_quantity: 18, price_override: 74999 },
      ],
    },
    {
      title: 'Nike Air Max 270',
      slug: 'nike-air-max-270',
      description: 'The Nike Air Max 270 features Nike\'s biggest heel Air unit yet for a super-soft ride.',
      short_description: 'Nike Air Max 270 - Maximum Comfort',
      base_price: 4999,
      compare_at_price: 5999,
      sku: 'NIK-AM270-BLK',
      category_id: savedCategories[1].id,
      brand_id: savedBrands[2].id,
      is_featured: true,
      images: ['https://picsum.photos/seed/nikeam270/600/600', 'https://picsum.photos/seed/nikeam2702/600/600'],
      variants: [
        { sku: 'NIK-AM270-42-BLK', title: 'Size 42 Black', attributes: { color: 'Black', size: '42' }, stock_quantity: 40 },
        { sku: 'NIK-AM270-43-WHT', title: 'Size 43 White', attributes: { color: 'White', size: '43' }, stock_quantity: 35 },
        { sku: 'NIK-AM270-44-RED', title: 'Size 44 Red', attributes: { color: 'Red', size: '44' }, stock_quantity: 20 },
      ],
    },
    {
      title: 'Adidas Ultraboost Light',
      slug: 'adidas-ultraboost-light',
      description: 'The lightest Ultraboost ever. Pure movement with incredible energy return.',
      short_description: 'Adidas Ultraboost Light - Pure Movement',
      base_price: 5499,
      sku: 'ADI-UBL-42',
      category_id: savedCategories[1].id,
      brand_id: savedBrands[3].id,
      is_featured: false,
      images: ['https://picsum.photos/seed/adidasub/600/600'],
      variants: [
        { sku: 'ADI-UBL-42-BLK', title: 'Size 42 Black', attributes: { color: 'Black', size: '42' }, stock_quantity: 30 },
        { sku: 'ADI-UBL-43-WHT', title: 'Size 43 White', attributes: { color: 'White', size: '43' }, stock_quantity: 25 },
      ],
    },
    {
      title: 'Zara Leather Jacket',
      slug: 'zara-leather-jacket',
      description: 'Premium faux leather jacket with a modern slim fit. Perfect for any occasion.',
      short_description: 'Zara Premium Faux Leather Jacket',
      base_price: 3999,
      compare_at_price: 4999,
      sku: 'ZAR-LJ-BLK-M',
      category_id: savedCategories[1].id,
      brand_id: savedBrands[4].id,
      is_featured: true,
      images: ['https://picsum.photos/seed/zarajacket/600/600', 'https://picsum.photos/seed/zarajacket2/600/600'],
      variants: [
        { sku: 'ZAR-LJ-BLK-S', title: 'Black Small', attributes: { color: 'Black', size: 'S' }, stock_quantity: 15 },
        { sku: 'ZAR-LJ-BLK-M', title: 'Black Medium', attributes: { color: 'Black', size: 'M' }, stock_quantity: 20 },
        { sku: 'ZAR-LJ-BRN-L', title: 'Brown Large', attributes: { color: 'Brown', size: 'L' }, stock_quantity: 12 },
      ],
    },
    {
      title: 'Sony WH-1000XM5',
      slug: 'sony-wh-1000xm5',
      description: 'Industry-leading noise canceling with Auto NC Optimizer. Crystal clear hands-free calling.',
      short_description: 'Sony Wireless Noise Canceling Headphones',
      base_price: 12999,
      compare_at_price: 14999,
      sku: 'SNY-WH1000XM5-BLK',
      category_id: savedCategories[0].id,
      is_featured: true,
      images: ['https://picsum.photos/seed/sonyxm5/600/600', 'https://picsum.photos/seed/sonyxm52/600/600'],
      variants: [
        { sku: 'SNY-WH1000XM5-BLK', title: 'Black', attributes: { color: 'Black' }, stock_quantity: 35 },
        { sku: 'SNY-WH1000XM5-SLV', title: 'Silver', attributes: { color: 'Silver' }, stock_quantity: 25 },
      ],
    },
    {
      title: 'MacBook Air M3',
      slug: 'macbook-air-m3',
      description: 'Strikingly thin. Incredibly powerful. The M3 chip makes MacBook Air extraordinary.',
      short_description: 'Apple MacBook Air 15" M3 Chip',
      base_price: 89999,
      compare_at_price: 94999,
      sku: 'APL-MBA-M3-15',
      category_id: savedCategories[0].id,
      brand_id: savedBrands[0].id,
      is_featured: true,
      images: ['https://picsum.photos/seed/macbookair/600/600'],
      variants: [
        { sku: 'APL-MBA-M3-8-256', title: '8GB / 256GB', attributes: { ram: '8GB', storage: '256GB' }, stock_quantity: 20 },
        { sku: 'APL-MBA-M3-16-512', title: '16GB / 512GB', attributes: { ram: '16GB', storage: '512GB' }, stock_quantity: 12, price_override: 109999 },
      ],
    },
    {
      title: 'L\'Oreal Paris Moisturizer',
      slug: 'loreal-paris-moisturizer',
      description: 'Hydra-Active moisturizer with hyaluronic acid for 72 hours of deep hydration.',
      short_description: 'L\'Oreal Hydra-Active Moisturizer',
      base_price: 899,
      compare_at_price: 1099,
      sku: 'LOREAL-HYD-100',
      category_id: savedCategories[3].id,
      is_featured: false,
      images: ['https://picsum.photos/seed/lorealmoist/600/600'],
      variants: [
        { sku: 'LOREAL-HYD-50', title: '50ml', attributes: { size: '50ml' }, stock_quantity: 100 },
        { sku: 'LOREAL-HYD-100', title: '100ml', attributes: { size: '100ml' }, stock_quantity: 60 },
      ],
    },
  ];

  const savedProducts: Product[] = [];
  for (const p of productSeeds) {
    const { images, variants, ...productData } = p;
    const saved = (await productRepo.save(
      productRepo.create({ tenant_id: tenantId, is_active: true, ...productData }),
    )) as Product;

    for (let i = 0; i < images.length; i++) {
      await productImageRepo.save(
        productImageRepo.create({
          product_id: saved.id,
          url: images[i],
          alt_text: `${saved.title} image ${i + 1}`,
          display_order: i,
          is_primary: i === 0,
        }),
      );
    }

    for (const v of variants) {
      await productVariantRepo.save(
        productVariantRepo.create({
          product_id: saved.id,
          tenant_id: tenantId,
          ...v,
          is_active: true,
        }),
      );
    }

    savedProducts.push(saved);
  }

  // ── Banners ──
  const now = new Date();
  const oneMonthLater = new Date(now);
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

  await bannerRepo.save([
    bannerRepo.create({
      tenant_id: tenantId,
      title: 'Summer Sale - Up to 50% Off',
      image_url: 'https://picsum.photos/seed/bannersummer/1200/400',
      link_type: 'category',
      link_value: savedCategories[1].id,
      position: 'home_top',
      display_order: 1,
      starts_at: now,
      expires_at: oneMonthLater,
      is_active: true,
    }),
    bannerRepo.create({
      tenant_id: tenantId,
      title: 'New Arrivals - Tech Collection',
      image_url: 'https://picsum.photos/seed/bannertech/1200/400',
      link_type: 'category',
      link_value: savedCategories[0].id,
      position: 'home_top',
      display_order: 2,
      starts_at: now,
      expires_at: oneMonthLater,
      is_active: true,
    }),
    bannerRepo.create({
      tenant_id: tenantId,
      title: 'Free Delivery on Orders Over 500 EGP',
      image_url: 'https://picsum.photos/seed/bannerdelivery/1200/400',
      link_type: 'none',
      position: 'home_top',
      display_order: 3,
      starts_at: now,
      expires_at: oneMonthLater,
      is_active: true,
    }),
  ]);

  // ── Flash Sale ──
  const flashSale = await flashSaleRepo.save(
    flashSaleRepo.create({
      tenant_id: tenantId,
      name: 'Weekend Flash Deal',
      description: 'Limited time offers on top products!',
      starts_at: now,
      ends_at: oneMonthLater,
      is_active: true,
    }),
  );

  const flashSaleProducts = [
    { product_id: savedProducts[0].id, flash_price: 69999, flash_stock: 10, sold_count: 3 },
    { product_id: savedProducts[2].id, flash_price: 3999, flash_stock: 20, sold_count: 8 },
    { product_id: savedProducts[5].id, flash_price: 10999, flash_stock: 15, sold_count: 5 },
  ];

  for (const fp of flashSaleProducts) {
    await flashSaleProductRepo.save(flashSaleProductRepo.create({ flash_sale_id: flashSale.id, ...fp }));
  }

  // ── Home Sections ──
  await homeSectionRepo.save([
    homeSectionRepo.create({
      tenant_id: tenantId,
      type: 'category_grid',
      title: 'Shop by Category',
      config: {},
      display_order: 1,
      is_active: true,
    }),
    homeSectionRepo.create({
      tenant_id: tenantId,
      type: 'flash_sale',
      title: 'Flash Sale',
      config: {},
      display_order: 2,
      is_active: true,
    }),
    homeSectionRepo.create({
      tenant_id: tenantId,
      type: 'product_grid',
      title: 'Best Sellers',
      config: { limit: 6 },
      display_order: 3,
      is_active: true,
    }),
  ]);

  // ── Feature Flags ──
  const defaultFlags = [
    { flag_name: 'multi_vendor_enabled', is_enabled: false },
    { flag_name: 'delivery_app_integration', is_enabled: true },
    { flag_name: 'loyalty_program_enabled', is_enabled: false },
    { flag_name: 'wallet_system_enabled', is_enabled: false },
    { flag_name: 'product_reviews_enabled', is_enabled: true },
    { flag_name: 'coupons_enabled', is_enabled: true },
    { flag_name: 'flash_sales_enabled', is_enabled: true },
    { flag_name: 'dynamic_home_builder', is_enabled: true },
    { flag_name: 'returns_enabled', is_enabled: true },
  ];

  for (const flag of defaultFlags) {
    await featureFlagRepo.save(featureFlagRepo.create({ tenant_id: tenantId, ...flag }));
  }

  console.log('Database seeded successfully!');
  console.log(`Store ID: ${tenantId}`);
  console.log(`Products: ${savedProducts.length}`);
  console.log(`Banners: 3`);
  console.log(`Flash Sale: 1 (${flashSaleProducts.length} products)`);
  console.log(`Home Sections: 3`);
  console.log('Admin: admin@novacommerce.io / admin123');
}
