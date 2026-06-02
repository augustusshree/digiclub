# Build stage: Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# Build stage: Backend
FROM node:20-alpine AS backend-build
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci
COPY server/ .
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Copy built frontend
COPY --from=frontend-build /app/client/dist ./client/dist

# Copy backend
COPY --from=backend-build /app/server/dist ./server/dist
COPY --from=backend-build /app/server/node_modules ./server/node_modules
COPY --from=backend-build /app/server/prisma ./server/prisma
COPY --from=backend-build /app/server/package.json ./server/package.json

# Uploads directory
RUN mkdir -p /app/server/uploads

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "server/dist/index.js"]
