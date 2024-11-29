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

# Dockerコンテナ内でPyYAMLをインストール
docker exec -it $CONTAINER_NAME pip install PyYAML==6.0.2

# ローカルファイルをDockerコンテナにコピー
docker cp $GEN_PY_PATH $CONTAINER_NAME:app/app/gen.py

# Dockerコンテナ内でPythonスクリプトを実行
docker exec -it $CONTAINER_NAME python app/gen.py

# Dockerコンテナからファイルをローカルにコピー
docker cp $CONTAINER_NAME:app/app/openapi.yml $OUTPUT_FILE

# APIクライアントを生成
make generate-api-client

# ファイルをフォーマット
cd frontend && yarn format
