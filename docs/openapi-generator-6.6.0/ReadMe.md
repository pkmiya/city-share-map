### openapi-generator-6.6.0 template typescript-fetch

- [公式レポジトリにあるテンプレート](https://github.com/OpenAPITools/openapi-generator/tree/v6.6.0/modules/openapi-generator/src/main/resources/typescript-fetch)から引用
- `runtime.mustache` の 130-139 行目を修正
  - before: 常にエラーメッセージは`Response returned an error code`をセットする
  - after: バックエンドが返すエラーメッセージをセットする
