# MediGuard - Blockchain-Based Healthcare Data Management System

## Overview
MediGuard is a comprehensive healthcare data management platform that leverages blockchain technology for secure, transparent, and patient-controlled medical data sharing. The system serves four user roles: Patients, Doctors, Pharmacies, and Insurance Agents.

## Current State
**Phase**: MVP Complete - Ready for Testing
**Last Updated**: January 2025
**Status**: All core features implemented and integrated

## Project Architecture

### Tech Stack
- **Frontend**: React.js + TypeScript + Wouter (routing)
- **UI Framework**: Shadcn UI + TailwindCSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **State Management**: TanStack Query (React Query v5)
- **Authentication**: JWT-based with role management
- **Blockchain**: Simulated blockchain with cryptographic hashing

### Design System
- **Primary Color**: Medical Blue (210 85% 45%)
- **Fonts**: 
  - Sans: Inter (body text)
  - Serif: Manrope (headings)
  - Mono: JetBrains Mono (blockchain hashes)
- **Theme**: Light/Dark mode support
- **Color Coding**:
  - Patient: Blue (#2563eb)
  - Doctor: Green (#22c55e)
  - Pharmacy: Teal (#06b6d4)
  - Insurance: Orange (#f97316)

## Features

### User Roles & Capabilities

#### 1. Patient
- Upload medical records (lab reports, imaging, prescriptions)
- Grant/revoke access to healthcare providers
- View blockchain transaction history
- Receive AI-powered health insights
- Track all data access events

#### 2. Doctor
- Create blockchain-verified e-prescriptions
- View patient medical records (with permission)
- Manage prescription history
- Digital signature on prescriptions

#### 3. Pharmacy
- Verify prescription authenticity via blockchain
- Scan QR codes or enter prescription IDs
- Mark prescriptions as dispensed
- View dispensing history

#### 4. Insurance Agent
- Browse health insurance plans (PolicyBazaar integration)
- Submit insurance claims
- Track claim status (submitted → under review → approved/rejected → paid)
- View blockchain-verified claim history

### Database Schema

#### Core Tables
1. **users** - User accounts with role-based access
   - Roles: patient, doctor, pharmacy, insurance
   - Includes specialization (doctors), license numbers (doctors/pharmacies)

2. **medical_records** - Patient-uploaded health documents
   - File metadata, type, upload timestamp
   - Linked to patient accounts

3. **access_permissions** - Granular access control
   - Tracks who can access which records
   - Grant/revoke capability with timestamps
   - Blockchain-logged consent management

4. **prescriptions** - Doctor-created e-prescriptions
   - Diagnosis, notes, blockchain hash
   - Status tracking (pending → verified → dispensed)

5. **prescription_items** - Medication details
   - Medication name, dosage, frequency, duration
   - Instructions for use

6. **insurance_claims** - Claim submissions and tracking
   - Policy details, claim amount, type
   - Status workflow with blockchain verification
   - Supporting documents (JSON array)

7. **blockchain_transactions** - Immutable audit log
   - Transaction hash (SHA-256)
   - Actor, action type, resource references
   - Previous hash for blockchain chain integrity

8. **health_insights** - AI-generated health alerts
   - Insight type, severity levels
   - Recommendations based on uploaded data

## Project Structure

```
/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/ (Shadcn components)
│   │   │   ├── dashboard-layout.tsx (Role-based sidebar)
│   │   │   ├── theme-provider.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── lib/
│   │   │   ├── auth-context.tsx (Auth state management)
│   │   │   └── queryClient.ts
│   │   ├── pages/
│   │   │   ├── landing.tsx (Marketing page)
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx (Role selection)
│   │   │   ├── patient-dashboard.tsx
│   │   │   ├── doctor-dashboard.tsx
│   │   │   ├── pharmacy-dashboard.tsx
│   │   │   └── insurance-dashboard.tsx
│   │   ├── App.tsx (Routing + Protected routes)
│   │   └── index.css (Design tokens)
│   └── index.html
├── server/
│   ├── routes.ts (API endpoints - TO BE IMPLEMENTED)
│   ├── storage.ts (Database interface - TO BE IMPLEMENTED)
│   └── db.ts (TO BE CREATED - PostgreSQL connection)
├── shared/
│   └── schema.ts (Drizzle schema + Zod types)
├── design_guidelines.md (Visual design system)
└── replit.md (This file)
```

## API Endpoints (To Be Implemented)

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Login with JWT token

### Patient APIs
- `GET /api/patient/stats` - Dashboard statistics
- `POST /api/medical-records` - Upload medical record
- `GET /api/medical-records` - List patient's records
- `POST /api/access-permissions` - Grant access
- `DELETE /api/access-permissions/:id` - Revoke access
- `GET /api/health-insights` - Get AI insights

### Doctor APIs
- `GET /api/doctor/stats` - Dashboard statistics
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions` - List doctor's prescriptions
- `GET /api/patients` - List patients (with access)

### Pharmacy APIs
- `GET /api/pharmacy/stats` - Dashboard statistics
- `GET /api/prescriptions/:id/verify` - Verify prescription
- `POST /api/prescriptions/:id/dispense` - Mark as dispensed

### Insurance APIs
- `GET /api/insurance/stats` - Dashboard statistics
- `POST /api/claims` - Submit new claim
- `GET /api/claims` - List user's claims
- `PATCH /api/claims/:id` - Update claim status

### Blockchain APIs
- `GET /api/blockchain/transactions` - Get transaction history
- `POST /api/blockchain/transaction` - Create new transaction

## Blockchain Implementation

### Simulated Blockchain Features
1. **Cryptographic Hashing**: SHA-256 for transaction integrity
2. **Chain Linking**: Each transaction references previous hash
3. **Immutability**: Read-only transaction log
4. **Transparency**: All actions auditable
5. **Consent Tracking**: Access grants/revokes on blockchain

### Transaction Types
- `grant_access` - Patient grants record access
- `revoke_access` - Patient revokes record access
- `create_prescription` - Doctor creates prescription
- `verify_prescription` - Pharmacy verifies prescription
- `dispense_prescription` - Pharmacy dispenses medication
- `submit_claim` - Insurance claim submission
- `update_claim` - Claim status change

## AI Health Insights

### Rule-Based Analysis (MVP)
- **High Blood Pressure Alert**: BP > 140/90
- **High Blood Sugar Alert**: Glucose > 180 mg/dL
- **Abnormal Lab Values**: Out-of-range results
- **Medication Interaction Warnings**: Based on prescription history
- **Preventive Care Reminders**: Checkup scheduling

### Future Enhancement
- TensorFlow.js integration
- Predictive health models
- Personalized recommendations

## User Preferences
- Clean, professional medical-grade UI
- Blockchain transparency emphasized
- Mobile-responsive design
- Accessibility (WCAG AA compliance)

## Recent Changes
- 2025-01: Created complete database schema with 8 tables
- 2025-01: Built authentication system with 4 user roles
- 2025-01: Designed all dashboard UIs (Patient, Doctor, Pharmacy, Insurance)
- 2025-01: Implemented theme toggle (light/dark mode)
- 2025-01: Created landing page with hero image
- 2025-01: Implemented all backend APIs (auth, medical records, prescriptions, pharmacy, insurance)
- 2025-01: Created blockchain simulation service with SHA-256 hashing
- 2025-01: Built health insights analyzer with rule-based alerts
- 2025-01: Integrated frontend with backend using JWT authentication
- 2025-01: Database tables created and migrations complete

## Next Steps
1. **Backend Implementation** (Task 2)
   - Create PostgreSQL connection (server/db.ts)
   - Implement all API endpoints in routes.ts
   - Create DatabaseStorage class
   - Build blockchain simulation service
   - Implement file upload handling
   - Create health insights analyzer

2. **Integration** (Task 3)
   - Connect frontend to backend APIs
   - Implement data fetching with React Query
   - Add loading states and error handling
   - Test all user workflows
   - Deploy and publish

## Notes
- PostgreSQL database is provisioned and ready
- Environment variables configured (DATABASE_URL, etc.)
- All frontend components use data-testid for e2e testing
- Design follows medical-grade professional standards
