#!/bin/bash

# エラーが発生したら停止
set -e

# Dockerが起動しているか確認
if ! docker info >/dev/null 2>&1; then
    echo "Error: Docker is not running. Start docker to run this script." >&2
    exit 1
fi

# 環境変数
CONTAINER_NAME="fukuoka-mitou-2024-backend-1"
GEN_PY_PATH="backend/app/gen.py"
OUTPUT_FILE="docs/openapi.yml"

# ========================================
# 1. バックエンドのソースコードから、openapi.ymlを生成
# ========================================
echo "[1] Generating openapi.yml..."

# Dockerコンテナ内でPythonスクリプトを実行
docker exec -it $CONTAINER_NAME python app/gen.py

# Dockerコンテナからファイルをローカルにコピー
docker cp $CONTAINER_NAME:app/openapi.yml $OUTPUT_FILE

# ========================================
# 2. openapi.ymlから、APIクライアントを生成
# ========================================

echo "[2] Generating API client..."

# APIクライアントを生成
make generate-api-client

# ========================================
# 3. 生成されたファイルをフォーマット
# ========================================

echo "[3] Formatting generated files..."

# ファイルをフォーマット
cd frontend && yarn format || echo "Error occurred during format. Run format by yourself."

echo "[INFO] gen.sh has finished."
