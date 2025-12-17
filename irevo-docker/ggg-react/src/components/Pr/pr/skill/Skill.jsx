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

// 変更点: props から user を受け取り、id のみ取得する
const Skill = ({ user }) => {
    const userId = user?.id ?? null; // TabNav から渡された user の id（存在しなければ null ）

    const [isEditMode, setIsEditMode] = useState(false);
    const [registeredSkills, setRegisteredSkills] = useState([]);
    const [editingSkills, setEditingSkills] = useState([]);
    const [mainLanguageSelectValue, setMainLanguageSelectValue] = useState('');

    useEffect(() => {
        // 初期表示時や registeredSkills が変更されたときに編集用スキルを同期
        setEditingSkills(JSON.parse(JSON.stringify(registeredSkills)));
    }, [registeredSkills, isEditMode]); // isEditModeが切り替わったときも同期

    // userId がある場合、サーバから program を取得して初期表示する
    useEffect(() => {
        if (!userId) return;
        const fetchPrograms = async () => {
            try {
                // 送信先を /user から /mypage に変更
                const resp = await fetch(`http://localhost:3030/mypage/userprogram?user_id=${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!resp.ok) {
                    console.error('program取得失敗', resp.status);
                    return;
                }
                const data = await resp.json();
                const programs = data && data.programs ? data.programs : [];

                // programs を [{ language, duration }, ...] の形に正規化
                const normalized = programs.map(p => {
                    if (typeof p === 'string') {
                        // JSON文字列ならパースを試みる
                        try {
                            const parsed = JSON.parse(p);
                            if (Array.isArray(parsed)) return parsed[0] || { language: '', duration: '' };
                            if (parsed && typeof parsed === 'object') return { language: parsed.language ?? '', duration: parsed.duration ?? '' };
                        } catch (e) {
                            // カンマ区切り (language,duration) の簡易処理
                            const parts = p.split(',');
                            return { language: (parts[0] || '').trim(), duration: (parts[1] || '').trim() };
                        }
                    }
                    if (p && typeof p === 'object') return { language: p.language ?? '', duration: p.duration ?? '' };
                    return { language: '', duration: '' };
                });

                // 表示用の登録スキルと、編集時に使う配列の両方を設定
                setRegisteredSkills(normalized);
                setEditingSkills(JSON.parse(JSON.stringify(normalized)));
            } catch (err) {
                console.error('program取得エラー', err);
            }
        };
        fetchPrograms();
    }, [userId]);

    const handleEditToggle = () => {
        setIsEditMode(prev => !prev);
        if (!isEditMode) {
            // 編集モードに入る時、現在の登録スキルを編集用にコピー
            setEditingSkills(JSON.parse(JSON.stringify(registeredSkills)));
        }
    };

    const handleMainLanguageSelectChange = (event) => {
        const lang = event.target.value;
        setMainLanguageSelectValue(''); // 選択後、セレクトボックスをリセット

        if (!lang) return;

        // 既に選択されているかチェック
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

    const handleRegister = async () => {
        // 編集中のデータを currentSkills に整形
        const currentSkills = editingSkills.map(skill => ({ language: skill.language, duration: skill.duration }));

        // フロントは必ず POST 送信する（空配列の場合は削除をサーバに指示）
        const payload = { user_id: userId };

        if (currentSkills.length > 0) {
            // 既存の送信フォーマットを維持（互換性のため skill/years を送る）
            payload.skill = currentSkills.map(s => s.language).join(',');
            payload.years = currentSkills.map(s => s.duration).join(',');
            // 併せて programs 配列も付ける（サーバは両方に対応済み）
            payload.programs = currentSkills;
        } else {
            // 空データ送信でサーバ側が該当 user_id のレコードを削除するようにする
            payload.programs = [];   // サーバ側の空判定に一致させる
            payload.skill = '';
            payload.years = '';
        }

        console.log('registering skills for userId:', userId, payload);

        if (!userId) {
            console.warn('userIdが無いため送信しません');
            return;
        }

        try {
            // 送信先を /user から /mypage に変更
            const resp = await fetch('http://localhost:3030/mypage/userprogram', {
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

        // UI側は currentSkills に合わせて更新（空なら表示は空になる）
        setRegisteredSkills(currentSkills);
        setIsEditMode(false);
    };

    const handleCancel = () => {
        setIsEditMode(false);
    };

    return (
        <div className="experience-container" data-user-id={userId}>
            <div className={`section-header ${isEditMode ? 'edit-mode' : 'display-mode'}`}>
                <div className="section-title">
                    プログラミング言語経験
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
                            <option value="Java">Java</option>
                            <option value="C">C</option>
                            <option value="C#">C#</option>
                            <option value="PHP">PHP</option>
                            <option value="JavaScript">JavaScript</option>
                            <option value="HTML+CSS">HTML+CSS</option>
                            <option value="SQL">SQL</option>
                            <option value="PL/SQL">PL/SQL</option>
                            <option value="Swift">Swift</option>
                            <option value="Kotlin">Kotlin</option>
                            <option value="Python">Python</option>
                            <option value="Ruby">Ruby</option>
                            <option value="Go">Go</option>
                            <option value="TypeScript">TypeScript</option>
                            <option value="C++">C++</option>
                            <option value="その他">その他</option>
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

export default Skill;