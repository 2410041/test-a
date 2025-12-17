// mypage
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './C_Dashboard.css';
import HamburgerMenu from '../../components/C_Header/C_Header';
// SVGs will be inlined so their color can be controlled via CSS (fill="currentColor").
// Show buttons that navigate to full pages instead of embedding panels

function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 画面に見やすく表示するためのフィールドラベルと表示順
    const companyFieldLabels = {
        company_name: '会社名',
        representative_name: '代表者名',
        email: 'メールアドレス',
        phone_number: '電話番号',
        location: '所在地',
        address: '住所',
        business: '事業内容',
        website: 'Webサイト',
        created_at: '登録日'
    };

    const companyDisplayOrder = [
        'company_name',
        'representative_name',
        'email',
        'phone_number',
        'location',
        'business',
        'website',
        'created_at'
    ];

    const navigate = useNavigate(); // ルーティング操作
    // whoami を取得するが、ログインしていない場合でも強制リダイレクトは行わず
    // デザイン確認のためにダッシュボードを表示できるようにする
    useEffect(() => {
        let mounted = true;
        const fetchUser = async () => {
            try {
                // まず企業セッションを確認
                const resCompany = await axios.get('http://localhost:3030/company/whoami', { withCredentials: true });
                if (!mounted) return;
                if (resCompany.data?.loggedIn) {
                    setUser({ company: resCompany.data.company });
                    return;
                }

                // 企業でなければ通常ユーザーの whoami を確認
                const resUser = await axios.get('http://localhost:3030/log/whoami', { withCredentials: true });
                if (!mounted) return;
                if (resUser.data?.loggedIn) {
                    setUser(resUser.data.user);
                } else {
                    // 未ログインならログインページへリダイレクト
                    setUser(null);
                    navigate('/C_Login', { replace: true });
                }
            } catch (err) {
                console.error('whoami error:', err);
                if (!mounted) return;
                setUser(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchUser();
        return () => { mounted = false; };
    }, [navigate]);

    const [editMode, setEditMode] = useState(false);
    const [editedCompany, setEditedCompany] = useState(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState('');
    // 求人一覧とモーダル管理
    const [offers, setOffers] = useState([]);
    const [offersLoading, setOffersLoading] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [offerSaveLoading, setOfferSaveLoading] = useState(false);
    const [offerModalLoading, setOfferModalLoading] = useState(false);

    const handleEdit = () => {
        if (user && user.company) {
            setEditedCompany({ ...user.company });
            setEditMode(true);
            setSaveError('');
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        setEditedCompany(null);
        setSaveError('');
    };

    const handleSave = async () => {
        if (!editedCompany) return;
        setSaveLoading(true);
        setSaveError('');
        try {
            const payload = {};
            // only send allowed editable fields
            const allowed = ['company_name', 'representative_name', 'email', 'phone_number', 'location', 'business', 'website', 'address'];
            for (const field of allowed) if (editedCompany[field] !== undefined) payload[field] = editedCompany[field];

            const res = await axios.post('http://localhost:3030/company/update', payload, { withCredentials: true });
            if (res.data?.success) {
                setUser({ company: res.data.company });
                setEditMode(false);
                setEditedCompany(null);
            } else {
                setSaveError(res.data?.message || '更新に失敗しました');
            }
        } catch (err) {
            setSaveError(err.response?.data?.message || err.message);
        } finally {
            setSaveLoading(false);
        }
    };

    // 求人一覧を取得（企業名でフィルタする）
    // 👉 バックエンド仕様変更に合わせて「companies_id」で取得するように修正
    const fetchOffers = async () => {
        setOffersLoading(true);
        try {
            // company_id を user から取得（構造の揺れに対応）
            const companyId =
                user?.company?.id ??
                user?.company_id ??
                null;

            if (!companyId) {
                console.warn('company_id が取得できませんでした');
                setOffers([]);
                return;
            }

            // /jobOffer?companyId=◯ で問い合わせ
            const res = await axios.get(
                'http://localhost:3030/jobOffer', {
                params: {
                    company_id: companyId
                }
            });
            setOffers(res.data || []);
        } catch (err) {
            console.error('fetchOffers error', err);
            setOffers([]);
        } finally {
            setOffersLoading(false);
        }
    };

    // user が変わったら求人一覧を取得する（企業ログイン時の company.id を利用）
    useEffect(() => {
        if (!user) return;
        // company 情報が入っている場合のみ取得
        if (user.company || user.company_id) {
            fetchOffers();
        }
    }, [user]);

    // 編集モーダルを開く（既存求人を編集する場合は最新データを取得してから開く）
    const openOfferModal = async (offer) => {
        setOfferModalLoading(true);
        try {
            if (offer && offer.id) {
                // fetch latest data
                const res = await axios.get(`http://localhost:3030/jobOffer/${offer.id}`);
                setEditingOffer(res.data || { ...offer });
            } else {
                // 新規は空オブジェクト（新規作成は別で管理されているため使わないことが想定されます）
                setEditingOffer({});
            }
            setIsOfferModalOpen(true);
        } catch (err) {
            console.error('openOfferModal error', err);
            alert('求人情報の取得に失敗しました');
        } finally {
            setOfferModalLoading(false);
        }
    };

    const closeOfferModal = () => {
        setEditingOffer(null);
        setIsOfferModalOpen(false);
    };

    // モーダル内の保存処理
    const handleOfferSave = async () => {
        if (!editingOffer || !editingOffer.id) return;
        setOfferSaveLoading(true);
        try {
            const payload = {
                job_title: editingOffer.job_title,
                job_description: editingOffer.job_description,
                employment_type: editingOffer.employment_type,
                salary_min: editingOffer.salary_min,
                salary_max: editingOffer.salary_max,
                training_exists: editingOffer.training_exists
            };
            await axios.patch(`http://localhost:3030/jobOffer/${editingOffer.id}`, payload, { withCredentials: true });
            // 更新後に一覧を再取得
            await fetchOffers();
            closeOfferModal();
        } catch (err) {
            console.error('handleOfferSave error', err);
            alert('保存に失敗しました');
        } finally {
            setOfferSaveLoading(false);
        }
    };

    return (
        <>
            <HamburgerMenu />
            <div className='main_dai'><strong>ダッシュボード</strong></div>
            <div className='around'>
                <div className="mypage_yoko">
                    {/* プロフィールカード: ログイン情報があれば代表者名・会社名・登録情報を表示 */}
                    <div className="cdb-profile-card">
                        <div className="cdb-profile-info">
                            <div className="cdb-profile-label">代表者名</div>
                            <div className="cdb-profile-name">
                                {(() => {
                                    // 企業ログイン時は user.company にレコードが入っている
                                    if (user && user.company) {
                                        const companyRecord = user.company;
                                        return companyRecord.representative_name || companyRecord.representative || companyRecord.representativeName || companyRecord.rep_name || '未設定';
                                    }
                                    // 通常ユーザーの形
                                    return user ? (user.representativeName || user.name || '未設定') : '未ログイン';
                                })()}
                            </div>

                            <div className="cdb-profile-label" style={{ marginTop: 12 }}>会社名</div>
                            <div className="cdb-profile-name">
                                {(() => {
                                    if (user && user.company) {
                                        const companyRecord = user.company;
                                        return companyRecord.company_name || companyRecord.name || companyRecord.company || '未設定';
                                    }
                                    return user?.company?.name || '未設定';
                                })()}
                            </div>

                            {/* 登録情報の一覧（company オブジェクトの主要フィールドを抜粋して表示） */}
                            {user && user.company ? (
                                !editMode ? (
                                    <ul className="cdb-profile-list">
                                        {/* 優先度の高い順に表示 */}
                                        {companyDisplayOrder.map((key) => {
                                            const label = companyFieldLabels[key] || key;
                                            const value = user.company[key] ?? user.company[key] === 0 ? user.company[key] : null;
                                            if (!value) return null;

                                            // 表示用のフォーマット
                                            let displayValue = String(value);
                                            if (key === 'email') displayValue = (<a href={`mailto:${value}`}>{value}</a>);
                                            if (key === 'phone_number') displayValue = (<a href={`tel:${value}`}>{value}</a>);
                                            if (key === 'website') {
                                                const href = String(value).startsWith('http') ? value : `https://${value}`;
                                                displayValue = (<a href={href} target="_blank" rel="noreferrer">{value}</a>);
                                            }

                                            return (
                                                <li key={key}><strong>{label}：</strong> {displayValue}</li>
                                            );
                                        })}

                                        {/* 表示しきれなかったその他の項目（最大3件） */}
                                        {Object.entries(user.company)
                                            .filter(([fieldKey]) => !companyDisplayOrder.includes(fieldKey) && !['password', 'photo', 'photo_2', 'photo_3', 'id'].includes(fieldKey))
                                            .slice(0, 3)
                                            .map(([fieldKey, fieldValue]) => (
                                                <li key={fieldKey}><strong>{fieldKey}</strong> {String(fieldValue)}</li>
                                            ))}
                                    </ul>
                                ) : (
                                    // 編集モード: フォーム表示
                                    <div style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
                                            {companyDisplayOrder.map((key) => {
                                                if (key === 'created_at') return null; // 不可変
                                                const label = companyFieldLabels[key] || key;
                                                const value = editedCompany?.[key] ?? user.company[key] ?? '';
                                                return (
                                                    <label key={key} style={{ width: '100%' }}>
                                                        <div style={{ fontWeight: 700, color: '#0056BB', marginBottom: 6 }}>{label}</div>
                                                        <input
                                                            type="text"
                                                            value={value}
                                                            onChange={(event) => setEditedCompany(prev => ({ ...prev, [key]: event.target.value }))}
                                                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                                        />
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        {saveError && <div style={{ color: 'red', marginTop: 8 }}>{saveError}</div>}
                                    </div>
                                )
                            ) : (
                                <div className="cdb-profile-basic-info">ログインすると登録情報が表示されます。</div>
                            )}

                            <div className="cdb-profile-actions">
                                {!editMode ? (
                                    <>
                                        <button className="cdb-card-button" style={{ marginLeft: 8 }} onClick={handleEdit}>求人情報 編集</button>
                                    </>
                                ) : (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button className="cdb-card-button" onClick={handleSave} disabled={saveLoading}>{saveLoading ? '保存中...' : '保存'}</button>
                                        <button className="cdb-card-button" onClick={handleCancel} style={{ background: '#ccc', color: '#000' }}>キャンセル</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="cdb-cards-grid">
                        {loading ? (
                            <div className="cdb-loading">読み込み中...</div>
                        ) : (
                            <>
                                {/* 上段: 求人関連を3つ */}
                                <div className="cdb-top-row">
                                    <div className="cdb-card">
                                        <h3 className="cdb-card-title">求人作成</h3>
                                        <div className="cdb-card-body">
                                            <div className="cdb-card-icon" aria-hidden="true">
                                                <svg className="cdb-card-icon-svg" viewBox="0 -960 960 960" width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
                                                    <path d="M520-400h80v-120h120v-80H600v-120h-80v120H400v80h120v120ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" />
                                                </svg>
                                            </div>
                                            <button className="cdb-card-button" onClick={() => navigate('/Offer')}>新しい求人を作成</button>
                                        </div>
                                    </div>

                                    <div className="cdb-card">
                                        <h3 className="cdb-card-title">求人審査状況</h3>
                                        <div className="cdb-card-body">
                                            <div className="cdb-card-icon" aria-hidden="true">
                                                <svg className="cdb-card-icon-svg" viewBox="0 -960 960 960" width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
                                                    <path d="M200-200v-560 454-85 191Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v320h-80v-320H200v560h166q-3 11-4.5 22t-1.5 22v36H200Zm494 40L552-222l57-56 85 85 170-170 56 57L694-80ZM320-440q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm120 160h240v-80H440v80Zm0-160h240v-80H440v80Z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="cdb-card">
                                        <h3 className="cdb-card-title">就活者一覧</h3>
                                        <div className="cdb-card-body">
                                            <div className="cdb-card-icon" aria-hidden="true">
                                                <svg className="cdb-card-icon-svg" viewBox="0 -960 960 960" width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
                                                    <path d="M680-320q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-440q0-17-11.5-28.5T680-480q-17 0-28.5 11.5T640-440q0 17 11.5 28.5T680-400ZM440-40v-116q0-21 10-39.5t28-29.5q32-19 67.5-31.5T618-275l62 75 62-75q37 6 72 18.5t67 31.5q18 11 28.5 29.5T920-156v116H440Zm79-80h123l-54-66q-18 5-35 13t-34 17v36Zm199 0h122v-36q-16-10-33-17.5T772-186l-54 66Zm-76 0Zm76 0Zm-518 0q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v200q-16-20-35-38t-45-24v-138H200v560h166q-3 11-4.5 22t-1.5 22v36H200Zm80-480h280q26-20 57-30t63-10v-40H280v80Zm0 160h200q0-21 4.5-41t12.5-39H280v80Zm0 160h138q11-9 23.5-16t25.5-13v-51H280v80Zm-80 80v-560 137-17 440Zm480-240Z" />
                                                </svg>
                                            </div>
                                            <button className="cdb-card-button" onClick={() => navigate('/C_Userlist')}>就活者一覧へ</button>
                                        </div>
                                    </div>
                                </div>

                                {/* 下段: チャット と 応募者一覧 を横並び */}
                                <div className="cdb-bottom-row">
                                    <div className="cdb-card">
                                        <h3 className="cdb-card-title">チャット</h3>
                                        <div className="cdb-card-body">
                                            <div className="cdb-card-icon" aria-hidden="true">
                                                <svg className="cdb-card-icon-svg" viewBox="0 -960 960 960" width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
                                                    <path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z" />
                                                </svg>
                                            </div>
                                            <button className="cdb-card-button" onClick={() => navigate('/C_Chat')}>チャット画面へ</button>
                                        </div>
                                    </div>

                                    <div className="cdb-card">
                                        <h3 className="cdb-card-title">応募者一覧</h3>
                                        <div className="cdb-card-body">
                                            <div className="cdb-card-icon" aria-hidden="true">
                                                <svg className="cdb-card-icon-svg" viewBox="0 -960 960 960" width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
                                                    <path d="M480-400q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400ZM320-240h320v-23q0-24-13-44t-36-30q-26-11-53.5-17t-57.5-6q-30 0-57.5 6T369-337q-23 10-36 30t-13 44v23ZM720-80H240q-33 0-56.5-23.5T120-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80Zm0-80v-446L526-800H240v640h480Zm-480 0v-640 640Z" />
                                                </svg>
                                            </div>
                                            <button className="cdb-card-button" onClick={() => navigate('/C_Applicant')}>応募者ページへ</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {/* 編集モーダル */}
                {isOfferModalOpen && (
                    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                        <div className="modal-card" style={{ background: '#fff', padding: 20, width: '90%', maxWidth: 800, borderRadius: 6 }}>
                            <h3 style={{ marginTop: 0 }}>{editingOffer ? '求人を編集' : '新規求人を作成'}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <label>職種<input type="text" value={editingOffer?.job_title || ''} onChange={(ev) => setEditingOffer(prev => ({ ...prev, job_title: ev.target.value }))} /></label>
                                <label>仕事内容<textarea value={editingOffer?.job_description || ''} onChange={(ev) => setEditingOffer(prev => ({ ...prev, job_description: ev.target.value }))} /></label>
                                <label>雇用形態<input type="text" value={editingOffer?.employment_type || ''} onChange={(ev) => setEditingOffer(prev => ({ ...prev, employment_type: ev.target.value }))} /></label>
                                <label>最低給与<input type="text" value={editingOffer?.salary_min || ''} onChange={(ev) => setEditingOffer(prev => ({ ...prev, salary_min: ev.target.value }))} /></label>
                                <label>最高給与<input type="text" value={editingOffer?.salary_max || ''} onChange={(ev) => setEditingOffer(prev => ({ ...prev, salary_max: ev.target.value }))} /></label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" checked={!!editingOffer?.training_exists} onChange={(ev) => setEditingOffer(prev => ({ ...prev, training_exists: ev.target.checked ? 1 : 0 }))} /> 研修あり</label>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                                <button className="cdb-card-button" onClick={closeOfferModal}>キャンセル</button>
                                <button className="cdb-card-button" onClick={handleOfferSave}>保存</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Dashboard;
