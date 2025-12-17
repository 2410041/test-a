import React, { useState, useEffect } from 'react';
import '../pr.css'; // スタイルは別途作成

const Industry = ({ user }) => {
    const userId = user?.id ?? (window?.__USER_ID__ ?? null);

    const [isEditMode, setIsEditMode] = useState(false);
    const [registeredSkills, setRegisteredSkills] = useState([]);
    const [editingSkills, setEditingSkills] = useState([]);
    const [mainLanguageSelectValue, setMainLanguageSelectValue] = useState('');

    useEffect(() => {
        // 初期表示時や registeredSkills が変更されたときに編集用スキルを同期
        setEditingSkills(JSON.parse(JSON.stringify(registeredSkills)));
    }, [registeredSkills, isEditMode]); // isEditModeが切り替わったときも同期

    // サーバーから Industry を取得して初期表示
    useEffect(() => {
        if (!userId) return;
        const fetchIndustry = async () => {
            try {
                // 送受信先を /user から /mypage に変更
                const resp = await fetch(`http://localhost:3030/mypage/industry?user_id=${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!resp.ok) return;
                const data = await resp.json();
                const txt = data?.Industry ?? '';
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
                console.error('industry fetch error', err);
            }
        };
        fetchIndustry();
    }, [userId]);

    const handleEditToggle = () => {
        setIsEditMode(prev => !prev);
        if (!isEditMode) {
            // 編集モードに入る時、現在の登録を編集用にコピー
            setEditingSkills(JSON.parse(JSON.stringify(registeredSkills)));
        }
    };

    const handleMainLanguageSelectChange = (event) => {
        const lang = event.target.value;
        setMainLanguageSelectValue(''); // 選択後リセット

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

    // サーバへ保存（カンマ区切り）
    const handleRegister = async () => {
        const currentSkills = editingSkills
            .map(s => (s.language || '').toString().trim())
            .filter(Boolean)
            .map(s => ({ language: s }));

        setRegisteredSkills(currentSkills);
        setIsEditMode(false);

        const industryText = currentSkills.map(s => s.language.trim()).filter(Boolean).join(',');

        if (!userId) {
            console.warn('userId が無いため送信しません');
            return;
        }

        const payload = { user_id: userId, Industry: industryText };

        try {
            // 送受信先を /user から /mypage に変更
            const resp = await fetch('http://localhost:3030/mypage/industry', {
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
                    希望業界
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
                            <option disabled>IT・Web・通信</option>
                            <option value="Webサービス(toC)">Webサービス(toC)</option>
                            <option value="Webサービス(toB)">Webサービス(toB)</option>
                            <option value="SaaS・パッケージ">SaaS・パッケージ</option>
                            <option value="SIer・ITコンサルティング">SIer・ITコンサルティング</option>
                            <option value="Web作成">Web作成</option>
                            <option value="広告">広告</option>
                            <option value="SES・技術者派遣">SES・技術者派遣</option>
                            <option value="通信">通信</option>
                            <option value="その他(IT・Web・通信)">その他(IT・Web・通信)</option>

                            <option disabled>金融・保険</option>
                            <option value="銀行・証券">銀行・証券</option>
                            <option value="生保・損保">生保・損保</option>
                            <option value="その他(金融・保険)">その他(金融・保険)</option>

                            <option disabled>メーカー・製造</option>
                            <option value="自動車・輸送機器">自動車・輸送機器</option>
                            <option value="機器・電気">機器・電気</option>
                            <option value="素材・化学・食品">素材・化学・食品</option>
                            <option value="医療・薬品">医療・薬品</option>
                            <option value="その他(メーカー・製造)">その他(メーカー・製造)</option>

                            <option disabled>エネルギー・インフラ</option>
                            <option value="電気・ガス・水道・エネルギー">電気・ガス・水道・エネルギー</option>
                            <option value="陸運・海運・物流">陸運・海運・物流</option>
                            <option value="鉄道・航空">鉄道・航空</option>
                            <option value="不動産">不動産</option>
                            <option value="建設">建設</option>

                            <option disabled>商社</option>
                            <option value="商社">商社</option>

                            <option disabled>コンサルティング・リサーチ</option>
                            <option value="コンサルティング">コンサルティング</option>
                            <option value="シンクタンク・調査">シンクタンク・調査</option>

                            <option disabled>マスコミ・メディア</option>
                            <option value="マスコミ(放送・新聞)">マスコミ(放送・新聞)</option>
                            <option value="マスコミ(出版・広告)">マスコミ(出版・広告)</option>
                            <option value="芸能・映画・音楽">芸能・映画・音楽</option>
                            <option value="ゲーム">ゲーム</option>

                            <option disabled>流通・小売</option>
                            <option value="百貨店・スーパー・コンビニ">百貨店・スーパー・コンビニ</option>
                            <option value="専門店">専門店</option>

                            <option disabled>サービス</option>
                            <option value="飲食・旅行・アミューズメント・レジャー">飲食・旅行・アミューズメント・レジャー</option>
                            <option value="フィットネスクラブ・エステ・理美容">フィットネスクラブ・エステ・理美容</option>
                            <option value="人材サービス(派遣・紹介)">人材サービス(派遣・紹介)</option>
                            <option value="医療・看護">医療・看護</option>
                            <option value="教育・福祉サービス">教育・福祉サービス</option>
                            <option value="冠婚葬祭">冠婚葬祭</option>
                            <option value="その他(サービス)">その他(サービス)</option>

                            <option disabled>士業・公共・その他</option>
                            <option value="士業">士業</option>
                            <option value="官公庁・公社・団体">官公庁・公社・団体</option>
                            <option value="フリーランス">フリーランス</option>
                            <option value="その他">その他</option>
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

export default Industry;