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
                if (resUser.data?.loggedIn) setUser(resUser.data.user);
                else setUser(null);
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
    }, []);

    return (
        <>
            <HamburgerMenu />
            <div className='main_dai'><strong>ダッシュボード</strong></div>

            <div className="mypage_yoko">
                {/* プロフィールカード: ログイン情報があれば代表者名・会社名・登録情報を表示 */}
                <div className="my_card cdb-profile-card">
                    <div className="cdb-profile-info">
                        <div className="cdb-profile-label">代表者名</div>
                        <div className="cdb-profile-name">
                            {(() => {
                                // 企業ログイン時は user.company にレコードが入っている
                                if (user && user.company) {
                                    const c = user.company;
                                    return c.representative_name || c.representative || c.representativeName || c.rep_name || '未設定';
                                }
                                // 通常ユーザーの形
                                return user ? (user.representativeName || user.name || '未設定') : '未ログイン';
                            })()}
                        </div>

                        <div className="cdb-profile-label" style={{marginTop:12}}>会社名</div>
                        <div className="cdb-profile-name">
                            {(() => {
                                if (user && user.company) {
                                    const c = user.company;
                                    return c.company_name || c.name || c.company || '未設定';
                                }
                                return user?.company?.name || '未設定';
                            })()}
                        </div>

                        {/* 登録情報の一覧（company オブジェクトの主要フィールドを抜粋して表示） */}
                        {user && user.company ? (
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
                                        <li key={key}><strong>{label}</strong>: {displayValue}</li>
                                    );
                                })}

                                {/* 表示しきれなかったその他の項目（最大3件） */}
                                {Object.entries(user.company)
                                    .filter(([k]) => !companyDisplayOrder.includes(k) && !['password', 'photo', 'photo_2', 'photo_3', 'id'].includes(k))
                                    .slice(0, 3)
                                    .map(([k, v]) => (
                                        <li key={k}><strong>{k}</strong>: {String(v)}</li>
                                    ))}
                            </ul>
                        ) : (
                            <div className="cdb-profile-basic-info">ログインすると登録情報が表示されます。</div>
                        )}

                        <div className="cdb-profile-actions">
                            <button className="cdb-card-button" style={{marginLeft:8}} onClick={() => navigate('/C_NewReg')}>編集</button>
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
                                                <path d="M200-200v-560 454-85 191Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v320h-80v-320H200v560h280v80H200Zm494 40L552-222l57-56 85 85 170-170 56 57L694-80ZM320-440q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm120 160h240v-80H440v80Zm0-160h240v-80H440v80Z" />
                                            </svg>
                                        </div>
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
                                                <path d="M480-400q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400ZM320-240h320v-23q0-24-13-44t-36-30q-26-11-53.5-17t-57.5-6q-30 0-57.5 6T369-337q-23 10-36 30t-13 44v23ZM720-80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80Zm0-80v-446L526-800H240v640h480Zm-480 0v-640 640Z" />
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
        </>
    );
}

export default Dashboard;
