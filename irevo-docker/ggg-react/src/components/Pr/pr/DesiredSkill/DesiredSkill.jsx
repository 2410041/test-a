import React, { useState, useEffect } from 'react';
import '../pr.css'; // スタイルは別途作成

const DesiredSkill = ({ user }) => {
    const userId = user?.id ?? (window?.__USER_ID__ ?? null);

    const [isEditMode, setIsEditMode] = useState(false);
    const [registeredSkills, setRegisteredSkills] = useState([]);
    const [editingSkills, setEditingSkills] = useState([]);
    const [mainLanguageSelectValue, setMainLanguageSelectValue] = useState('');

    useEffect(() => {
        // 初期表示時や registeredSkills が変更されたときに編集用スキルを同期
        setEditingSkills(JSON.parse(JSON.stringify(registeredSkills)));
    }, [registeredSkills, isEditMode]);

    // サーバーから DesiredSkill を取得して初期表示
    useEffect(() => {
        if (!userId) return;
        const fetchDesired = async () => {
            try {
                // 送受信先を /user から /mypage に変更
                const resp = await fetch(`http://localhost:3030/mypage/desiredskill?user_id=${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!resp.ok) return;
                const data = await resp.json();
                const txt = data?.DesiredSkill ?? '';
                if (!txt) {
                    setRegisteredSkills([]);
                    setEditingSkills([]);
                    return;
                }
                const parts = String(txt)
                    .split(/\s*,\s*/)
                    .map(s => s.trim())
                    .filter(Boolean)
                    .map(p => ({ language: p }));
                setRegisteredSkills(parts);
                setEditingSkills(JSON.parse(JSON.stringify(parts)));
            } catch (err) {
                console.error('desiredskill fetch error', err);
            }
        };
        fetchDesired();
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
            setEditingSkills(prev => [...prev, { language: lang }]);
        }
    };

    const handleRemoveLanguage = (index) => {
        const updated = editingSkills.filter((_, i) => i !== index);
        setEditingSkills(updated);
    };

    // サーバへ保存（カンマ区切り）。必ず user_id を送信
    const handleRegister = async () => {
        const currentSkills = editingSkills
            .map(s => (s.language || '').toString().trim())
            .filter(Boolean)
            .map(s => ({ language: s }));

        setRegisteredSkills(currentSkills);
        setIsEditMode(false);

        const text = currentSkills.map(s => s.language.trim()).filter(Boolean).join(',');

        if (!userId) {
            console.warn('userId が無いため送信しません');
            return;
        }

        const payload = { user_id: userId, DesiredSkill: text };

        try {
            // 送受信先を /user から /mypage に変更
            const resp = await fetch('http://localhost:3030/mypage/desiredskill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            const result = await resp.json();
            if (!resp.ok) {
                console.error('保存に失敗しました:', result);
            }
        } catch (err) {
            console.error('通信エラー:', err);
        }
    };

    const handleCancel = () => {
        setIsEditMode(false);
    };

    return (
        <div className="experience-container">
            <div className={`section-header ${isEditMode ? 'edit-mode' : 'display-mode'}`}>
                <div className="section-title">
                    希望開発言語
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
                            <li>未入力</li>
                        ) : (
                            registeredSkills.map((skill, index) => (
                                <li key={index} className="skill-item">
                                    {skill.language}
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
                        </select>
                    </div>

                    <div className="edit-mode-headers">
                        <div className="header-language">選択済み項目</div>
                        <div style={{ width: '40px' }}></div>
                    </div>

                    <div className="dynamic-language-inputs">
                        {editingSkills.map((skill, index) => (
                            <div key={index} className="language-input-row" data-language={skill.language}>
                                <span className="language-name">{skill.language}</span>
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

export default DesiredSkill;