# 🫧 Beasy.my — Digital Event Platform

**Slogan:** "Everything for your event, in one place."

Platform event digital serba guna dengan ciri-ciri utama:
- Customer Own Storage (Google Drive & Sheets)
- Liquid Glass UI/UX (iOS Glassmorphism)
- PWA Ready (Offline First)
- Real-time Live Photo Wall
- Multi-event support (Wedding, Birthday, Corporate, dll.)

## 📋 Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Framework | Next.js 14+ (App Router) |
| Bahasa | TypeScript |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + Google OAuth |
| Styling | Tailwind CSS + Shadcn UI |
| Animation | Framer Motion |
| Icons | Lucide React |
| PWA | next-pwa |
| External API | Google Drive API v3 + Google Sheets API v4 |

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- `GOOGLE_CLIENT_ID` - Google Cloud Console OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google Cloud Console OAuth client secret
- `GOOGLE_REDIRECT_URI` - OAuth callback URL
- `NEXTAUTH_URL` - NextAuth URL
- `NEXTAUTH_SECRET` - NextAuth secret key

### 3. Setup Supabase Database

Run the SQL migration in Supabase SQL Editor:

```bash
# Open Supabase Dashboard → SQL Editor
# Copy content from supabase/migrations/001_initial_schema.sql
```

### 4. Setup Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google Drive API** and **Google Sheets API**
4. Go to **Credentials** → **Create Credentials** → **OAuth Client ID**
5. Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
beasy-my/
├── public/                    # Static assets
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service Worker
│   └── icons/                 # PWA icons
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (landing)/         # Landing page route group
│   │   ├── (dashboard)/       # Dashboard route group
│   │   ├── e/[eventSlug]/     # Event portal pages
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Base UI components
│   │   │   ├── GlassCard.tsx
│   │   │   ├── LiquidFAB.tsx
│   │   │   ├── LiquidGlassDock.tsx
│   │   │   └── Toaster.tsx
│   │   ├── forms/             # Form components
│   │   │   └── RSVPForm.tsx
│   │   └── widgets/           # Widget components
│   │       └── CountdownTimer.tsx
│   └── lib/                   # Utility libraries
│       ├── supabase.ts        # Supabase client
│       ├── google-drive.ts    # Google API integration
│       └── utils.ts           # Helper functions
├── supabase/
│   └── migrations/            # Database migrations
│       └── 001_initial_schema.sql
├── .env.example               # Environment variables template
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## 🔑 Key Features

### Liquid Glass UI System
- Translucent glass cards with backdrop blur
- Specular borders and glowing edges
- iOS-style rounded corners (`rounded-3xl`)
- Haptic-like interactions with Framer Motion
- Dynamic mesh gradient backgrounds

### Google Drive Integration
- Direct streaming upload (no server storage)
- Auto folder structure creation per event
- Real-time RSVP sync to Google Sheets
- OAuth 2.0 with auto-refresh tokens

### PWA Capabilities
- Add to Home Screen support
- Offline caching with Service Workers
- Standalone display mode
- Custom splash screen and icons

## 🎨 Design Tokens

### Colors
```css
--glass-light: rgba(255, 255, 255, 0.1)
--glass-dark: rgba(0, 0, 0, 0.2)
--glass-border: rgba(255, 255, 255, 0.2)
```

### Shadows
```css
--shadow-glass: 0 8px 32px 0 rgba(0, 0, 0, 0.12)
--shadow-glass-inner: inset 0 1px 1px rgba(255, 255, 255, 0.4)
```

### Border Radius
```css
--radius-glass: 1.5rem
--radius-glass-lg: 2rem
--radius-glass-xl: 2.5rem
```

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## 🔒 Security Notes

- Never commit `.env.local` or any files containing secrets
- Use Supabase Row Level Security (RLS) policies
- Google refresh tokens are encrypted and stored server-side only
- All user inputs are validated with Zod schemas
- Media files stream directly to customer's Google Drive

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in Vercel settings
4. Deploy!

For detailed deployment guide, see [Vercel Documentation](https://vercel.com/docs).

## 📄 License

Private project - Beasy.my
