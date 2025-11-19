import React, { useState, useEffect } from 'react';
import '../pr.css'; // スタイルは別途作成


const JobType = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [registeredSkills, setRegisteredSkills] = useState([]);
    const [editingSkills, setEditingSkills] = useState([]);
    const [mainLanguageSelectValue, setMainLanguageSelectValue] = useState('');

    useEffect(() => {
        // 初期表示時や registeredSkills が変更されたときに編集用スキルを同期
        setEditingSkills(JSON.parse(JSON.stringify(registeredSkills)));
    }, [registeredSkills, isEditMode]); // isEditModeが切り替わったときも同期

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

    const handleDurationChange = (index, newDuration) => {
        const updatedSkills = [...editingSkills];
        updatedSkills[index].duration = newDuration;
        setEditingSkills(updatedSkills);
    };

    const handleRemoveLanguage = (index) => {
        const updatedSkills = editingSkills.filter((_, i) => i !== index);
        setEditingSkills(updatedSkills);
    };

    const handleRegister = () => {
        const currentSkills = [];
        editingSkills.forEach(skill => {
            currentSkills.push({ language: skill.language, duration: skill.duration });
        });
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
                    希望職種
                    <span className="recommend-badge">入力推奨</span>
                </div>
                {!isEditMode && (
                    <span className="material-icons edit-toggle-icon" onClick={handleEditToggle}>edit</span>
                )}
            </div>

            {!isEditMode ? (
                <div className="display-mode">
                    <ul className="skill-list">
                        {/* {console.log(registeredSkills)}                         */}
                        {registeredSkills.length === 0 ? (
                            <li>未入力</li>
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
                            <option disabled>エンジニア系</option>
                            <option value="SE(システムエンジニア)">SE(システムエンジニア)</option>
                            <option value="PG(プログラマ)">PG(プログラマ)</option>
                            <option value="組込・制御エンジニア">組込・制御エンジニア</option>
                            <option value="Webエンジニア(バック・サーバ)">Webエンジニア(バック・サーバ)</option>
                            <option value="Webエンジニア(フロント)">Webエンジニア(フロント)</option>
                            <option value="AI・データエンジニア">AI・データエンジニア</option>
                            <option value="QAエンジニア">QAエンジニア</option>
                            <option value="データサイエンティスト">データサイエンティスト</option>
                            <option value="アプリエンジニア">アプリエンジニア</option>
                            <option value="ゲームエンジニア">ゲームエンジニア</option>
                            <option value="ITコンサルタント">ITコンサルタント</option>
                            <option value="PL・PM">PL・PM</option>
                            <option value="インフラエンジニア">インフラエンジニア</option>
                            <option value="セキュリティエンジニア">セキュリティエンジニア</option>
                            <option value="社内SE・情シス">社内SE・情シス</option>
                            <option value="セールスエンジニア・プリセールス">セールスエンジニア・プリセールス</option>
                            <option disabled>非エンジニア</option>
                            <option value="Webプロデューサー・ディレクター">Webプロデューサー・ディレクター</option>
                            <option value="Webデザイナー・UI/UXデザイナー">Webデザイナー・UI/UXデザイナー</option>
                            <option value="Webマーケティング">Webマーケティング</option>
                            <option value="研究開発職">研究開発職</option>
                            <option value="その他技術職">その他技術職</option>
                            <option value="コンサルタント・アナリスト">コンサルタント・アナリスト</option>
                            <option value="金融専門家">金融専門家</option>
                            <option value="マーケティング・商品企画">マーケティング・商品企画</option>
                            <option value="企画・管理(総務・法務・財務・広報など)">企画・管理(総務・法務・財務・広報など)</option>
                            <option value="営業">営業</option>
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
                                {/* <select
                                    className="duration-select-button"
                                    value={skill.duration}
                                    onChange={(e) => handleDurationChange(index, e.target.value)}
                                >
                                    {skillData.map(opt => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.text}
                                        </option>
                                    ))}
                                </select> */}
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

export default JobType;