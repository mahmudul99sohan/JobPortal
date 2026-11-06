<div align="center">

# JobPortal

**A full-stack job portal with role-based access, OTP email verification and an admin dashboard.**

![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-TypeORM-4169E1?logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)

</div>

---

## Overview

JobPortal is a two-part web application:

- **`job_porta/`** is a REST API built with **NestJS**, **TypeORM** and **PostgreSQL**.
- **`job_porta_front/`** is the web client built with **Next.js (App Router)**, **React 19** and **Tailwind CSS**.

The focus of the project is a secure account lifecycle: admins create accounts, users verify their email with a one-time password (OTP), log in with a JWT, and can recover their password through a time-limited reset link. An admin dashboard lets staff search, filter and ban or unban users.

## Features

**Authentication and security**
- Login with **email or username** (custom validator accepts either).
- **JWT** access tokens (1 hour expiry) checked by a custom `JwtAuthGuard`.
- **Email OTP verification**: a 6-digit code, bcrypt-hashed in the database, valid for 5 minutes. Unverified accounts must supply the OTP at login.
- **Password reset by email link**: a signed 15-minute JWT, signed with its own secret, separate from the access-token secret.
- Passwords hashed with **bcrypt**. Strong-password rules enforced by DTO validation (8+ characters with upper case, lower case, number and symbol).
- Global `ValidationPipe` with `whitelist` and `forbidNonWhitelisted`, so unknown fields are rejected.
- Banned accounts are blocked at login.

**Users and roles**
- Five roles: `super_admin`, `admin`, `employer`, `job_seeker`, `editor`.
- `@Roles()` decorator and `RolesGuard` for role-based access control.
- **Role-based user IDs** such as `20-00001-8` (role prefix, zero-padded counter, role suffix), generated inside a database transaction.
- `super_admin` accounts are hidden from the user list for regular admins.

**Admin dashboard (Next.js)**
- User management: search by name, username or email, filter by status, role and email-verified, and ban or unban in one click.
- Add-user form with client-side validation.
- Responsive sidebar layout with a dark-mode friendly design.
- Forgot-password and reset-password pages with a live password-strength meter.

**Jobs (in progress)**
- Job entity with `pending`, `approved` and `rejected` states, plus create, update, delete, approve and reject service logic. See [Project status](#project-status).

## Tech stack

| Layer | Technologies |
|---|---|
| Backend | NestJS 11, TypeScript, TypeORM, PostgreSQL, Passport/JWT, bcrypt, class-validator, Nodemailer |
| Frontend | Next.js 15 (App Router), React 19, Tailwind CSS 4, daisyUI 5, Lucide icons, react-hot-toast |
| Tooling | ESLint, Prettier, Jest |

## Project structure

```
JobPortal/
├── job_porta/               # NestJS REST API
│   └── src/
│       ├── auth/            # login, reset password, JWT guard, roles guard
│       ├── user/            # user CRUD, ban, OTP and reset emails
│       ├── otp/             # OTP generation and validation
│       ├── email/           # Nodemailer service
│       ├── job/             # job entity, service, controller (not yet enabled)
│       └── common/          # shared validators
└── job_porta_front/         # Next.js client
    └── src/app/
        ├── home/            # landing page
        ├── login/
        ├── forgot-password/
        ├── reset-password/
        └── admin/dashboard/ # users, add-user, add-job
```

## Getting started

### Prerequisites

- Node.js 20 or newer
- PostgreSQL
- An SMTP account for sending OTP and reset emails (a Gmail app password or Mailtrap works)

### 1. Clone

```bash
git clone https://github.com/mahmudul99sohan/JobPortal.git
cd JobPortal
```

### 2. Database

Create the database:

```sql
CREATE DATABASE job_portal_db_1;
```

TypeORM creates the `user`, `otp` and `job` tables automatically (`synchronize: true`). The role-based ID counter is a plain SQL table that you create once:

```sql
CREATE TABLE user_role_counters (
  role    VARCHAR(50) PRIMARY KEY,
  counter INTEGER NOT NULL DEFAULT 0
);
```

### 3. Backend

```bash
cd job_porta
npm install
```

Create `job_porta/.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=job_portal_db_1

# JWT (use long random strings)
JWT_SECRET=change_me
JWT_RESET_SECRET=change_me_too

# SMTP
MAIL_HOST=smtp.example.com
MAIL_PORT=587
EMAIL_USER=you@example.com
EMAIL_PASS=your_smtp_password

# Link used in the password-reset email
RESET_PASSWORD_URL=http://localhost:3001/reset-password
```

Start the API on **http://localhost:3000**:

```bash
npm run start:dev
```

### 4. Frontend

```bash
cd job_porta_front
npm install
npm run dev
```

The client runs on **http://localhost:3001**. The API URL is currently hard-coded to `http://localhost:3000` and CORS allows `http://localhost:3001`.

### 5. Create the first account

Accounts are created through the API. Create a super admin, then read the OTP from the email that is sent:

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Super",
    "last_name": "Admin",
    "email": "admin@example.com",
    "password": "Passw0rd!",
    "role": "super_admin"
  }'
