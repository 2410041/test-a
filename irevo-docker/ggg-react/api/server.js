const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const session = require('express-session');

// フロントからのアクセス許可
// → フロントエンド（Reactなど）とバックエンド（Express）が別ポートで動くため、
//   CORS設定を行わないと通信がブロックされてしまう。
app.use(cors({
    origin: 'http://localhost:3000',
    // Cookieや認証情報を送受信するための設定
    credentials: true,
    // 許可するHTTPメソッド                                      
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // 許可するHTTPヘッダー   
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Json形式のデータ
app.use(express.json());
// フォームのデータを読めるようにする
app.use(express.urlencoded({ extended: true }));

// 動作確認用エンドポイント
app.get('/', (req, res) => {
    res.send('APIサーバーは正常に動作しています');
});

// sessionの設定（CORSの後に移動）
app.use(session({
    // セッション暗号化キー
    secret: process.env.SESSION_SECRET || 'default_secret',
    // セッションが変更されていない場合は再保存しない
    resave: false,
    // 未初期化セッションを保存しない
    saveUninitialized: false,
    cookie: {
        // JavaScriptからアクセスできないようにする（セキュリティ対策）
        httpOnly: true,
        // HTTPSのみでCookie送信するかどうか（本番ではtrueに）
        secure: false,
        // クロスサイトリクエストの際のCookie制御
        // CORS対策として追加
        sameSite: 'lax',
        // session 有効期限1日
        maxAge: 1000 * 60 * 60 * 24     // ログアウトしてsessionを削除する場合はこの行を削除する
        //      1000ミリ秒 * 60秒 * 60分 * 24時間   
    }
}));

// MySQLデータベース接続とサーバー起動（リトライロジック付き）
const connectAndStartServer = async () => {
    try {
        // DB接続試行
        // → MySQLへの接続は時間がかかるため、非同期関数で安全に処理を待つ必要がある
        const db = await mysql.createConnection({
            // host: 'localhost', // Docker環境ならmysql-db
            host: 'mysql-db',
            user: 'S4rTqi7D',
            password: 'p3A46MdV',
            database: 'iRevo',
        });

        // 接続成功時の処理
        // グローバルに設定（他のルートファイルでも使用可能に）
        // 接続成功時のログ出力
        global.db = db;
        console.log('DB接続成功');

        // ファイルの読み込み（DB接続後）
        // → DB接続が成功してからルートファイルを読み込むことで、
        //   接続前にSQLを実行しようとしてエラーになるのを防ぐ
        const cServer = require('./Routes/cServer.js');
        const logServer = require('./Routes/logServer.js');
        const uServer = require('./Routes/uServer.js');
        const calendarServer = require('./Routes/calendarServer.js');
        const gasServer = require('./Routes/gasServer.js');
        const locationServer = require('./Routes/locationServer');
        const chartServer = require('./Routes/chartServer.js');
        const cUserServer = require('./Routes/C_UserServer.js');
        const chatServer = require('./Routes/chatServer.js');
        const clogServer = require('./cRoutes/clogServer.js');

        // ルーティングの設定
        // → 各モジュールに分割されたAPIをルートとして登録
        app.use('/company', cServer);
        app.use('/log', logServer);
        app.use('/user', uServer);
        app.use('/calendar', calendarServer);
        app.use('/gas', gasServer);
        app.use('/location', locationServer);
        app.use('/chart', chartServer);
        app.use('/c_user', cUserServer);
        app.use('/chat', chatServer);
        app.use('/clog', clogServer);

        // デバッグ: 現在マウントされているルート一覧を返すエンドポイント
        app.get('/debug/routes', (req, res) => {
            try {
                const routes = [];
                app._router.stack.forEach(layer => {
                    if (layer.route) {
                        // 直接定義されたルート
                        routes.push({ 
                            path: layer.route.path,
                            methods: Object.keys(layer.route.methods)
                        });
                    } else if (layer.name === 'router' && layer.regexp) {
                        // マウントされたルーター（例: /company）をざっくり表示
                        routes.push({
                            mount: layer.regexp.toString(),
                            name: layer.name
                        });
                    }
                });
                res.json(routes);
            } catch (err) {
                res.status(500).json({
                    error: String(err)
                });
            }
        });

        // サーバー起動（DBとルート設定が完了してから起動）
        // → APIサーバーが3030番ポートで待ち受けるように設定
        app.listen(3030, () => {
            console.log('API server running on http://localhost:3030');
        });

    } catch (err) {
        // DB接続失敗時のエラーハンドリング
        console.error('DB接続失敗:', err.code || err.message); // エラーコードまたはメッセージを表示
        console.log('10秒後に再接続します...');

        // 10秒後にこの関数自身を再度呼び出す
        setTimeout(connectAndStartServer, 10000);
    }
};

// 最初の接続試行を開始
connectAndStartServer();


/*
▼ なぜ非同期（async/await）を使わないといけないのか？

MySQLの接続やファイルの読み込みなどは入出力処理であり、
実行完了までに時間がかかるため、JavaScriptのメインスレッドをブロックしてしまいます。

もし同期的（非async）に接続処理を行うと、
DB接続が終わるまで他のコード（ルート設定やサーバー起動）が止まってしまい、
アプリ全体がフリーズする原因になります。

async/awaitを使うことで「接続完了を待ちながらも」他の処理をブロックせず、
安全かつ確実に「DBが使える状態になってから」ルーティングを設定できるようになります。
*/