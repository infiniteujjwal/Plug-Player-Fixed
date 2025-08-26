
# Production build
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm ci || yarn || pnpm i

COPY . .
RUN npm run prisma:generate
RUN npm run build

# Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app .
EXPOSE 3000
CMD ["npm","start"]
