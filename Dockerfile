# ====== Stage 1: Build ======
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Remove devDependencies to reduce size
RUN yarn install --production --frozen-lockfile --ignore-scripts --prefer-offline

# ====== Stage 2: Production ======
FROM node:24-alpine

# Set environment
ENV NODE_ENV=production

WORKDIR /app

# Copy built files and production node_modules from builder
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Use non-root user for security
USER node

EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]