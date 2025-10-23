import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with role-based access
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(), // patient, doctor, pharmacy, insurance
  phone: text("phone"),
  specialization: text("specialization"), // for doctors
  licenseNumber: text("license_number"), // for doctors/pharmacies
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Medical records uploaded by patients
export const medicalRecords = pgTable("medical_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  fileType: text("file_type").notNull(), // pdf, image, etc
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size").notNull(),
  recordType: text("record_type").notNull(), // lab_report, prescription, imaging, etc
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

// Access permissions for medical records
export const accessPermissions = pgTable("access_permissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  recordId: varchar("record_id").notNull().references(() => medicalRecords.id),
  grantedToId: varchar("granted_to_id").notNull().references(() => users.id),
  grantedById: varchar("granted_by_id").notNull().references(() => users.id),
  accessLevel: text("access_level").notNull(), // view, download
  grantedAt: timestamp("granted_at").defaultNow().notNull(),
  revokedAt: timestamp("revoked_at"),
  isActive: boolean("is_active").default(true).notNull(),
});

// E-prescriptions created by doctors
export const prescriptions = pgTable("prescriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => users.id),
  doctorId: varchar("doctor_id").notNull().references(() => users.id),
  diagnosis: text("diagnosis").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default('pending'), // pending, verified, dispensed
  dispensedById: varchar("dispensed_by_id").references(() => users.id),
  dispensedAt: timestamp("dispensed_at"),
  blockchainHash: text("blockchain_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Individual medications in a prescription
export const prescriptionItems = pgTable("prescription_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  prescriptionId: varchar("prescription_id").notNull().references(() => prescriptions.id),
  medicationName: text("medication_name").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull(),
  duration: text("duration").notNull(),
  instructions: text("instructions"),
});

// Insurance claims
export const insuranceClaims = pgTable("insurance_claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => users.id),
  agentId: varchar("agent_id").references(() => users.id),
  policyNumber: text("policy_number").notNull(),
  policyProvider: text("policy_provider").notNull(),
  claimAmount: integer("claim_amount").notNull(),
  claimType: text("claim_type").notNull(), // hospitalization, outpatient, pharmacy
  description: text("description").notNull(),
  status: text("status").notNull().default('submitted'), // submitted, under_review, approved, rejected, paid
  supportingDocuments: jsonb("supporting_documents").$type<string[]>().default([]),
  reviewNotes: text("review_notes"),
  blockchainHash: text("blockchain_hash").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Blockchain transaction log (immutable)
export const blockchainTransactions = pgTable("blockchain_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionHash: text("transaction_hash").notNull().unique(),
  actorId: varchar("actor_id").notNull().references(() => users.id),
  actionType: text("action_type").notNull(), // grant_access, revoke_access, create_prescription, verify_prescription, submit_claim
  resourceType: text("resource_type").notNull(), // medical_record, prescription, claim
  resourceId: varchar("resource_id").notNull(),
  metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
  previousHash: text("previous_hash"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Health insights from AI analysis
export const healthInsights = pgTable("health_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => users.id),
  recordId: varchar("record_id").references(() => medicalRecords.id),
  insightType: text("insight_type").notNull(), // alert, recommendation, trend
  severity: text("severity").notNull(), // low, medium, high, critical
  title: text("title").notNull(),
  description: text("description").notNull(),
  recommendations: text("recommendations"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  medicalRecords: many(medicalRecords),
  prescriptionsAsPatient: many(prescriptions, { relationName: "patientPrescriptions" }),
  prescriptionsAsDoctor: many(prescriptions, { relationName: "doctorPrescriptions" }),
  claims: many(insuranceClaims),
  blockchainTransactions: many(blockchainTransactions),
  healthInsights: many(healthInsights),
}));

export const medicalRecordsRelations = relations(medicalRecords, ({ one, many }) => ({
  patient: one(users, {
    fields: [medicalRecords.patientId],
    references: [users.id],
  }),
  accessPermissions: many(accessPermissions),
}));

export const prescriptionsRelations = relations(prescriptions, ({ one, many }) => ({
  patient: one(users, {
    fields: [prescriptions.patientId],
    references: [users.id],
    relationName: "patientPrescriptions",
  }),
  doctor: one(users, {
    fields: [prescriptions.doctorId],
    references: [users.id],
    relationName: "doctorPrescriptions",
  }),
  items: many(prescriptionItems),
}));

export const prescriptionItemsRelations = relations(prescriptionItems, ({ one }) => ({
  prescription: one(prescriptions, {
    fields: [prescriptionItems.prescriptionId],
    references: [prescriptions.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).omit({
  id: true,
  uploadedAt: true,
});

export const insertAccessPermissionSchema = createInsertSchema(accessPermissions).omit({
  id: true,
  grantedAt: true,
});

export const insertPrescriptionSchema = createInsertSchema(prescriptions).omit({
  id: true,
  createdAt: true,
  dispensedAt: true,
  dispensedById: true,
});

export const insertPrescriptionItemSchema = createInsertSchema(prescriptionItems).omit({
  id: true,
});

export const insertInsuranceClaimSchema = createInsertSchema(insuranceClaims).omit({
  id: true,
  submittedAt: true,
  updatedAt: true,
  agentId: true,
});

export const insertBlockchainTransactionSchema = createInsertSchema(blockchainTransactions).omit({
  id: true,
  timestamp: true,
});

export const insertHealthInsightSchema = createInsertSchema(healthInsights).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;

export type AccessPermission = typeof accessPermissions.$inferSelect;
export type InsertAccessPermission = z.infer<typeof insertAccessPermissionSchema>;

export type Prescription = typeof prescriptions.$inferSelect;
export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;

export type PrescriptionItem = typeof prescriptionItems.$inferSelect;
export type InsertPrescriptionItem = z.infer<typeof insertPrescriptionItemSchema>;

export type InsuranceClaim = typeof insuranceClaims.$inferSelect;
export type InsertInsuranceClaim = z.infer<typeof insertInsuranceClaimSchema>;

export type BlockchainTransaction = typeof blockchainTransactions.$inferSelect;
export type InsertBlockchainTransaction = z.infer<typeof insertBlockchainTransactionSchema>;

export type HealthInsight = typeof healthInsights.$inferSelect;
export type InsertHealthInsight = z.infer<typeof insertHealthInsightSchema>;