```

Log in once with the OTP to verify the account (afterwards the OTP is no longer needed):

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "identifier": "admin@example.com", "password": "Passw0rd!", "otp": "123456" }'
```

Then open http://localhost:3001/login.

## API reference

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/login` | Log in with email or username. Accepts an optional `otp` to verify the account. Returns `accessToken`. | Public |
| `POST` | `/auth/reset-password` | Set a new password using the emailed reset token. | Public |
| `GET` | `/auth/profile` | Current user from the JWT. | Bearer token |
| `POST` | `/users` | Create a user and email an OTP. | Public (see status) |
| `GET` | `/users` | List users (super admins excluded for admins). | Bearer token |
| `PATCH` | `/users/:id/ban` | Ban or unban a user with `{ "is_banned": true }`. | Public (see status) |
| `POST` | `/users/request-otp` | Re-send the verification OTP. | Public |
| `POST` | `/users/forgot-password` | Email a password-reset link. | Public |

## Scripts

| Where | Command | Purpose |
|---|---|---|
| `job_porta` | `npm run start:dev` | API with watch mode |
| `job_porta` | `npm run build` / `npm run start:prod` | Production build and run |
| `job_porta` | `npm run lint` / `npm test` | Lint and unit tests |
| `job_porta_front` | `npm run dev` | Dev server on port 3001 |
| `job_porta_front` | `npm run build` / `npm start` | Production build and run |

## Project status

This is a learning project that is still under active development. Being upfront about where it stands:

**Working end to end:** account creation, OTP verification, login, JWT-protected routes, forgot and reset password, user list with filters, ban and unban.

**Not finished yet:**
- The **Job module** is implemented (entity, service, controller) but not yet registered in `AppModule`, so `/jobs` endpoints are not served. The "Add Job" form in the admin panel will start working once it is enabled and the route is aligned.
- The public **landing page** uses sample data. Sign-up, job listing, and job detail pages are not built yet. The dashboard statistics cards are placeholders.
- The `/` route is empty; use `/home` or `/login`.

**Hardening planned before any deployment:**
- Enforce authentication and `RolesGuard` on `POST /users`, `PATCH /users/:id/ban` and `GET /users` (the `@Roles()` decorators exist, but the guard is not applied on every route).
- Remove the unauthenticated `POST /email/send` and `GET /users/test-update/:role` helper routes.
- Stop including the password hash in the OTP email.
- Move `synchronize: true` to proper migrations and create `user_role_counters` through one.
- Read the API base URL from an environment variable.
- Add tests (only the Nest starter specs exist today).

## Roadmap

- [ ] Enable and secure the Job module (post, approve, reject, search)
- [ ] Public job listing and detail pages
- [ ] Self-service sign-up for job seekers and employers
- [ ] Job applications and resume upload
- [ ] Database migrations and Docker Compose setup
- [ ] Unit and e2e tests, CI with GitHub Actions

## Author

**Mahmudul Hasan**, CSE graduate (AIUB).
[GitHub](https://github.com/mahmudul99sohan) · [LinkedIn](https://www.linkedin.com/in/mahmudul-hasan-26470715a/)