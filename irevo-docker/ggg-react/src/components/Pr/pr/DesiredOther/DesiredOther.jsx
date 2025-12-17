import React, { useState, useEffect } from 'react';
import '../pr.css' // スタイルは別途作成
const DesiredOther = ({ user }) => {
    const userId = user?.id ?? (window?.__USER_ID__ ?? null);

    const [isEditMode, setIsEditMode] = useState(false);
    const [achievements, setAchievements] = useState([]);
    // 編集モード時、初期値として1つ分の入力欄を表示
    const [editAchievements, setEditAchievements] = useState([{ theme: '', details: '' }]);

    useEffect(() => {
        // 初期表示時や achievements が変更されたときに編集用実績を同期
        if (isEditMode) {
            setEditAchievements(achievements.length === 0 ? [{ theme: '', details: '' }] : JSON.parse(JSON.stringify(achievements)));
        } else {
            setEditAchievements([{ theme: '', details: '' }]);
        }
    }, [achievements, isEditMode]);

    // サーバーから DesiredOther を取得して初期表示
    useEffect(() => {
        if (!userId) return;
        const fetchDesiredOther = async () => {
            try {
                // 送受信先を /user から /mypage に変更
                const resp = await fetch(`http://localhost:3030/mypage/desiredother?user_id=${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!resp.ok) return;
                const data = await resp.json();
                const txt = data?.DesiredOther ?? '';
                if (!txt) {
                    setAchievements([]);
                    setEditAchievements([{ theme: '', details: '' }]);
                    return;
                }
                // カンマ区切りを分解して配列化
                const items = String(txt)
                    .split(/\s*,\s*/)
                    .map(s => ({ theme: '', details: s.trim() }))
                    .filter(i => i.details !== '');
                setAchievements(items);
                setEditAchievements(JSON.parse(JSON.stringify(items)));
            } catch (err) {
                console.error('desiredother fetch error', err);
            }
        };
        fetchDesiredOther();
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
        setEditAchievements(updated.length === 0 ? [{ theme: '', details: '' }] : updated);
    };

    const handleRegister = async () => {
        // 空のフィールドを持つ実績を除外して登録
        const currentAchievements = editAchievements.filter(ach => ach.theme.trim() || ach.details.trim());
        setAchievements(currentAchievements);
        setIsEditMode(false);

        // カンマ区切りで保存（例: "項目A,項目B"）
        const current = currentAchievements.map(a => (a.details || '').trim()).filter(Boolean);
        const DesiredOtherText = current.join(',');

        if (!userId) {
            console.warn('userId が無いため送信しません');
            return;
        }

        const payload = { user_id: userId, DesiredOther: DesiredOtherText };

        try {
            // 送受信先を /user から /mypage に変更
            const resp = await fetch('http://localhost:3030/mypage/desiredother', {
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
                    その他
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
                                    <div className="achievement-details-wrapper"><strong>詳細:</strong></div>
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

export default DesiredOther;