const express = require('express');
const router = express.Router();
const axios = require('axios');
// ↓ これを使う！
const qs = require('qs');

const GAS_URL = "https://script.google.com/macros/s/AKfycby3z1KoPnzLRsZO6E9nQZek7O0xwDknJWnZCKSDK5uEBDtWGi-_tnnFy5GkM-MLhPk/exec";

router.post('/contact', async (req, res) => {
    try {
        // sessionに保存されたユーザーデータを取得し user 変数に格納
        const user = req.session?.user;

        // ログインチェック
        if (!user || !user.id) {
            return res.status(401).json({
                success: false,
                message: 'ログインしていません。'
            });
        }

        //  bodyから uName email title message select_p を取得
        const { uName, email, title, message, select_p } = req.body;
        const time = new Date();
        const formattedTime = time.toISOString().slice(0, 19).replace('T', ' ');

        if (!uName || !email || !title || !message || !select_p) {
            return res.status(400).json({
                success: false,
                message: '項目が不足しています'
            });
        }

        // DB保存
        await global.db.query(
            'INSERT INTO Contact (user_id, uName, email, title, message, time, select_p) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user.id, uName, email, title, message, formattedTime, select_p]
        );

        // GASに送信（フォーム形式）
        try {
            const formData = qs.stringify({ // ← ここを修正！
                uName,
                email,
                select_p,
                title,
                message,
            });

            const gasResponse = await axios.post(GAS_URL, formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            console.log("✅ GAS response:", gasResponse.data);
        } catch (err) {
            console.error("❌ GAS request error:", err.response?.status, err.response?.data || err.message);
        }

        // ✅ フロントにも成功を返す
        res.status(200).json({
            success: true,
            message: 'お問い合わせを受け付けました。'
        });

    } catch (error) {
        console.error('Error in /gas/contact:', error);
        res.status(500).json({
            success: false,
            message: 'サーバーエラー'
        });
    }
});

module.exports = router;
