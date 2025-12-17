const express = require('express');
const router = express.Router();

// ユーザー情報更新エンドポイント (新規)
router.post('/user_update', async (req, res) => {
    try {
        const body = req.body || {};
        const {
            name,
            kana,
            dob,
            gender,
            zipCode,
            prefecture,
            city,
            street,
            building,
            phone,
            email,
            employmentStatus,
            originalEmail,
            address // クライアント送信のフリーテキスト住所（ある場合）
        } = body;

        // originalEmail がなければ email を検索キーにする
        const lookupEmail = originalEmail || email;
        if (!lookupEmail) {
            return res.status(400).json({ success: false, message: 'originalEmail または email が必要です' });
        }

        // 住所を連結して u_Address に保存する（郵便番号のプレフィックスは保存しない）
        let u_Address = null;
        const hasComponents = (prefecture || city || street || building);
        if (hasComponents) {
            const addrParts = [];
            if (prefecture) addrParts.push(String(prefecture).trim());
            if (city) addrParts.push(String(city).trim());
            if (street) addrParts.push(String(street).trim());
            if (building) addrParts.push(String(building).trim());
            u_Address = addrParts.join(' ').trim() || null;
        } else if (address) {
            // もしクライアント側の address に「〒1234567」や「123-4567」が入っていたら除去
            let a = String(address).trim();
            a = a.replace(/^〒\s*\d{3}-?\d{4}\s*/, '').replace(/^\d{3}-?\d{4}\s*/, '');
            u_Address = a || null;
        } else {
            u_Address = null;
        }

        // 氏名を分割して u_Fname, u_Lname にする（スペース区切りを想定）
        let u_Fname = null;
        let u_Lname = null;
        if (name && String(name).trim() !== '') {
            const parts = String(name).trim().split(/\s+/);
            u_Fname = parts[0] || null;
            u_Lname = parts.slice(1).join(' ') || null;
        }

        // 更新するフィールドを組み立てる
        const updates = {};
        if (u_Fname !== null) updates.u_Fname = u_Fname;
        if (u_Lname !== null) updates.u_Lname = u_Lname;
        if (kana !== undefined) updates.u_kana = kana || null;
        if (dob !== undefined) updates.Birthday = dob || null;
        if (gender !== undefined) updates.Gender = gender || null;
        if (phone !== undefined) updates.u_Contact = phone || null;
        // u_Address は郵便番号プレフィックスを除いた文字列を保存
        if (u_Address !== undefined) updates.u_Address = u_Address;
        if (email !== undefined) updates.u_Email = email || null;
        if (employmentStatus !== undefined) updates.Employment = employmentStatus || null;

        const keys = Object.keys(updates);
        if (keys.length === 0) {
            return res.status(400).json({ success: false, message: '更新するフィールドがありません' });
        }

        // クエリ組み立て
        const setClause = keys.map(k => `${k} = ?`).join(', ');
        const values = keys.map(k => updates[k]);
        values.push(lookupEmail);

        const sql = `UPDATE User SET ${setClause} WHERE u_Email = ?`;
        const [result] = await global.db.query(sql, values);

        if (result && result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'ユーザーが見つかりませんでした' });
        }

        // 更新後の最新 user を取得して返す
        const [rows] = await global.db.query('SELECT * FROM User WHERE u_Email = ?', [email || lookupEmail]);
        const user = (rows && rows[0]) ? rows[0] : null;

        return res.json({ success: true, message: 'ユーザー情報を更新しました', user });
    } catch (error) {
        console.error('Error in /user_update:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーのプログラム言語（連想配列をカンマ区切りで保存）を保存するエンドポイント
router.post('/userprogram', async (req, res) => {
    try {
        const body = req.body || {};
        const { user_id, programs, skill, years } = body;

        if (!user_id) {
            return res.status(400).json({ success: false, message: 'user_id が必要です' });
        }

        // ---------- 空データ処理: 空なら該当レコードを削除して終了 ----------
        const isEmptyProgramsArray = Array.isArray(programs) && programs.length === 0;
        const isEmptySkillYearsStrings = (typeof skill === 'string' && typeof years === 'string' &&
            skill.trim() === '' && years.trim() === '');

        if (isEmptyProgramsArray || isEmptySkillYearsStrings) {
            await global.db.query('DELETE FROM program WHERE user_id = ?', [user_id]);
            return res.json({ success: true, message: 'program を削除しました（空データ受信）' });
        }
        // -----------------------------------------------------------------

        // 保存する skill 値 と years_of_experience 値
        let skillValue = null;
        let yearsValue = null;

        if (Array.isArray(programs) && programs.length > 0) {
            // 変更: programs 配列をカンマ区切り文字列で保存する
            // skill: "php,java"
            // years_of_experience: "趣味or実務 1年未満,趣味or実務 1年未満"
            const langs = programs.map(p => (p.language || '').toString().trim()).filter(Boolean);
            const yrs = programs.map(p => (p.duration || '').toString().trim());
            skillValue = langs.join(',');
            yearsValue = yrs.join(',');
        } else if (typeof skill === 'string' && typeof years === 'string') {
            // 既にカンマ区切り文字列で送られている場合はそのまま保存
            skillValue = skill;
            yearsValue = years;
        } else {
            return res.status(400).json({ success: false, message: 'programs または skill/years のどちらかを送ってください' });
        }

        // DB上書き：既存レコードを削除してから挿入（要件に合わせて変更可）
        await global.db.query('DELETE FROM program WHERE user_id = ?', [user_id]);

        await global.db.query(
            'INSERT INTO program (user_id, skill, years_of_experience) VALUES (?, ?, ?)',
            [user_id, skillValue, yearsValue]
        );

        return res.json({ success: true, message: 'program 保存成功' });
    } catch (error) {
        console.error('Error in /userprogram:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの program を取得するエンドポイント（skill, years_of_experience の新旧フォーマットに対応して programs 配列を返す）
router.get('/userprogram', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ success: false, message: 'user_id が必要です' });

        const [rows] = await global.db.query('SELECT * FROM program WHERE user_id = ?', [user_id]);
        if (!rows || rows.length === 0) return res.json({ success: true, programs: [] });

        const row = rows[0];
        const programs = [];

        const tryParse = (txt) => {
            if (!txt) return null;
            try { return JSON.parse(txt); } catch (e) { return null; }
        };

        const skillStr = String(row.skill || '').trim();
        const yearsParsed = tryParse(row.years_of_experience);
        const skillParsed = tryParse(row.skill);

        // 1) years_of_experience がオブジェクト（言語 => duration）の場合
        if (yearsParsed && typeof yearsParsed === 'object' && !Array.isArray(yearsParsed)) {
            // 優先順: skill カラムの順序が欲しい場合は skillStr の言語順を使う
            if (skillStr !== '') {
                const langs = skillStr.split(',').map(s => s.trim()).filter(Boolean);
                langs.forEach(lang => {
                    programs.push({ language: lang, duration: yearsParsed[lang] ?? '' });
                });
            } else {
                // skillStr が空なら yearsParsed のキー順で返す
                Object.keys(yearsParsed).forEach(lang => {
                    programs.push({ language: lang, duration: yearsParsed[lang] ?? '' });
                });
            }
            return res.json({ success: true, programs });
        }

        // 2) skill カラムが JSON 配列 [{language,duration}, ...] の場合（旧フォーマット）
        if (Array.isArray(skillParsed)) {
            skillParsed.forEach(p => {
                if (p && typeof p === 'object') programs.push({ language: p.language ?? '', duration: p.duration ?? '' });
            });
            return res.json({ success: true, programs });
        }

        // 3) years_of_experience が JSON 配列 [{language,duration}, ...] の場合（旧フォーマット）
        if (Array.isArray(yearsParsed)) {
            yearsParsed.forEach(p => {
                if (p && typeof p === 'object') programs.push({ language: p.language ?? '', duration: p.duration ?? '' });
            });
            return res.json({ success: true, programs });
        }

        // 4) フォールバック: skill と years をカンマ区切りで分割して対応付け
        const skillParts = skillStr === '' ? [] : skillStr.split(',').map(s => s.trim());
        const yearsStr = String(row.years_of_experience || '');
        const yearsParts = yearsStr === '' ? [] : yearsStr.split(',').map(s => s.trim());
        const maxLen = Math.max(skillParts.length, yearsParts.length);
        for (let i = 0; i < maxLen; i++) {
            programs.push({
                language: skillParts[i] ?? '',
                duration: yearsParts[i] ?? ''
            });
        }

        return res.json({ success: true, programs });
    } catch (error) {
        console.error('Error in GET /userprogram:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーのフレームワーク情報を保存するエンドポイント（POST /userframework）
router.post('/userframework', async (req, res) => {
    try {
        const body = req.body || {};
        const { user_id, programs, skill, years } = body;

        if (!user_id) {
            return res.status(400).json({ success: false, message: 'user_id が必要です' });
        }

        // 空データ判定: 空配列 または skill/years が空文字なら削除
        const isEmptyProgramsArray = Array.isArray(programs) && programs.length === 0;
        const isEmptySkillYearsStrings = (typeof skill === 'string' && typeof years === 'string' &&
            skill.trim() === '' && years.trim() === '');

        if (isEmptyProgramsArray || isEmptySkillYearsStrings) {
            await global.db.query('DELETE FROM framework WHERE user_id = ?', [user_id]);
            return res.json({ success: true, message: 'framework データを削除しました（空データ受信）' });
        }

        let skillValue = null;
        let yearsValue = null;

        if (Array.isArray(programs) && programs.length > 0) {
            // --- 変更点 ---
            // programs 配列をカンマ区切りの文字列で保存する
            // skill: "Camping,Catalyst"
            // years_of_experience: "趣味or実務 1年未満,趣味or実務 1年未満"
            skillValue = programs
                .map(p => (p.language || '').toString().trim())
                .filter(Boolean)
                .join(',');
            yearsValue = programs
                .map(p => (p.duration || '').toString().trim())
                .join(',');
        } else if (typeof skill === 'string' && typeof years === 'string') {
            // 既にカンマ区切り文字列で送られている場合はそのまま保存
            skillValue = skill;
            yearsValue = years;
        } else {
            return res.status(400).json({ success: false, message: 'programs または skill/years のどちらかを送ってください' });
        }

        // 既存レコードを削除してから挿入（上書き）
        await global.db.query('DELETE FROM framework WHERE user_id = ?', [user_id]);

        await global.db.query(
            'INSERT INTO framework (user_id, skill, years_of_experience) VALUES (?, ?, ?)',
            [user_id, skillValue, yearsValue]
        );

        return res.json({ success: true, message: 'framework 保存成功' });
    } catch (error) {
        console.error('Error in /userframework:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの framework を取得するエンドポイント（GET /userframework）
router.get('/userframework', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ success: false, message: 'user_id が必要です' });

        const [rows] = await global.db.query('SELECT * FROM framework WHERE user_id = ?', [user_id]);
        if (!rows || rows.length === 0) return res.json({ success: true, programs: [] });

        const row = rows[0];
        const programs = [];

        const tryParse = (txt) => {
            if (!txt) return null;
            try { return JSON.parse(txt); } catch (e) { return null; }
        };

        const skillStr = String(row.skill || '').trim();
        const yearsParsed = tryParse(row.years_of_experience);
        const skillParsed = tryParse(row.skill);

        // 1) years_of_experience がオブジェクト（言語 => duration）形式の場合
        if (yearsParsed && typeof yearsParsed === 'object' && !Array.isArray(yearsParsed)) {
            if (skillStr !== '') {
                const langs = skillStr.split(',').map(s => s.trim()).filter(Boolean);
                langs.forEach(lang => {
                    programs.push({ language: lang, duration: yearsParsed[lang] ?? '' });
                });
            } else {
                Object.keys(yearsParsed).forEach(lang => {
                    programs.push({ language: lang, duration: yearsParsed[lang] ?? '' });
                });
            }
            return res.json({ success: true, programs });
        }

        // 2) skill カラムが JSON 配列 [{language,duration}, ...] の場合
        if (Array.isArray(skillParsed)) {
            skillParsed.forEach(p => {
                if (p && typeof p === 'object') programs.push({ language: p.language ?? '', duration: p.duration ?? '' });
            });
            return res.json({ success: true, programs });
        }

        // 3) years_of_experience が JSON 配列 [{language,duration}, ...] の場合
        if (Array.isArray(yearsParsed)) {
            yearsParsed.forEach(p => {
                if (p && typeof p === 'object') programs.push({ language: p.language ?? '', duration: p.duration ?? '' });
            });
            return res.json({ success: true, programs });
        }

        // 4) フォールバック: skill と years をカンマ区切りで分割して対応付け
        const skillParts = skillStr === '' ? [] : skillStr.split(',').map(s => s.trim());
        const yearsStr = String(row.years_of_experience || '');
        const yearsParts = yearsStr === '' ? [] : yearsStr.split(',').map(s => s.trim());
        const maxLen = Math.max(skillParts.length, yearsParts.length);
        for (let i = 0; i < maxLen; i++) {
            programs.push({
                language: skillParts[i] ?? '',
                duration: yearsParts[i] ?? ''
            });
        }

        return res.json({ success: true, programs });
    } catch (error) {
        console.error('Error in GET /userframework:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの DB (databasePR) 情報を保存するエンドポイント（POST /userdb）
router.post('/userdb', async (req, res) => {
    try {
        const body = req.body || {};
        const { user_id, programs, skill, years } = body;

        if (!user_id) {
            return res.status(400).json({ success: false, message: 'user_id が必要です' });
        }

        // 空データ判定: 空配列 または skill/years が空文字なら削除
        const isEmptyProgramsArray = Array.isArray(programs) && programs.length === 0;
        const isEmptySkillYearsStrings = (typeof skill === 'string' && typeof years === 'string' &&
            skill.trim() === '' && years.trim() === '');

        if (isEmptyProgramsArray || isEmptySkillYearsStrings) {
            await global.db.query('DELETE FROM databasePR WHERE user_id = ?', [user_id]);
            return res.json({ success: true, message: 'databasePR データを削除しました（空データ受信）' });
        }

        let skillValue = null;
        let yearsValue = null;

        if (Array.isArray(programs) && programs.length > 0) {
            // 保存方法は既存と同じ: カンマ区切り文字列で保存
            skillValue = programs
                .map(p => (p.language || '').toString().trim())
                .filter(Boolean)
                .join(',');
            yearsValue = programs
                .map(p => (p.duration || '').toString().trim())
                .join(',');
        } else if (typeof skill === 'string' && typeof years === 'string') {
            skillValue = skill;
            yearsValue = years;
        } else {
            return res.status(400).json({ success: false, message: 'programs または skill/years のどちらかを送ってください' });
        }

        // 既存レコードを削除してから挿入（上書き）
        await global.db.query('DELETE FROM databasePR WHERE user_id = ?', [user_id]);

        await global.db.query(
            'INSERT INTO databasePR (user_id, skill, years_of_experience) VALUES (?, ?, ?)',
            [user_id, skillValue, yearsValue]
        );

        return res.json({ success: true, message: 'databasePR 保存成功' });
    } catch (error) {
        console.error('Error in /userdb:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの DB (databasePR) を取得するエンドポイント（GET /userdb）
router.get('/userdb', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ success: false, message: 'user_id が必要です' });

        const [rows] = await global.db.query('SELECT * FROM databasePR WHERE user_id = ?', [user_id]);
        if (!rows || rows.length === 0) return res.json({ success: true, programs: [] });

        const row = rows[0];
        const programs = [];

        const tryParse = (txt) => {
            if (!txt) return null;
            try { return JSON.parse(txt); } catch (e) { return null; }
        };

        const skillStr = String(row.skill || '').trim();
        const yearsParsed = tryParse(row.years_of_experience);
        const skillParsed = tryParse(row.skill);

        // 1) years_of_experience がオブジェクト（言語 => duration）の場合
        if (yearsParsed && typeof yearsParsed === 'object' && !Array.isArray(yearsParsed)) {
            if (skillStr !== '') {
                const langs = skillStr.split(',').map(s => s.trim()).filter(Boolean);
                langs.forEach(lang => {
                    programs.push({ language: lang, duration: yearsParsed[lang] ?? '' });
                });
            } else {
                Object.keys(yearsParsed).forEach(lang => {
                    programs.push({ language: lang, duration: yearsParsed[lang] ?? '' });
                });
            }
            return res.json({ success: true, programs });
        }

        // 2) skill カラムが JSON 配列 [{language,duration}, ...] の場合
        if (Array.isArray(skillParsed)) {
            skillParsed.forEach(p => {
                if (p && typeof p === 'object') programs.push({ language: p.language ?? '', duration: p.duration ?? '' });
            });
            return res.json({ success: true, programs });
        }

        // 3) years_of_experience が JSON 配列 [{language,duration}, ...] の場合
        if (Array.isArray(yearsParsed)) {
            yearsParsed.forEach(p => {
                if (p && typeof p === 'object') programs.push({ language: p.language ?? '', duration: p.duration ?? '' });
            });
            return res.json({ success: true, programs });
        }

        // 4) フォールバック: skill と years をカンマ区切りで分割して対応付け
        const skillParts = skillStr === '' ? [] : skillStr.split(',').map(s => s.trim());
        const yearsStr = String(row.years_of_experience || '');
        const yearsParts = yearsStr === '' ? [] : yearsStr.split(',').map(s => s.trim());
        const maxLen = Math.max(skillParts.length, yearsParts.length);
        for (let i = 0; i < maxLen; i++) {
            programs.push({
                language: skillParts[i] ?? '',
                duration: yearsParts[i] ?? ''
            });
        }

        return res.json({ success: true, programs });
    } catch (error) {
        console.error('Error in GET /userdb:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの Cloud_Platform 情報を保存するエンドポイント（POST /cloudpr）
router.post('/cloudpr', async (req, res) => {
    try {
        const body = req.body || {};
        const { user_id, programs, skill, years } = body;

        if (!user_id) {
            return res.status(400).json({ success: false, message: 'user_id が必要です' });
        }

        const isEmptyProgramsArray = Array.isArray(programs) && programs.length === 0;
        const isEmptySkillYearsStrings = (typeof skill === 'string' && typeof years === 'string' &&
            skill.trim() === '' && years.trim() === '');

        if (isEmptyProgramsArray || isEmptySkillYearsStrings) {
            await global.db.query('DELETE FROM Cloud_Platform WHERE user_id = ?', [user_id]);
            return res.json({ success: true, message: 'Cloud_Platform データを削除しました（空データ受信）' });
        }

        let skillValue = null;
        let yearsValue = null;

        if (Array.isArray(programs) && programs.length > 0) {
            // 保存方法: カンマ区切り文字列で保存
            skillValue = programs.map(p => (p.language || '').toString().trim()).filter(Boolean).join(',');
            yearsValue = programs.map(p => (p.duration || '').toString().trim()).join(',');
        } else if (typeof skill === 'string' && typeof years === 'string') {
            skillValue = skill;
            yearsValue = years;
        } else {
            return res.status(400).json({ success: false, message: 'programs または skill/years のどちらかを送ってください' });
        }

        await global.db.query('DELETE FROM Cloud_Platform WHERE user_id = ?', [user_id]);

        await global.db.query(
            'INSERT INTO Cloud_Platform (user_id, skill, years_of_experience) VALUES (?, ?, ?)',
            [user_id, skillValue, yearsValue]
        );

        return res.json({ success: true, message: 'Cloud_Platform 保存成功' });
    } catch (error) {
        console.error('Error in /cloudpr:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの Cloud_Platform を取得するエンドポイント（GET /cloudpr）
router.get('/cloudpr', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ success: false, message: 'user_id が必要です' });

        const [rows] = await global.db.query('SELECT * FROM Cloud_Platform WHERE user_id = ?', [user_id]);
        if (!rows || rows.length === 0) return res.json({ success: true, programs: [] });

        const row = rows[0];
        const programs = [];

        const tryParse = (txt) => {
            if (!txt) return null;
            try { return JSON.parse(txt); } catch (e) { return null; }
        };

        const skillStr = String(row.skill || '').trim();
        const yearsParsed = tryParse(row.years_of_experience);
        const skillParsed = tryParse(row.skill);

        if (yearsParsed && typeof yearsParsed === 'object' && !Array.isArray(yearsParsed)) {
            if (skillStr !== '') {
                const langs = skillStr.split(',').map(s => s.trim()).filter(Boolean);
                langs.forEach(lang => programs.push({ language: lang, duration: yearsParsed[lang] ?? '' }));
            } else {
                Object.keys(yearsParsed).forEach(lang => programs.push({ language: lang, duration: yearsParsed[lang] ?? '' }));
            }
            return res.json({ success: true, programs });
        }

        if (Array.isArray(skillParsed)) {
            skillParsed.forEach(p => { if (p && typeof p === 'object') programs.push({ language: p.language ?? '', duration: p.duration ?? '' }); });
            return res.json({ success: true, programs });
        }

        if (Array.isArray(yearsParsed)) {
            yearsParsed.forEach(p => { if (p && typeof p === 'object') programs.push({ language: p.language ?? '', duration: p.duration ?? '' }); });
            return res.json({ success: true, programs });
        }

        const skillParts = skillStr === '' ? [] : skillStr.split(',').map(s => s.trim());
        const yearsStr = String(row.years_of_experience || '');
        const yearsParts = yearsStr === '' ? [] : yearsStr.split(',').map(s => s.trim());
        const maxLen = Math.max(skillParts.length, yearsParts.length);
        for (let i = 0; i < maxLen; i++) {
            programs.push({ language: skillParts[i] ?? '', duration: yearsParts[i] ?? '' });
        }

        return res.json({ success: true, programs });
    } catch (error) {
        console.error('Error in GET /cloudpr:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの開発支援ツール情報を保存するエンドポイント（POST /tool）
router.post('/tool', async (req, res) => {
    try {
        const body = req.body || {};
        const { user_id, programs, skill, years } = body;

        if (!user_id) {
            return res.status(400).json({ success: false, message: 'user_id が必要です' });
        }

        const isEmptyProgramsArray = Array.isArray(programs) && programs.length === 0;
        const isEmptySkillYearsStrings = (typeof skill === 'string' && typeof years === 'string' &&
            skill.trim() === '' && years.trim() === '');

        if (isEmptyProgramsArray || isEmptySkillYearsStrings) {
            await global.db.query('DELETE FROM tool WHERE user_id = ?', [user_id]);
            return res.json({ success: true, message: 'tool データを削除しました（空データ受信）' });
        }

        let skillValue = null;
        let yearsValue = null;

        if (Array.isArray(programs) && programs.length > 0) {
            // 保存方法: カンマ区切り文字列で保存（既存と同じ形式）
            skillValue = programs.map(p => (p.language || '').toString().trim()).filter(Boolean).join(',');
            yearsValue = programs.map(p => (p.duration || '').toString().trim()).join(',');
        } else if (typeof skill === 'string' && typeof years === 'string') {
            skillValue = skill;
            yearsValue = years;
        } else {
            return res.status(400).json({ success: false, message: 'programs または skill/years のどちらかを送ってください' });
        }

        await global.db.query('DELETE FROM tool WHERE user_id = ?', [user_id]);

        await global.db.query(
            'INSERT INTO tool (user_id, skill, years_of_experience) VALUES (?, ?, ?)',
            [user_id, skillValue, yearsValue]
        );

        return res.json({ success: true, message: 'tool 保存成功' });
    } catch (error) {
        console.error('Error in /tool:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの tool を取得するエンドポイント（GET /tool）
router.get('/tool', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ success: false, message: 'user_id が必要です' });

        const [rows] = await global.db.query('SELECT * FROM tool WHERE user_id = ?', [user_id]);
        if (!rows || rows.length === 0) return res.json({ success: true, programs: [] });

        const row = rows[0];
        const programs = [];

        const tryParse = (txt) => {
            if (!txt) return null;
            try { return JSON.parse(txt); } catch (e) { return null; }
        };

        const skillStr = String(row.skill || '').trim();
        const yearsParsed = tryParse(row.years_of_experience);
        const skillParsed = tryParse(row.skill);

        // 1) years_of_experience がオブジェクト（言語 => duration）形式の場合
        if (yearsParsed && typeof yearsParsed === 'object' && !Array.isArray(yearsParsed)) {
            if (skillStr !== '') {
                const langs = skillStr.split(',').map(s => s.trim()).filter(Boolean);
                langs.forEach(lang => programs.push({ language: lang, duration: yearsParsed[lang] ?? '' }));
            } else {
                Object.keys(yearsParsed).forEach(lang => programs.push({ language: lang, duration: yearsParsed[lang] ?? '' }));
            }
            return res.json({ success: true, programs });
        }

        // 2) skill カラムが JSON 配列 [{language,duration}, ...] の場合
        if (Array.isArray(skillParsed)) {
            skillParsed.forEach(p => { if (p && typeof p === 'object') programs.push({ language: p.language ?? '', duration: p.duration ?? '' }); });
            return res.json({ success: true, programs });
        }

        // 3) years_of_experience が JSON 配列 [{language,duration}, ...] の場合
        if (Array.isArray(yearsParsed)) {
            yearsParsed.forEach(p => { if (p && typeof p === 'object') programs.push({ language: p.language ?? '', duration: p.duration ?? '' }); });
            return res.json({ success: true, programs });
        }

        // 4) フォールバック: skill と years をカンマ区切りで分割して対応付け
        const skillParts = skillStr === '' ? [] : skillStr.split(',').map(s => s.trim());
        const yearsStr = String(row.years_of_experience || '');
        const yearsParts = yearsStr === '' ? [] : yearsStr.split(',').map(s => s.trim());
        const maxLen = Math.max(skillParts.length, yearsParts.length);
        for (let i = 0; i < maxLen; i++) {
            programs.push({ language: skillParts[i] ?? '', duration: yearsParts[i] ?? '' });
        }

        return res.json({ success: true, programs });
    } catch (error) {
        console.error('Error in GET /tool:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// 上書き: ユーザーの Other_Experience を保存するエンドポイント（POST /other_experience_skill）
// DB テーブル名を Other_ExperiencePR に変更して上書きします
router.post('/other_experience_skill', async (req, res) => {
    try {
        const body = req.body || {};
        const { user_id, programs, skill, years } = body;

        if (!user_id) {
            return res.status(400).json({ success: false, message: 'user_id が必要です' });
        }

        // 空データ判定: 空配列 または skill/years が空文字なら削除
        const isEmptyProgramsArray = Array.isArray(programs) && programs.length === 0;
        const isEmptySkillYearsStrings = (typeof skill === 'string' && typeof years === 'string' &&
            skill.trim() === '' && years.trim() === '');

        if (isEmptyProgramsArray || isEmptySkillYearsStrings) {
            await global.db.query('DELETE FROM Other_ExperiencePR WHERE user_id = ?', [user_id]);
            return res.json({ success: true, message: 'Other_ExperiencePR データを削除しました（空データ受信）' });
        }

        let skillValue = null;
        let yearsValue = null;

        if (Array.isArray(programs) && programs.length > 0) {
            // 保存方法: カンマ区切り文字列で保存
            // skill: "A,B"
            // years_of_experience: "経験1,経験2"
            skillValue = programs.map(p => (p.language || '').toString().trim()).filter(Boolean).join(',');
            yearsValue = programs.map(p => (p.duration || '').toString().trim()).join(',');
        } else if (typeof skill === 'string' && typeof years === 'string') {
            skillValue = skill;
            yearsValue = years;
        } else {
            return res.status(400).json({ success: false, message: 'programs または skill/years のどちらかを送ってください' });
        }

        // 既存レコードを削除してから挿入（上書き）
        await global.db.query('DELETE FROM Other_ExperiencePR WHERE user_id = ?', [user_id]);

        await global.db.query(
            'INSERT INTO Other_ExperiencePR (user_id, skill, years_of_experience) VALUES (?, ?, ?)',
            [user_id, skillValue, yearsValue]
        );

        return res.json({ success: true, message: 'Other_ExperiencePR 保存成功' });
    } catch (error) {
        console.error('Error in /other_experience_skill (POST):', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// 上書き: ユーザーの Other_Experience を取得するエンドポイント（GET /other_experience_skill）
router.get('/other_experience_skill', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ success: false, message: 'user_id が必要です' });

        const [rows] = await global.db.query('SELECT * FROM Other_ExperiencePR WHERE user_id = ?', [user_id]);
        if (!rows || rows.length === 0) return res.json({ success: true, programs: [] });

        const row = rows[0];
        const programs = [];

        const tryParse = (txt) => {
            if (!txt) return null;
            try { return JSON.parse(txt); } catch (e) { return null; }
        };

        const skillStr = String(row.skill || '').trim();
        const yearsParsed = tryParse(row.years_of_experience);
        const skillParsed = tryParse(row.skill);

        // 1) years_of_experience がオブジェクト（言語 => duration）の場合
        if (yearsParsed && typeof yearsParsed === 'object' && !Array.isArray(yearsParsed)) {
            if (skillStr !== '') {
                const langs = skillStr.split(',').map(s => s.trim()).filter(Boolean);
                langs.forEach(lang => {
                    programs.push({ language: lang, duration: yearsParsed[lang] ?? '' });
                });
            } else {
                Object.keys(yearsParsed).forEach(lang => {
                    programs.push({ language: lang, duration: yearsParsed[lang] ?? '' });
                });
            }
            return res.json({ success: true, programs });
        }

        // 2) skill カラムが JSON 配列 [{language,duration}, ...] の場合
        if (Array.isArray(skillParsed)) {
            skillParsed.forEach(p => {
                if (p && typeof p === 'object') programs.push({ language: p.language ?? '', duration: p.duration ?? '' });
            });
            return res.json({ success: true, programs });
        }

        // 3) years_of_experience が JSON 配列 [{language,duration}, ...] の場合
        if (Array.isArray(yearsParsed)) {
            yearsParsed.forEach(p => {
                if (p && typeof p === 'object') programs.push({ language: p.language ?? '', duration: p.duration ?? '' });
            });
            return res.json({ success: true, programs });
        }

        // 4) フォールバック: skill と years をカンマ区切りで分割して対応付け
        const skillParts = skillStr === '' ? [] : skillStr.split(',').map(s => s.trim());
        const yearsStr = String(row.years_of_experience || '');
        const yearsParts = yearsStr === '' ? [] : yearsStr.split(',').map(s => s.trim());
        const maxLen = Math.max(skillParts.length, yearsParts.length);
        for (let i = 0; i < maxLen; i++) {
            programs.push({
                language: skillParts[i] ?? '',
                duration: yearsParts[i] ?? ''
            });
        }

        return res.json({ success: true, programs });
    } catch (error) {
        console.error('Error in GET /other_experience_skill:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーのアルバイト（part_time）を保存するエンドポイント（POST /part-time）
router.post('/part-time', async (req, res) => {
    try {
        const body = req.body || {};
        const { user_id, part_time } = body;

        if (!user_id) {
            return res.status(400).json({ success: false, message: 'user_id が必要です' });
        }

        // 空文字または空白のみなら該当レコードを削除して終了
        if (typeof part_time === 'string' && part_time.trim() === '') {
            await global.db.query('DELETE FROM part_time WHERE user_id = ?', [user_id]);
            return res.json({ success: true, message: 'part_time レコードを削除しました（空データ受信）' });
        }

        // part_time をそのまま TEXT カラムに保存
        const partValue = (typeof part_time === 'string') ? part_time : String(part_time ?? '');

        // 既存レコードを削除してから挿入（上書き）
        await global.db.query('DELETE FROM part_time WHERE user_id = ?', [user_id]);

        await global.db.query(
            'INSERT INTO part_time (user_id, part_time) VALUES (?, ?)',
            [user_id, partValue]
        );

        return res.json({ success: true, message: 'part_time 保存成功' });
    } catch (error) {
        console.error('Error in /part-time:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーのアルバイト（part_time）を取得するエンドポイント（GET /part-time）
router.get('/part-time', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ success: false, message: 'user_id が必要です' });

        const [rows] = await global.db.query('SELECT * FROM part_time WHERE user_id = ?', [user_id]);
        if (!rows || rows.length === 0) return res.json({ success: true, part_time: '' });

        const row = rows[0];
        return res.json({ success: true, part_time: row.part_time ?? '' });
    } catch (error) {
        console.error('Error in GET /part-time:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの Research_Contentrch を保存するエンドポイント（POST /Research_Contentrch）
router.post('/Research_Contentrch', async (req, res) => {
    try {
        const body = req.body || {};
        const { user_id, programs, research, content } = body;

        if (!user_id) {
            return res.status(400).json({ success: false, message: 'user_id が必要です' });
        }

        // 空データ判定: 空配列 または research/content が空文字なら削除
        const isEmptyProgramsArray = Array.isArray(programs) && programs.length === 0;
        const isEmptyResearchContentStrings = (typeof research === 'string' && typeof content === 'string' &&
            research.trim() === '' && content.trim() === '');

        if (isEmptyProgramsArray || isEmptyResearchContentStrings) {
            await global.db.query('DELETE FROM Research_Contentrch WHERE user_id = ?', [user_id]);
            return res.json({ success: true, message: 'Research_Contentrch データを削除しました（空データ受信）' });
        }

        let researchValue = null;
        let contentValue = null;

        if (Array.isArray(programs) && programs.length > 0) {
            // 保存方法: カンマ区切り文字列で保存
            researchValue = programs.map(p => (p.research || p.theme || '').toString().trim()).filter(Boolean).join(',');
            contentValue = programs.map(p => (p.content || p.details || '').toString().trim()).join(',');
        } else if (typeof research === 'string' && typeof content === 'string') {
            researchValue = research;
            contentValue = content;
        } else {
            return res.status(400).json({ success: false, message: 'programs または research/content のどちらかを送ってください' });
        }

        // 既存レコードを削除してから挿入（上書き）
        await global.db.query('DELETE FROM Research_Contentrch WHERE user_id = ?', [user_id]);

        await global.db.query(
            'INSERT INTO Research_Contentrch (user_id, Research, Content) VALUES (?, ?, ?)',
            [user_id, researchValue, contentValue]
        );

        return res.json({ success: true, message: 'Research_Contentrch 保存成功' });
    } catch (error) {
        console.error('Error in /Research_Contentrch:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの Research_Contentrch を取得するエンドポイント（GET /Research_Contentrch）
router.get('/Research_Contentrch', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ success: false, message: 'user_id が必要です' });

        const [rows] = await global.db.query('SELECT * FROM Research_Contentrch WHERE user_id = ?', [user_id]);
        if (!rows || rows.length === 0) return res.json({ success: true, programs: [] });

        const row = rows[0];
        const programs = [];

        const tryParse = (txt) => {
            if (!txt) return null;
            try { return JSON.parse(txt); } catch (e) { return null; }
        };

        const researchStr = String(row.Research || '').trim();
        const contentParsed = tryParse(row.Content);
        const researchParsed = tryParse(row.Research);

        // 1) Content がオブジェクト（research => content）形式の場合
        if (contentParsed && typeof contentParsed === 'object' && !Array.isArray(contentParsed)) {
            if (researchStr !== '') {
                const researches = researchStr.split(',').map(s => s.trim()).filter(Boolean);
                researches.forEach(r => {
                    programs.push({ research: r, content: contentParsed[r] ?? '' });
                });
            } else {
                Object.keys(contentParsed).forEach(r => {
                    programs.push({ research: r, content: contentParsed[r] ?? '' });
                });
            }
            return res.json({ success: true, programs });
        }

        // 2) Research カラムが JSON 配列 [{research,content}, ...] の場合
        if (Array.isArray(researchParsed)) {
            researchParsed.forEach(p => {
                if (p && typeof p === 'object') programs.push({ research: p.research ?? p.theme ?? '', content: p.content ?? p.details ?? '' });
            });
            return res.json({ success: true, programs });
        }

        // 3) Content が JSON 配列 [{research,content}, ...] の場合
        if (Array.isArray(contentParsed)) {
            contentParsed.forEach(p => {
                if (p && typeof p === 'object') programs.push({ research: p.research ?? p.theme ?? '', content: p.content ?? p.details ?? '' });
            });
            return res.json({ success: true, programs });
        }

        // 4) フォールバック: Research と Content をカンマ区切りで分割して対応付け
        const researchParts = researchStr === '' ? [] : researchStr.split(',').map(s => s.trim());
        const contentStr = String(row.Content || '');
        const contentParts = contentStr === '' ? [] : contentStr.split(',').map(s => s.trim());
        const maxLen = Math.max(researchParts.length, contentParts.length);
        for (let i = 0; i < maxLen; i++) {
            programs.push({
                research: researchParts[i] ?? '',
                content: contentParts[i] ?? ''
            });
        }

        return res.json({ success: true, programs });
    } catch (error) {
        console.error('Error in GET /Research_Contentrch:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーのインターン（Intern）を保存するエンドポイント（POST /intern）
router.post('/intern', async (req, res) => {
    try {
        const body = req.body || {};
        const { user_id, intern } = body;

        if (!user_id) {
            return res.status(400).json({ success: false, message: 'user_id が必要です' });
        }

        // 空文字または空白のみなら該当レコードを削除して終了
        if (typeof intern === 'string' && intern.trim() === '') {
            await global.db.query('DELETE FROM Intern WHERE user_id = ?', [user_id]);
            return res.json({ success: true, message: 'Intern レコードを削除しました（空データ受信）' });
        }

        const internValue = (typeof intern === 'string') ? intern : String(intern ?? '');

        // 既存レコードを削除してから挿入（上書き）
        await global.db.query('DELETE FROM Intern WHERE user_id = ?', [user_id]);

        await global.db.query(
            'INSERT INTO Intern (user_id, Intern) VALUES (?, ?)',
            [user_id, internValue]
        );

        return res.json({ success: true, message: 'Intern 保存成功' });
    } catch (error) {
        console.error('Error in /intern (POST):', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーのインターン（Intern）を取得するエンドポイント（GET /intern）
router.get('/intern', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ success: false, message: 'user_id が必要です' });

        const [rows] = await global.db.query('SELECT * FROM Intern WHERE user_id = ?', [user_id]);
        if (!rows || rows.length === 0) return res.json({ success: true, intern: '' });

        const row = rows[0];
        return res.json({ success: true, intern: row.Intern ?? '' });
    } catch (error) {
        console.error('Error in GET /intern:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの企業選び優先事項（prioritize）を保存するエンドポイント（POST /prioritize）
router.post('/prioritize', async (req, res) => {
    try {
        const body = req.body || {};
        const { user_id, prioritize } = body;

        if (!user_id) {
            return res.status(400).json({ success: false, message: 'user_id が必要です' });
        }

        // 空文字または空白のみなら該当レコードを削除して終了
        if (typeof prioritize === 'string' && prioritize.trim() === '') {
            await global.db.query('DELETE FROM prioritize WHERE user_id = ?', [user_id]);
            return res.json({ success: true, message: 'prioritize レコードを削除しました（空データ受信）' });
        }

        const prioritizeValue = (typeof prioritize === 'string') ? prioritize : String(prioritize ?? '');

        // 既存レコードを削除してから挿入（上書き）
        await global.db.query('DELETE FROM prioritize WHERE user_id = ?', [user_id]);

        await global.db.query(
            'INSERT INTO prioritize (user_id, prioritize) VALUES (?, ?)',
            [user_id, prioritizeValue]
        );

        return res.json({ success: true, message: 'prioritize 保存成功' });
    } catch (error) {
        console.error('Error in /prioritize (POST):', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの企業選び優先事項（prioritize）を取得するエンドポイント（GET /prioritize）
router.get('/prioritize', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ success: false, message: 'user_id が必要です' });

        const [rows] = await global.db.query('SELECT * FROM prioritize WHERE user_id = ?', [user_id]);
        if (!rows || rows.length === 0) return res.json({ success: true, prioritize: '' });

        const row = rows[0];
        return res.json({ success: true, prioritize: row.prioritize ?? '' });
    } catch (error) {
        console.error('Error in GET /prioritize:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの希望企業タイプ（Desired_Company_Type）を保存するエンドポイント（POST /type）
router.post('/type', async (req, res) => {
    try {
        const body = req.body || {};
        const { user_id, Desired_Company_Type } = body;

        if (!user_id) {
            return res.status(400).json({ success: false, message: 'user_id が必要です' });
        }

        // 空文字または空白のみなら該当レコードを削除して終了
        if (typeof Desired_Company_Type === 'string' && Desired_Company_Type.trim() === '') {
            await global.db.query('DELETE FROM Desired_Company_Type WHERE user_id = ?', [user_id]);
            return res.json({ success: true, message: 'Desired_Company_Type レコードを削除しました（空データ受信）' });
        }

        const value = (typeof Desired_Company_Type === 'string') ? Desired_Company_Type : String(Desired_Company_Type ?? '');

        // 既存レコードを削除してから挿入（上書き）
        await global.db.query('DELETE FROM Desired_Company_Type WHERE user_id = ?', [user_id]);

        await global.db.query(
            'INSERT INTO Desired_Company_Type (user_id, Desired_Company_Type) VALUES (?, ?)',
            [user_id, value]
        );

        return res.json({ success: true, message: 'Type 保存成功' });
    } catch (error) {
        console.error('Error in /type (POST):', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの希望企業タイプ（Desired_Company_Type）を取得するエンドポイント（GET /type）
router.get('/type', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ success: false, message: 'user_id が必要です' });

        const [rows] = await global.db.query('SELECT * FROM Desired_Company_Type WHERE user_id = ?', [user_id]);
        if (!rows || rows.length === 0) return res.json({ success: true, Desired_Company_Type: '' });

        const row = rows[0];
        return res.json({ success: true, Desired_Company_Type: row.Desired_Company_Type ?? '' });
    } catch (error) {
        console.error('Error in GET /type:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの希望勤務地（Location）を保存するエンドポイント（POST /location）
router.post('/location', async (req, res) => {
    try {
        const body = req.body || {};
        const { user_id, Location } = body;

        if (!user_id) {
            return res.status(400).json({ success: false, message: 'user_id が必要です' });
        }

        // 空文字または空白のみなら該当レコードを削除して終了
        if (typeof Location === 'string' && Location.trim() === '') {
            await global.db.query('DELETE FROM Location WHERE user_id = ?', [user_id]);
            return res.json({ success: true, message: 'Location レコードを削除しました（空データ受信）' });
        }

        const value = (typeof Location === 'string') ? Location : String(Location ?? '');

        // 既存レコードを削除してから挿入（上書き）
        await global.db.query('DELETE FROM Location WHERE user_id = ?', [user_id]);

        await global.db.query(
            'INSERT INTO Location (user_id, Location) VALUES (?, ?)',
            [user_id, value]
        );

        return res.json({ success: true, message: 'Location 保存成功' });
    } catch (error) {
        console.error('Error in /location (POST):', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの希望勤務地（Location）を取得するエンドポイント（GET /location）
router.get('/location', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ success: false, message: 'user_id が必要です' });

        const [rows] = await global.db.query('SELECT * FROM Location WHERE user_id = ?', [user_id]);
        if (!rows || rows.length === 0) return res.json({ success: true, Location: '' });

        const row = rows[0];
        return res.json({ success: true, Location: row.Location ?? '' });
    } catch (error) {
        console.error('Error in GET /location:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの希望職種（JobType）を保存するエンドポイント（POST /jobtype）
router.post('/jobtype', async (req, res) => {
    try {
        const body = req.body || {};
        const { user_id, Location } = body; // テーブル定義が Location カラムのため Location を使用

        if (!user_id) {
            return res.status(400).json({ success: false, message: 'user_id が必要です' });
        }

        if (typeof Location === 'string' && Location.trim() === '') {
            await global.db.query('DELETE FROM JobType WHERE user_id = ?', [user_id]);
            return res.json({ success: true, message: 'JobType レコードを削除しました（空データ受信）' });
        }

        const value = (typeof Location === 'string') ? Location : String(Location ?? '');

        await global.db.query('DELETE FROM JobType WHERE user_id = ?', [user_id]);

        await global.db.query(
            'INSERT INTO JobType (user_id, Location) VALUES (?, ?)',
            [user_id, value]
        );

        return res.json({ success: true, message: 'JobType 保存成功' });
    } catch (error) {
        console.error('Error in /jobtype (POST):', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの希望職種（JobType）を取得するエンドポイント（GET /jobtype）
router.get('/jobtype', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ success: false, message: 'user_id が必要です' });

        const [rows] = await global.db.query('SELECT * FROM JobType WHERE user_id = ?', [user_id]);
        if (!rows || rows.length === 0) return res.json({ success: true, Location: '' });

        const row = rows[0];
        return res.json({ success: true, Location: row.Location ?? '' });
    } catch (error) {
        console.error('Error in GET /jobtype:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの希望業界（Industry）を保存するエンドポイント（POST /industry）
router.post('/industry', async (req, res) => {
    try {
        const body = req.body || {};
        const { user_id, Industry } = body;

        if (!user_id) {
            return res.status(400).json({ success: false, message: 'user_id が必要です' });
        }

        // 空文字または空白のみなら該当レコードを削除して終了
        if (typeof Industry === 'string' && Industry.trim() === '') {
            await global.db.query('DELETE FROM Industry WHERE user_id = ?', [user_id]);
            return res.json({ success: true, message: 'Industry レコードを削除しました（空データ受信）' });
        }

        const value = (typeof Industry === 'string') ? Industry : String(Industry ?? '');

        // 既存レコードを削除してから挿入（上書き）
        await global.db.query('DELETE FROM Industry WHERE user_id = ?', [user_id]);

        await global.db.query(
            'INSERT INTO Industry (user_id, Industry) VALUES (?, ?)',
            [user_id, value]
        );

        return res.json({ success: true, message: 'Industry 保存成功' });
    } catch (error) {
        console.error('Error in /industry (POST):', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの希望業界（Industry）を取得するエンドポイント（GET /industry）
router.get('/industry', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ success: false, message: 'user_id が必要です' });

        const [rows] = await global.db.query('SELECT * FROM Industry WHERE user_id = ?', [user_id]);
        if (!rows || rows.length === 0) return res.json({ success: true, Industry: '' });

        const row = rows[0];
        return res.json({ success: true, Industry: row.Industry ?? '' });
    } catch (error) {
        console.error('Error in GET /industry:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの希望開発言語（DesiredSkill）を保存するエンドポイント（POST /desiredskill）
router.post('/desiredskill', async (req, res) => {
    try {
        const body = req.body || {};
        const { user_id, DesiredSkill } = body;

        if (!user_id) {
            return res.status(400).json({ success: false, message: 'user_id が必要です' });
        }

        // 空文字または空白のみなら該当レコードを削除して終了
        if (typeof DesiredSkill === 'string' && DesiredSkill.trim() === '') {
            await global.db.query('DELETE FROM DesiredSkill WHERE user_id = ?', [user_id]);
            return res.json({ success: true, message: 'DesiredSkill レコードを削除しました（空データ受信）' });
        }

        const value = (typeof DesiredSkill === 'string') ? DesiredSkill : String(DesiredSkill ?? '');

        // 既存レコードを削除してから挿入（上書き）
        await global.db.query('DELETE FROM DesiredSkill WHERE user_id = ?', [user_id]);

        await global.db.query(
            'INSERT INTO DesiredSkill (user_id, DesiredSkill) VALUES (?, ?)',
            [user_id, value]
        );

        return res.json({ success: true, message: 'DesiredSkill 保存成功' });
    } catch (error) {
        console.error('Error in /desiredskill (POST):', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの希望開発言語（DesiredSkill）を取得するエンドポイント（GET /desiredskill）
router.get('/desiredskill', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ success: false, message: 'user_id が必要です' });

        const [rows] = await global.db.query('SELECT * FROM DesiredSkill WHERE user_id = ?', [user_id]);
        if (!rows || rows.length === 0) return res.json({ success: true, DesiredSkill: '' });

        const row = rows[0];
        return res.json({ success: true, DesiredSkill: row.DesiredSkill ?? '' });
    } catch (error) {
        console.error('Error in GET /desiredskill:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの DesiredOther を保存するエンドポイント（POST /desiredother）
router.post('/desiredother', async (req, res) => {
    try {
        const body = req.body || {};
        const { user_id, DesiredOther } = body;

        if (!user_id) {
            return res.status(400).json({ success: false, message: 'user_id が必要です' });
        }

        // 空文字または空白のみなら該当レコードを削除して終了
        if (typeof DesiredOther === 'string' && DesiredOther.trim() === '') {
            await global.db.query('DELETE FROM DesiredOther WHERE user_id = ?', [user_id]);
            return res.json({ success: true, message: 'DesiredOther レコードを削除しました（空データ受信）' });
        }

        const value = (typeof DesiredOther === 'string') ? DesiredOther : String(DesiredOther ?? '');

        // 既存レコードを削除してから挿入（上書き）
        await global.db.query('DELETE FROM DesiredOther WHERE user_id = ?', [user_id]);

        await global.db.query(
            'INSERT INTO DesiredOther (user_id, DesiredOther) VALUES (?, ?)',
            [user_id, value]
        );

        return res.json({ success: true, message: 'DesiredOther 保存成功' });
    } catch (error) {
        console.error('Error in /desiredother (POST):', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// ユーザーの DesiredOther を取得するエンドポイント（GET /desiredother）
router.get('/desiredother', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ success: false, message: 'user_id が必要です' });

        const [rows] = await global.db.query('SELECT * FROM DesiredOther WHERE user_id = ?', [user_id]);
        if (!rows || rows.length === 0) return res.json({ success: true, DesiredOther: '' });

        const row = rows[0];
        return res.json({ success: true, DesiredOther: row.DesiredOther ?? '' });
    } catch (error) {
        console.error('Error in GET /desiredother:', error);
        return res.status(500).json({ success: false, message: 'サーバーエラー' });
    }
});

// /mypage/skillMatch
// 企業（求人）側が求めるスキル(companySkill + skillMaster) と
// ユーザー側の言語経験(program) を照合して ✔ / ✖ を返す
router.get('/skillMatch', async (req, res) => {
    try {
        const { userId, jobOfferId } = req.query;

        if (!userId || !jobOfferId) {
            return res.status(400).json({
                success: false,
                message: 'userId と jobOfferId が必要です'
            });
        }

        // 1) 求人側スキルを取得
        const [companySkillRows] = await global.db.query(
            `SELECT sm.skillName FROM companySkill cs JOIN skillMaster sm ON cs.skillId = sm.id
            WHERE cs.jobOfferId = ? ORDER BY cs.id ASC`,
            [jobOfferId]
        );

        // 2) ユーザー側 言語経験を取得
        const [programRows] = await global.db.query(
            `SELECT skill FROM program WHERE user_id = ?`,
            [userId]
        );

        // ユーザーが登録している言語を配列化
        const userSkills = programRows
            .flatMap(row =>
                String(row.skill || '')
                    .split(',')
                    .map(skills => skills.trim())
            )
            .filter(Boolean);

        // 比較用正規化
        const normalize = view => view.toLowerCase();
        const userSet = new Set(userSkills.map(normalize));

        // 3) 企業スキルと照合
        const skills = companySkillRows.map(row => {
            const name = row.skillName;
            return {
                skillName: name,
                matched: userSet.has(normalize(name))
            };
        });

        // 4) 会社名を取得
        const [[jobRow]] = await global.db.query(
            `SELECT c.c_name FROM job_offers jo JOIN Companies c ON jo.company_id = c.id WHERE jo.id = ?`,
            [jobOfferId]
        );

        return res.json({
            success: true,
            companyName: jobRow?.c_name || '',
            skills
        });

    } catch (err) {
        console.error('skillMatch error:', err);
        return res.status(500).json({
            success: false,
            message: 'サーバーエラー',
            error: String(err)
        });
    }
});

//  (注意) 以前のマージで file の途中に module.exports = router; が入っている場合は削除してください。
//  以下では既存ルートはそのままにし、最後に module.exports = router; を置くようにします。

module.exports = router;