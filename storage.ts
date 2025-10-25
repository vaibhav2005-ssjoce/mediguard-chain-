// Referenced from javascript_database blueprint
import {
  users, medicalRecords, accessPermissions, prescriptions, prescriptionItems,
  insuranceClaims, blockchainTransactions, healthInsights,
  type User, type InsertUser, type MedicalRecord, type InsertMedicalRecord,
  type AccessPermission, type InsertAccessPermission, type Prescription, type InsertPrescription,
  type PrescriptionItem, type InsertPrescriptionItem, type InsuranceClaim, type InsertInsuranceClaim,
  type BlockchainTransaction, type HealthInsight, type InsertHealthInsight
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Medical Records
  createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord>;
  getMedicalRecords(patientId: string): Promise<MedicalRecord[]>;
  getMedicalRecord(id: string): Promise<MedicalRecord | undefined>;

  // Access Permissions
  createAccessPermission(permission: InsertAccessPermission): Promise<AccessPermission>;
  getAccessPermission(id: string): Promise<AccessPermission | undefined>;
  getAccessPermissions(recordId: string): Promise<AccessPermission[]>;
  revokeAccessPermission(id: string): Promise<void>;
  getUserAccessibleRecords(userId: string): Promise<MedicalRecord[]>;

  // Prescriptions
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  getPrescriptions(filters: { doctorId?: string; patientId?: string }): Promise<Prescription[]>;
  getPrescription(id: string): Promise<Prescription | undefined>;
  updatePrescriptionStatus(id: string, status: string, dispensedById?: string): Promise<Prescription>;

  // Prescription Items
  createPrescriptionItems(items: InsertPrescriptionItem[]): Promise<PrescriptionItem[]>;
  getPrescriptionItems(prescriptionId: string): Promise<PrescriptionItem[]>;

  // Insurance Claims
  createInsuranceClaim(claim: InsertInsuranceClaim): Promise<InsuranceClaim>;
  getInsuranceClaims(filters: { patientId?: string; agentId?: string }): Promise<InsuranceClaim[]>;
  getInsuranceClaim(id: string): Promise<InsuranceClaim | undefined>;
  updateClaimStatus(id: string, status: string, reviewNotes?: string): Promise<InsuranceClaim>;

  // Blockchain Transactions
  getBlockchainTransactions(filters: { actorId?: string; resourceId?: string }): Promise<BlockchainTransaction[]>;

  // Health Insights
  createHealthInsight(insight: InsertHealthInsight): Promise<HealthInsight>;
  getHealthInsights(patientId: string, unreadOnly?: boolean): Promise<HealthInsight[]>;
  markInsightAsRead(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Medical Records
  async createMedicalRecord(record: InsertMedicalRecord): Promise<MedicalRecord> {
    const [medicalRecord] = await db.insert(medicalRecords).values(record).returning();
    return medicalRecord;
  }

  async getMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
    return await db.select().from(medicalRecords).where(eq(medicalRecords.patientId, patientId));
  }

  async getMedicalRecord(id: string): Promise<MedicalRecord | undefined> {
    const [record] = await db.select().from(medicalRecords).where(eq(medicalRecords.id, id));
    return record || undefined;
  }

  // Access Permissions
  async createAccessPermission(permission: InsertAccessPermission): Promise<AccessPermission> {
    const [perm] = await db.insert(accessPermissions).values(permission).returning();
    return perm;
  }

  async getAccessPermission(id: string): Promise<AccessPermission | undefined> {
    const [permission] = await db
      .select()
      .from(accessPermissions)
      .where(eq(accessPermissions.id, id));
    return permission || undefined;
  }

  async getAccessPermissions(recordId: string): Promise<AccessPermission[]> {
    return await db
      .select()
      .from(accessPermissions)
      .where(and(
        eq(accessPermissions.recordId, recordId),
        eq(accessPermissions.isActive, true)
      ));
  }

  async revokeAccessPermission(id: string): Promise<void> {
    await db
      .update(accessPermissions)
      .set({ isActive: false, revokedAt: new Date() })
      .where(eq(accessPermissions.id, id));
  }

  async getUserAccessibleRecords(userId: string): Promise<MedicalRecord[]> {
    const permissions = await db
      .select()
      .from(accessPermissions)
      .where(and(
        eq(accessPermissions.grantedToId, userId),
        eq(accessPermissions.isActive, true)
      ));

    if (permissions.length === 0) return [];

    const recordIds = permissions.map(p => p.recordId);
    return await db
      .select()
      .from(medicalRecords)
      .where(eq(medicalRecords.id, recordIds[0])); // Simplified for MVP
  }

  // Prescriptions
  async createPrescription(prescription: InsertPrescription): Promise<Prescription> {
    const [presc] = await db.insert(prescriptions).values(prescription).returning();
    return presc;
  }

  async getPrescriptions(filters: { doctorId?: string; patientId?: string }): Promise<Prescription[]> {
    let query = db.select().from(prescriptions);

    if (filters.doctorId) {
      return await query.where(eq(prescriptions.doctorId, filters.doctorId));
    }
    if (filters.patientId) {
      return await query.where(eq(prescriptions.patientId, filters.patientId));
    }

    return await query;
  }

  async getPrescription(id: string): Promise<Prescription | undefined> {
    const [presc] = await db.select().from(prescriptions).where(eq(prescriptions.id, id));
    return presc || undefined;
  }

  async updatePrescriptionStatus(id: string, status: string, dispensedById?: string): Promise<Prescription> {
    const updateData: any = { status };
    if (status === 'dispensed' && dispensedById) {
      updateData.dispensedById = dispensedById;
      updateData.dispensedAt = new Date();
    }

    const [presc] = await db
      .update(prescriptions)
      .set(updateData)
      .where(eq(prescriptions.id, id))
      .returning();

    return presc;
  }

  // Prescription Items
  async createPrescriptionItems(items: InsertPrescriptionItem[]): Promise<PrescriptionItem[]> {
    return await db.insert(prescriptionItems).values(items).returning();
  }

  async getPrescriptionItems(prescriptionId: string): Promise<PrescriptionItem[]> {
    return await db
      .select()
      .from(prescriptionItems)
      .where(eq(prescriptionItems.prescriptionId, prescriptionId));
  }

  // Insurance Claims
  async createInsuranceClaim(claim: InsertInsuranceClaim): Promise<InsuranceClaim> {
    const [insuranceClaim] = await db.insert(insuranceClaims).values(claim).returning();
    return insuranceClaim;
  }

  async getInsuranceClaims(filters: { patientId?: string; agentId?: string }): Promise<InsuranceClaim[]> {
    let query = db.select().from(insuranceClaims);

    if (filters.patientId) {
      return await query.where(eq(insuranceClaims.patientId, filters.patientId));
    }
    if (filters.agentId) {
      return await query.where(eq(insuranceClaims.agentId, filters.agentId));
    }

    return await query;
  }

  async getInsuranceClaim(id: string): Promise<InsuranceClaim | undefined> {
    const [claim] = await db.select().from(insuranceClaims).where(eq(insuranceClaims.id, id));
    return claim || undefined;
  }

  async updateClaimStatus(id: string, status: string, reviewNotes?: string): Promise<InsuranceClaim> {
    const updateData: any = { status, updatedAt: new Date() };
    if (reviewNotes) {
      updateData.reviewNotes = reviewNotes;
    }

    const [claim] = await db
      .update(insuranceClaims)
      .set(updateData)
      .where(eq(insuranceClaims.id, id))
      .returning();

    return claim;
  }

  // Blockchain Transactions
  async getBlockchainTransactions(filters: { actorId?: string; resourceId?: string }): Promise<BlockchainTransaction[]> {
    let query = db.select().from(blockchainTransactions).orderBy(desc(blockchainTransactions.timestamp));

    if (filters.actorId) {
      return await query.where(eq(blockchainTransactions.actorId, filters.actorId));
    }
    if (filters.resourceId) {
      return await query.where(eq(blockchainTransactions.resourceId, filters.resourceId));
    }

    return await query;
  }

  // Health Insights
  async createHealthInsight(insight: InsertHealthInsight): Promise<HealthInsight> {
    const [healthInsight] = await db.insert(healthInsights).values(insight).returning();
    return healthInsight;
  }

  async getHealthInsights(patientId: string, unreadOnly?: boolean): Promise<HealthInsight[]> {
    let query = db
      .select()
      .from(healthInsights)
      .where(eq(healthInsights.patientId, patientId))
      .orderBy(desc(healthInsights.createdAt));

    if (unreadOnly) {
      const results = await query;
      return results.filter(i => !i.isRead);
    }

    return await query;
  }

  async markInsightAsRead(id: string): Promise<void> {
    await db
      .update(healthInsights)
      .set({ isRead: true })
      .where(eq(healthInsights.id, id));
  }
}

export const storage = new DatabaseStorage();
