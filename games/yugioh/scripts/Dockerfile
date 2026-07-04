# 2D Games monorepo — scripts image (build from repo root)
FROM python:3.11-slim
WORKDIR /app
COPY games/yugioh/scripts/requirements.txt ./scripts/requirements.txt
RUN pip install --no-cache-dir -r scripts/requirements.txt
COPY games/yugioh/scripts ./scripts
COPY games/yugioh/migrations ./migrations
COPY games/yugioh/data ./data
ENTRYPOINT ["python3"]
CMD ["scripts/src/setup.py"]
