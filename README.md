# Anna Winnick Portfolio

Personal portfolio site showcasing skills, ideas, and projects.

**Live:** https://annawinnick.com

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        GitHub Actions                            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │  Push to    │───▶│ Build Image │───▶│ Push to ghcr.io     │  │
│  │  main       │    │ (Docker)    │    │                     │  │
│  └─────────────┘    └─────────────┘    └──────────┬──────────┘  │
└──────────────────────────────────────────────────┬──────────────┘
                                                   │
                                                   ▼ SSH Deploy
┌─────────────────────────────────────────────────────────────────┐
│                     DigitalOcean Droplet                         │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                      Traefik v2.11                       │    │
│  │           (Reverse Proxy + Let's Encrypt SSL)            │    │
│  │                    :80 / :443                            │    │
│  └─────────────────────────┬───────────────────────────────┘    │
│                            │                                     │
│                            ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │               Portfolio (Next.js 16)                     │    │
│  │                      :3000                               │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │    │
│  │  │   App       │  │   Admin     │  │   API Routes    │  │    │
│  │  │   Router    │  │   Portal    │  │   /api/*        │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │    │
│  │                            │                             │    │
│  │                   Prisma ORM (v7)                        │    │
│  └────────────────────────────┬────────────────────────────┘    │
│                               │                                  │
│                               ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                 PostgreSQL 16 (Alpine)                   │    │
│  │                        :5432                             │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS |
| **Backend** | Next.js App Router, Server Components |
| **Database** | PostgreSQL 16, Prisma ORM 7 |
| **Auth** | Auth.js (NextAuth v5) with GitHub OAuth |
| **Reverse Proxy** | Traefik v2.11 (auto SSL via Let's Encrypt) |
| **Container** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |
| **Registry** | GitHub Container Registry (ghcr.io) |
| **Hosting** | DigitalOcean Droplet |

## External Integrations

- **GitHub API** - Recent commit activity
- **Goodreads RSS** - Currently reading / bookshelf
- **Substack RSS** - Blog posts
- **Spotify API** - Now playing (planned)

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Generate Prisma client
npx prisma generate

# Run database (requires Docker)
docker compose up db -d

# Push schema to database
npx prisma db push

# Start dev server
npm run dev
```

Open http://localhost:3000

## Deployment

Deployment is automatic on push to `main` (except for docs/beads changes).

Manual deploy:
1. Go to Actions tab
2. Select "Deploy to DigitalOcean"
3. Click "Run workflow"

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin portal (protected)
│   ├── api/                # API routes
│   └── page.tsx            # Homepage
├── components/
│   └── sections/           # Page sections (Hero, Toolbox, etc.)
├── lib/
│   ├── auth.ts             # Auth.js configuration
│   ├── prisma.ts           # Database client
│   ├── github.ts           # GitHub API integration
│   └── goodreads.ts        # Goodreads RSS parser
└── generated/
    └── prisma/             # Generated Prisma client
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | Public URL for auth callbacks |
| `NEXTAUTH_SECRET` | Auth.js secret key |
| `AUTH_TRUST_HOST` | Trust proxy headers (required behind Traefik) |
| `GITHUB_ID` | GitHub OAuth App client ID |
| `GITHUB_SECRET` | GitHub OAuth App client secret |
| `ADMIN_EMAIL` | Email allowed to access admin portal |
| `GOODREADS_USER_ID` | Goodreads user ID for bookshelf |
