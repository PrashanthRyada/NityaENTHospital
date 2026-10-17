import { createInsertSchema } from "drizzle-zod";
import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const mediaTable = pgTable("nitya_media", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  caption: text("caption").notNull().default(""),
  objectPath: text("object_path").notNull().unique(),
  mediaType: text("media_type").notNull(),
  altText: text("alt_text").notNull().default(""),
  isHeroVideo: boolean("is_hero_video").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertMediaSchema = createInsertSchema(mediaTable).omit({
  id: true,
  createdAt: true,
});
export type InsertMedia = z.infer<typeof insertMediaSchema>;
export type MediaItem = typeof mediaTable.$inferSelect;
