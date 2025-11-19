import React, { useState, useEffect } from 'react';
import '../pr.css'; // スタイルは別途作成

const Study = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [achievements, setAchievements] = useState([]);
    const [editAchievements, setEditAchievements] = useState([]);

    useEffect(() => {
        // 初期表示時や achievements が変更されたときに編集用実績を同期
        setEditAchievements(JSON.parse(JSON.stringify(achievements)));
    }, [achievements, isEditMode]);

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

    const handleRegister = () => {
        // 空のフィールドを持つ実績を除外して登録
        const currentAchievements = editAchievements.filter(ach => ach.theme.trim() || ach.details.trim());
        setAchievements(currentAchievements);
        setIsEditMode(false);
    };

    const handleCancel = () => {
        setIsEditMode(false);
    };

    return (
        <div className="experience-container"> {/* 同じコンテナスタイルを再利用 */}
            <div className={`section-header ${isEditMode ? 'edit-mode' : 'display-mode'}`}>
                <div className="section-title">
                    研究実績
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
                            <li>まだ研究実績は登録されていません。</li>
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
                                        placeholder="研究内容、成果などを入力してください"
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
                        実績を追加
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

export default Study;