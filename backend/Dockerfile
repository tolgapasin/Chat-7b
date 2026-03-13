#syntax=docker/dockerfile:1

# === Build stage: Install dependencies and create virtual environment ===
FROM nvidia/cuda:12.8.0-cudnn-devel-ubuntu24.04 AS builder

ENV LANG=C.UTF-8
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/src/venv/bin:$PATH"

WORKDIR /src

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.12 \
    python3.12-venv \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

RUN python3.12 -m venv /src/venv
COPY requirements.txt .

RUN pip install torch --index-url https://download.pytorch.org/whl/cu128
RUN pip install --no-cache-dir -r requirements.txt

# === Final stage: Create minimal runtime image ===
FROM nvidia/cuda:12.8.0-cudnn-runtime-ubuntu24.04

WORKDIR /src

ENV PYTHONUNBUFFERED=1
ENV PATH="/src/venv/bin:$PATH"

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.12 \
    && rm -rf /var/lib/apt/lists/*

COPY src/ ./
COPY --from=builder /src/venv /src/venv

ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]



