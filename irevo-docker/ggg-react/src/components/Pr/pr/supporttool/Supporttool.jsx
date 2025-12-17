import React, { useState, useEffect } from 'react';
import '../pr.css';

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

const Support = ({ user }) => {
    const userId = user?.id ?? null;

    const [isEditMode, setIsEditMode] = useState(false);
    const [registeredSkills, setRegisteredSkills] = useState([]);
    const [editingSkills, setEditingSkills] = useState([]);
    const [mainLanguageSelectValue, setMainLanguageSelectValue] = useState('');

    useEffect(() => {
        setEditingSkills(JSON.parse(JSON.stringify(registeredSkills)));
    }, [registeredSkills, isEditMode]);

    // 初期取得
    useEffect(() => {
        if (!userId) return;
        const fetchTools = async () => {
            try {
                // 送受信先を /user から /mypage に変更
                const resp = await fetch(`http://localhost:3030/mypage/tool?user_id=${userId}`, {
                     method: 'GET',
                     credentials: 'include',
                     headers: { 'Content-Type': 'application/json' }
                 });
                 if (!resp.ok) return;
                 const data = await resp.json();
                 const programs = data?.programs ?? [];

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
                console.error('tool fetch error', err);
            }
        };
        fetchTools();
    }, [userId]);

    const handleEditToggle = () => {
        setIsEditMode(prev => !prev);
        if (!isEditMode) setEditingSkills(JSON.parse(JSON.stringify(registeredSkills)));
    };

    const handleMainLanguageSelectChange = (event) => {
        const lang = event.target.value;
        setMainLanguageSelectValue('');
        if (!lang) return;
        const exists = editingSkills.some(skill => skill.language === lang);
        if (!exists) {
            setEditingSkills(prev => [...prev, { language: lang, duration: skillData[0].value }]);
        }
    };

    const handleDurationChange = (index, newDuration) => {
        const copy = [...editingSkills];
        copy[index].duration = newDuration;
        setEditingSkills(copy);
    };

    const handleRemoveLanguage = (index) => {
        setEditingSkills(prev => prev.filter((_, i) => i !== index));
    };

    const handleRegister = async () => {
        const currentSkills = editingSkills.map(s => ({ language: s.language, duration: s.duration }));
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

        if (!userId) return;

        try {
            // 送受信先を /user から /mypage に変更
            const resp = await fetch('http://localhost:3030/mypage/tool', {
                 method: 'POST',
                 credentials: 'include',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(payload)
             });
             const result = await resp.json();
             if (!resp.ok) console.error('tool save failed', result);
         } catch (err) {
             console.error('tool save error', err);
         }

        setRegisteredSkills(currentSkills);
        setIsEditMode(false);
    };

    const handleCancel = () => setIsEditMode(false);

    return (
        <div className="experience-container">
            <div className={`section-header ${isEditMode ? 'edit-mode' : 'display-mode'}`}>
                <div className="section-title">
                    開発支援ツール
                </div>
                {!isEditMode && <span className="material-icons edit-toggle-icon" onClick={handleEditToggle}>edit</span>}
            </div>

            {!isEditMode ? (
                <div className="display-mode">
                    <ul className="skill-list">
                        {registeredSkills.length === 0 ? (
                            <li>スキルはまだ登録されていません。</li>
                        ) : (
                            registeredSkills.map((s, i) => <li key={i} className="skill-item">{s.language} {s.duration}</li>)
                        )}
                    </ul>
                </div>
            ) : (
                <div className="edit-mode">
                    <div className="main-language-select-wrapper">
                        <select className="main-language-select" value={mainLanguageSelectValue} onChange={handleMainLanguageSelectChange}>
                            <option value="">複数選択可</option>
                            <option value="Apache Airflow">Apache Airflow</option>
                            <option value="Backlog">Backlog</option>
                            <option value="Basecamp">Basecamp</option>
                            <option value="Bazaar">Bazaar</option>
                            <option value="Bitbucket">Bitbucket</option>
                            <option value="CircleCI">CircleCI</option>
                            <option value="CVS">CVS</option>
                            <option value="digdag">digdag</option>
                            <option value="Git">Git</option>
                            <option value="GitHub">GitHub</option>
                            <option value="GitHub Actions">GitHub Actions</option>
                            <option value="GitLab">GitLab</option>
                            <option value="Jenkins">Jenkins</option>
                            <option value="Jira">Jira</option>
                            <option value="Mercurial">Mercurial</option>
                            <option value="New Relic">New Relic</option>
                            <option value="PagerDuty">PagerDuty</option>
                            <option value="Pirotal Ttacker">Pirotal Ttacker</option>
                            <option value="Redmine">Redmine</option>
                            <option value="Rollbar">Rollbar</option>
                            <option value="Sentry">Sentry</option>
                            <option value="Subversion">Subversion</option>
                            <option value="Trac">Trac</option>
                            <option value="Travis CI">Travis CI</option>
                        </select>
                    </div>

                    <div className="edit-mode-headers">
                        <div className="header-language">選択済み項目</div>
                        <div className="header-experience">実務経験</div>
                        <div style={{ width: '40px' }}></div>
                    </div>

                    <div className="dynamic-language-inputs">
                        {editingSkills.map((s, idx) => (
                            <div key={idx} className="language-input-row" data-language={s.language}>
                                <span className="language-name">{s.language}</span>
                                <select className="duration-select-button" value={s.duration} onChange={(e) => handleDurationChange(idx, e.target.value)}>
                                    {skillData.map(opt => <option key={opt.value} value={opt.value}>{opt.text}</option>)}
                                </select>
                                <button className="remove-language-button" aria-label="削除" onClick={() => handleRemoveLanguage(idx)}>
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

export default Support;