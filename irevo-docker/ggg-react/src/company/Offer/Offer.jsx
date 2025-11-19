import './Offer.css';
import useOffer from'./useOffer';
import HamburgerMenu from '../../components/C_Header/C_Header';
import React, { useState, useRef, useEffect } from 'react';

function Offer() {

    useOffer();

    // ロゴ・会社画像の state (プレビュー表示用)
    const [logoPreview, setLogoPreview] = useState(null);
    const logoRef = useRef(null);
    const [photosPreviews, setPhotosPreviews] = useState([null, null, null]);
    const photosRefs = useRef([null, null, null]);

    // input の change ハンドラ（React 側はプレビューのみ管理。実際の送信は useOffer 側で FormData を作る）
    const handleLogoChange = (e) => {
        const f = e.target.files && e.target.files[0];
        if (logoRef.current) {
            try { URL.revokeObjectURL(logoRef.current); } catch (e) {}
        }
        if (f) {
            const url = URL.createObjectURL(f);
            logoRef.current = url;
            setLogoPreview(url);
        } else {
            logoRef.current = null;
            setLogoPreview(null);
        }
    };

    const handlePhotoChange = (idx) => (e) => {
        const f = e.target.files && e.target.files[0];
        const newPreviews = [...photosPreviews];
        if (photosRefs.current[idx]) {
            try { URL.revokeObjectURL(photosRefs.current[idx]); } catch (e) {}
        }
        if (f) {
            const url = URL.createObjectURL(f);
            photosRefs.current[idx] = url;
            newPreviews[idx] = url;
        } else {
            photosRefs.current[idx] = null;
            newPreviews[idx] = null;
        }
        setPhotosPreviews(newPreviews);
    };

    useEffect(() => {
        return () => {
            if (logoRef.current) try { URL.revokeObjectURL(logoRef.current); } catch (e) {}
            photosRefs.current.forEach(p => { if (p) try { URL.revokeObjectURL(p); } catch (e) {} });
        }
    }, []);

    return (
        <>
            <HamburgerMenu />
            <div className="offer-container">
                <h4 className="offer-title">求人掲載情報</h4>
                <div className="offer-page_indicator" id="page_indicator">
                    <div className="offer-line"></div>
                    <a href="#" className="offer-step" data-page="1">
                        <div className="offer-circle">
                            <img src="./images/iRevoicon.png" alt="完了" />
                            <span>1</span>
                        </div>
                        <div className="offer-step_text">会社情報</div>
                    </a>
                    <a href="#" className="offer-step" data-page="2">
                        <div className="offer-circle">
                            <img src="./images/iRevoicon.png" alt="完了" />
                            <span>2</span>
                        </div>
                        <div className="offer-step_text">募集情報</div>
                    </a>
                    <a href="#" className="offer-step" data-page="3">
                        <div className="offer-circle">
                            <img src="./images/iRevoicon.png" alt="完了" />
                            <span>3</span>
                        </div>
                        <div className="offer-step_text">応募資格</div>
                    </a>

                    <a href="#" className="offer-step" data-page="4">
                        <div className="offer-circle">
                            <img src="./images/iRevoicon.png" alt="完了" />
                            <span>4</span>
                        </div>
                        <div className="offer-step_text">勤務条件</div>
                    </a>
                    <a href="#" className="offer-step" data-page="5">
                        <div className="offer-circle">
                            <img src="./images/iRevoicon.png" alt="完了" />
                            <span>5</span>
                        </div>
                        <div className="offer-step_text">給与・待遇</div>
                    </a>
                    <a href="#" className="offer-step" data-page="6">
                        <div className="offer-circle">
                            <img src="./images/iRevoicon.png" alt="完了" />
                            <span>6</span>
                        </div>
                        <div className="offer-step_text">福利厚生</div>
                    </a>
                    <a href="#" className="offer-step" data-page="7">
                        <div className="offer-circle">
                            <img src="./images/iRevoicon.png" alt="完了" />
                            <span>7</span>
                        </div>
                        <div className="offer-step_text">選考情報</div>
                    </a>
                </div>

                <form id="multi_step_form">
                    <div className="offer-form_section" id="form_section_1">
                        <div className="offer-form_row">
                            <label htmlFor="company_name">社名</label>
                            <div className="offer-input_group">
                                <input type="text" id="company_name" name="company_name" placeholder="株式会社iRevo" />
                            </div>
                        </div>

                            {/* ロゴアップロード */}
                            <div className="offer-form_row">
                                <label>ロゴ</label>
                                <div className="offer-input_group">
                                    <label className="custom-upload">ロゴを選択
                                        <input type="file" name="logo" accept="image/*" className="hidden" onChange={handleLogoChange} />
                                    </label>
                                    {logoPreview && (<div className="offer-image-preview_wrap"><img src={logoPreview} alt="logo preview" className="offer-image-preview" /></div>)}
                                </div>
                            </div>

                            {/* 会社画像（3枚） */}
                            <div className="offer-form_row">
                                <label>会社画像</label>
                                <div className="offer-input_group offer-image-row">
                                    <div className="offer-image-item">
                                        <label className="custom-upload">外観写真
                                            <input type="file" name="photo_1" accept="image/*" className="hidden" onChange={handlePhotoChange(0)} />
                                        </label>
                                        {photosPreviews[0] && <img src={photosPreviews[0]} alt="photo1" className="offer-image-preview" />}
                                    </div>
                                    <div className="offer-image-item">
                                        <label className="custom-upload">社内風景
                                            <input type="file" name="photo_2" accept="image/*" className="hidden" onChange={handlePhotoChange(1)} />
                                        </label>
                                        {photosPreviews[1] && <img src={photosPreviews[1]} alt="photo2" className="offer-image-preview" />}
                                    </div>
                                    <div className="offer-image-item">
                                        <label className="custom-upload">作業環境
                                            <input type="file" name="photo_3" accept="image/*" className="hidden" onChange={handlePhotoChange(2)} />
                                        </label>
                                        {photosPreviews[2] && <img src={photosPreviews[2]} alt="photo3" className="offer-image-preview" />}
                                    </div>
                                </div>
                            </div>

                        <div className="offer-form_row">
                            <label>所在地</label>
                            <div className="offer-input_group">
                                <span className="offer-address_label">郵便番号</span>
                                <input type="text" id="postal_code" name="postal_code" className="offer-small_input" placeholder="郵便番号" />
                                <span className="offer-address_label">住所</span>
                                <input type="text" id="address_input" name="address_input" placeholder="住所" />
                                <span className="offer-address_label">住所ふりがな (任意)</span>
                                <input type="text" id="address_kana" name="address_kana" placeholder="住所ふりがな" />
                            </div>
                        </div>
                    
                        <div className="offer-form_row">
                            <label>設立年・創業年 (任意)</label>
                            <div className="offer-input_group offer-date_inputs_container">
                                <select id="establishment_year" name="establishment_year">
                                    <option value="">年</option>
                                </select>
                                <span>年</span>
                                <select id="establishment_month" name="establishment_month">
                                    <option value="">月</option>
                                </select>
                                <span>月</span>
                                <select id="establishment_day" name="establishment_day">
                                    <option value="">日</option>
                                </select>
                                <span>日</span>
                            </div>
                        </div>

                        <div className="offer-form_row">
                            <label htmlFor="capital_input">資本金 (任意)</label>
                            <div className="offer-input_group">
                                <input type="text" id="capital_input" name="capital_input" placeholder="例: 1,000万円" />
                            </div>
                        </div>

                        <div className="offer-form_row">
                            <label htmlFor="employees_input">従業員数 (任意)</label>
                            <div className="offer-input_group">
                                <input type="text" id="employees_input" name="employees_input" placeholder="例: 100名" />
                            </div>
                        </div>

                        <div className="offer-form_row">
                            <label htmlFor="business_content">事業内容</label>
                            <div className="offer-input_group">
                                <textarea id="business_content" name="business_content" placeholder="事業内容を具体的にご記入ください"></textarea>
                            </div>
                        </div>
                        <div className="offer-form_row">
                            <label htmlFor="homepage_url">ホームページURL (任意)</label>
                            <div className="offer-input_group">
                                <input type="url" id="homepage_url" name="homepage_url" placeholder="https://www.example.com" />
                            </div>
                        </div>
                    </div>

                    <div className="offer-form_section" id="form_section_2">
                        <div className="offer-form_row">
                            <label htmlFor="job_title">募集職種</label>
                            <div className="offer-input_group">
                                <input type="text" id="job_title" name="job_title" placeholder="例: Webエンジニア" />
                            </div>
                        </div>

                        <div className="offer-form_row">
                            <label htmlFor="job_description">仕事内容</label>
                            <div className="offer-input_group">
                                <textarea id="job_description" name="job_description" placeholder="仕事内容を具体的にご記入ください"></textarea>
                            </div>
                        </div>

                        <div className="offer-form_row">
                            <label htmlFor="employment_type">雇用形態</label>
                            <div className="offer-input_group">
                                <input type="text" id="employment_type" name="employment_type" placeholder="例: 正社員, 契約社員" />
                            </div>
                        </div>

                        <div className="offer-form_row">
                            <label htmlFor="recruitment_count">募集人数 (任意)</label>
                            <div className="offer-input_group">
                                <input type="text" id="recruitment_count" name="recruitment_count" placeholder="例: 若干名, 1名" />
                            </div>
                        </div>
                    </div>

                    <div className="offer-form_section" id="form_section_3">
                        <div className="offer-form_row">
                            <label htmlFor="required_skills">必須スキル・経験</label>
                            <div className="offer-input_group">
                                <textarea id="required_skills" name="required_skills" placeholder="必須スキル・経験を具体的にご記入ください"></textarea>
                            </div>
                        </div>
                        <div className="offer-form_row">
                            <label htmlFor="preferred_skills">歓迎スキル・経験 (任意)</label>
                            <div className="offer-input_group">
                                <textarea id="preferred_skills" name="preferred_skills" placeholder="歓迎スキル・経験を具体的にご記入ください"></textarea>
                            </div>
                        </div>
                        <div className="offer-form_row">
                            <label htmlFor="education_age_restrictions">学歴・年齢制限 (任意)</label>
                            <div className="offer-input_group">
                                <textarea id="education_age_restrictions" name="education_age_restrictions" placeholder="学歴・年齢制限がある場合はその理由もご記入ください"></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="offer-form_section" id="form_section_4">
                        <div className="offer-form_row">
                            <label htmlFor="work_location">勤務地</label>
                            <div className="offer-input_group">
                                <input type="text" id="work_location" name="work_location" placeholder="例: 東京都渋谷区 / 最寄駅: 渋谷駅" />
                            </div>
                        </div>

                        <div className="offer-form_row">
                            <label>勤務時間</label>
                            <div className="offer-input_group offer-time_range">
                                <div className="offer-time_block">
                                    <select id="work_start_hour" name="work_start_hour" className="offer-small_input"></select>
                                    <span className="offer-time_colon">：</span>
                                    <select id="work_start_minute" name="work_start_minute" className="offer-small_input"></select>
                                </div>
                                <span className="offer-time_separator">〜</span>
                                <div className="offer-time_block">
                                    <select id="work_end_hour" name="work_end_hour" className="offer-small_input"></select>
                                    <span className="offer-time_colon">：</span>
                                    <select id="work_end_minute" name="work_end_minute" className="offer-small_input"></select>
                                </div>
                            </div>
                        </div>

                        <div className='offer-form_row'>
                            <label>休憩：</label>
                            <div className="offer-input_group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <input type="text" id="work_break" name="work_break" placeholder="例: 60分" className="offer-small_input" />
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <input type="checkbox" id="shift_system" name="shift_system" /> シフト制
                                </label>
                            </div>
                        </div>

                        <div className="offer-form_row">
                            <label>残業の有無</label>
                            <div className="offer-input_group">
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <input type="radio" id="overtime_no" name="overtime_exists" value="no" defaultChecked /> なし
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <input type="radio" id="overtime_yes" name="overtime_exists" value="yes" /> あり
                                    </label>
                                </div>
                                <input type="text" id="overtime_average" name="overtime_average" placeholder="例: 月平均10時間" className="offer-small_input" style={{ marginTop: '8px' }} />
                            </div>
                        </div>

                        <div className="offer-form_row">
                            <label>休日・休暇</label>
                            <div className="offer-input_group">
                                <input type="text" id="weekly_holiday" name="weekly_holiday" placeholder="例: 週休2日（シフト制）" />
                                <input type="text" id="paid_leave" name="paid_leave" placeholder="例: 有給あり（入社6ヶ月後10日）" />
                                <textarea id="long_leave" name="long_leave" placeholder="長期休暇（例: 夏季休暇、年末年始）" />
                            </div>
                        </div>
                    </div>

                    <div className="offer-form_section" id="form_section_5">
                        <div className="offer-form_row">
                            <label>給与額（月給）</label>
                            <div className="offer-input_group">
                                <span>最低額</span>
                                <input type="text" id="salary_min" name="salary_min" placeholder="例: 250000" />
                                <span>最高額</span>
                                <input type="text" name="salary_max" id="salary_max" placeholder="例: 300000" />
                            </div>
                        </div>

                        <div className="offer-form_row">
                            <label>昇給・賞与</label>
                            <div className="offer-input_group">
                                <input type="text" id="salary_raise" name="salary_raise" placeholder="昇給の有無と条件（例: 年1回、業績による）" />
                                <input type="text" id="bonus" name="bonus" placeholder="賞与の有無と条件（例: 年2回、業績連動）" />
                            </div>
                        </div>

                        <div className="offer-form_row">
                            <label>交通費・手当・試用期間</label>
                            <div className="offer-input_group">
                                <input type="text" id="transport_allowance" name="transport_allowance" placeholder="交通費支給の有無と上限（例: 支給 / 上限2万円）" />
                                <input type="text" id="allowances" name="allowances" placeholder="各種手当（例: 役職手当、住宅手当）" />
                                <input type="text" id="probation" name="probation" placeholder="試用期間（例: 3ヶ月／待遇の変化）" />
                            </div>
                        </div>
                    </div>

                    <div className="offer-form_section" id="form_section_6">
                        <div className="offer-form_row">
                            <label>社会保険</label>
                            <div className="offer-input_group">
                                <select id="social_insurance" name="social_insurance">
                                    <option value="">選択してください</option>
                                    <option value="all">全て加入（雇用・労災・健康・厚生年金）</option>
                                    <option value="partial">一部加入（該当保険を備考に記載）</option>
                                    <option value="none">未加入</option>
                                </select>
                                <input type="text" id="social_insurance_detail" name="social_insurance_detail" placeholder="該当する保険を記載（例: 雇用保険、健康保険）" style={{ marginTop: '8px' }} />
                            </div>
                        </div>

                        <div className="offer-form_row">
                            <label>福利厚生制度</label>
                            <div className="offer-input_group">
                                <textarea id="welfare_systems" name="welfare_systems" placeholder="社割、資格取得支援、社宅など" />
                            </div>
                        </div>

                        <div className="offer-form_row">
                            <label>研修制度の有無</label>
                            <div className="offer-input_group">
                                <label><input type="checkbox" id="training_exists" name="training_exists" /> あり</label>
                                <input type="text" id="training_detail" name="training_detail" placeholder="研修の概要（任意）」" />
                            </div>
                        </div>
                    </div>

                    <div className="offer-form_section" id="form_section_7">
                        <div className="offer-form_row">
                            <label>応募方法</label>
                            <div className="offer-input_group">
                                <textarea id="application_method" name="application_method" placeholder="電話、メール、応募フォームなどの案内" />
                            </div>
                        </div>

                        <div className="offer-form_row">
                            <label>選考フロー</label>
                            <div className="offer-input_group">
                                <textarea id="selection_flow" name="selection_flow" placeholder="例: 書類選考 → 面接（1〜2回） → 内定" />
                            </div>
                        </div>

                        <div className="offer-form_row">
                            <label>面接地</label>
                            <div className="offer-input_group">
                                <input type="text" id="interview_location" name="interview_location" placeholder="面接地の住所（勤務地と異なる場合）" />
                            </div>
                        </div>
                    </div>
                    

                    <div className="offer-button_group">
                        <button type="button" className="offer-prev_button" id="prev_button"> &lt;&lt; 前へ </button>
                        <button type="button" className="offer-next_button" id="next_button"> 次へ &gt;&gt; </button>
                    </div>

                    <div className="offer-submit_button_container" id="submit_button_container" style={{ display: 'none' }}>
                        <button type="submit" className="offer-submit_button">送信</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Offer;
