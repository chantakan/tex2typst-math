FROM node:lts-slim

# 必要最小限のパッケージのみインストール
RUN apt-get update && apt-get install -y \
    git curl build-essential \
    && rm -rf /var/lib/apt/lists/* \
    # Install latest npm
    && npm install -g npm@latest

# ワークスペースディレクトリを作成
WORKDIR /workspace

# タイムゾーンを設定
ENV TZ=Asia/Tokyo

# npmの設定
RUN npm config set update-notifier false
