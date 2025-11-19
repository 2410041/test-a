router.post("/company/login", async (req, res) => {
    // フロントから送られる email / password を受け取る
    const { email, password } = req.body;

    // 入力バリデーション（どちらか欠けていたらエラー）
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "メールアドレスとパスワードは必須です",
        });
    }

    try {
        // 入力メールアドレスと一致する企業を DB から取得（大小文字無視）
        const [rows] = await global.db.query(
            `SELECT * FROM corporations WHERE LOWER(email) = LOWER(?) LIMIT 1`,
            [email]
        );

        // 一致する企業がなければログイン失敗
        if (!rows || rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "メールまたはパスワードが違います",
            });
        }

        // 取得した企業レコード
        const company = rows[0];

        // パスワードが「bcryptでハッシュ化されているか」をチェック
        // bcrypt のハッシュは "$2b$" で始まるため、これで判別できる
        const passwordIsHashed = company.password.startsWith("$2b$");

        // パスワード検証の結果を入れる変数
        let isValidPassword;

        // もしハッシュ化されているなら bcrypt で比較する
        if (passwordIsHashed) {
            // bcrypt の場合、パスワードはそのままでは比較できない
            // bcrypt.compare(入力されたパスワード, DBに保存されているハッシュパスワード)
            isValidPassword = await bcrypt.compare(password, company.password);
        } else {
            /* ▼ 平文パスワード（古いデータ用）のチェックユーザーが入力したパスワード（password）と
                データベースに保存されているパスワード（company.password）をそのまま文字として比較する。
                完全に一致したら true（正しいパスワード）、一致しなければ false（間違い）。 */
            isValidPassword = (password === company.password);
        }

        // パスワード不一致 → 認証失敗
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "メールまたはパスワードが違います",
            });
        }

        // セッションに企業情報を保存（ログイン成功）
        req.session.company = { ...company };

        // パスワードはセッションに保存しないように削除
        delete req.session.company.password;

        // クライアント側に返す安全な企業情報（password を除外）
        const safeCompany = { ...company };
        delete safeCompany.password;

        // ログイン成功レスポンス
        return res.json({
            success: true,
            company: safeCompany,
        });

    } catch (error) {
        // サーバー内部エラー
        console.error("Error in /company/login:", error);
        return res.status(500).json({
            success: false,
            message: "server error",
        });
    }
});