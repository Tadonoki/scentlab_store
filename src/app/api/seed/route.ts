import { db } from "@/db";
import { products, user as userTable, account as accountTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

const productList = [
  {
    name: "Sweet Dreams",
    slug: "sweet-dreams",
    category: "Lilin Aromaterapi",
    scentNotes: "Jasmine | Ylang-ylang | Vanilla",
    description:
      "Perpaduan aroma manis dan lembut untuk menciptakan suasana nyaman dan menenangkan. Cocok untuk menemani tidur malam yang nyenyak.",
    price: 75000,
    stock: 25,
    badge: "Best Seller",
    isFeatured: true,
  },
  {
    name: "Calm Horizon",
    slug: "calm-horizon",
    category: "Lilin Aromaterapi",
    scentNotes: "Lavender | Eucalyptus | Lemongrass",
    description:
      "Aroma segar dan menenangkan yang membawa ketenangan alami. Ideal untuk relaksasi setelah hari yang panjang.",
    price: 85000,
    stock: 20,
    badge: "Relax",
    isFeatured: true,
  },
  {
    name: "Earth Awakening",
    slug: "earth-awakening",
    category: "Lilin Aromaterapi",
    scentNotes: "Lemongrass | Patchouli | Peppermint",
    description:
      "Aroma earthy dan segar yang membangkitkan semangat. Perpaduan unik untuk memulai hari dengan energi positif.",
    price: 80000,
    stock: 18,
    badge: "Fresh",
    isFeatured: true,
  },
  {
    name: "Sunset Beach",
    slug: "sunset-beach",
    category: "Lilin Aromaterapi",
    scentNotes: "Ocean Breeze | Lavender | Vanilla",
    description:
      "Aroma pantai senja yang lembut dan menenangkan. Membawa nuansa liburan tropis ke dalam rumah Anda.",
    price: 90000,
    stock: 15,
    badge: "New",
    isFeatured: true,
  },
  {
    name: "Royal Arabian",
    slug: "royal-arabian",
    category: "Lilin Aromaterapi",
    scentNotes: "Oud | Rose | Sandalwood",
    description:
      "Aroma mewah Timur Tengah yang elegan dan tahan lama. Perpaduan sempurna antara kemewahan dan ketenangan.",
    price: 120000,
    stock: 12,
    badge: "Premium",
    isFeatured: true,
  },
  {
    name: "Summer Bouquet",
    slug: "summer-bouquet",
    category: "Lilin Aromaterapi",
    scentNotes: "Gardenia | Ylang-ylang | White Flower",
    description:
      "Aroma bunga musim panas yang lembut dan romantis. Menghadirkan keindahan taman bunga ke dalam ruangan.",
    price: 85000,
    stock: 22,
    badge: "Floral",
    isFeatured: true,
  },
  {
    name: "Whispering Musk",
    slug: "whispering-musk",
    category: "Lilin Aromaterapi",
    scentNotes: "Musk | Amber | Cedarwood",
    description:
      "Aroma misterius dan hangat yang memikat. Cocok untuk menciptakan suasana intim dan elegan.",
    price: 95000,
    stock: 16,
    badge: null,
    isFeatured: false,
  },
];

async function seedProducts() {
  const results: string[] = [];
  for (const product of productList) {
    const existing = await db
      .select()
      .from(products)
      .where(eq(products.slug, product.slug))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(products).values(product);
      results.push(`✅ Product created: ${product.name}`);
    } else {
      results.push(`⏭️ Product already exists: ${product.name}`);
    }
  }
  return results;
}

async function seedAdmin() {
  const results: string[] = [];
  const adminEmail = "admin@scentlab.com";
  const adminPassword = "admin123456";
  const adminName = "Admin ScentLab";

  // First, clean up any existing user with bad password hash
  try {
    const existingUsers = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, adminEmail))
      .limit(1);

    if (existingUsers.length > 0) {
      // Delete account entries first (cascade might not work for all cases)
      await db
        .delete(accountTable)
        .where(eq(accountTable.userId, existingUsers[0].id));
      // Delete user
      await db
        .delete(userTable)
        .where(eq(userTable.id, existingUsers[0].id));
      results.push(`🗑️ Removed existing admin user to recreate with proper hash`);
    }
  } catch (err) {
    // ignore cleanup errors
  }

  // Use Better Auth API to create user with proper password hashing
  try {
    const response = await auth.api.signUpEmail({
      body: {
        name: adminName,
        email: adminEmail,
        password: adminPassword,
      },
    });

    if (response.token) {
      results.push(`✅ Admin created: ${adminEmail}`);
      results.push(`   Password: ${adminPassword}`);
    } else {
      results.push(`⚠️ Admin signup returned no token (might already exist)`);
    }
  } catch (err: any) {
    if (err?.body?.message?.includes?.("already") || 
        err?.status === 422 || 
        err?.message?.includes?.("already")) {
      results.push(`⏭️ Admin already exists: ${adminEmail}`);
    } else {
      results.push(`❌ Admin seed failed: ${err?.message || err}`);
      results.push(`   (You can try logging in with admin@scentlab.com / admin123456)`);
    }
  }

  return results;
}

export async function GET() {
  try {
    const log: string[] = [];

    // ─── Seed Products ───
    const productResults = await seedProducts();
    log.push(...productResults);

    // ─── Seed Admin ───
    const adminResults = await seedAdmin();
    log.push(...adminResults);

    return Response.json({ success: true, log });
  } catch (error) {
    console.error("Seed error:", error);
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}