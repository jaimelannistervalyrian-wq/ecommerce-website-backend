"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const cloudinary_1 = require("cloudinary");
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const prisma = new client_1.PrismaClient();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
async function verifyCloudinary() {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.warn('  ⚠ Cloudinary env vars missing — skipping image upload');
        return false;
    }
    try {
        await cloudinary_1.v2.api.ping();
        console.log(`  ✓ Cloudinary connected (cloud: ${process.env.CLOUDINARY_CLOUD_NAME})`);
        return true;
    }
    catch (e) {
        const msg = e?.error?.message ?? e?.message ?? String(e);
        console.warn(`\n  ✗ Cloudinary connection failed: ${msg}`);
        console.warn('  ✗ CLOUDINARY_CLOUD_NAME must be the lowercase cloud name from your');
        console.warn('    Cloudinary Dashboard (e.g. "dxxxxxxxx"), NOT your account display name.');
        console.warn('    Fix it in backend/.env and re-run: npm run seed\n');
        return false;
    }
}
const IMAGES_DIR = path.resolve(__dirname, '../../frontend/src/assets/product_images');
function uploadToCloudinary(buffer, publicId, folder = 'ss-jeweleries/products') {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload_stream({
            folder,
            public_id: publicId,
            overwrite: false,
            resource_type: 'image',
            transformation: [
                { quality: 'auto', fetch_format: 'auto' },
                { width: 1200, height: 1600, crop: 'limit' },
            ],
        }, (err, result) => {
            if (err) {
                if (err.http_code === 400 && err.message?.includes('already exists')) {
                    const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/ss-jeweleries/products/${publicId}`;
                    return resolve(url);
                }
                return reject(err);
            }
            resolve(result.secure_url);
        }).end(buffer);
    });
}
async function uploadAllImages() {
    const ok = await verifyCloudinary();
    if (!ok)
        return {};
    console.log(`\n📸 Uploading images from: ${IMAGES_DIR}`);
    if (!fs.existsSync(IMAGES_DIR)) {
        console.warn(`  ⚠ Images directory not found: ${IMAGES_DIR}`);
        return {};
    }
    const fileMap = [
        { file: 'WhatsApp Image 2026-04-24 at 8.31.04 PM.jpeg', publicId: 'img-01' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.05 PM (1).jpeg', publicId: 'img-02' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.05 PM.jpeg', publicId: 'img-03' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.06 PM.jpeg', publicId: 'img-04' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.07 PM.jpeg', publicId: 'img-05' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.08 PM (1).jpeg', publicId: 'img-06' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.08 PM (2).jpeg', publicId: 'img-07' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.08 PM.jpeg', publicId: 'img-08' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.10 PM (1).jpeg', publicId: 'img-09' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.10 PM.jpeg', publicId: 'img-10' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.11 PM (1).jpeg', publicId: 'img-11' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.11 PM.jpeg', publicId: 'img-12' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.17 PM.jpeg', publicId: 'img-13' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.18 PM (1).jpeg', publicId: 'img-14' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.18 PM.jpeg', publicId: 'img-15' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.19 PM (1).jpeg', publicId: 'img-16' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.19 PM.jpeg', publicId: 'img-17' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.20 PM (1).jpeg', publicId: 'img-18' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.20 PM (2).jpeg', publicId: 'img-19' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.20 PM.jpeg', publicId: 'img-20' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.21 PM (1).jpeg', publicId: 'img-21' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.21 PM.jpeg', publicId: 'img-22' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.22 PM (1).jpeg', publicId: 'img-23' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.22 PM (2).jpeg', publicId: 'img-24' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.22 PM.jpeg', publicId: 'img-25' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.23 PM (1).jpeg', publicId: 'img-26' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.23 PM.jpeg', publicId: 'img-27' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.24 PM (1).jpeg', publicId: 'img-28' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.24 PM.jpeg', publicId: 'img-29' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.25 PM (1).jpeg', publicId: 'img-30' },
        { file: 'WhatsApp Image 2026-04-24 at 8.31.25 PM.jpeg', publicId: 'img-31' },
        { file: 'WhatsApp Image 2026-05-08 at 1.01.50 AM.jpeg', publicId: 'img-32' },
        { file: 'WhatsApp Image 2026-05-08 at 1.01.51 AM (1).jpeg', publicId: 'img-33' },
        { file: 'WhatsApp Image 2026-05-08 at 1.01.51 AM (2).jpeg', publicId: 'img-34' },
        { file: 'WhatsApp Image 2026-05-08 at 1.01.51 AM.jpeg', publicId: 'img-35' },
    ];
    const urlMap = {};
    for (const { file, publicId } of fileMap) {
        const filePath = path.join(IMAGES_DIR, file);
        if (!fs.existsSync(filePath)) {
            console.warn(`  ⚠ Missing: ${file}`);
            continue;
        }
        try {
            const buffer = fs.readFileSync(filePath);
            const url = await uploadToCloudinary(buffer, publicId);
            urlMap[publicId] = url;
            process.stdout.write(`  ✓ ${publicId} → uploaded\r`);
        }
        catch (err) {
            console.error(`  ✗ Failed ${publicId}: ${err.message}`);
        }
    }
    console.log(`\n  ✓ ${Object.keys(urlMap).length}/${fileMap.length} images uploaded to Cloudinary`);
    const u = urlMap;
    return {
        'diamond-solitaire-ring': [u['img-01'], u['img-02']].filter(Boolean),
        'gold-chain-necklace': [u['img-03'], u['img-04']].filter(Boolean),
        'pearl-drop-earrings': [u['img-05'], u['img-06']].filter(Boolean),
        'sapphire-tennis-bracelet': [u['img-07'], u['img-08']].filter(Boolean),
        'emerald-pendant': [u['img-09'], u['img-10']].filter(Boolean),
        'rose-gold-bangle': [u['img-11'], u['img-12']].filter(Boolean),
        'ruby-cocktail-ring': [u['img-13'], u['img-14']].filter(Boolean),
        'diamond-stud-earrings': [u['img-15'], u['img-16']].filter(Boolean),
        'art-deco-brooch': [u['img-17'], u['img-18']].filter(Boolean),
        'gold-hoop-earrings': [u['img-19'], u['img-20']].filter(Boolean),
        'platinum-wedding-band': [u['img-21'], u['img-22']].filter(Boolean),
        'layered-gold-necklace': [u['img-23'], u['img-24']].filter(Boolean),
        'amethyst-drop-earrings': [u['img-25'], u['img-26']].filter(Boolean),
        'gold-charm-bracelet': [u['img-27'], u['img-28']].filter(Boolean),
        'diamond-eternity-band': [u['img-29'], u['img-30']].filter(Boolean),
        'opal-pendant-necklace': [u['img-31'], u['img-32']].filter(Boolean),
        'sterling-silver-cuff': [u['img-33'], u['img-34']].filter(Boolean),
        'tanzanite-cocktail-ring': [u['img-35'], u['img-01']].filter(Boolean),
    };
}
async function main() {
    console.log('🌱 SS Jeweleries — Full Database Seed\n');
    const imageMap = await uploadAllImages();
    console.log('\n📂 Seeding categories...');
    const categoryData = [
        { name: 'Rings', slug: 'rings', description: 'Engagement rings, wedding bands, cocktail rings and more' },
        { name: 'Necklaces', slug: 'necklaces', description: 'Pendants, chains, chokers and statement necklaces' },
        { name: 'Earrings', slug: 'earrings', description: 'Studs, hoops, drops and chandelier earrings' },
        { name: 'Bracelets', slug: 'bracelets', description: 'Bangles, tennis bracelets, charm bracelets and cuffs' },
        { name: 'Accessories', slug: 'accessories', description: 'Brooches, hair accessories and other fine jewelry' },
    ];
    const categories = {};
    for (const cat of categoryData) {
        const created = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name, description: cat.description },
            create: cat,
        });
        categories[cat.slug] = created.id;
        console.log(`  ✓ ${cat.name}`);
    }
    console.log('\n💎 Seeding products...');
    const products = [
        {
            name: 'Diamond Solitaire Ring',
            slug: 'diamond-solitaire-ring',
            description: 'A timeless solitaire ring featuring a brilliant-cut diamond set in 18k white gold. The perfect symbol of eternal love and refined elegance.',
            price: 2499.00, salePrice: 1999.00, stock: 5,
            categorySlug: 'rings', isFeatured: true, isBestSeller: true, rating: 4.9, reviewCount: 142,
        },
        {
            name: 'Gold Chain Necklace',
            slug: 'gold-chain-necklace',
            description: 'Handcrafted 22k gold chain necklace with a delicate interlocking design. A statement piece that elevates any ensemble.',
            price: 1850.00, stock: 8,
            categorySlug: 'necklaces', isFeatured: true, rating: 4.8, reviewCount: 98,
        },
        {
            name: 'Pearl Drop Earrings',
            slug: 'pearl-drop-earrings',
            description: 'South Sea pearl drop earrings set in sterling silver. Lustrous, elegant, and effortlessly sophisticated.',
            price: 650.00, stock: 12,
            categorySlug: 'earrings', isBestSeller: true, rating: 4.7, reviewCount: 76,
        },
        {
            name: 'Sapphire Tennis Bracelet',
            slug: 'sapphire-tennis-bracelet',
            description: 'A stunning tennis bracelet featuring alternating sapphires and diamonds in a 14k white gold setting.',
            price: 3200.00, salePrice: 2750.00, stock: 3,
            categorySlug: 'bracelets', isFeatured: true, rating: 5.0, reviewCount: 54,
        },
        {
            name: 'Emerald Pendant',
            slug: 'emerald-pendant',
            description: 'Colombian emerald pendant in 18k yellow gold with a delicate diamond halo. Vivid color, exceptional clarity.',
            price: 1750.00, stock: 6,
            categorySlug: 'necklaces', rating: 4.8, reviewCount: 63,
        },
        {
            name: 'Rose Gold Bangle',
            slug: 'rose-gold-bangle',
            description: 'Sleek 18k rose gold bangle with a brushed finish. Minimalist luxury for the modern woman.',
            price: 980.00, stock: 15,
            categorySlug: 'bracelets', isBestSeller: true, rating: 4.6, reviewCount: 89,
        },
        {
            name: 'Ruby Cocktail Ring',
            slug: 'ruby-cocktail-ring',
            description: "Bold Burmese ruby cocktail ring surrounded by pavé diamonds in 18k gold. A true collector's piece.",
            price: 4200.00, stock: 2,
            categorySlug: 'rings', isFeatured: true, rating: 4.9, reviewCount: 37,
        },
        {
            name: 'Diamond Stud Earrings',
            slug: 'diamond-stud-earrings',
            description: 'Classic round brilliant diamond studs in 18k white gold four-prong settings. Timeless and versatile.',
            price: 1200.00, salePrice: 999.00, stock: 20,
            categorySlug: 'earrings', isFeatured: true, isBestSeller: true, rating: 4.9, reviewCount: 211,
        },
        {
            name: 'Art Deco Brooch',
            slug: 'art-deco-brooch',
            description: 'Inspired by the Art Deco era, this platinum brooch features geometric diamond patterns with sapphire accents.',
            price: 2100.00, stock: 4,
            categorySlug: 'accessories', rating: 4.7, reviewCount: 29,
        },
        {
            name: 'Gold Hoop Earrings',
            slug: 'gold-hoop-earrings',
            description: 'Polished 14k yellow gold hoop earrings with a seamless finish. Effortlessly chic for day or night.',
            price: 480.00, stock: 25,
            categorySlug: 'earrings', isBestSeller: true, rating: 4.5, reviewCount: 134,
        },
        {
            name: 'Platinum Wedding Band',
            slug: 'platinum-wedding-band',
            description: 'A classic comfort-fit platinum wedding band with a satin finish. Crafted for a lifetime of wear.',
            price: 1600.00, stock: 10,
            categorySlug: 'rings', isBestSeller: true, rating: 5.0, reviewCount: 88,
        },
        {
            name: 'Layered Gold Necklace',
            slug: 'layered-gold-necklace',
            description: 'A delicate multi-strand 18k gold necklace with subtle diamond-cut links. Perfect for layering.',
            price: 720.00, stock: 18,
            categorySlug: 'necklaces', rating: 4.6, reviewCount: 67,
        },
        {
            name: 'Amethyst Drop Earrings',
            slug: 'amethyst-drop-earrings',
            description: 'Vivid purple amethyst drops in sterling silver with a rhodium finish. Elegant and eye-catching.',
            price: 390.00, stock: 14,
            categorySlug: 'earrings', rating: 4.4, reviewCount: 45,
        },
        {
            name: 'Gold Charm Bracelet',
            slug: 'gold-charm-bracelet',
            description: 'Customizable 14k gold charm bracelet with a lobster clasp. Add charms to tell your story.',
            price: 850.00, salePrice: 699.00, stock: 9,
            categorySlug: 'bracelets', rating: 4.7, reviewCount: 102,
        },
        {
            name: 'Diamond Eternity Band',
            slug: 'diamond-eternity-band',
            description: 'Full eternity band with round brilliant diamonds set in 18k white gold. Symbolizing endless love.',
            price: 3800.00, stock: 4,
            categorySlug: 'rings', isFeatured: true, rating: 5.0, reviewCount: 56,
        },
        {
            name: 'Opal Pendant Necklace',
            slug: 'opal-pendant-necklace',
            description: 'Australian opal pendant with a play-of-color effect, set in 14k rose gold on a delicate chain.',
            price: 560.00, stock: 7,
            categorySlug: 'necklaces', rating: 4.6, reviewCount: 41,
        },
        {
            name: 'Sterling Silver Cuff',
            slug: 'sterling-silver-cuff',
            description: 'Bold sterling silver cuff bracelet with a hammered texture. A modern statement for any wrist.',
            price: 320.00, stock: 22,
            categorySlug: 'bracelets', rating: 4.3, reviewCount: 73,
        },
        {
            name: 'Tanzanite Cocktail Ring',
            slug: 'tanzanite-cocktail-ring',
            description: 'Rare tanzanite center stone with a diamond halo in 18k white gold. One of a kind, just like you.',
            price: 5200.00, stock: 1,
            categorySlug: 'rings', isFeatured: true, rating: 4.9, reviewCount: 22,
        },
    ];
    for (const p of products) {
        const images = imageMap[p.slug] ?? [];
        const data = {
            name: p.name,
            description: p.description,
            price: p.price.toFixed(2),
            salePrice: 'salePrice' in p && p.salePrice != null ? p.salePrice.toFixed(2) : null,
            stock: p.stock,
            isFeatured: 'isFeatured' in p ? Boolean(p.isFeatured) : false,
            isBestSeller: 'isBestSeller' in p ? Boolean(p.isBestSeller) : false,
            rating: 'rating' in p ? Number(p.rating) : 0,
            reviewCount: 'reviewCount' in p ? Number(p.reviewCount) : 0,
            images,
            categoryId: categories[p.categorySlug],
        };
        await prisma.product.upsert({
            where: { slug: p.slug },
            update: data,
            create: { slug: p.slug, ...data },
        });
        const imgCount = images.length;
        console.log(`  ✓ ${p.name} — ${imgCount} image${imgCount !== 1 ? 's' : ''}`);
    }
    console.log('\n🎟  Seeding coupons...');
    for (const coupon of [
        { code: 'SAVE10', percentage: 10 },
        { code: 'WELCOME20', percentage: 20 },
    ]) {
        await prisma.coupon.upsert({
            where: { code: coupon.code },
            update: {},
            create: { code: coupon.code, percentage: coupon.percentage, active: true },
        });
        console.log(`  ✓ ${coupon.code} (${coupon.percentage}% off)`);
    }
    console.log('\n🖼  Seeding banners...');
    const bannerCount = await prisma.banner.count();
    if (bannerCount === 0) {
        await prisma.banner.createMany({
            data: [
                {
                    title: 'New Collection 2026',
                    subtitle: 'Discover our latest fine jewelry pieces crafted for eternity.',
                    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1400',
                    ctaLabel: 'Shop Now',
                    ctaLink: '/products',
                    section: 'home',
                    isActive: true,
                    sortOrder: 1,
                },
                {
                    title: 'Diamond Sale — Up to 30% Off',
                    subtitle: 'Limited time offer on our finest diamond collection.',
                    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1400',
                    ctaLabel: 'View Sale',
                    ctaLink: '/products',
                    section: 'home',
                    isActive: true,
                    sortOrder: 2,
                },
            ],
        });
        console.log('  ✓ 2 banners created');
    }
    else {
        console.log(`  ✓ Banners already exist (${bannerCount}), skipping`);
    }
    console.log('\n👤 Seeding admin user...');
    const adminEmail = 'admin@ssjeweleries.com';
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existing) {
        const passwordHash = await bcrypt.hash('Admin@123', 10);
        await prisma.user.create({
            data: { email: adminEmail, fullName: 'SS Admin', passwordHash, role: 'ADMIN' },
        });
        console.log(`  ✓ Created: ${adminEmail}  /  Admin@123`);
    }
    else {
        console.log(`  ✓ Already exists: ${adminEmail}`);
    }
    console.log('\n✅ Seed complete!\n');
}
main()
    .catch((e) => {
    console.error('\n❌ Seed failed:', e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map