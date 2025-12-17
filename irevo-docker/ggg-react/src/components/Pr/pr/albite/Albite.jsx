import React, { useState, useEffect } from 'react';
import '../pr.css' // スタイルは別途作成

// 変更: user を受け取るようにし、user.id を優先して使う（無ければ window.__USER_ID__ をフォールバック）
const Albite = ({ user }) => {
    const userId = user?.id ?? (window?.__USER_ID__ ?? null);

    const [isEditMode, setIsEditMode] = useState(false);
    const [achievements, setAchievements] = useState([]);
    const [editAchievements, setEditAchievements] = useState([]);

    useEffect(() => {
        // 初期表示時や achievements が変更されたときに編集用実績を同期
        setEditAchievements(JSON.parse(JSON.stringify(achievements)));
    }, [achievements, isEditMode]);

    // --- 追加: server から part_time を取得して初期表示 ---
    useEffect(() => {
        if (!userId) return;
        const fetchPartTime = async () => {
            try {
                // 送受信先を /user から /mypage に変更
                const resp = await fetch(`http://localhost:3030/mypage/part-time?user_id=${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!resp.ok) return;
                const data = await resp.json();
                const partText = data?.part_time ?? '';
                if (!partText) {
                    setAchievements([]);
                    setEditAchievements([]);
                    return;
                }
                const items = String(partText).split(/\r?\n/).map(s => ({ theme: '', details: s.trim() })).filter(i => i.details !== '');
                setAchievements(items);
                setEditAchievements(JSON.parse(JSON.stringify(items)));
            } catch (err) {
                console.error('part-time fetch error', err);
            }
        };
        fetchPartTime();
    }, [userId]);

    const handleEditToggle = () => {
        setIsEditMode(prev => !prev);
        if (!isEditMode) {
            // 編集モードに入る時、現在の登録実績を編集用にコピー
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

    // --- 変更: サーバに保存（part_time カラムへ一つの文字列として保存） ---
    const handleRegister = async () => {
        const current = editAchievements.map(a => (a.details || '').trim()).filter(Boolean);
        const partText = current.join('\n');

        if (!userId) {
            console.warn('userId が無いため送信しません');
            setAchievements(current.map(s => ({ theme: '', details: s })));
            setIsEditMode(false);
            return;
        }

        const payload = { user_id: userId, part_time: partText };

        try {
            // 送受信先を /user から /mypage に変更
            const resp = await fetch('http://localhost:3030/mypage/part-time', {
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
                    アルバイト経験
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

export default Albite;