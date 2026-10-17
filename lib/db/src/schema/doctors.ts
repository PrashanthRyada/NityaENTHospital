import { createInsertSchema } from "drizzle-zod";
import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const doctorsTable = pgTable("nitya_doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  specialty: text("specialty").notNull(),
  bio: text("bio").notNull().default(""),
  imageUrl: text("image_url"),
  availabilityDays: text("availability_days")
    .array()
    .notNull()
    .default([]),
  availabilityHours: text("availability_hours").notNull().default(""),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertDoctorSchema = createInsertSchema(doctorsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctorsTable.$inferSelect;
