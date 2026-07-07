# 🚀 Setup and run the app

This project uses **Docker** (or **Podman**) with **docker-compose**. You only need one of the two. *No Java, Node, or Python on the host required* to run the app in containers.

**Running tests:** See [TESTS.md](TESTS.md) for per-project test commands, Podman, and native runtimes.

---

## ✅ Prerequisites

| Runtime | Install | Notes |
|---------|---------|--------|
| **Docker** | [Install Docker](https://docs.docker.com/get-docker/) (or Docker Desktop) | Ensure `docker compose` works |
| **Podman** | [Install Podman](https://podman.io/) + [Compose](https://github.com/containers/podman-compose) (e.g. `pip install podman-compose`) | Use `podman compose -f pipeline Docker workflows` and `podman` in place of `docker compose` and `docker` below |

---

## 📦 What to install

### Linux terminal

1. **Docker Engine:** [Install Docker](https://docs.docker.com/engine/install/) and ensure `docker compose` works.
2. **Podman:** install Podman and [podman-compose](https://github.com/containers/podman-compose) if you prefer a daemonless runtime.
3. **Native development:** install Java, Node, and Python only if you are running components without containers.

### Native runtimes

See [DEVELOPMENT.md](DEVELOPMENT.md) for running **without containers** (Java, Node, Python on the host).

---

## 🏃 Run the app

From the **repository root**:

| Runtime | Command |
|---------|---------|
| **Docker** | `docker compose up --build` |
| **Podman** | `podman compose -f pipeline Docker workflows up --build` |

**First run:** The database maintenance flow runs **migrations** (create tables) then **seed** from `data/*.csv`, then exits. Backend and frontend start after that.

### After startup — where to open

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:8082 |
| **Swagger UI** | http://localhost:8080/swagger-ui.html |
| **Health** | http://localhost:8080/healthcheck |

### Other useful commands

| Goal | Docker | Podman |
|------|--------|--------|
| **Start only DB** (e.g. for local backend) | `docker compose up -d database` | `podman compose -f pipeline Docker workflows up -d database` |
| **Tear down** | `docker compose down` | `podman compose -f pipeline Docker workflows down` |

---

## 📚 See also

- **Run tests (Docker / Podman / native):** [TESTS.md](TESTS.md)
- **Use the app (URLs, Swagger, frontend):** [GETTING_STARTED.md](GETTING_STARTED.md)
- **Local dev without containers:** [DEVELOPMENT.md](DEVELOPMENT.md)
