## デバッグ

### Liff inspectorを用いたLIFFアプリのデバッグ

参考：[【LIFF】LIFF Inspectorを使ってローカル開発環境で実機デバッグする方法](https://qiita.com/takahara_yuuki/items/a931dff0c7dc54462249)

#### 準備

以下を済ませておく

- ローカルで、アプリケーションの環境構築（`yarn install`）
- 利用ツールの環境構築（ngrokのアカウント作成・ログイン）
- LIFFの設定

#### 手順

1. ローカルでWebサーバを起動・公開する

   以下を順番に、別々のターミナルでおこなう

   1. サーバの起動：`yarn dev`
   2. サーバの公開：`npx localtunnel --port {local-tunnel-port}`。ただし、`{local-tunnel-port}`は起動したWebサーバのポート番号

2. ローカルでLiff Inspectorサーバを起動・公開する

   以下を順番に、別々のターミナルでおこなう

   1. サーバの起動：`npx @line/liff-inspector`
   2. サーバの公開：`ngrok http {liff-inspector-port}`。ただし、`{liff-inspector-port}`は起動したLiff Inspectorサーバのポート番号

   実行結果の例：

   ```
   yusakumiyata@YusakunoMacBook-Air frontend % npx @line/liff-inspector
   Debugger listening on ws://192.168.3.11:9222

   You need to serve this server over SSL/TLS
   For help, see: https://github.com/line/liff-inspector#important-liff-inspector-server-need-to-be-served-over-ssltls
   ```

3. LIFFアプリ設定の変更

   LINE DevelopersのLIFFアプリ設定画面で、LIFFアプリのエンドポイントURLを以下に変更する。

   ここで、`{web-server-url}`は、1.で公開したWebサーバのURL、`{liff-inspector-url}`は、2.で公開したLiff InspectorサーバのURL

   ```
   {web-server-url}?li.origin={liff-inspector-url}
   ```

4. 完了。実際に使う場合は以下の手順
   1. LINEアプリ内で、本アプリのLIFF URLにアクセスする（LINE DevelopersのLIFFアプリ詳細から確認できる）
      たとえば、`https://liff.line.me/{liff-id}`
   2. すると、手順2-2でLiff Inspectorサーバを起動したターミナルに、いまアクセスした端末に対応したDevToolsのURLが表示される。これをPCのブラウザなどで開く
      たとえば、`devtools://devtools/bundled/inspector.html?wss={liff-inspector-url}/?hi_id={connection-id}`
   3. コンソールやネットワーク、アプリケーションタブが使える

#### その他

- localtunnelで公開したWebサーバにアクセスするとき、IPアドレスを入力する必要がある場合がある。その場合は、Webサーバを公開しているPCで以下のコマンドを実行し、そのIPアドレスを入力する

  ```
  wget -q -O - https://loca.lt/mytunnelpassword
  ```
