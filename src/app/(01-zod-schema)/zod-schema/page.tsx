"use client";

import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ============================================
// 📌 TYPESCRIPT TANIMLARI
// ============================================

// Enum tanımı
type RoleEnum = "admin" | "user" | "moderator";

// Ana User Type
type UserType = {
  // ─────────────────────────────────────────
  // 🟢 PRİMİTİVE TYPES
  // ─────────────────────────────────────────
  name: string;
  age: number;
  email: string;
  isActive: boolean;
  createdAt: Date;

  // ─────────────────────────────────────────
  // 🟡 STRING METODLARI
  // ─────────────────────────────────────────
  username: string; // min(3).max(20) → TS'de ifade edilemez!
  website?: string; // optional

  // ─────────────────────────────────────────
  // 🟠 NUMBER METODLARI
  // ─────────────────────────────────────────
  score: number; // min(0).max(100) → TS'de ifade edilemez!
  level: number; // int().positive() → TS'de ifade edilemez!

  // ─────────────────────────────────────────
  // 🔵 MODİFİERS (Değiştiriciler)
  // ─────────────────────────────────────────
  bio?: string; // string | undefined
  avatar: string | null; // string | null
  nickname?: string | null; // string | null | undefined
  theme: string; // default → TS'de ifade edilemez!

  // ─────────────────────────────────────────
  // 🟣 ENUM & LITERAL
  // ─────────────────────────────────────────
  role: RoleEnum;
  status: "active";

  // ─────────────────────────────────────────
  // 🔴 COMPLEX TYPES
  // ─────────────────────────────────────────
  tags: string[];
  scores: [number, ...number[]]; // nonempty → NonEmptyArray

  // Array of Objects
  activities: {
    title: string;
    completed: boolean;
  }[];

  // Nested Object
  address: {
    city: string;
    country: string;
    zipCode?: string;
  };

  // Union Type
  contactMethod: "email" | "phone" | "sms";

  // Record Type
  metadata: Record<string, unknown>;

  // Tuple
  coordinates: [number, number];
};

// ============================================
// 📌 SCHEMA TANIMLARI
// ============================================

// Enum tanımı
const RoleEnum = z.enum(["admin", "user", "moderator"]);

// Ana User Schema
const UserSchema = z.object({
  // ─────────────────────────────────────────
  // 🟢 PRİMİTİVE TYPES
  // ─────────────────────────────────────────
  name: z.string(),
  age: z.number(),
  email: z.email(),
  isActive: z.boolean(),
  createdAt: z.date(),

  // ─────────────────────────────────────────
  // 🟡 STRING METODLARI
  // ─────────────────────────────────────────
  username: z.string().min(3).max(20),
  website: z.url().optional(),

  // ─────────────────────────────────────────
  // 🟠 NUMBER METODLARI
  // ─────────────────────────────────────────
  score: z.number().min(0).max(100),
  level: z.int().positive(),

  // ─────────────────────────────────────────
  // 🔵 MODİFİERS (Değiştiriciler)
  // ─────────────────────────────────────────
  bio: z.string().optional(), // string | undefined
  avatar: z.string().nullable(), // string | null
  nickname: z.string().nullish(), // string | null | undefined
  theme: z.string().default("light"), // Varsayılan değer

  // ─────────────────────────────────────────
  // 🟣 ENUM & LITERAL
  // ─────────────────────────────────────────
  role: RoleEnum,
  status: z.literal("active"),

  // ─────────────────────────────────────────
  // 🔴 COMPLEX TYPES
  // ─────────────────────────────────────────
  tags: z.array(z.string()), // string[]
  scores: z.array(z.number()).nonempty(), // En az 1 eleman

  // Array of Objects (karmaşık nesne dizileri)
  activities: z.array(
    z.object({
      title: z.string(),
      completed: z.boolean(),
    })
  ),

  // Nested Object
  address: z.object({
    city: z.string(),
    country: z.string(),
    zipCode: z.string().optional(),
  }),

  // Union Type
  contactMethod: z.union([
    z.literal("email"),
    z.literal("phone"),
    z.literal("sms"),
  ]),

  // Record Type (dinamik key'ler)
  metadata: z.record(z.string(), z.unknown()),

  // Tuple (sabit uzunluk ve tipler)
  coordinates: z.tuple([z.number(), z.number()]),
});

// Type inference
type User = z.infer<typeof UserSchema>;

export default function BasicUsagePage() {
  // ============================================
  // 📌 TEST VERİSİ
  // ============================================
  const data = {
    // Primitive types
    name: "John Doe",
    age: 28,
    email: "john@example.com",
    isActive: true,
    createdAt: new Date("2025-01-01"),

    // String metodları
    username: "johndoe",
    website: "https://johndoe.dev", // optional - verilebilir

    // Number metodları
    score: 85,
    level: 5,

    // Modifiers
    bio: undefined, // optional → undefined OK ✅
    avatar: null, // nullable → null OK ✅
    nickname: null, // nullish → null veya undefined OK ✅
    // theme verilmedi → default "light" olacak ✅

    // Enum & Literal
    role: "admin",
    status: "active",

    // Complex types
    tags: ["developer", "typescript", "react"],
    scores: [95, 87, 92],

    // Array of Objects
    activities: [
      {
        title: "Complete profile setup",
        completed: true,
      },
      {
        title: "Upload profile picture",
        completed: false,
      },
      {
        title: "Verify email address",
        completed: true,
      },
    ],

    // Nested Object
    address: {
      city: "Istanbul",
      country: "Turkey",
      // zipCode verilmedi → optional ✅
    },

    // Union
    contactMethod: "email",

    // Record
    metadata: {
      source: "web",
      campaign: "summer2024",
      referrer: null,
    },

    // Tuple
    coordinates: [41.0082, 28.9784],
  };

  // ============================================
  // 📌 PARSE İŞLEMİ
  // ============================================
  const user = UserSchema.parse(data);
  console.log("Parsed user:", user);

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Zod Schema Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Parsed Data */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Parsed Data</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
