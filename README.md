
# PlugPlayers

Next.js 14 + TypeScript + Prisma + NextAuth + PostgreSQL. Role-based portals for Admin, Client, Jobseeker.

## Quickstart

1. Copy `.env.example` to `.env` and set `DATABASE_URL`, `NEXTAUTH_SECRET`.
2. Install deps:
   ```bash
   npm i
   ```
3. Generate client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Seed demo users:
   ```bash
   npm run seed
   ```
5. Start dev:
   ```bash
   npm run dev
   ```

Demo users:
- admin@plugplayers.dev / admin123
- client@plugplayers.dev / client123
- job@plugplayers.dev / job123

## Deploy

- Vercel: set env vars, add Postgres (Neon/Supabase), `npm run build`.
- Fly.io: supply Postgres, set env, build with Dockerfile.
- Render/Railway: use Dockerfile or node buildpack.

## Notes

- NextAuth uses Credentials provider for demo. Add OAuth providers as needed.
- Prisma schema includes Role enum. Middleware gates routes by role.


## Zero-terminal deploy (Vercel + Neon)

This repo is configured to run Prisma migrations and seed during the Vercel build step.

1. **Create a GitHub repo** (web UI): New → Create repository → Upload all files from this folder.
2. **Create a Neon Postgres** (web UI): New Project → copy the connection string.
3. **On Vercel** (web UI): New Project → Import your GitHub repo.
   - Set Environment Variables:
     - `DATABASE_URL` = Neon connection string
     - `NEXTAUTH_SECRET` = generate at https://generate-secret.vercel.app/32
     - `NEXTAUTH_URL` = `https://<your-project>.vercel.app`
   - Deploy. During build, the app runs:
     - `prisma generate`
     - `prisma migrate deploy`
     - `tsx prisma/seed.ts`
     - `next build`
4. Visit `/signin` and use the demo accounts from above.
