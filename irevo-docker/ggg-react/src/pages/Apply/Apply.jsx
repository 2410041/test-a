import React, { useEffect, useState } from 'react';
import fetchUser from '../../components/Common/Common';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import './Apply.css';

export default function ApplyPage() {
    const location = useLocation();
    const params = useParams();
    const [company, setCompany] = useState(location.state?.company || null);
    const id = params.id;
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const [emailInput, setEmailInput] = useState('');
    const [contactInput, setContactInput] = useState('');

    // モーダル表示フラグ
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // モーダル開閉時に背景スクロールを禁止する
    useEffect(() => {
        document.body.style.overflow = isModalOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isModalOpen]);

    // Esc キーで閉じる
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
        if (isModalOpen) window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isModalOpen]);

    useEffect(() => {
        fetchUser().then(data => {
            if (data) {
                console.log("ユーザー情報:", data);
                setUserData(data);
            } else {
                // 未ログインならログインページにリダイレクト
                navigate("/login");
            }
        });

        if (!company && id) {
            // state が無ければ ID で取得
            axios.get(`http://localhost:3030/company/${id}`)
                .then(res => setCompany(res.data))
                .catch(() => { });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company, id]);

    useEffect(() => {
        if (userData?.u_Email) setEmailInput(userData.u_Email);
    }, [userData]);

    useEffect(() => {
        if (userData?.u_Contact) setContactInput(userData.u_Contact);
    }, [userData]);

    const handleApply = async () => {
        try {
            await axios.post('http://localhost:3030/apply', { companyId: company.id, email: emailInput, contact: contactInput }, { withCredentials: true });
            alert('応募しました');
        } catch (e) {
            alert('応募に失敗しました');
        }
    };

    if (!company) return <div style={{ padding: 32 }}>企業情報を取得できませんでした。</div>;

    return (
        <div className="apply-page">
            {/* only-form クラスを付与してフォームのみ中央表示 */}
            <div className={`apply-container ${!isModalOpen ? 'only-form' : ''}`}>
                {/* 企業詳細はモーダル内にのみ表示するため、ここではフォームのみをレンダリング */}
                <div className="form-panel">
                    <h2 style={{ marginTop: 0, marginBottom: 8 }}>応募フォーム</h2>
                    <div className="secondary">以下の情報を確認して応募を送信してください。</div>

                    <div className="form-row">
                        <label className="form-label">メールアドレス</label>
                        <input className="form-input" type="text" name="email" id="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
                    </div>

                    <div className="form-row">
                        <label className="form-label">連絡先</label>
                        <input className="form-input" type="text" name="contact" id="contact" value={contactInput} onChange={(e) => setContactInput(e.target.value)} />
                    </div>

                    <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
                        {/* プレビューを開くボタン（モーダル表示） */}
                        <button className="primary-btn" onClick={openModal}>プレビュー</button>
                        <button className="primary-btn" onClick={handleApply}>応募を確定する</button>
                        <button
                            type="button"
                            onClick={() => {
                                navigate(`/Company`);
                            }}
                            className="primary-btn"
                        >
                            企業一覧に戻る
                        </button>
                    </div>
                </div>
            </div>

            {/* モーダル：ここで企業情報と応募内容を表示する（モーダルでのみ企業詳細を表示） */}
            {isModalOpen && (
                <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="応募内容プレビュー" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>応募内容プレビュー</h3>
                            <button className="modal-close" onClick={closeModal} aria-label="閉じる">×</button>
                        </div>
                        <div className="modal-body">
                            <section>
                                <h4>{company.name || company.c_name}</h4>
                                <div className="secondary">{company.location}</div>
                                <p className="description">
                                    {company.company_detail_description || company.JobDescription || '会社・募集の詳細がここに表示されます。'}
                                </p>
                                <div style={{ display: 'flex', gap: 12 }}>
                                    <div>
                                        <div className="secondary">募集職種</div>
                                        <div>{company.title}</div>
                                    </div>
                                    <div>
                                        <div className="secondary">給与</div>
                                        <div>{company.salary}</div>
                                    </div>
                                </div>

                                <div style={{ marginTop: 18 }}>
                                    <div className="secondary">勤務地</div>
                                    <div>{company.work_location}</div>
                                </div>
                            </section>

                            <hr style={{ margin: '16px 0' }} />

                            <section>
                                <h4>応募者情報</h4>
                                <div className="form-row"><div className="form-label">メールアドレス</div><div>{emailInput || '未入力'}</div></div>
                                <div className="form-row"><div className="form-label">連絡先</div><div>{contactInput || '未入力'}</div></div>
                            </section>
                        </div>
                        <div className="modal-footer">
                            <button className="primary-btn" onClick={() => { closeModal(); handleApply(); }}>このまま応募する</button>
                            <button style={{ marginLeft: 8 }} onClick={closeModal}>閉じる</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}