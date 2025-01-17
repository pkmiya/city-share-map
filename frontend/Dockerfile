# ベースイメージ
FROM node:18-alpine AS base

# ビルドフェーズ
FROM base AS builder

WORKDIR /app

# 必要なファイルのみコピー
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

COPY src ./src
COPY public ./public
COPY next.config.mjs tsconfig.json ./

# 環境変数をビルド時に指定
ARG BUILD_ENV
ENV BUILD_ENV=${BUILD_ENV}
RUN yarn build:${BUILD_ENV}

# 実行フェーズ
FROM base AS runner

WORKDIR /app

# 必要なファイルのみコピー
COPY --from=builder /app/.next/ ./.next/
COPY --from=builder /app/public ./public

CMD ["yarn", "start"]
