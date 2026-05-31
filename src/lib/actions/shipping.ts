"use server";

import { db } from "@/db";
import { shippingRates } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

const DEFAULT_PROVINCES = [
  { province: "DKI Jakarta", shippingCost: 10000 },
  { province: "Jawa Barat", shippingCost: 10000 },
  { province: "Jawa Tengah", shippingCost: 10000 },
  { province: "Jawa Timur", shippingCost: 10000 },
  { province: "Sumatera Selatan", shippingCost: 15000 },
  { province: "Kalimantan Barat", shippingCost: 25000 },
  { province: "Kalimantan Timur", shippingCost: 30000 },
  { province: "Sulawesi Selatan", shippingCost: 30000 },
  { province: "Papua", shippingCost: 50000 },
];

// Helper to seed initial rates if table is empty
async function checkAndSeedRates() {
  const existing = await db.select().from(shippingRates).limit(1);
  if (existing.length === 0) {
    for (const item of DEFAULT_PROVINCES) {
      await db.insert(shippingRates).values({
        province: item.province,
        shippingCost: item.shippingCost,
        isActive: true,
      });
    }
  }
}

// Fetch all shipping rates (seeding if empty)
export async function getShippingRates() {
  await checkAndSeedRates();
  return db.select().from(shippingRates).orderBy(asc(shippingRates.province));
}

// Fetch active shipping rates for checkout dropdown
export async function getActiveShippingRates() {
  await checkAndSeedRates();
  return db
    .select()
    .from(shippingRates)
    .where(eq(shippingRates.isActive, true))
    .orderBy(asc(shippingRates.province));
}

// Update shipping rate
export async function updateShippingRate(
  id: string,
  cost: number,
  isActive: boolean
) {
  const [updated] = await db
    .update(shippingRates)
    .set({
      shippingCost: cost,
      isActive,
      updatedAt: new Date(),
    })
    .where(eq(shippingRates.id, id))
    .returning();
  return updated;
}

// Create new shipping rate
export async function createShippingRate(
  province: string,
  cost: number,
  isActive: boolean
) {
  // Check if already exists (case-insensitive or exact)
  const existing = await db
    .select()
    .from(shippingRates)
    .where(eq(shippingRates.province, province))
    .limit(1);

  if (existing.length > 0) {
    throw new Error("Provinsi sudah terdaftar");
  }

  const [inserted] = await db
    .insert(shippingRates)
    .values({
      province,
      shippingCost: cost,
      isActive,
    })
    .returning();
  return inserted;
}
