import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import { storage } from "./storage";
import { BlockchainService } from "./blockchain";
import { HealthInsightsAnalyzer } from "./health-insights";
import { insertUserSchema, insertMedicalRecordSchema, insertPrescriptionSchema, insertPrescriptionItemSchema, insertInsuranceClaimSchema } from "@shared/schema";

const JWT_SECRET = process.env.SESSION_SECRET || 'mediguard-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Configure multer for file uploads (in-memory storage for MVP)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ==================== AUTHENTICATION ====================

  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
        expiresIn: '7d',
      });

      // Don't send password back
      const { password, ...userWithoutPassword } = user;

      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, {
        expiresIn: '7d',
      });

      const { password: _, ...userWithoutPassword } = user;

      res.json({ user: userWithoutPassword, token });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Login failed' });
    }
  });

  // ==================== PATIENT ENDPOINTS ====================

  app.get('/api/patient/stats', authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;

      const records = await storage.getMedicalRecords(userId);
      const insights = await storage.getHealthInsights(userId);
      const transactions = await storage.getBlockchainTransactions({ actorId: userId });

      // Count shared records
      let sharedCount = 0;
      for (const record of records) {
        const permissions = await storage.getAccessPermissions(record.id);
        if (permissions.length > 0) sharedCount++;
      }

      res.json({
        totalRecords: records.length,
        sharedRecords: sharedCount,
        totalInsights: insights.length,
        blockchainTransactions: transactions.length,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/medical-records', authenticateToken, upload.single('file'), async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const file = (req as any).file;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // In production, upload to cloud storage (S3, etc.)
      // For MVP, we'll store file info and simulate upload
      const fileUrl = `/uploads/${Date.now()}-${file.originalname}`;

      const record = await storage.createMedicalRecord({
        patientId: userId,
        title: req.body.title,
        description: req.body.description || '',
        fileType: file.mimetype,
        fileUrl,
        fileSize: file.size,
        recordType: req.body.recordType,
      });

      // Log blockchain transaction
      await BlockchainService.recordTransaction(
        userId,
        'upload_record',
        'medical_record',
        record.id,
        { title: record.title, fileType: record.fileType }
      );

      // Analyze for health insights
      if (req.body.description) {
        await HealthInsightsAnalyzer.analyzeRecord(record.id, userId, req.body.description);
      }

      res.json(record);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/medical-records', authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const records = await storage.getMedicalRecords(userId);
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/access-permissions', authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const { recordId, grantedToId } = req.body;

      // Verify ownership before granting access
      const record = await storage.getMedicalRecord(recordId);
      if (!record || record.patientId !== userId) {
        return res.status(403).json({ error: 'Access denied. You can only grant access to your own records.' });
      }

      const permission = await storage.createAccessPermission({
        recordId,
        grantedToId,
        grantedById: userId,
        accessLevel: 'view',
      });

      // Log blockchain transaction
      await BlockchainService.recordTransaction(
        userId,
        'grant_access',
        'medical_record',
        recordId,
        { grantedTo: grantedToId }
      );

      res.json(permission);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/access-permissions', authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const recordId = req.query.recordId as string;

      if (recordId) {
        // Verify ownership before returning permissions
        const record = await storage.getMedicalRecord(recordId);
        if (!record || record.patientId !== userId) {
          return res.status(403).json({ error: 'Access denied. You do not own this record.' });
        }
        
        const permissions = await storage.getAccessPermissions(recordId);
        res.json(permissions);
      } else {
        // Get all permissions for user's records
        const records = await storage.getMedicalRecords(userId);
        const allPermissions: any[] = [];
        
        for (const record of records) {
          const perms = await storage.getAccessPermissions(record.id);
          allPermissions.push(...perms.map(p => ({ ...p, recordTitle: record.title })));
        }
        
        res.json(allPermissions);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/access-permissions/:id', authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const permissionId = req.params.id;

      // Verify ownership before revoking - get the permission first
      const permission = await storage.getAccessPermission(permissionId);
      if (!permission) {
        return res.status(404).json({ error: 'Permission not found' });
      }
      
      // Verify the permission was granted by this user
      if (permission.grantedById !== userId) {
        return res.status(403).json({ error: 'Access denied. You can only revoke permissions you granted.' });
      }

      await storage.revokeAccessPermission(permissionId);

      // Log blockchain transaction
      await BlockchainService.recordTransaction(
        userId,
        'revoke_access',
        'access_permission',
        permissionId,
        {}
      );

      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/health-insights', authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const insights = await storage.getHealthInsights(userId);
      res.json(insights);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== DOCTOR ENDPOINTS ====================

  app.get('/api/doctor/stats', authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;

      const prescriptions = await storage.getPrescriptions({ doctorId: userId });
      const pending = prescriptions.filter(p => p.status === 'pending').length;
      const dispensed = prescriptions.filter(p => p.status === 'dispensed').length;

      // Count unique patients
      const uniquePatients = new Set(prescriptions.map(p => p.patientId));

      res.json({
        totalPrescriptions: prescriptions.length,
        pendingPrescriptions: pending,
        dispensedPrescriptions: dispensed,
        totalPatients: uniquePatients.size,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/prescriptions', authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const { prescription, medications } = req.body;

      // Create blockchain hash for prescription
      const blockchainHash = BlockchainService.createResourceHash({
        doctorId: userId,
        patientId: prescription.patientId,
        diagnosis: prescription.diagnosis,
        medications,
        timestamp: new Date(),
      });

      const newPrescription = await storage.createPrescription({
        patientId: prescription.patientId,
        doctorId: userId,
        diagnosis: prescription.diagnosis,
        notes: prescription.notes || '',
        blockchainHash,
      });

      // Create prescription items
      const items = medications.map((med: any) => ({
        prescriptionId: newPrescription.id,
        medicationName: med.medicationName,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
        instructions: med.instructions || '',
      }));

      await storage.createPrescriptionItems(items);

      // Log blockchain transaction
      await BlockchainService.recordTransaction(
        userId,
        'create_prescription',
        'prescription',
        newPrescription.id,
        { patientId: prescription.patientId, diagnosis: prescription.diagnosis }
      );

      res.json(newPrescription);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/prescriptions', authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const role = (req as any).user.role;

      let prescriptions;
      if (role === 'doctor') {
        prescriptions = await storage.getPrescriptions({ doctorId: userId });
      } else if (role === 'patient') {
        prescriptions = await storage.getPrescriptions({ patientId: userId });
      } else {
        prescriptions = await storage.getPrescriptions({});
      }

      res.json(prescriptions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/prescriptions/:id', authenticateToken, async (req, res) => {
    try {
      const prescription = await storage.getPrescription(req.params.id);
      if (!prescription) {
        return res.status(404).json({ error: 'Prescription not found' });
      }

      const items = await storage.getPrescriptionItems(prescription.id);

      res.json({ ...prescription, items });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== PHARMACY ENDPOINTS ====================

  app.get('/api/pharmacy/stats', authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;

      const allPrescriptions = await storage.getPrescriptions({});
      const dispensedByMe = allPrescriptions.filter(p => p.dispensedById === userId);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dispensedToday = dispensedByMe.filter(p => {
        if (!p.dispensedAt) return false;
        const dispenseDate = new Date(p.dispensedAt);
        dispenseDate.setHours(0, 0, 0, 0);
        return dispenseDate.getTime() === today.getTime();
      }).length;

      res.json({
        verifiedPrescriptions: dispensedToday,
        dispensedToday,
        totalDispensed: dispensedByMe.length,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/prescriptions/:id/verify', authenticateToken, async (req, res) => {
    try {
      const prescription = await storage.getPrescription(req.params.id);
      if (!prescription) {
        return res.status(404).json({ error: 'Prescription not found' });
      }

      const items = await storage.getPrescriptionItems(prescription.id);

      res.json({
        ...prescription,
        items,
        verified: true,
        message: 'Prescription verified on blockchain',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/prescriptions/:id/dispense', authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const prescriptionId = req.params.id;

      const prescription = await storage.updatePrescriptionStatus(prescriptionId, 'dispensed', userId);

      // Log blockchain transaction
      await BlockchainService.recordTransaction(
        userId,
        'dispense_prescription',
        'prescription',
        prescriptionId,
        {}
      );

      res.json(prescription);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ==================== INSURANCE ENDPOINTS ====================

  app.get('/api/insurance/stats', authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const role = (req as any).user.role;

      let claims;
      if (role === 'patient') {
        claims = await storage.getInsuranceClaims({ patientId: userId });
      } else if (role === 'insurance') {
        claims = await storage.getInsuranceClaims({ agentId: userId });
      } else {
        claims = await storage.getInsuranceClaims({});
      }

      res.json({
        totalClaims: claims.length,
        pendingClaims: claims.filter(c => c.status === 'submitted' || c.status === 'under_review').length,
        approvedClaims: claims.filter(c => c.status === 'approved' || c.status === 'paid').length,
        rejectedClaims: claims.filter(c => c.status === 'rejected').length,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/claims', authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;

      // Create blockchain hash for claim
      const blockchainHash = BlockchainService.createResourceHash({
        patientId: userId,
        policyNumber: req.body.policyNumber,
        claimAmount: req.body.claimAmount,
        timestamp: new Date(),
      });

      const claim = await storage.createInsuranceClaim({
        patientId: userId,
        policyNumber: req.body.policyNumber,
        policyProvider: req.body.policyProvider,
        claimAmount: req.body.claimAmount,
        claimType: req.body.claimType,
        description: req.body.description,
        supportingDocuments: req.body.supportingDocuments || [],
        blockchainHash,
      });

      // Log blockchain transaction
      await BlockchainService.recordTransaction(
        userId,
        'submit_claim',
        'insurance_claim',
        claim.id,
        { claimAmount: claim.claimAmount, policyNumber: claim.policyNumber }
      );

      res.json(claim);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/claims', authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const role = (req as any).user.role;

      let claims;
      if (role === 'patient') {
        claims = await storage.getInsuranceClaims({ patientId: userId });
      } else if (role === 'insurance') {
        claims = await storage.getInsuranceClaims({ agentId: userId });
      } else {
        claims = await storage.getInsuranceClaims({});
      }

      res.json(claims);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/claims/:id', authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const { status, reviewNotes } = req.body;

      const claim = await storage.updateClaimStatus(req.params.id, status, reviewNotes);

      // Log blockchain transaction
      await BlockchainService.recordTransaction(
        userId,
        'update_claim_status',
        'insurance_claim',
        claim.id,
        { newStatus: status }
      );

      res.json(claim);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ==================== BLOCKCHAIN ENDPOINTS ====================

  app.get('/api/blockchain/transactions', authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const transactions = await storage.getBlockchainTransactions({ actorId: userId });
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
