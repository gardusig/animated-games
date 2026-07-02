# 2D Games monorepo — scripts image (build from repo root)
FROM python:3.11-slim
WORKDIR /app
COPY games/pokemon/scripts/requirements.txt ./scripts/requirements.txt
RUN pip install --no-cache-dir -r scripts/requirements.txt
COPY games/pokemon/scripts ./scripts
COPY games/pokemon/migrations ./migrations
COPY games/pokemon/data ./data
ENTRYPOINT ["python3"]
CMD ["scripts/src/setup.py"]
