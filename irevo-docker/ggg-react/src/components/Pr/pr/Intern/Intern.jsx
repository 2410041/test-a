import React, { useState, useEffect } from 'react';
import '../pr.css' // スタイルは別途作成

// user を受け取るようにし、user.id を優先（無ければ window.__USER_ID__ をフォールバック）
const Intern = ({ user }) => {
    const userId = user?.id ?? (window?.__USER_ID__ ?? null);

    const [isEditMode, setIsEditMode] = useState(false);
    const [achievements, setAchievements] = useState([]);
    const [editAchievements, setEditAchievements] = useState([]);

    useEffect(() => {
        setEditAchievements(JSON.parse(JSON.stringify(achievements)));
    }, [achievements, isEditMode]);

    // サーバーから Intern を取得して初期表示
    useEffect(() => {
        if (!userId) return;
        const fetchIntern = async () => {
            try {
                // 送受信先を /user から /mypage に変更
                const resp = await fetch(`http://localhost:3030/mypage/intern?user_id=${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!resp.ok) return;
                const data = await resp.json();
                const internText = data?.intern ?? '';
                if (!internText) {
                    setAchievements([]);
                    setEditAchievements([]);
                    return;
                }
                // CHANGED: カンマ区切りで分割して配列化（例: "30日行った,25日行った"）
                const items = String(internText)
                    .split(/\s*,\s*/) // カンマで分割、前後の空白を除去
                    .map(s => ({ theme: '', details: s.trim() }))
                    .filter(i => i.details !== '');
                setAchievements(items);
                setEditAchievements(JSON.parse(JSON.stringify(items)));
            } catch (err) {
                console.error('intern fetch error', err);
            }
        };
        fetchIntern();
    }, [userId]);

    const handleEditToggle = () => {
        setIsEditMode(prev => !prev);
        if (!isEditMode) {
            setEditAchievements(achievements.length === 0 ? [{ theme: '', details: '' }] : JSON.parse(JSON.stringify(achievements)));
        }
    };

    const handleAddAchievement = () => {
        setEditAchievements(prev => [...prev, { theme: '', details: '' }]);
    };

    const handleAchievementChange = (index, field, value) => {
        const updated = [...editAchievements];
        updated[index][field] = value;
        setEditAchievements(updated);
    };

    const handleRemoveAchievement = (index) => {
        const updated = editAchievements.filter((_, i) => i !== index);
        setEditAchievements(updated);
    };

    const handleRegister = async () => {
        const current = editAchievements.map(a => (a.details || '').trim()).filter(Boolean);
        // CHANGED: カンマ区切りで保存する（例: "30日行った,25日行った"）
        const internText = current.join(',');

        if (!userId) {
            console.warn('userId が無いため送信しません');
            setAchievements(current.map(s => ({ theme: '', details: s })));
            setIsEditMode(false);
            return;
        }

        const payload = { user_id: userId, intern: internText };

        try {
            // 送受信先を /user から /mypage に変更
            const resp = await fetch('http://localhost:3030/mypage/intern', {
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

        setAchievements(current.map(s => ({ theme: '', details: s })));
        setIsEditMode(false);
    };

    const handleCancel = () => {
        setIsEditMode(false);
    };

    return (
        <div className="experience-container">
            <div className={`section-header ${isEditMode ? 'edit-mode' : 'display-mode'}`}>
                <div className="section-title">
                    インターン経験
                </div>
                {!isEditMode && (
                    <span className="material-icons edit-toggle-icon" onClick={handleEditToggle}>edit</span>
                )}
            </div>

            {!isEditMode ? (
                <div className="display-mode">
                    <ul className="achievement-list">
                        {achievements.length === 0 ? (
                            <li>情報は登録されていません。</li>
                        ) : (
                            achievements.map((achievement, index) => (
                                <li key={index} className="achievement-item">
                                    <div className="achievement-details">{achievement.details || '未入力'}</div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            ) : (
                <div className="edit-mode">
                    <div className="dynamic-achievement-inputs">
                        {editAchievements.map((achievement, index) => (
                            <div key={index} className="achievement-input-row">
                                <div>
                                    <label htmlFor={`details-${index}`}>詳細:</label>
                                    <textarea
                                        id={`details-${index}`}
                                        className="achievement-details-input"
                                        placeholder="詳細を入力してください"
                                        value={achievement.details}
                                        onChange={(e) => handleAchievementChange(index, 'details', e.target.value)}
                                    ></textarea>
                                </div>
                                <button className="remove-achievement-button" aria-label="削除" onClick={() => handleRemoveAchievement(index)}>
                                    <span className="material-icons">remove_circle_outline</span>
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className="add-achievement-button" onClick={handleAddAchievement}>
                        <span className="material-icons">add_circle_outline</span>
                        情報を追加
                    </button>

                    <div className="action-buttons">
                        <button className="cancel-button" onClick={handleCancel}>キャンセル</button>
                        <button className="register-button" onClick={handleRegister}>登録</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Intern;