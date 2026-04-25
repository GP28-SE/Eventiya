# Sprint 4 Backlog: Validation, Notifications & Analytics

## Epic: QR Code & Validation
*Goal: Ensure authenticity and facilitate seamless entry at the venue.*

### User Stories:
1. **Story: Unique QR code generation**
   - *As a system, I want to generate a unique QR code for each ticket to ensure authenticity.*
   - **Tasks:**
     - [ ] [BACKEND] Implement `QRCodeService` using ZXing library.
     - [ ] [BACKEND] Generate secure, signed JWT tokens for QR data (bookingId, ticketIndex).
     - [ ] [FRONTEND] Create `TicketCard` component to display QR code on verified tickets.
2. **Story: QR Validation/Check-in**
   - *As an organizer, I want to scan and validate attendee QR codes at the venue for check-in.*
   - **Tasks:**
     - [ ] [FRONTEND] Implement `ScannerPage` using `html5-qrcode` or similar library.
     - [ ] [BACKEND] Create `/api/validation/check-in` endpoint to verify tokens and update attendance status.

## Epic: Notifications
*Goal: Keep attendees informed through automated communication.*

### User Stories:
1. **Story: Automated Email Confirmations**
   - *As a system, I want to send automated email confirmations and event reminders to attendees.*
   - **Tasks:**
     - [ ] [BACKEND] Setup `spring-boot-starter-mail` configuration.
     - [ ] [BACKEND] Implement `EmailService` with Thymeleaf templates.
     - [ ] [BACKEND] Trigger emails on:
       - Booking submission (Payment instructions).
       - Payment approval (Final ticket with QR).
       - Event reminder (Scheduled task for 24h before event).

## Epic: Admin & Metrics
*Goal: Provide data-driven insights and platform control.*

### User Stories:
1. **Story: Sales & Attendance Analytics**
   - *As an organizer/admin, I want to see sales analytics and attendance reports to measure event success.*
   - **Tasks:**
     - [ ] [BACKEND] Create `/api/analytics/sales` and `/api/analytics/attendance` endpoints.
     - [ ] [FRONTEND] Implement `AnalyticsDashboard` with Recharts or Chart.js.
2. **Story: Platform & User Management**
   - *As an admin, I want to manage platform users and monitor event status for quality control.*
   - **Tasks:**
     - [ ] [FRONTEND] Implement `UserManagement` table (Search, Filter, Role update).
     - [ ] [FRONTEND] Implement `AdminVerification` page to review bank transfer receipts.

## Epic: Payment Flow (Bank Transfer Only)
*Goal: Secure manual payment handling.*

### User Stories:
1. **Story: Bank Transfer Checkout**
   - *As an attendee, I want to pay via bank transfer and upload my receipt to secure my ticket.*
   - **Tasks:**
     - [ ] [FRONTEND] Update `BookingFlow` to show Bank Account details.
     - [ ] [FRONTEND] Add `ReceiptUpload` component.
     - [ ] [BACKEND] Update `Booking` entity to handle `proofUrl` and `status` (PENDING_VERIFICATION).
