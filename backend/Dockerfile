# ---- Builder Stage ----
FROM python:3.12-alpine AS builder

WORKDIR /app

# Install build dependencies (Alpine uses apk)
RUN apk update && apk add --no-cache gcc musl-dev

# Copy requirements and install dependencies to a temp folder
COPY requirements.txt .
RUN pip install --user --upgrade pip && \
    pip install --user --no-cache-dir -r requirements.txt

# ---- Final Stage ----
FROM python:3.12-alpine

WORKDIR /app

# Copy only installed packages from builder
COPY --from=builder /root/.local /root/.local

# Add local bin to PATH
ENV PATH=/root/.local/bin:$PATH

# Copy application code
COPY . .

# Set permissions if needed
RUN mkdir -p /app/logs && chmod -R 755 /app/logs

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]