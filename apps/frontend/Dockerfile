FROM node:20-alpine

WORKDIR /app

# Copy root configurations
COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/

# Install dependencies
RUN npm install

# Copy source code
COPY apps/frontend ./apps/frontend

WORKDIR /app/apps/frontend

# Build Next.js app
RUN npm run build

# Expose web port
EXPOSE 3001

# Start production server
CMD ["npm", "start"]
