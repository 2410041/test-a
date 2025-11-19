# irevo-docker

<!-- docker + react vite 環境の作り方-->
## dockerコマンド一覧

#履歴書PDFに必要なコマンドdocker自体に入力
```bash
npm install html2canvas jspdf
```

```bash
# After Create or Edit First Only
docker compose up -d --build

# Run Docker Container
docker compose up -d

# Stop Docker Container
docker compose down
```

## AWS上のEC2(Amazon Linux2023)からGitHubのリポジトリをクローンする方法

### GitHub側の設定

GitHubにログイン

GitHubの「Settings」>「Developer settings」>「Personal access tokens」> 「Token (classic)」>「Generate new token」>「Generate new token (classic)」から発行します

Note : 任意の名前

Select scopoes : `repo`にチェックを入れて`Generate token`をクリックする

発行された`トークン`は、後で使用するので保存しておく

### AWS側の設定

Gitのインストール（初回のみ）

```bash
sudo yum update -y
sudo yum install -y git
```

リポジトリをクローン

```bash
git clone https://<GitHubユーザー名>:<トークン>@github.com/Mahi-0420/irevo-docker.git
```
