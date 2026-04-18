<div align="center">
  <h1>🏠 Roomzy</h1>
  <p><strong>AI-powered rental platform for India</strong></p>
  <p>Find your perfect room with smart matching, real-time chat, verified listings, and Stripe payments.</p>
</div>

---

## ✨ Features

- 🗺️ **Map View** — Interactive Mapbox map with room pins across Mumbai, Bengaluru & Delhi
- 🤖 **AI Matcher** — Gemini-powered room recommendations based on your preferences
- 💬 **Real-time Chat** — Message owners directly in the app
- 💳 **Payments** — Stripe checkout for deposit and rent payments (INR)
- 🏠 **Owner Dashboard** — Add listings, manage leads, boost visibility, AI-optimize descriptions
- 👤 **KYC & Verification** — Verified badges for trusted owners and tenants
- 📋 **Tenant Tools** — Checklist, rent receipts, rental agreements, rewards
- 🛡️ **Safety Scores** — Algorithmic safety rating for each listing

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone & Install
```bash
git clone https://github.com/your-username/roomzy.git
cd roomzy
npm install
```

### 2. Set up Environment Variables
```bash
cp .env.example .env
```
Edit `.env` and fill in your API keys (see `.env.example` for instructions).

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Render will auto-detect `render.yaml` — click **Deploy**
5. In **Environment → Secret Files**, add your env vars from `.env.example`
6. Set `APP_URL` to your Render service URL (e.g. `https://roomzy.onrender.com`)

> **Render auto-configuration** via `render.yaml`:
> - Build: `npm install && npm run build`
> - Start: `npm start`

---

## ⚡ Deploy to Vercel

> **Note:** Vercel is best for the **frontend only**. The Stripe API routes require a Node.js server — use Render for full-stack.

```bash
npm install -g vercel
vercel --prod
```

Set the following environment variables in the Vercel dashboard:
- `VITE_MAPBOX_ACCESS_TOKEN`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_GOOGLE_MAPS_API_KEY`
- `GEMINI_API_KEY`

---

## 🔑 Required API Keys

| Service | Variable | Where to get |
|---|---|---|
| Gemini AI | `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| Stripe (secret) | `STRIPE_SECRET_KEY` | [dashboard.stripe.com](https://dashboard.stripe.com/apikeys) |
| Stripe (public) | `VITE_STRIPE_PUBLISHABLE_KEY` | [dashboard.stripe.com](https://dashboard.stripe.com/apikeys) |
| Mapbox | `VITE_MAPBOX_ACCESS_TOKEN` | [account.mapbox.com](https://account.mapbox.com/access-tokens/) |
| Google Maps | `VITE_GOOGLE_MAPS_API_KEY` | [console.cloud.google.com](https://console.cloud.google.com) |

---

## 📁 Project Structure

```
roomzy/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── BottomNav.tsx
│   │   ├── Header.tsx
│   │   ├── Modal.tsx
│   │   ├── PaymentModal.tsx
│   │   ├── RoomCard.tsx
│   │   ├── Stars.tsx
│   │   ├── StatusBar.tsx
│   │   ├── Tag.tsx
│   │   └── Toast.tsx
│   ├── pages/            # Full-screen page components
│   │   ├── MapPage.tsx         # Home / Map view
│   │   ├── RoomsPage.tsx       # Room listings
│   │   ├── DetailPage.tsx      # Room detail + payment
│   │   ├── ChatPage.tsx        # Owner chat
│   │   ├── MatcherPage.tsx     # AI room matcher
│   │   ├── OwnerPage.tsx       # Owner dashboard
│   │   ├── ProfilePage.tsx     # Tenant profile
│   │   ├── AdminPanel.tsx      # Admin panel
│   │   ├── PricingPage.tsx     # Subscription plans
│   │   └── ...                 # Other pages
│   ├── lib/
│   │   └── safetyScore.ts      # Safety score algorithm
│   ├── services/
│   │   └── geminiService.ts    # Gemini AI integration
│   ├── App.tsx                 # Root component + routing
│   ├── constants.ts            # Seed data & constants
│   ├── types.ts                # TypeScript interfaces
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles + Tailwind
├── server.ts                   # Express server (API + static serving)
├── vite.config.ts              # Vite build config
├── render.yaml                 # Render deployment config
├── vercel.json                 # Vercel deployment config
├── .env.example                # Environment variable template
└── package.json
```

---

## 🛠️ Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (Express + Vite HMR) |
| `npm run build` | Build for production |
| `npm start` | Start production server (serves built `dist/`) |
| `npm run lint` | TypeScript type check |
| `npm run clean` | Remove `dist/` folder |

---

## 📄 License

MIT — feel free to use and adapt for your own projects.
