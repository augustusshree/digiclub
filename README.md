# DigiClub 🏆

A **school gamification platform** where students earn points, unlock badges, compete in challenges, and climb leaderboards — all within a Facebook-style social feed. Built for 100+ schools in Nepal.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router v7, TanStack Query 5, Zustand 5, shadcn/ui (Radix + Tailwind CSS v3), Lucide React, Recharts, Sonner |
| **Backend** | Hono 4, tRPC 11, Zod, jose (JWT), bcryptjs |
| **Database** | MySQL 8, Drizzle ORM, Drizzle Kit |
| **Build** | Vite 7, TypeScript 5.9, @hono/vite-dev-server |
| **Infra** | Docker Compose (MySQL), Node.js 20 |

## Features

### 👤 User Roles
- **Student** — Create posts, like/comment, earn points, unlock badges, join challenges, view leaderboards
- **Admin** — Approve/reject posts, assign points, create challenges & badges, school dashboard
- **Super Admin** — Create/manage admins, manage all schools, full system analytics, moderate content

### 📱 Student Experience (Facebook-style)
- **News Feed** — Scrollable feed of approved posts from schoolmates
- **Create Posts** — Text, image, video, or task submissions
- **Engage** — Like, comment, share posts
- **Profile** — View your badges, posts, points, rank

### 🎮 Gamification
| Rank | Points Required | Icon |
|------|----------------|------|
| NEWBIE | 0–49 | ⭐ |
| INITIATOR | 50–124 | ⚡ |
| CREATOR | 125–224 | ✨ |
| KNIGHT | 225–399 | 🛡️ |
| GUARDIAN | 400–599 | 🔥 |
| APEX | 600+ | 👑 |

**10 Badges** — First Post, Rising Star, Content Creator, Popular, Commentator, Challenge Master, Knight Rank, Guardian Rank, Apex Rank, School Champion

**Challenges** — Weekly, Monthly, and Special challenges with point rewards

**Leaderboards** — Individual (global & per-school) and school-vs-school rankings

**Seasons** — Time-bound competitive seasons

### 🛡️ Admin Panel
- Dashboard with stats (users, posts, schools, challenges)
- Review pending posts (approve/reject with point rewards)
- Create and manage challenges
- Create badges

### ⚡ Super Admin Panel
- Full system analytics
- Manage admins (create, activate/deactivate)
- Manage schools (add, activate/deactivate)
- View all activity logs

## Project Structure

```
D:\DigiClub\
├── api/                          # Backend (Hono + tRPC)
│   ├── boot.ts                   # Hono server entry (@hono/vite-dev-server)
│   ├── context.ts                # tRPC context (auth extraction)
│   ├── middleware/
│   │   └── auth.ts               # JWT sign/verify (jose), bcrypt helpers
│   ├── routers/
│   │   ├── _app.ts               # Root tRPC app router
│   │   ├── trpc.ts               # tRPC init, middleware (auth, admin, superadmin)
│   │   ├── auth.ts               # login, register, me
│   │   ├── post.ts               # CRUD, feed, like, comment
│   │   ├── user.ts               # profile, leaderboard
│   │   ├── admin.ts              # dashboard, review posts, challenges, badges
│   │   ├── superadmin.ts         # manage admins, schools, activity logs
│   │   └── gamification.ts       # leaderboards, challenges, badges, seasons
├── contracts/
│   └── index.ts                  # Shared TypeScript types, Zod schemas, rank calculator
├── db/
│   ├── schema.ts                 # Drizzle ORM schema (18 tables, relations)
│   ├── index.ts                  # MySQL2 pool connection
│   ├── seed.ts                   # Seed script (100+ Nepal schools, badges, users)
│   └── migrations/               # Auto-generated migrations
├── src/                          # Frontend (React 19 + shadcn/ui)
│   ├── main.tsx                  # Entry point (tRPC + TanStack Query + React Router)
│   ├── App.tsx                   # Routes, auth guards
│   ├── index.css                 # Tailwind + CSS variables (shadcn dark mode)
│   ├── lib/
│   │   ├── trpc.ts               # tRPC React client setup
│   │   └── utils.ts              # cn() utility (tailwind-merge + clsx)
│   ├── store/
│   │   ├── authStore.ts          # Zustand auth store (persisted to localStorage)
│   │   └── themeStore.ts         # Zustand theme store (dark/light)
│   ├── components/
│   │   ├── ui/                   # shadcn components (button, card, dialog, etc.)
│   │   └── layout/
│   │       ├── AppLayout.tsx      # Main nav layout (feed, profile, leaderboard)
│   │       └── AdminLayout.tsx    # Admin nav layout
│   └── pages/
│       ├── LoginPage.tsx         # Login (username or email)
│       ├── RegisterPage.tsx      # Student registration
│       ├── FeedPage.tsx          # Facebook-style news feed
│       ├── ProfilePage.tsx       # User profile + badges
│       ├── LeaderboardPage.tsx   # Ranked leaderboard
│       ├── ChallengesPage.tsx    # Active challenges
│       ├── admin/
│       │   ├── AdminDashboard.tsx
│       │   ├── AdminPosts.tsx
│       │   ├── AdminChallenges.tsx
│       │   └── AdminBadges.tsx
│       └── superadmin/
│           ├── SuperAdminDashboard.tsx
│           ├── SuperAdminAdmins.tsx
│           └── SuperAdminSchools.tsx
├── vite.config.ts                # Vite config with Hono dev server
├── drizzle.config.ts             # Drizzle Kit config (MySQL)
├── tailwind.config.js            # Tailwind + shadcn theme
├── tsconfig.json                 # TypeScript project references
├── tsconfig.app.json             # Frontend TS config
├── tsconfig.server.json          # Backend TS config
├── docker-compose.yml            # MySQL 8 container
├── .env.example                  # Environment variables template
└── package.json                  # Scripts and dependencies
```

