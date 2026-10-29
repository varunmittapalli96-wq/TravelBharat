# 🇮🇳 TravelBharat – Explore India State by State

> **A production-grade, highly aesthetic digital travel encyclopedia showcasing all 28 States, 8 Union Territories, and 80+ cities across India.**

TravelBharat provides a centralized, authoritative, and visually stunning reference guide for travelers, researchers, students, and culture enthusiasts. It is strictly an **informational encyclopedia** designed with rich Indian heritage aesthetics, high-resolution imagery, interactive faceted search, UNESCO heritage tracking, best-month travel widgets, and a secure editorial administration console.

---

## 🌟 Key Features

### 🏛️ Public Experience
- **Complete Indian Geography:** All 28 States & 8 Union Territories documented with capitals, state birds/animals/trees, official languages, best travel seasons, and cultural summaries.
- **80+ Curated Cities:** Rich city profiles covering connectivity (nearest airport, railway junction, highway access), climate, and signature culinary delights.
- **Comprehensive Destination Catalog:** Deep-dive destination profiles with high-resolution responsive galleries, entry fee breakdowns (domestic vs. foreign), seasonal operating hours, geo-coordinates, insider tips, and computed distances to nearby attractions.
- **Interactive Faceted Search (`/explore`):** Filter attractions instantly by category (`HERITAGE`, `NATURE`, `BEACH`, `RELIGIOUS`, `ADVENTURE`, etc.), tags, entry fee type (Free / Paid), UNESCO status, and search keywords.
- **Zonal Geographic Explorer:** Filter states and union territories by North, South, East, West, Central, and North-East zones.
- **Best Month Travel Engine:** Interactive selector discovering destinations and regions at their peak weather conditions across all 12 calendar months.
- **Client-Side Saved Destinations (`/saved`):** Bookmark favorite monuments and sanctuaries stored locally in the browser with zero login friction.
- **SEO & Structured Data:** Semantic HTML5, dynamic Open Graph tags, automated XML sitemap generation (`/sitemap.xml`), and rich `TouristAttraction` JSON-LD schemas.

### 🛡️ Editorial Admin Console (`/admin`)
- **Secure Authentication:** JWT-based stateless authentication with HttpOnly cookies, bcrypt-hashed passwords, and dedicated login brute-force rate limiters.
- **Editorial State Machine:** Manage destination publication workflow through formal lifecycle states: `DRAFT` ➔ `IN_REVIEW` ➔ `PUBLISHED` ➔ `ARCHIVED`.
- **Full Audit Trail (`/admin/audit`):** Every administrative action (status transition, edit, creation) is recorded with timestamp, admin ID, IP address, user-agent, and JSON metadata.
- **Live System Health & Metrics:** Dashboard aggregating publication ratios, category breakdowns, state distributions, and moderation queues.

---

## 🏗️ Architecture & Tech Stack

```mermaid
graph TD
    Client[Web Browser / User] -->|HTTP / HTTPS| NextJS[Next.js 14 App Router :3000]
    Admin[Editorial Staff] -->|JWT Session| NextJS
    NextJS -->|REST API v1| Express[Express Node.js API :4000]
    Express -->|Prisma Client| Postgres[(PostgreSQL 16 Engine :5433)]
    Express -->|OpenAPI / Swagger| SwaggerUI[Swagger UI /api/docs]
```

### Technology Matrix
| Layer | Technologies |
|---|---|
| **Monorepo** | Turborepo, npm workspaces |
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React, Framer Motion |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM, Zod, Helmet, Express Rate Limit |
| **Database** | PostgreSQL 16 (Local cluster on port 5433 or Docker Compose) |
| **API Docs** | Swagger JSDoc, Swagger UI Express (`/api/docs`) |
| **Testing** | Vitest, Supertest (14/14 API integration tests passing) |

---

## 📁 Repository Structure

