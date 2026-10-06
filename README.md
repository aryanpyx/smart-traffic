<![CDATA[<div align="center">

![APYX Smart Traffic Banner](./banner.jpg)

<br/>

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-Drizzle_ORM-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://orm.drizzle.team/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--Time-FF6B35?style=for-the-badge&logo=websocket&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)](./LICENSE)

<h3>AI-Powered Real-Time Urban Traffic Management & Signal Optimization Platform</h3>

[Quick Start](#-quick-start) · [Documentation](#-architecture) · [API Reference](#-api-reference) · [Contributing](#-contributing)

</div>

---

## Overview

**APYX Smart Traffic** is a production-ready, full-stack intelligent traffic control system designed for urban traffic authorities. It provides a real-time command center for monitoring traffic junctions, managing signal timings, and applying AI-generated optimization recommendations — all through a beautifully crafted dashboard.

> Built with a modern React + Express + WebSocket stack, the system enables authorities to reduce congestion, lower CO2 emissions, and improve commute times across an entire city grid.

---

## Key Features

| Feature | Description |
|---|---|
| **Live Traffic Map** | Real-time interactive map visualizing junction status, congestion levels, and vehicle flow across the city |
| **AI Recommendations** | Intelligent signal timing suggestions with confidence scores — apply optimizations with a single click |
| **Analytics Dashboard** | Track wait times, commute efficiency, CO2 emissions, and fuel savings over time |
| **Signal Control** | Manually or automatically adjust green/red signal phase durations per junction |
| **Real-Time Updates** | WebSocket-powered live synchronization — dashboard reflects ground truth instantly |
| **Role-Based Auth** | Secure session-based authentication with role-based access for traffic authorities |
| **Congestion Levels** | Automatic congestion classification (Low / Medium / High) per junction |

---

## Architecture

```
APYX-SMART traffic/
├── client/                  # React Frontend
│   ├── index.html
│   └── src/
│       ├── App.tsx             # Root application & routing
│       ├── main.tsx            # Entry point
│       ├── index.css           # Global styles & CSS variables
│       ├── pages/
│       │   ├── dashboard.tsx   # Main operations dashboard
│       │   ├── map.tsx         # Live traffic map view
│       │   ├── ai-control.tsx  # AI recommendations panel
│       │   ├── analytics.tsx   # Traffic analytics & charts
│       │   └── login.tsx       # Authentication page
│       ├── components/
│       │   ├── junction-card.tsx     # Junction status card
│       │   ├── traffic-map.tsx       # Map visualization
│       │   ├── analytics-chart.tsx   # Recharts data viz
│       │   └── ui/                   # shadcn/ui components
│       ├── hooks/              # Custom React hooks
│       └── lib/                # Utilities & query client
│
├── server/                  # Express.js Backend
│   ├── index.ts               # Server entry point
│   ├── routes.ts              # API routes + WebSocket server
│   ├── storage.ts             # Data access layer (SQLite/Drizzle)
│   ├── db.ts                  # Database connection
│   └── vite.ts                # Vite dev server integration
│
├── shared/
│   └── schema.ts              # Drizzle ORM schema + Zod validators
│
├── vite.config.ts             # Vite build configuration
├── drizzle.config.ts          # Drizzle database configuration
├── tailwind.config.ts         # TailwindCSS configuration
└── tsconfig.json              # TypeScript configuration
```

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** + **TypeScript** | Core UI framework with type safety |
| **Vite 5** | Lightning-fast build tool & dev server |
| **shadcn/ui** + **Radix UI** | Accessible, unstyled component primitives |
| **TailwindCSS** | Utility-first styling with custom theme tokens |
| **TanStack Query** | Server state management, caching, background sync |
| **Wouter** | Lightweight client-side routing |
| **Recharts** | Traffic analytics data visualization |
| **Framer Motion** | Smooth animations and transitions |
| **Lucide React** | Consistent icon library |

### Backend
| Technology | Purpose |
|---|---|
| **Express.js 4** | RESTful API server |
| **TypeScript** + **tsx** | Type-safe server-side code |
| **WebSocket (ws)** | Real-time bidirectional communication |
| **Drizzle ORM** | Type-safe SQLite database operations |
| **SQLite** + **better-sqlite3** | Embedded local database |
| **express-session** | Session management |
| **Zod** | Runtime schema validation |
| **nanoid** | Unique ID generation |

---

## Database Schema

```
+------------------+    +----------------------+    +-------------------------+
|      users       |    |      junctions       |    |     signal_timings      |
+------------------+    +----------------------+    +-------------------------+
| id (PK)          |    | id (PK)              |    | id (PK)                 |
| username         |    | name                 |    | junction_id (FK)        |
| password         |    | location (JSON)      |    | current_phase           |
| role             |    | vehicle_count        |    | phase_start_time        |
+------------------+    | avg_speed            |    | phase_end_time          |
                        | green_time           |    | ai_optimized            |
                        | red_time             |    +-------------------------+
                        | congestion_level     |
                        | status               |    +-------------------------+
                        | last_updated         |    |   ai_recommendations    |
                        +----------------------+    +-------------------------+
                                                    | id (PK)                 |
+--------------------------+                        | junction_id (FK)        |
|    traffic_analytics     |                        | recommendation          |
+--------------------------+                        | confidence_score        |
| id (PK)                  |                        | applied                 |
| date                     |                        | created_at              |
| avg_wait_time            |                        +-------------------------+
| avg_commute_time         |
| co2_emissions            |
| fuel_consumption         |
| ai_mode                  |
+--------------------------+
```

---

## Quick Start

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/apyx-smart-traffic.git
cd apyx-smart-traffic
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the project root:

```env
# Database (uses SQLite by default)
DATABASE_URL=file:./dev.db

# Session secret for express-session
SESSION_SECRET=your-super-secret-session-key

# Server port (optional, defaults to 5000)
PORT=5000
```

### 4. Initialize the Database

```bash
npm run db:push
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at **http://localhost:5000**

---

## Build for Production

```bash
# Build frontend (Vite) + backend (esbuild)
npm run build

# Start production server
npm start
```

The build produces:
- `dist/public/` — Static frontend assets served by Express
- `dist/index.js` — Bundled Express server (ESM)

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Login with username + password |
| `POST` | `/api/auth/logout` | End current session |
| `GET` | `/api/auth/user` | Get current authenticated user |

### Junctions

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/junctions` | List all traffic junctions |
| `GET` | `/api/junctions/:id` | Get a specific junction |
| `POST` | `/api/junctions` | Create a new junction |
| `PATCH` | `/api/junctions/:id` | Update junction data |
| `DELETE` | `/api/junctions/:id` | Remove a junction |

### Signal Timings

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/signal-timings/:junctionId` | Get signal timing for junction |
| `POST` | `/api/signal-timings` | Create signal timing record |
| `PATCH` | `/api/signal-timings/:id` | Update phase timing |

### AI Recommendations

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/ai-recommendations` | Get all recommendations |
| `GET` | `/api/ai-recommendations/:junctionId` | Junction-specific recommendations |
| `POST` | `/api/ai-recommendations` | Store a new recommendation |
| `PATCH` | `/api/ai-recommendations/:id/apply` | Apply a recommendation |

### Analytics

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics` | Get traffic analytics history |
| `POST` | `/api/analytics` | Record analytics snapshot |

### WebSocket

Connect to `ws://localhost:5000/ws` for real-time push updates.

**Events:**
```json
// Server -> Client: Junction updated
{ "type": "junction_updated", "data": { "...junctionData" } }

// Server -> Client: Signal timing changed
{ "type": "signal_update", "data": { "...timingData" } }

// Server -> Client: New AI recommendation
{ "type": "ai_recommendation", "data": { "...recommendationData" } }
```

---

## Available Scripts

| Script | Command | Description |
|---|---|---|
| **Dev** | `npm run dev` | Start development server with hot reload |
| **Build** | `npm run build` | Production build (frontend + backend) |
| **Start** | `npm start` | Run production server |
| **Type Check** | `npm run check` | Run TypeScript compiler check |
| **DB Push** | `npm run db:push` | Push schema changes to database |

---

## Pages & Features

### Dashboard (`/dashboard`)
The main operations center. Shows an overview of all active junctions, system-wide statistics (total vehicles, average speed, AI recommendations count), and congestion alerts.

### Traffic Map (`/map`)
Interactive city map with color-coded junction markers:
- **Green** — Low congestion, normal flow
- **Yellow** — Medium congestion, monitoring
- **Red** — High congestion, intervention needed

### AI Control (`/ai-control`)
View and manage AI-generated signal timing recommendations. Each recommendation includes:
- Target junction
- Suggested action (e.g., *"Extend green phase by 15s"*)
- Confidence score (0–100%)
- One-click **Apply** button

### Analytics (`/analytics`)
Time-series charts powered by Recharts:
- Average wait time per junction
- City-wide commute time trends
- CO2 emissions tracked over time
- Fuel consumption metrics
- AI mode efficiency comparisons

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'feat: add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

Please ensure all code passes `npm run check` before submitting.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

**Built with care for smarter, safer cities**

*APYX Smart Traffic — Reducing congestion, one signal at a time.*

</div>
]]>
