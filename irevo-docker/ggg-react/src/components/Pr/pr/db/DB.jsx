import React, { useState, useEffect } from 'react';
import '../pr.css'; // スタイルは別途作成

const skillData = [
    { value: '趣味or実務 1年未満', text: '趣味or実務 1年未満' },
    { value: '趣味or実務 1年〜3年', text: '趣味or実務 1年〜3年' },
    { value: '趣味or実務 3年〜5年', text: '趣味or実務 3年〜5年' },
    { value: '趣味or実務 5年以上', text: '趣味or実務 5年以上' },
    { value: '実務 1年未満', text: '実務 1年未満' },
    { value: '実務 1年〜3年', text: '実務 1年〜3年' },
    { value: '実務 3年〜5年', text: '実務 3年〜5年' },
    { value: '実務 5年以上', text: '実務 5年以上' }
];

// 変更: user を受け取り user.id を使用
const DB = ({ user }) => {
    const userId = user?.id ?? null;

    const [isEditMode, setIsEditMode] = useState(false);
    const [registeredSkills, setRegisteredSkills] = useState([]);
    const [editingSkills, setEditingSkills] = useState([]);
    const [mainLanguageSelectValue, setMainLanguageSelectValue] = useState('');

    useEffect(() => {
        // 編集モード切替時に編集配列を同期
        setEditingSkills(JSON.parse(JSON.stringify(registeredSkills)));
    }, [registeredSkills, isEditMode]);

    // userId がある場合、サーバから databasePR を取得して初期表示する
    useEffect(() => {
        if (!userId) return;
        const fetchPrograms = async () => {
            try {
                // 送受信先を /user から /mypage に変更
                const resp = await fetch(`http://localhost:3030/mypage/userdb?user_id=${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!resp.ok) {
                    console.error('DBデータ取得失敗', resp.status);
                    return;
                }
                const data = await resp.json();
                const programs = data?.programs ?? [];

                // 正規化: [{ language, duration }, ...]
                const normalized = programs.map(p => {
                    if (typeof p === 'string') {
                        try {
                            const parsed = JSON.parse(p);
                            if (Array.isArray(parsed)) return parsed[0] || { language: '', duration: '' };
                            if (parsed && typeof parsed === 'object') return { language: parsed.language ?? '', duration: parsed.duration ?? '' };
                        } catch (e) {
                            const parts = p.split(',');
                            return { language: (parts[0] || '').trim(), duration: (parts[1] || '').trim() };
                        }
                    }
                    if (p && typeof p === 'object') return { language: p.language ?? '', duration: p.duration ?? '' };
                    return { language: '', duration: '' };
                });

                setRegisteredSkills(normalized);
                setEditingSkills(JSON.parse(JSON.stringify(normalized)));
            } catch (err) {
                console.error('DBデータ取得エラー', err);
            }
        };
        fetchPrograms();
    }, [userId]);

    const handleEditToggle = () => {
        setIsEditMode(prev => !prev);
        if (!isEditMode) {
            setEditingSkills(JSON.parse(JSON.stringify(registeredSkills)));
        }
    };

    const handleMainLanguageSelectChange = (event) => {
        const lang = event.target.value;
        setMainLanguageSelectValue('');
        if (!lang) return;
        const exists = editingSkills.some(skill => skill.language === lang);
        if (!exists) {
            setEditingSkills(prevSkills => [
                ...prevSkills,
                { language: lang, duration: skillData[0].value }
            ]);
        } else {
            console.log(`${lang} は既に選択されています。`);
        }
    };

    const handleDurationChange = (index, newDuration) => {
        const updatedSkills = [...editingSkills];
        updatedSkills[index].duration = newDuration;
        setEditingSkills(updatedSkills);
    };

    const handleRemoveLanguage = (index) => {
        const updatedSkills = editingSkills.filter((_, i) => i !== index);
        setEditingSkills(updatedSkills);
    };

    // 編集内容をサーバに送信（空なら削除指示）
    const handleRegister = async () => {
        const currentSkills = editingSkills.map(skill => ({ language: skill.language, duration: skill.duration }));
        const payload = { user_id: userId };

        if (currentSkills.length > 0) {
            payload.skill = currentSkills.map(s => s.language).join(',');
            payload.years = currentSkills.map(s => s.duration).join(',');
            payload.programs = currentSkills;
        } else {
            // 空データ送信でサーバ側が該当 user_id のレコードを削除する
            payload.programs = [];
            payload.skill = '';
            payload.years = '';
        }

        if (!userId) {
            console.warn('userIdが無いため送信しません');
            return;
        }

        try {
            // 送受信先を /user から /mypage に変更
            const resp = await fetch('http://localhost:3030/mypage/userdb', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            const result = await resp.json();
            if (!resp.ok) {
                console.error('保存に失敗しました:', result);
            } else {
                console.log('保存成功:', result);
            }
        } catch (err) {
            console.error('通信エラー:', err);
        }

        setRegisteredSkills(currentSkills);
        setIsEditMode(false);
    };

    const handleCancel = () => {
        setIsEditMode(false);
    };

    return (
        <div className="experience-container">
            <div className={`section-header ${isEditMode ? 'edit-mode' : 'display-mode'}`}>
                <div className="section-title">
                    データベース
                    <span className="recommend-badge">入力推奨</span>
                </div>
                {!isEditMode && (
                    <span className="material-icons edit-toggle-icon" onClick={handleEditToggle}>edit</span>
                )}
            </div>

            {!isEditMode ? (
                <div className="display-mode">
                    <ul className="skill-list">
                        {registeredSkills.length === 0 ? (
                            <li>スキルはまだ登録されていません。</li>
                        ) : (
                            registeredSkills.map((skill, index) => (
                                <li key={index} className="skill-item">
                                    {skill.language} {skill.duration}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            ) : (
                <div className="edit-mode">
                    <div className="main-language-select-wrapper">
                        <select
                            className="main-language-select"
                            value={mainLanguageSelectValue}
                            onChange={handleMainLanguageSelectChange}
                        >
                            <option value="">複数選択可</option>
                            <option value="cassandra">cassandra</option>
                            <option value="DB2">DB2</option>
                            <option value="DynamoDB">DynamoDB</option>
                            <option value="Microsoft SQL Server">Microsoft SQL Server</option>
                            <option value="MongoDB">MongoDB</option>
                            <option value="mSQL">mSQL</option>
                            <option value="MySQL">MySQL</option>
                            <option value="Oracle">Oracle</option>
                            <option value="PostgreSQL">PostgreSQL</option>
                            <option value="SQLite">SQLite</option>
                        </select>
                    </div>

                    <div className="edit-mode-headers">
                        <div className="header-language">選択済み項目</div>
                        <div className="header-experience">実務経験</div>
                        <div style={{ width: '40px' }}></div>
                    </div>

                    <div className="dynamic-language-inputs">
                        {editingSkills.map((skill, index) => (
                            <div key={index} className="language-input-row" data-language={skill.language}>
                                <span className="language-name">{skill.language}</span>
                                <select
                                    className="duration-select-button"
                                    value={skill.duration}
                                    onChange={(e) => handleDurationChange(index, e.target.value)}
                                >
                                    {skillData.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.text}
                                        </option>
                                    ))}
                                </select>
                                <button className="remove-language-button" aria-label="削除" onClick={() => handleRemoveLanguage(index)}>
                                    <span className="material-icons">remove_circle_outline</span>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="action-buttons">
                        <button className="cancel-button" onClick={handleCancel}>キャンセル</button>
                        <button className="register-button" onClick={handleRegister}>登録</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DB;