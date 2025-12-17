import React, { useState, useEffect } from 'react';
import '../pr.css'; // スタイルは別途作成


const Type = ({ user }) => {
    const userId = user?.id ?? (window?.__USER_ID__ ?? null);

    const [isEditMode, setIsEditMode] = useState(false);
    const [registeredSkills, setRegisteredSkills] = useState([]);
    const [editingSkills, setEditingSkills] = useState([]);
    const [mainLanguageSelectValue, setMainLanguageSelectValue] = useState('');

    useEffect(() => {
        // 初期表示時や registeredSkills が変更されたときに編集用スキルを同期
        setEditingSkills(JSON.parse(JSON.stringify(registeredSkills)));
    }, [registeredSkills, isEditMode]); // isEditModeが切り替わったときも同期

    // サーバーから Type（Desired_Company_Type）を取得して初期表示
    useEffect(() => {
        if (!userId) return;
        const fetchType = async () => {
            try {
                // 送受信先を /user から /mypage に変更
                const resp = await fetch(`http://localhost:3030/mypage/type?user_id=${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!resp.ok) return;
                const data = await resp.json();
                const txt = data?.Desired_Company_Type ?? '';
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
                console.error('type fetch error', err);
            }
        };
        fetchType();
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
                { language: lang}
            ]);
        } else {
            console.log(`${lang} は既に選択されています。`);
        }
    };

    const handleRemoveLanguage = (index) => {
        const updatedSkills = editingSkills.filter((_, i) => i !== index);
        setEditingSkills(updatedSkills);
    };

    // サーバへ保存（カンマ区切り）
    const handleRegister = async () => {
        // userId 必須
        if (!userId) {
            console.warn('userId が無いため送信しません');
            const local = editingSkills.map(s => ({ language: s.language }));
            setRegisteredSkills(local);
            setIsEditMode(false);
            return;
        }

        const currentSkills = editingSkills
            .map(s => (s.language || '').toString().trim())
            .filter(Boolean)
            .map(s => ({ language: s }));

        setRegisteredSkills(currentSkills);
        setIsEditMode(false);

        const typeText = currentSkills.map(s => s.language.trim()).filter(Boolean).join(',');

        const payload = { user_id: userId, Desired_Company_Type: typeText };

        try {
            // 送受信先を /user から /mypage に変更
            const resp = await fetch('http://localhost:3030/mypage/type', {
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
    };

    const handleCancel = () => {
        setIsEditMode(false);
    };

    return (
        <div className="experience-container">
            <div className={`section-header ${isEditMode ? 'edit-mode' : 'display-mode'}`}>
                <div className="section-title">
                    希望企業のタイプ
                    {/* <span className="recommend-badge">入力推奨</span> */}
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
                            <option value="大企業">大企業</option>
                            <option value="中小企業">中小企業</option>
                            <option value="メガベンチャー(500名以上~)">メガベンチャー(500名以上~)</option>
                            <option value="ベンチャー・スタートアップ">ベンチャー・スタートアップ</option>
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

export default Type;