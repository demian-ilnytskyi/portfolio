## **Challenge**

The objective was to engineer and stabilize **Liva Clinic**, an all-in-one healthcare ecosystem connecting clinics, doctors, and patients. The platform needed to support three distinct applications: a Patient Web & Mobile portal for booking and attending visits, a Doctor workspace for schedule management and virtual consultations, and a comprehensive Admin Panel for clinic staff. Key technical challenges included handling complex multi-timezone calendar scheduling, preventing double-booking overlaps for recurring doctor availability, supporting seamless in-person and Agora-powered video consultations, and ensuring reliable payment processing via Stripe Connect.

---

## **Solution**

Working on both the frontend and backend, I contributed to optimizing and stabilizing the platform:

As part of the cross-platform development, I enhanced and stabilized responsive Web and Mobile interfaces for both doctors and patients using Clean Architecture and BLoC state management, delivering smooth navigation, interactive calendars, and instant search filtering.

On the backend, I scaled the Node.js and Express services with PostgreSQL and Sequelize, refactoring complex availability and recurring slot overlap algorithms with timezone-aware calculations.

For telehealth and communications, I integrated Agora RTC for low-latency, encrypted audio and video consultations, Google Maps API for clinic location verification, SendGrid for automated email reminders, and Twilio for SMS alerts.

To support clinic monetization, I integrated Stripe and Stripe Connect to facilitate seamless consultation payments and automated payout distributions. Additionally, I configured AWS cloud services including S3 bucket asset pipelines and CloudWatch monitoring.

---

## **Result**

The platform achieved high stability, responsive load times, and a frictionless experience across web and mobile. Doctors gained intuitive control over their working hours and virtual practices, while patients benefited from real-time doctor discovery, instant appointment confirmation, and encrypted teleconsultations. The streamlined admin panel significantly reduced clinic administrative workload and manual scheduling errors.

---

**Technologies Used:**

- Flutter & Flutter Web
- Node.js & Express
- PostgreSQL & Sequelize
- Clean Architecture (BLoC)
- Agora RTC (Video Consultations)
- Stripe & Stripe Connect
- AWS (S3, CloudWatch)
- Google Maps Platform
- Twilio SMS
- SendGrid
- REST API Design
- UX & UI Optimization
