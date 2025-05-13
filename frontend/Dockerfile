# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (cache layer)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source files
COPY . .

# Copy .env file from project root to frontend build context
COPY .env .env

# Build the React app
RUN yarn build

# ---- Production Stage ----
FROM node:20-alpine

WORKDIR /app

# Install serve to serve the build directory
RUN yarn global add serve

# Copy build output from builder
COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]