# 🏛️ Architecture Decision Records (ADRs)

## Project: TravelBharat – Explore India State by State
**Document Version:** 1.0.0  
**Status:** Approved & Recorded  

---

### Table of Contents
- [ADR-001: Monorepo Architecture with Turborepo](#adr-001-monorepo-architecture-with-turborepo)
- [ADR-002: PostgreSQL 16 & Prisma ORM for Relational Travel Knowledge Graph](#adr-002-postgresql-16--prisma-orm-for-relational-travel-knowledge-graph)
- [ADR-003: Stateless JWT + HttpOnly Cookie Editorial Admin Authentication](#adr-003-stateless-jwt--httponly-cookie-editorial-admin-authentication)
- [ADR-004: Prisma In-Database Query Filtering vs External Search Engine](#adr-004-prisma-in-database-query-filtering-vs-external-search-engine)
- [ADR-005: Client-Side LocalStorage for Personal Destination Bookmarks](#adr-005-client-side-localstorage-for-personal-destination-bookmarks)
- [ADR-006: Indian Heritage Aesthetic Color Palette & Design Tokens](#adr-006-indian-heritage-aesthetic-color-palette--design-tokens)
- [ADR-007: Editorial State Machine with Immutable Audit Trail](#adr-007-editorial-state-machine-with-immutable-audit-trail)
- [ADR-008: Dedicated Local PostgreSQL Cluster on Port 5433](#adr-008-dedicated-local-postgresql-cluster-on-port-5433)
- [ADR-009: Hybrid SSR and Client-Side Hydration Strategy in Next.js 14](#adr-009-hybrid-ssr-and-client-side-hydration-strategy-in-nextjs-14)

---

### ADR-001: Monorepo Architecture with Turborepo

#### Context
TravelBharat consists of a Next.js 14 web application, an Express/Node.js REST API, a shared TypeScript package for models and enums, and a database seeding toolset. Managing separate repositories would lead to model duplication, out-of-sync type definitions, and complex multi-repo deployment workflows.

#### Decision
We chose a **Turborepo monorepo** managed with npm workspaces:
- `apps/web`: Next.js 14 frontend application
- `apps/api`: Express TypeScript REST backend
- `packages/shared`: Shared TypeScript types, Zod schemas, and common constants
- `seed`: Database seeding scripts and JSON source archives

#### Consequences
- **Positive:** Type changes (such as new destination categories or status enums) are immediately available across both client and server codebases. Single `npm install` and parallelized builds via Turborepo.
- **Negative:** Slightly larger initial workspace footprint, requiring workspace filtering flags for targeted execution (e.g., `--workspace=@travelbharat/api`).

---

### ADR-002: PostgreSQL 16 & Prisma ORM for Relational Travel Knowledge Graph

#### Context
Travel information is deeply hierarchical and relational: States contain Cities, Cities contain Places, Places have multiple PlaceImages and self-referencing NearbyPlaces with calculated distances. Document-oriented stores like MongoDB would require extensive application-level joins or denormalization, risking data anomalies.

#### Decision
We chose **PostgreSQL 16** with **Prisma ORM**.
- Strong relational constraints (`ON DELETE CASCADE`, unique slugs, foreign keys).
- Prisma provides end-to-end type safety, automated migrations, and an intuitive querying syntax.
- PostgreSQL native support for indexing, spatial coordinates (lat/long), and JSON columns for audit log payloads.

#### Consequences
- **Positive:** Schema migrations are version-controlled and reproducible. Zero risk of orphaned child records when deleting test places or images.
- **Negative:** Schema updates require explicit migration steps (`prisma db push` or `prisma migrate dev`).

---

### ADR-003: Stateless JWT + HttpOnly Cookie Editorial Admin Authentication

#### Context
TravelBharat strictly excludes public consumer accounts. However, editorial staff require authenticated access to manage content, transition publication states, and review audit logs.

#### Decision
We implemented **stateless JSON Web Tokens (JWT)** transmitted via **HttpOnly cookies** (with fallback support for `Authorization: Bearer <token>` headers):
- Admin passwords hashed using `bcryptjs` with salt rounds = 10.
- JWT signed with a 64-character secret with a 7-day expiration.
- Cookies configured with `httpOnly: true`, `sameSite: 'lax'`, and conditional `secure: true` in production.
- Brute-force protection enforced using `express-rate-limit` (max 5 login attempts per 15-minute window).

#### Consequences
- **Positive:** Protects administrative sessions from XSS token theft via JavaScript. Eliminates server-side session store overhead.
- **Negative:** Token revocation before expiration requires either short token lifespans or a token denylist.

---

### ADR-004: Prisma In-Database Query Filtering vs External Search Engine

#### Context
Search and filtering is a critical requirement (`/explore`). Architectural alternatives included deploying Elasticsearch/Meilisearch or utilizing PostgreSQL full-text search with Prisma query filters.

#### Decision
For an encyclopedic catalog of hundreds to thousands of curated attractions, we selected **PostgreSQL indexed column filtering and case-insensitive Prisma queries** (`mode: 'insensitive'`) combined with a dedicated autocomplete suggestion endpoint (`/api/v1/search/suggest`):
- Indexes placed on `category`, `status`, `cityId`, `stateId`, and `isUnesco`.
- SQL `OR` conditions searching `title` and `description`.

#### Consequences
- **Positive:** Zero external operational dependencies. Eliminates search index synchronization delays or failure modes. Instant responsiveness on modest hardware.
- **Negative:** Complex fuzzy typographic matching (e.g., typo tolerance) is limited compared to dedicated search engines. If the catalog scales past 50,000 entries, migrating to PostgreSQL `pg_trgm` or Meilisearch will be considered.

---

### ADR-005: Client-Side LocalStorage for Personal Destination Bookmarks

#### Context
Travelers need to save destinations for quick reference while browsing itineraries. Traditional platforms force users to create accounts, verify emails, or log in with social providers to save a bookmark.

#### Decision
In alignment with our **informational-only and zero-friction privacy philosophy**, bookmarks are stored **exclusively in the user's browser `localStorage`** (`travelbharat_saved`):
- No user accounts, passwords, or personal data collected.
- Immediate bookmark addition and removal without network latency.
- Dedicated `/saved` page reads local IDs and fetches full place cards.

#### Consequences
- **Positive:** 100% privacy-preserving, zero database storage overhead, instant user satisfaction without signup friction.
- **Negative:** Bookmarks do not synchronize across different devices unless users manually export/import their local state.

---

### ADR-006: Indian Heritage Aesthetic Color Palette & Design Tokens

#### Context
Generic travel websites typically employ generic blues or sterile corporate templates. TravelBharat requires an evocative visual identity that pays homage to India’s cultural heritage while maintaining clean modern readability.

#### Decision
We engineered a curated CSS design token system in Tailwind CSS (`apps/web/src/app/globals.css`):
- **Deep Saffron (`#E86014` / `#D4540E`):** Represents vitality, festivity, and cultural heritage.
- **Indian Heritage Teal (`#0C6268` / `#08494E`):** Evoking the peacock, coastal waters, and architectural tiles.
- **Warm Ivory (`#FDFBF7` / `#F7F4EC`):** Emulating marble palaces, temple sandstone, and warm parchment.
- **Rich Slate / Dark Sand:** Providing high-contrast, WCAG 2.1 AA-compliant typography across both light and dark display modes.

#### Consequences
- **Positive:** Distinctive brand identity that elevates the user experience and imparts a premium, polished feel.
- **Negative:** Custom color palettes require deliberate vigilance to ensure third-party component libraries blend seamlessly.

---

### ADR-007: Editorial State Machine with Immutable Audit Trail

#### Context
Unverified edits to historical and cultural data could degrade encyclopedic accuracy. Content additions and modifications must follow a verifiable quality control process.

#### Decision
We implemented a strict **four-state publication state machine**:
```
[DRAFT] ──(Submit for Review)──> [IN_REVIEW] ──(Approve)──> [PUBLISHED]
   ▲                                   │                          │
   └───────(Request Revision)──────────┘                          ▼
                                                             [ARCHIVED]
```
- Only `PUBLISHED` places are visible on public discovery routes.
- Every state transition or administrative modification automatically writes an immutable row to the `AuditLog` table capturing:
  - Admin User ID
  - Action name (e.g., `PLACE_STATUS_UPDATE`, `PLACE_CREATED`)
  - Target entity ID
  - Timestamp
  - JSON details containing old status, new status, IP address, and browser agent.

#### Consequences
- **Positive:** Complete visibility into editorial changes, preventing inadvertent publication of incomplete drafts.
- **Negative:** Requires an extra approval step before new content is publicly discoverable.

---

### ADR-008: Dedicated Local PostgreSQL Cluster on Port 5433

#### Context
During initial local environment setup, port `5432` was pre-allocated by a background host Windows service with inaccessible administrative credentials, blocking Prisma migrations.

#### Decision
We provisioned an isolated local PostgreSQL 16 cluster residing at `C:\Users\varun\.travelbharat_pgdata` running on **port `5433`** with a dedicated `travelbharat` database user:
- Kept outside the OneDrive synchronization tree to prevent file-lock contention with PostgreSQL WAL files.
- Configured `.env` files to bind directly to `localhost:5433`.

#### Consequences
- **Positive:** Complete environment isolation with zero conflicts against system services. Reliable, high-performance database execution.
- **Negative:** Developers running the project on other machines must ensure their `DATABASE_URL` matches their target PostgreSQL port (defaults to 5432 in `.env.example`, configurable via standard environment variables).

---

### ADR-009: Hybrid SSR and Client-Side Hydration Strategy in Next.js 14

#### Context
Travel encyclopedia content benefits enormously from Server-Side Rendering (SSR) for search engine indexing and social media cards, while interactive components (search filters, gallery lightboxes, bookmarks) require client-side reactivity.

#### Decision
We adopted a **hybrid rendering architecture** within the Next.js 14 App Router:
- **Server Components:** Route layouts, state encyclopedic profiles, city profiles, and static informational pages (`about`, `sitemap`). These inject metadata, JSON-LD schemas, and HTML tags directly on the initial server response.
- **Client Components (`'use client'`):** `ExploreClient.tsx` (facet state and query parameters), `Gallery.tsx` (lightbox modal and keyboard listeners), `SavedPlacesClient.tsx` (`localStorage` state), and the admin panel dashboard.

#### Consequences
- **Positive:** Maximum Core Web Vitals performance, pristine SEO crawlers compatibility, and fluid client-side interactivity without layout shifts.
- **Negative:** Requires disciplined separation between server data loaders and client component trees.
