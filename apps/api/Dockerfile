FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/

RUN npm install

COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/packages/shared ./packages/shared

EXPOSE 4000

CMD ["node", "dist/index.js"]