```
TravelBharat – Explore India State by State/
├── apps/
│   ├── api/                     # Express REST API application
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # Relational database models
│   │   ├── src/
│   │   │   ├── middleware/      # Auth, audit, error, rate-limiting
│   │   │   ├── routes/          # API v1 routes & Swagger annotations
│   │   │   └── index.ts         # Express server entry point
│   │   └── tests/               # Vitest integration test suite
│   │
│   └── web/                     # Next.js 14 Frontend application
│       ├── public/              # Static assets & icons
│       └── src/
│           ├── app/             # Next.js App Router pages
│           │   ├── admin/       # Editorial moderation dashboard & audit log
│           │   ├── explore/     # Faceted destination search
│           │   ├── states/      # State directories & detail pages
│           │   ├── cities/      # City directory & detail pages
│           │   ├── places/      # Destination encyclopedia profiles
│           │   ├── saved/       # Local bookmark collection
│           │   ├── about/       # Project mission & methodology
│           │   └── contact/     # Community suggestions & feedback
│           └── components/      # Reusable UI component library
│
├── packages/
│   └── shared/                  # Shared TypeScript interfaces & enums
├── seed/                        # Comprehensive seed data & importer scripts
│   ├── data/                    # JSON datasets (states, cities, places, admins)
│   ├── seed.ts                  # Idempotent Prisma seeder
│   └── check-images.ts          # Image availability verifier
├── docker-compose.yml           # Containerized PostgreSQL service
├── package.json                 # Monorepo root package definition
├── turbo.json                   # Turborepo task pipeline configuration
├── README.md                    # Project documentation
├── PRD.md                       # Product Requirements Document
└── DECISIONS.md                 # Architectural Decision Records (ADRs)
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v15 or v16 running locally (or via Docker)

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd "TravelBharat – Explore India State by State"
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the root and in `apps/api/.env`:
```bash
cp .env.example .env
cp .env.example apps/api/.env
```

Ensure `DATABASE_URL` matches your local PostgreSQL setup:
```env
DATABASE_URL="postgresql://travelbharat:travelbharat@localhost:5433/travelbharat?schema=public"
API_PORT=4000
API_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
JWT_SECRET=super-secret-random-key-for-admin-tokens-minimum-32-chars
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@travelbharat.in
ADMIN_PASSWORD=Admin@TravelBharat2024!
```

### 3. Initialize & Seed Database
```bash
# Push Prisma schema to create tables
npm run db:push --workspace=@travelbharat/api

# Run database seed script (populates 36 States/UTs, 81 Cities, 56 Places, 112 Images)
npm run db:seed
```

### 4. Run Development Servers
You can start both applications concurrently via Turborepo:
```bash
npm run dev
```

Or run them individually in separate terminals:
```bash
# Start backend API (runs on http://localhost:4000)
npm run dev --workspace=@travelbharat/api

# Start Next.js frontend (runs on http://localhost:3000)
npm run dev --workspace=@travelbharat/web
```

---

## 🔐 Admin Credentials & Access

Access the editorial management console at: **`http://localhost:3000/admin`**

| Field | Default Value | Role |
|---|---|---|
| **Email** | `admin@travelbharat.in` | `SUPER_ADMIN` |
| **Password** | `Admin@TravelBharat2024!` | Full Permissions |
| **Editor Email** | `editor@travelbharat.in` | `EDITOR` |
| **Editor Password** | `Editor@TravelBharat2024!` | Moderation Permissions |

---

## 📖 API Documentation & Endpoints

Interactive Swagger API documentation is available at: **`http://localhost:4000/api/docs`**

### Key REST Endpoints
| Method | Route | Description | Auth |
|---|---|---|---|
| `GET` | `/api/v1/states` | List all 36 States & UTs with optional zone filtering | Public |
| `GET` | `/api/v1/states/:slug` | Get state details with all child cities and places | Public |
| `GET` | `/api/v1/cities` | List cities with state details and destination counts | Public |
| `GET` | `/api/v1/cities/:slug` | Get city details with tourist destinations | Public |
| `GET` | `/api/v1/places` | Faceted search across destinations with sorting & pagination | Public |
| `GET` | `/api/v1/places/:slug` | Deep destination record with gallery & nearby attractions | Public |
| `GET` | `/api/v1/search/suggest` | Live autocomplete search for places, cities, and states | Public |
| `GET` | `/api/v1/stats` | Global summary metrics (counts of states, cities, places) | Public |
| `POST` | `/api/v1/contact` | Submit traveler feedback or correction request | Public |
| `POST` | `/api/v1/admin/auth/login` | Admin authentication with JWT cookie set | Public |
| `GET` | `/api/v1/admin/dashboard` | Administrative overview metrics & workflow counts | Bearer/Cookie |
| `GET` | `/api/v1/admin/places` | Manage destination catalog across all statuses | Bearer/Cookie |
| `PATCH` | `/api/v1/admin/places/:id/status` | Transition destination lifecycle state | Bearer/Cookie |
| `GET` | `/api/v1/admin/audit` | Paginated audit log of all system changes | Bearer/Cookie |

---

## 🧪 Testing & Verification

The API is thoroughly validated through automated Vitest integration tests covering states, places, search filters, and authentication pipelines:

```bash
npm run test --workspace=@travelbharat/api
```

```
✓ tests/search.test.ts (4 tests)
✓ tests/places.test.ts (3 tests)
✓ tests/states.test.ts (3 tests)
✓ tests/auth.test.ts (4 tests)

Test Files  4 passed (4)
     Tests  14 passed (14)
```

Visual UI and full end-to-end browser walkthroughs were conducted using automated browser agents covering all public and administrative views, with recorded browser sessions available under the artifacts directory.

---

## ⚖️ Scope & Boundaries

- ✅ **Strictly In-Scope**: Authoritative destination encyclopedic data, state and city guides, distance calculators, high-resolution galleries, local bookmarks, administrative review workflows, structured SEO tags.
- ❌ **Strictly Out-of-Scope**: Ticket purchases, hotel reservations, live payment processing, user social accounts, and public comment boards.

---

## 📄 License
This project is open-source and intended for educational, cultural, and informational purposes. All tourism information is curated for public reference.
