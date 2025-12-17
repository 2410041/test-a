import React, { useState, useEffect } from 'react';
import '../pr.css' // スタイルは別途作成

const Content = ({ user }) => {
    const userId = user?.id ?? null;

    const [isEditMode, setIsEditMode] = useState(false);
    const [achievements, setAchievements] = useState([]);
    const [editAchievements, setEditAchievements] = useState([]);

    useEffect(() => {
        // 初期表示時や achievements が変更されたときに編集用実績を同期
        setEditAchievements(JSON.parse(JSON.stringify(achievements)));
    }, [achievements, isEditMode]);

    // サーバから Research_Contentrch を取得して初期表示する
    useEffect(() => {
        if (!userId) return;
        const fetchResearch = async () => {
            try {
                // 送受信先を /user から /mypage に変更
                const resp = await fetch(`http://localhost:3030/mypage/Research_Contentrch?user_id=${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!resp.ok) return;
                const data = await resp.json();
                const programs = data?.programs ?? [];

                // programs を [{ theme, details }, ...] の形に正規化
                const normalized = programs.map(p => {
                    if (typeof p === 'string') {
                        try {
                            const parsed = JSON.parse(p);
                            if (Array.isArray(parsed)) return parsed[0] || { theme: '', details: '' };
                            if (parsed && typeof parsed === 'object') return { theme: parsed.research ?? '', details: parsed.content ?? '' };
                        } catch (e) {
                            const parts = p.split(',');
                            return { theme: (parts[0] || '').trim(), details: (parts[1] || '').trim() };
                        }
                    }
                    if (p && typeof p === 'object') return { theme: p.research ?? p.theme ?? '', details: p.content ?? p.details ?? '' };
                    return { theme: '', details: '' };
                });

                setAchievements(normalized);
                setEditAchievements(JSON.parse(JSON.stringify(normalized)));
            } catch (err) {
                console.error('Research_Contentrch fetch error', err);
            }
        };
        fetchResearch();
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

    // サーバに保存（空なら削除指示）
    const handleRegister = async () => {
        // 空のフィールドを持つ実績を除外して登録
        const current = editAchievements
            .map(ach => ({ research: (ach.theme || '').trim(), content: (ach.details || '').trim() }))
            .filter(a => a.research !== '' || a.content !== '');

        const payload = { user_id: userId };

        if (current.length > 0) {
            // 保存方法: Research カラム = カンマ区切り研究テーマ、Content カラム = カンマ区切り詳細
            payload.research = current.map(a => a.research).join(',');
            payload.content = current.map(a => a.content).join(',');
            payload.programs = current.map(a => ({ research: a.research, content: a.content }));
        } else {
            // 空データ送信でサーバ側が該当 user_id のレコードを削除する
            payload.programs = [];
            payload.research = '';
            payload.content = '';
        }

        if (!userId) {
            console.warn('userIdが無いため送信しません');
            setAchievements(current.map(a => ({ theme: a.research, details: a.content })));
            setIsEditMode(false);
            return;
        }

        try {
            // 送受信先を /user から /mypage に変更
            const resp = await fetch('http://localhost:3030/mypage/Research_Contentrch', {
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

        setAchievements(current.map(a => ({ theme: a.research, details: a.content })));
        setIsEditMode(false);
    };

    const handleCancel = () => {
        setIsEditMode(false);
    };

    return (
        <div className="experience-container"> {/* 同じコンテナスタイルを再利用 */}
            <div className={`section-header ${isEditMode ? 'edit-mode' : 'display-mode'}`}>
                <div className="section-title">
                    研究内容
                    <span className="recommend-badge">入力推奨</span>
                </div>
                {!isEditMode && (
                    <span className="material-icons edit-toggle-icon" onClick={handleEditToggle}>edit</span>
                )}
            </div>

            {!isEditMode ? (
                <div className="display-mode">
                    <ul className="achievement-list">
                        {achievements.length === 0 ? (
                            <li>まだ研究内容は登録されていません。</li>
                        ) : (
                            achievements.map((achievement, index) => (
                                <li key={index} className="achievement-item">
                                    <div className="achievement-theme"><strong>研究テーマ:</strong> {achievement.theme || '未入力'}</div>
                                    <div className="achievement-details-wrapper"><strong>研究詳細:</strong></div>
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
                                    <label htmlFor={`theme-${index}`}>テーマ:</label>
                                    <input
                                        type="text"
                                        id={`theme-${index}`}
                                        className="achievement-theme-input"
                                        placeholder="研究テーマを入力してください"
                                        value={achievement.theme}
                                        onChange={(e) => handleAchievementChange(index, 'theme', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`details-${index}`}>詳細:</label>
                                    <textarea
                                        id={`details-${index}`}
                                        className="achievement-details-input"
                                        placeholder="研究内容などを入力してください"
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
                        研究内容を追加
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

export default Content;