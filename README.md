# fukuoka-mitou-2024

## ローカル開発

### フロントエンド開発

まず、以下のコマンドを実行し、バックエンドとデータベースを起動してください。イメージを再ビルドする場合、末尾に `--build` オプションを追加します。

```
$ docker compose -f docker-compose.yml -f docker-compose.local.yml up -d
```

次に、以下のコマンドを実行し、フロントエンドの開発サーバーを起動してください。

```
$ yarn dev
```

## デプロイ方法

本プロジェクトでは、GitHub Actions を設定しており、特定のブランチに push されたり、マニュアルで実行することで、自動でデプロイが行われます。

ただし、手動で設定する場合、以下の手順に従ってください。プロジェクトのレポジトリに入り、以下のコマンドを実行します。

### ステージング環境の場合

```
$ BUILD_ENV=stg docker compose -f docker-compose.yml -f docker-compose.stg.yml up -d --build
```

### 本番環境の場合

```
$ BUILD_ENV=prd docker compose -f docker-compose.yml -f docker-compose.prd.yml up -d --build
```
