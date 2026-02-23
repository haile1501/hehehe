# ====== Stage 1: Build ======
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files trước để cache layer
COPY package*.json ./

# Cài full dependencies (bao gồm devDependencies để build)
RUN npm install

# Copy source code
COPY . .

# Build NestJS (tạo dist/)
RUN npm run build


# ====== Stage 2: Production ======
FROM node:24-alpine

WORKDIR /app

# Chỉ copy package files
COPY package*.json ./

# Cài production dependencies
RUN npm install --omit=dev

# Copy file build từ stage builder
COPY --from=builder /app/dist ./dist

# Expose port (mặc định NestJS dùng 3000)
EXPOSE 3000

# Start app
CMD ["node", "dist/main.js"]