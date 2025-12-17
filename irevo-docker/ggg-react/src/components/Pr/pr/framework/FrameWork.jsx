import React, { useState, useEffect } from 'react';
import '../pr.css';

const Data = [
    { value: '趣味or実務 1年未満', text: '趣味or実務 1年未満' },
    { value: '趣味or実務 1年〜3年', text: '趣味or実務 1年〜3年' },
    { value: '趣味or実務 3年〜5年', text: '趣味or実務 3年〜5年' },
    { value: '趣味or実務 5年以上', text: '趣味or実務 5年以上' },
    { value: '実務 1年未満', text: '実務 1年未満' },
    { value: '実務 1年〜3年', text: '実務 1年〜3年' },
    { value: '実務 3年〜5年', text: '実務 3年〜5年' },
    { value: '実務 5年以上', text: '実務 5年以上' }
];

// 変更: user を受け取り user.id を使用
const FrameWork = ({ user }) => {
    const userId = user?.id ?? null;

    const [isEditMode, setIsEditMode] = useState(false); // 編集モードかどうか
    const [registeredSkills, setRegisteredSkills] = useState([]); // 登録済みのスキル一覧
    const [editingSkills, setEditingSkills] = useState([]); // 編集中のスキル一覧（登録前）
    const [mainLanguageSelectValue, setMainLanguageSelectValue] = useState(''); // セレクトボックスの一時選択の値

    useEffect(() => {
        // 編集モードへの切替・登録データ変更時に同期
        setEditingSkills(JSON.parse(JSON.stringify(registeredSkills)));
    }, [registeredSkills, isEditMode]);

    // userId がある場合、サーバから framework データを取得して初期表示する
    useEffect(() => {
        if (!userId) return;
        const fetchFrameworks = async () => {
            try {
                // 送受信先を /user から /mypage に変更
                const resp = await fetch(`http://localhost:3030/mypage/userframework?user_id=${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!resp.ok) {
                    console.error('framework取得失敗', resp.status);
                    return;
                }
                const data = await resp.json();
                const programs = data && data.programs ? data.programs : [];

                // programs を [{ language, duration }, ...] の形に正規化
                const normalized = programs.map(p => {
                    if (typeof p === 'string') {
                        try {
                            const parsed = JSON.parse(p);
                            if (Array.isArray(parsed)) return parsed[0] || { language: '', duration: '' };
                            if (parsed && typeof parsed === 'object') return { language: parsed.language ?? '', duration: parsed.duration ?? '' };
                        } catch (e) {
                            const parts = p.split(',');
                            return { language: (parts[0] || '').trim(), duration: (parts[1] || '').trim() };
                        }
                    }
                    if (p && typeof p === 'object') return { language: p.language ?? '', duration: p.duration ?? '' };
                    return { language: '', duration: '' };
                });

                setRegisteredSkills(normalized);
                setEditingSkills(JSON.parse(JSON.stringify(normalized)));
            } catch (err) {
                console.error('framework取得エラー', err);
            }
        };
        fetchFrameworks();
    }, [userId]);

    // 編集と表示の切り替え
    const handleEditToggle = () => {
        setIsEditMode(prev => !prev);
        if (!isEditMode) {
            setEditingSkills(JSON.parse(JSON.stringify(registeredSkills)));
        }
    };

    // セレクトボックスでフレームワークを選択したときの処理
    const handleMainLanguageSelectChange = (event) => {
        const lang = event.target.value;
        setMainLanguageSelectValue('');
        if (!lang) return;
        const exists = editingSkills.some(skill => skill.language === lang);
        if (!exists) {
            setEditingSkills(prevSkills => [
                ...prevSkills,
                { language: lang, duration: Data[0].value }
            ]);
        } else {
            console.log(`${lang} は既に選択されています。`);
        }
    };

    // 経験年数の変更処理（該当のデータだけ更新）
    const handleDurationChange = (index, newDuration) => {
        const updatedSkills = [...editingSkills];
        updatedSkills[index].duration = newDuration;
        setEditingSkills(updatedSkills);
    };

    // 選択済み言語の削除処理
    const handleRemoveLanguage = (index) => {
        const updatedSkills = editingSkills.filter((_, i) => i !== index);
        setEditingSkills(updatedSkills);
    };

    // 編集内容をサーバに送信（空なら削除指示）
    const handleRegister = async () => {
        const currentSkills = editingSkills.map(skill => ({ language: skill.language, duration: skill.duration }));
        const payload = { user_id: userId };

        if (currentSkills.length > 0) {
            payload.skill = currentSkills.map(s => s.language).join(',');
            payload.years = currentSkills.map(s => s.duration).join(',');
            payload.programs = currentSkills;
        } else {
            payload.programs = [];
            payload.skill = '';
            payload.years = '';
        }

        if (!userId) {
            console.warn('userIdが無いため送信しません');
            return;
        }

        try {
            // 送受信先を /user から /mypage に変更
            const resp = await fetch('http://localhost:3030/mypage/userframework', {
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

        setRegisteredSkills(currentSkills);
        setIsEditMode(false);
    };

    // 編集キャンセル
    const handleCancel = () => {
        setIsEditMode(false);
    };

    return (
        <div className="experience-container">
            <div className={`section-header ${isEditMode ? 'edit-mode' : 'display-mode'}`}>
                <div className="section-title">
                    フレームワーク
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
                            <option value=".NET Framework">.NET Framework</option>
                            <option value="actix-web">actix-web</option>
                            <option value="Android SDK">Android SDK</option>
                            <option value="Angular">Angular</option>
                            <option value="Backbone.js">Backbone.js</option>
                            <option value="Bootstrap">Bootstrap</option>
                            <option value="Caffe">Caffe</option>
                            <option value="CakePHP">CakePHP</option>
                            <option value="Camping">Camping</option>
                            <option value="Catalyst">Catalyst</option>
                            <option value="Chainer">Chainer</option>
                            <option value="cocos2d">cocos2d</option>
                            <option value="cocos2d-x">cocos2d-x</option>
                            <option value="Codelgniter">Codelgniter</option>
                            <option value="DirectX">DirectX</option>
                            <option value="Djasngo">Djasngo</option>
                            <option value="Dojo Toolkit">Dojo Toolkit</option>
                            <option value="Echo">Echo</option>
                            <option value="Ember.js">Ember.js</option>
                            <option value="Ethna">Ethna</option>
                            <option value="Express">Express</option>
                            <option value="Flask">Flask</option>
                            <option value="Flutter">Flutter</option>
                            <option value="Foundation">Foundation</option>
                            <option value="FuelPHP">FuelPHP</option>
                            <option value="Gin">Gin</option>
                            <option value="Hibernate">Hibernate</option>
                            <option value="iBATIS">iBATIS</option>
                            <option value="IOS SDK">IOS SDK</option>
                            <option value="java EE">java EE</option>
                            <option value="jQuery">jQuery</option>
                            <option value="JSF">JSF</option>
                            <option value="Knockout.js">Knockout.js</option>
                            <option value="Laravel">Laravel</option>
                            <option value="MyBatis">MyBatis</option>
                            <option value="Next.js">Next.js</option>
                            <option value="ngCore">ngCore</option>
                            <option value="Node.js">Node.js</option>
                            <option value="Nuxt.js">Nuxt.js</option>
                            <option value="OpenGL">OpenGL</option>
                            <option value="Phalcon">Phalcon</option>
                            <option value="Play Framework">Play Framework</option>
                            <option value="prototype.js">prototype.js</option>
                            <option value="Pylons">Pylons</option>
                            <option value="Pyramid">Pyramid</option>
                            <option value="React">React</option>
                            <option value="React Native">React Native</option>
                            <option value="Revel">Revel</option>
                            <option value="Riot.js">Riot.js</option>
                            <option value="Ruby on Rails">Ruby on Rails</option>
                            <option value="Seasar2">Seasar2</option>
                            <option value="Sinatra">Sinatra</option>
                            <option value="Slim">Slim</option>
                            <option value="Smarty">Smarty</option>
                            <option value="Spring">Spring</option>
                            <option value="Struts">Struts</option>
                            <option value="Symfony">Symfony</option>
                            <option value="TensorFlow">TensorFlow</option>
                            <option value="Titanium Mobile">Titanium Mobile</option>
                            <option value="Tornado">Tornado</option>
                            <option value="Unity">Unity</option>
                            <option value="Unreal Engine">Unreal Engine</option>
                            <option value="Vue.js">Vue.js</option>
                            <option value="Waves">Waves</option>
                            <option value="Xamarin">Xamarin</option>
                            <option value="Zend Framework">Zend Framework</option>
                            <option value="自社フレームワーク">自社フレームワーク</option>
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
                                    {Data.map(opt => (
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

export default FrameWork;
