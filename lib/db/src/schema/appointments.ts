import { createInsertSchema } from "drizzle-zod";
import { date, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { doctorsTable } from "./doctors";

export const appointmentsTable = pgTable("nitya_appointments", {
  id: serial("id").primaryKey(),
  patientName: text("patient_name").notNull(),
  patientPhone: text("patient_phone").notNull(),
  patientEmail: text("patient_email"),
  visitType: text("visit_type").notNull(),
  doctorId: integer("doctor_id").references(() => doctorsTable.id, {
    onDelete: "set null",
  }),
  preferredDate: date("preferred_date", { mode: "string" }).notNull(),
  preferredSlot: text("preferred_slot").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertAppointmentSchema = createInsertSchema(appointmentsTable).omit({
  id: true,
  status: true,
  createdAt: true,
});
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointmentsTable.$inferSelect;
