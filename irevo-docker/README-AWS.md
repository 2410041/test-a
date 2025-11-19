# AWSの手順書
## dockerのインストール
```
sudo dnf -y update
```
## Dockerのインストール
```
sudo dnf install docker
```
# 入ったかどうかの確認
```
docker -v
```

## 手順2：Dockerの起動
```
sudo systemctl start docker.service
```
## Dockerが起動しているか確認
```
sudo systemctl status docker.service
```
## activate（running）と表示されるのでDockerが起動していることが確認できます

# Docker インストールと自動起動設定手順 (Amazon Linux / EC2)


## Docker の自動起動設定

EC2を停止、再起動しても Docker が自動的に起動するように設定します。

### 自動起動設定の確認

```bash
sudo systemctl is-enabled docker.service
````

実行結果:

```
disabled
```

### 自動起動を有効化

```bash
sudo systemctl enable docker.service
```

### 再度、自動起動設定を確認

```bash
sudo systemctl is-enabled docker.service
```

実行結果:

```
enabled
```

## docker comopose
```
sudo usermod -aG docker ec2-user

sudo curl -SL https://github.com/docker/compose/releases/download/v2.39.4/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose

$ ls -l /usr/local/bin/docker-compose
-rw-r--r--. 1 root root 73699264 May  7 01:31 /usr/local/bin/docker-compose

$ sudo chmod +x /usr/local/bin/docker-compose

$ ls -l /usr/local/bin/docker-compose
-rwxr-xr-x. 1 root root 73699264 May  7 01:31 /usr/local/bin/docker-compose

docker-compose -v
```

## gitのインストール
https://qiita.com/myaX/items/677cfd8a669d6c7eff80

## git clone
https://qiita.com/shunport/items/39cf2d438654e6610a73
