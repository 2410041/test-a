import React, { useState, useEffect } from 'react';
import '../pr.css'; // スタイルは別途作成

// const skillData = [
//     { value: '趣味or実務 1年未満', text: '趣味or実務 1年未満' },
//     { value: '趣味or実務 1年〜3年', text: '趣味or実務 1年〜3年' },
//     { value: '趣味or実務 3年〜5年', text: '趣味or実務 3年〜5年' },
//     { value: '趣味or実務 5年以上', text: '趣味or実務 5年以上' },
//     { value: '実務 1年未満', text: '実務 1年未満' },
//     { value: '実務 1年〜3年', text: '実務 1年〜3年' },
//     { value: '実務 3年〜5年', text: '実務 3年〜5年' },
//     { value: '実務 5年以上', text: '実務 5年以上' }
// ];

const Choose = () => {
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

        // 3つ以上選択されていたら追加しない
        if (editingSkills.length >= 3) {
            alert("選択できる言語は最大3つまでです。");
            return;
        }

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
                企業選びで重視すること(3つまで)
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
                            <option value="企業名や製品・サービスの認知度が高い会社">企業名や製品・サービスの認知度が高い会社</option>
                            <option value="グローバルなビジネス展開をしている">グローバルなビジネス展開をしている</option>
                            <option value="若いうちから責任のある仕事を任してもらえる">若いうちから責任のある仕事を任してもらえる</option>
                            <option value="経営者が魅力的で尊敬できる">経営者が魅力的で尊敬できる</option>
                            <option value="経営が安定している">経営が安定している</option>
                            <option value="福利厚生が良い">福利厚生が良い</option>
                            <option value="残業時間が少ない">残業時間が少ない</option>
                            <option value="研修・教育制度が充実している">研修・教育制度が充実している</option>
                            <option value="独自の技術を持っている">独自の技術を持っている</option>
                            <option value="社員のエンジニア率が高い">社員のエンジニア率が高い</option>
                            <option value="優秀なエンジニアがいる">優秀なエンジニアがいる</option>
                            <option value="エンジニアとして特定分野を極められる">エンジニアとして特定分野を極められる</option>
                            <option value="エンジニアとして幅広い知識が身につけられる">エンジニアとして幅広い知識が身につけられる</option>
                            <option value="技術力だけでなくビジネス視点も身につけれる">技術力だけでなくビジネス視点も身につけれる</option>
                            <option value="社内勉強会が盛んに行われている">社内勉強会が盛んに行われている</option>
                            <option value="勤務地が決まっており転勤がない">勤務地が決まっており転勤がない</option>
                            <option value="出産・育児休暇など女性店員の支援に積極的である">出産・育児休暇など女性店員の支援に積極的である</option>
                            <option value="女性が活躍している会社">女性が活躍している会社</option>
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

export default Choose;