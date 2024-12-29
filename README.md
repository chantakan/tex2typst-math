# React Router v7 TypeScript Development Environment

このプロジェクトは、React Router v7を使用したTypeScript開発環境を提供します。以下の手順に従ってセットアップを行ってください。

## React Router v7について

React Routerは、Reactアプリケーションのための標準的なルーティングライブラリです。バージョン7では、よりシンプルで強力なAPIが提供されています。

## セットアップ方法

### 1. リポジトリをクローン


### 2. Devcontainerのセットアップ
このプロジェクトは、VS CodeのDevcontainerを使用して開発環境を提供します。以下の手順に従ってセットアップを行ってください。

VS Codeでプロジェクトを開きます。
左下の「><」アイコンをクリックし、「Reopen in Container」を選択します。
### 3. 依存関係のインストール
コンテナ内で以下のコマンドを実行して依存関係をインストールします。

コンテナ内で以下のコマンドを実行して依存関係をインストールします。

```bash
npm install
```

### 4. 開発サーバーの起動
以下のコマンドを実行して開発サーバーを起動します。

```bash
npm run dev
```

### 5. ブラウザでアプリケーションを確認
ブラウザで以下のURLにアクセスしてアプリケーションを確認します。

http://localhost:5137
vite.config.tsのhost指定
vite.config.tsファイルでは、開発サーバーのホストとポートを指定しています。以下の設定を確認してください。

```ts
// filepath: /home/tom/projects/my-own-product/test-react-router/vite.config.ts
// ...existing code...
server: {
  host: true,
  port: 5137,
  strictPort: true,
  watch: {
    usePolling: true,
  }
}
// ...existing code...
```


この設定により、開発サーバーはポート5137でアクセス可能になります。