## Database Schema (18 Tables)

| Table | Description |
|-------|-------------|
| `users` | Students, admins, super admins |
| `schools` | 100+ Nepal schools |
| `posts` | User posts with approval workflow |
| `comments` | Post comments |
| `likes` | Post likes (unique per user+post) |
| `badges` | Badge definitions (10 built-in) |
| `badge_progress` | User progress toward badges |
| `user_badges` | Earned badges per user |
| `user_achievements` | Achievement history |
| `challenges` | Weekly/monthly/special challenges |
| `challenge_participants` | User challenge participation |
| `seasons` | Competitive seasons |
| `notifications` | User notifications |
| `refresh_tokens` | JWT refresh tokens |
| `activity_logs` | Audit trail |

All tables include full Drizzle ORM relations with proper foreign keys and indexes.

## Getting Started

### Prerequisites
- **Node.js 20+**
- **MySQL 8** (local or via Docker)
- **npm**

### 1. Start MySQL

```bash
docker compose up -d
```

Or use a local MySQL instance. Update `DATABASE_URL` in `.env`.

### 2. Install & Seed

```bash
npm install
npm run db:seed
```

### 3. Start Dev Server

```bash
npm run dev
```

Open **http://localhost:5173**.

## Default Credentials

| Role | Username | Password |
|------|----------|----------|
| **Super Admin** | `superadmin` | `T9f&3!Xp@Lr6^wQz` |
| Admin | `admin_avm001` | `admin123` |
| Student | `alex_j` | `student123` |
| Student | `emma_m` | `student123` |

> Login works with **username or email**.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server (frontend + backend) |
| `npm run build` | TypeScript build + Vite production build |
| `npm run preview` | Preview production build |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed database with schools, badges, and test data |

## API

The API uses **tRPC** — no REST endpoints to memorize. All procedures are type-safe and auto-completed in the frontend via `@trpc/react-query`.

### Router Structure

```
auth.*          → login, register, me
post.*          → create, getFeed, getMyPosts, like, comment, getComments
user.*          → getProfile, updateProfile, getLeaderboard
admin.*         → getDashboard, getPendingPosts, reviewPost, createChallenge, getChallenges, getBadges, createBadge
superAdmin.*    → getDashboard, getAdmins, createAdmin, toggleAdminStatus, getSchools, createSchool, toggleSchoolStatus, getAllActivity
gamification.*  → getLeaderboard, getChallenges, joinChallenge, getBadges, getUserBadges, getActiveSeasons, getSchoolLeaderboard
```

Health check: `GET /api/health`

## Authentication

JWT-based with **jose** library:
- Tokens expire in 7 days
- Stored in `localStorage` (persisted via Zustand)
- Sent as `Authorization: Bearer <token>` header
- Three middleware levels: `protectedProcedure`, `adminProcedure`, `superAdminProcedure`

## Schools

The platform ships with **104 Nepal schools** pre-seeded, including:
- Adarsh Vidya Mandir, Budhanilkantha School, St. Xavier's School
- Schools from Kathmandu, Pokhara, Bhaktapur, Lalitpur, Biratnagar, Butwal, Dhangadhi, Chitwan, and more

## 100+ Nepal Schools

The seed data includes 104 schools from across Nepal, covering all major cities and regions. Schools can be managed via the Super Admin panel.

## License

MIT
