# MediGuard Design Guidelines

## Design Approach: Healthcare-Focused Design System

**Selected Approach**: Medical Design System with Material Design principles
**Justification**: Healthcare applications demand trust, clarity, and accessibility. Drawing from leading healthcare platforms (Epic, Cerner, HealthKit) and Material Design for data-heavy interfaces.

**Core Principles**:
- Medical-grade clarity and precision
- Trust-building through professional aesthetics
- Role-based visual hierarchy
- Blockchain transparency visualization

---

## Color Palette

### Primary Colors (Medical Trust Theme)
- **Primary Medical Blue**: 210 85% 45% (trust, professionalism)
- **Deep Navy**: 220 40% 20% (headers, emphasis)
- **Success Green**: 145 65% 45% (verification, approvals)
- **Alert Red**: 0 70% 50% (warnings, critical actions)

### Light Mode
- Background: 210 20% 98%
- Surface: 0 0% 100%
- Text Primary: 220 15% 15%
- Text Secondary: 220 10% 45%
- Borders: 210 15% 85%

### Dark Mode
- Background: 220 25% 8%
- Surface: 220 20% 12%
- Text Primary: 210 10% 95%
- Text Secondary: 210 8% 70%
- Borders: 220 15% 20%

### Accent Colors
- **Blockchain Purple**: 270 60% 55% (blockchain features)
- **Insurance Orange**: 25 75% 55% (insurance elements)
- **Pharmacy Teal**: 180 55% 50% (pharmacy actions)

---

## Typography

**Font Families**:
- Primary: "Inter" (UI, forms, data)
- Secondary: "Manrope" (headings, emphasis)
- Monospace: "JetBrains Mono" (blockchain hashes, technical data)

**Scale**:
- Display: 48px/56px, font-bold
- H1: 36px/44px, font-bold
- H2: 28px/36px, font-semibold
- H3: 22px/30px, font-semibold
- Body: 16px/24px, font-normal
- Small: 14px/20px, font-normal
- Caption: 12px/16px, font-medium

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16, 20**
- Micro spacing: p-2, gap-2 (tight elements)
- Component spacing: p-4, p-6, gap-4 (cards, forms)
- Section spacing: p-8, p-12, py-16, py-20 (page sections)

**Grid System**:
- Container: max-w-7xl mx-auto px-4 md:px-8
- Dashboard Layouts: 12-column grid with sidebar (aside: w-64, main: flex-1)
- Card Grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

---

## Component Library

### Navigation
**Top Navigation Bar**:
- Height: h-16, sticky top-0
- Logo + User role badge + notifications + profile dropdown
- Background: blur backdrop with border-b
- Active state: border-b-2 border-primary

**Sidebar Navigation** (Dashboard):
- Width: w-64, fixed left
- Icons + labels, grouped by category
- Active state: bg-primary/10 with left border indicator

### Data Display Components

**Medical Record Cards**:
- White/dark surface with shadow-md
- Header: Patient name + date + status badge
- Body: Scrollable content area with file previews
- Footer: Action buttons (View, Download, Share)
- Border-left color coding by record type

**Prescription Cards**:
- Pharmacy-specific green accent
- Doctor info + medication list + blockchain verification badge
- QR code display for pharmacy scanning
- Status indicator (Pending/Verified/Dispensed)

**Blockchain Transaction Table**:
- Monospace font for hashes
- Color-coded action types (Grant: green, Revoke: red, View: blue)
- Timestamp + actor + action columns
- Copy-to-clipboard for hash values

**Claim Status Timeline**:
- Vertical stepper component
- Current step highlighted with pulse animation
- Completed steps: check icon, green
- Pending steps: gray with dashed connector

### Forms

**Medical Upload Form**:
- Drag-and-drop zone with dashed border
- File preview thumbnails (PDF icons, image previews)
- Progress bars for uploads
- Access control checkboxes for role-based sharing

**Prescription Form** (Doctor):
- Autocomplete medication search
- Dosage + frequency + duration inputs
- Digital signature pad
- Blockchain submission confirmation modal

**Insurance Claim Form**:
- Multi-step wizard (3 steps: Details, Documents, Review)
- Progress indicator at top
- File upload for policy documents
- Summary card before submission

### Data Visualization

**Health Dashboard Charts** (Chart.js):
- Line charts: Health metrics over time (BP, glucose)
- Donut charts: Prescription adherence
- Bar charts: Monthly health score trends
- Color scheme matches primary palette
- Tooltips with precise values

**Access Control Matrix**:
- Table view with toggles
- Columns: Provider name, role, access level, granted date
- Quick revoke button per row
- Filter by role type

### Buttons & Actions

**Primary Actions**:
- bg-primary text-white, rounded-lg, px-6 py-3
- Hover: slight scale + brightness increase
- Disabled: opacity-50, cursor-not-allowed

**Secondary Actions**:
- border-2 border-primary text-primary bg-transparent
- Used for cancel, back actions

**Destructive Actions**:
- bg-red-600 text-white (Delete, Revoke)
- Confirmation modal required

### Modals & Overlays

**Blockchain Confirmation Modal**:
- Center-screen overlay with backdrop blur
- Transaction details summary
- Gas fee estimate (simulated)
- Confirm/Cancel buttons
- Loading spinner during submission

**Access Grant/Revoke Modal**:
- List of providers with checkboxes
- Preview of data they'll access
- Blockchain transaction preview
- Warning for sensitive data

---

## Images & Visual Assets

**Hero Image**: 
- Landing page: Medical professional reviewing blockchain data visualization on screen
- Dimensions: Full viewport width, 60vh height
- Overlay: gradient from transparent to dark at bottom
- CTA buttons with backdrop-blur background

**Dashboard Backgrounds**:
- Subtle medical pattern (DNA helix, heartbeat line) at 5% opacity
- Or: Abstract blockchain node network visualization

**Icons**:
- Use Heroicons for general UI
- Custom medical icons for: stethoscope, prescription, insurance card, blockchain link
- Role badges: color-coded circular avatars with first letter

---

## Role-Specific Theming

**Patient Dashboard**: Blue primary, emphasis on access control
**Doctor Dashboard**: Green accents, focus on prescription creation
**Pharmacy Dashboard**: Teal accents, verification-focused
**Insurance Dashboard**: Orange accents, claim processing focus

---

## Accessibility & Quality

- WCAG AA contrast ratios minimum
- Focus states: 2px ring with offset
- Keyboard navigation throughout
- Screen reader labels for all interactive elements
- Loading states for all async actions
- Error states with clear messaging

---

## Animation Principles

**Use Sparingly**:
- Page transitions: 200ms ease-in-out
- Blockchain transaction confirmation: Success checkmark animation
- Notification toasts: Slide in from top-right
- No decorative animations - function only