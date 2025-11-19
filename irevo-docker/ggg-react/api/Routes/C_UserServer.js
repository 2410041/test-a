const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// POST /newUser
router.post('/newUser', async (req, res) => {
    try {
        const payload = req.body || {};
        // 受信ペイロードを早期にログ（デバッグ用）
        console.log('C_UserServer: received payload keys', Object.keys(payload));
        console.log('C_UserServer: received payload sample', {
            c_name: payload.c_name,
            c_Contact: payload.c_Contact,
            c_Password: payload.c_Password ? (typeof payload.c_Password === 'string' ? (payload.c_Password.length > 50 ? payload.c_Password.slice(0,50)+'...' : payload.c_Password) : '[non-string]') : undefined,
            c_Email: payload.c_Email
        });

        // 固定スキーマに合わせて簡潔にマッピング
        // テーブル構造: company_name, representative_name, phone_number, email, password
        // 必須項目は複数のキー表記を許容する（フロント実装差異を吸収）
        const getField = (candidates) => candidates.map(k => payload[k]).find(v => typeof v !== 'undefined' && v !== null && String(v).trim() !== '');

        const companyName = getField(['c_name', 'name', 'company_name']);
        const passwordRaw = getField(['c_Password', 'password', 'pass', 'passwd']);
        const emailVal = getField(['c_Email', 'email', 'mail', 'email_address']);
        const phoneVal = getField(['c_Contact', 'phone', 'phone_number', 'telephone']);

        if (!companyName) {
            console.warn('C_UserServer: missing company name. payload keys:', Object.keys(payload));
            return res.status(400).json({ success: false, message: '必須項目が不足しています: c_name (会社名) が必要です' });
        }
        if (!passwordRaw) {
            return res.status(400).json({ success: false, message: '必須項目が不足しています: c_Password (パスワード) が必要です' });
        }
        if (!emailVal) {
            return res.status(400).json({ success: false, message: '必須項目が不足しています: c_Email (メール) が必要です' });
        }
        if (!phoneVal) {
            return res.status(400).json({ success: false, message: '必須項目が不足しています: c_Contact (電話番号) が必要です' });
        }

        const insertCols = ['company_name', 'representative_name', 'phone_number', 'email', 'password'];
        const hashed = await bcrypt.hash(String(passwordRaw), 10);
        const insertVals = [
            companyName,
            getField(['representative', 'representative_name', 'rep_name']) || null,
            phoneVal,
            emailVal,
            hashed
        ];

        const placeholders = insertCols.map(() => '?').join(', ');
        const sql = `INSERT INTO corporations (${insertCols.join(',')}) VALUES (${placeholders})`;

        // デバッグ用ログ（実行前に出力）
        console.log('C_UserServer: attempting insert', {
            payloadSample: Object.keys(payload).slice(0,10),
            insertCols,
            insertValsSample: insertVals.map(v => (typeof v === 'string' && v.length > 100 ? v.slice(0,100) + '...' : v)),
            sql
        });

        let result;
        try {
            [result] = await global.db.query(sql, insertVals);
        } catch (sqlErr) {
            console.error('C_UserServer SQL error:', sqlErr);
            console.error('Failed SQL:', sql);
            console.error('Values:', insertVals);
            return res.status(500).json({ success: false, message: 'DBエラー', error: sqlErr.message });
        }

        // セッションを作成して登録直後にログイン済みにする
        try {
            // 保存する情報は必要最小限にする
            req.session.company = {
                id: result.insertId,
                company_name: companyName,
                email: emailVal
            };
            console.log('C_UserServer: created session for company', req.session.company);
        } catch (sessErr) {
            console.warn('C_UserServer: session creation failed:', sessErr);
            // セッション作成に失敗しても登録自体は成功しているため、クライアントには成功を返す
        }

        return res.status(201).json({ success: true, id: result.insertId, message: '登録を受け付けました' });
    } catch (err) {
        console.error('newUser error:', err);
        return res.status(500).json({ success: false, message: 'サーバーエラー', error: err.message });
    }
});

module.exports = router;
