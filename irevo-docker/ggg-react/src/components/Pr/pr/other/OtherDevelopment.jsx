import React, { useState, useEffect } from 'react';
import '../pr.css'; // スタイルは別途作成

const skillData = [
    { value: '趣味or実務 1年未満', text: '趣味or実務 1年未満' },
    { value: '趣味or実務 1年〜3年', text: '趣味or実務 1年〜3年' },
    { value: '趣味or実務 3年〜5年', text: '趣味or実務 3年〜5年' },
    { value: '趣味or実務 5年以上', text: '趣味or実務 5年以上' },
    { value: '実務 1年未満', text: '実務 1年未満' },
    { value: '実務 1年〜3年', text: '実務 1年〜3年' },
    { value: '実務 3年〜5年', text: '実務 3年〜5年' },
    { value: '実務 5年以上', text: '実務 5年以上' }
];

// 変更: user を受け取り user.id を優先して使用（無ければ window.__USER_ID__ をフォールバック）
const Other = ({ user }) => {
    const userId = user?.id ?? (window?.__USER_ID__ ?? null);

    const [isEditMode, setIsEditMode] = useState(false);
    const [registeredSkills, setRegisteredSkills] = useState([]);
    const [editingSkills, setEditingSkills] = useState([]);
    const [mainLanguageSelectValue, setMainLanguageSelectValue] = useState('');

    useEffect(() => {
        // 初期表示時や registeredSkills が変更されたときに編集用スキルを同期
        setEditingSkills(JSON.parse(JSON.stringify(registeredSkills)));
    }, [registeredSkills, isEditMode]);

    // userId がある場合、サーバから Other_ExperiencePR（ルートは other_experience_skill のまま）を取得して初期表示する
    useEffect(() => {
        if (!userId) return;
        const fetchPrograms = async () => {
            try {
                // 送受信先を /user から /mypage に変更
                const resp = await fetch(`http://localhost:3030/mypage/other_experience_skill?user_id=${userId}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (!resp.ok) {
                    console.error('OtherExperience取得失敗', resp.status);
                    return;
                }
                const data = await resp.json();
                const programs = data?.programs ?? [];

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
                console.error('OtherExperience取得エラー', err);
            }
        };
        fetchPrograms();
    }, [userId]);

    const handleEditToggle = () => {
        setIsEditMode(prev => !prev);
        if (!isEditMode) {
            setEditingSkills(JSON.parse(JSON.stringify(registeredSkills)));
        }
    };

    const handleMainLanguageSelectChange = (event) => {
        const lang = event.target.value;
        setMainLanguageSelectValue(''); // 選択後リセット
        if (!lang) return;
        const exists = editingSkills.some(skill => skill.language === lang);
        if (!exists) {
            setEditingSkills(prevSkills => [
                ...prevSkills,
                { language: lang, duration: skillData[0].value }
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

    // 編集内容をサーバに送信（空なら削除指示）
    const handleRegister = async () => {
        const currentSkills = editingSkills.map(skill => ({ language: skill.language, duration: skill.duration }));
        const payload = { user_id: userId };

        if (currentSkills.length > 0) {
            payload.skill = currentSkills.map(s => s.language).join(',');
            payload.years = currentSkills.map(s => s.duration).join(',');
            payload.programs = currentSkills;
        } else {
            // 空データ送信でサーバ側が該当 user_id のレコードを削除する
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
            const resp = await fetch('http://localhost:3030/mypage/other_experience_skill', {
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

    const handleCancel = () => {
        setIsEditMode(false);
    };

    return (
        <div className="experience-container">
            <div className={`section-header ${isEditMode ? 'edit-mode' : 'display-mode'}`}>
                <div className="section-title">
                    その他経験開発環境
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
                            <option value="AIX">AIX</option>
                            <option value="Apache Kafka">Apache Kafka</option>
                            <option value="Apache Solr">Apache Solr</option>
                            <option value="Apache Superset">Apache Superset</option>
                            <option value="Apache Tomcat">Apache Tomcat</option>
                            <option value="CentOS">CentOS</option>
                            <option value="Debian">Debian</option>
                            <option value="Eclipse">Eclipse</option>
                            <option value="Emacs">Emacs</option>
                            <option value="FreeBSD">FreeBSD</option>
                            <option value="Grafana">Grafana</option>
                            <option value="GraphQL">GraphQL</option>
                            <option value="HP-UX">HP-UX</option>
                            <option value="internet Information Services(IIS)">internet Information Services(IIS)</option>
                            <option value="Linux">Linux</option>
                            <option value="Looker Studio">Looker Studio</option>
                            <option value="Mac OS X">Mac OS X</option>
                            <option value="Memcached">Memcached</option>
                            <option value="Movable Type">Movable Type</option>
                            <option value="NGINX">NGINX</option>
                            <option value="Passenger">Passenger</option>
                            <option value="Red Hat Enterprise Linux">Red Hat Enterprise Linux</option>
                            <option value="Redash">Redash</option>
                            <option value="Redis">Redis</option>
                            <option value="Solaris">Solaris</option>
                            <option value="SUSE Linux Enterprise Server">SUSE Linux Enterprise Server</option>
                            <option value="Tableau">Tableau</option>
                            <option value="thin">thin</option>
                            <option value="Unicorn">Unicorn</option>
                            <option value="UNIX">UNIX</option>
                            <option value="Vim">Vim</option>
                            <option value="WEBrick">WEBrick</option>
                            <option value="Windows">Windows</option>
                            <option value="Windows Server">Windows Server</option>
                            <option value="WordPress">WordPress</option>
                            <option value="Zope">Zope</option>
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
                                    {skillData.map(opt => (
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

export default Other;