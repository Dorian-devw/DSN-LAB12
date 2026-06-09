FROM node:20-alpine

WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

# Copy root configurations
COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/

# Install dependencies (workspaces)
RUN npm install

# Copy source code
COPY apps/backend ./apps/backend

# Generate Prisma Client
WORKDIR /app/apps/backend
RUN npx prisma generate

# Build backend
RUN npm run build

# Expose API port
EXPOSE 3000

# Start production server
CMD ["npm", "run", "start:prod"]
