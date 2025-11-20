import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Company.css';
import HamburgerMenu from '../../components/HamburgerMenu/HamburgerMenu';
import axios from 'axios';
import Map from '../../pages/Map/Map.jsx'; // Mapコンポーネントをインポート


export default function Company() {
    const navigate = useNavigate(); // 追加：navigate を定義
    const [items, setItems] = useState([]);
    const [URL, setSearchURL] = useState('http://15.152.5.110:3030/company/company'); // 検索URLを保存するstate
    // console.log(URL, setSearchURL);
    const [filters, setFilters] = useState({
        prefecture: '',
        job: '',
        keyword: ''
    });
    const handleSearch = () => {
        // プルダウンの値を取得
        const prefectureSelect = document.querySelector('select[name="prefecture"]');
        const jobSelect = document.querySelector('select[name="job"]');
        const employeeSizeSelect = document.querySelector('select[name="employee_size"]');
        const salarySelect = document.querySelector('select[name="salary"]'); // 追加：給与セレクト
        const keywordInput = document.querySelector('input[type="text"]');

        const prefecture = prefectureSelect?.value || '';
        const job = jobSelect?.value || '';
        const employee_size = employeeSizeSelect?.value || '';
        const salary = salarySelect?.value || ''; // 追加：給与値を取得
        const keyword = keywordInput?.value || '';

        console.log('検索条件:', { prefecture, job, employee_size, salary, keyword });

        // URL に employee_size と salary（および keyword）を含める
        const URL = `http://15.152.5.110:3030/company/company_filter?prefecture=${encodeURIComponent(prefecture)}&job=${encodeURIComponent(job)}&employee_size=${encodeURIComponent(employee_size)}&salary=${encodeURIComponent(salary)}&keyword=${encodeURIComponent(keyword)}`;

        console.log(URL);

        setSearchURL(URL);
    }

    useEffect(() => {
        axios.get(URL)
            .then(response => {
                setItems(response.data);
            })
            .catch(error => {
                console.error('エラー:', error);
            });
    }, [URL]);

    const [selectedCompany, setSelectedCompany] = useState(null);

    // 追加: items 読み込み後に最初の要素を選択する
    useEffect(() => {
        if (items && items.length > 0) {
            // 既に選択中でなければ最初を選ぶ
            setSelectedCompany(prev => (prev && prev.id) ? prev : items[0]);
        }
    }, [items]);

    // let selectedCompanyCard = null; // 現在選択されているカードを追跡
    // // --- チャットに追加ボタンのonClick例 ---
    // const handleAddChat = async () => {
    //     // 1. チャット開始API
    //     await axios.post("http://15.152.5.110:3030/user/user_chat/start", {
    //         user_id: user.id,
    //         Companies_id: selectedCompany.id
    //     });
    // 2. 企業一覧再取得（Testchat.jsx側で管理している場合は、
    //    追加後にTestchat.jsxの企業一覧取得useEffectが走るようにしてください）
    //    ここで直接setCompaniesする場合は、下記のように取得できます。
    //    const res = await axios.get("http://15.152.5.110:3030/user_chat/companies", {
    //        params: { user_id: user.id }
    //    });
    //    setCompanies(res.data.map(c => ({ id: c.id, name: c.name })));
    // 必要ならsetSelectedCompanyで新規追加企業を選択
    // setSelectedCompany({ id: selectedCompany.id, name: selectedCompany.name });
    // };

    // 選択した会社の詳細をサーバーから取得して selectedCompany にマージする
    useEffect(() => {
        const fetchDetail = async () => {
            if (!selectedCompany?.id) return;
            try {
                const res = await axios.get('http://15.152.5.110:3030/company/company_detail', { params: { company_id: selectedCompany.id } });
                const data = res.data || {};
                // マージして selectedCompany を更新（photo_2 / photo_3 等が含まれる想定）
                setSelectedCompany(prev => ({ ...(prev || {}), ...data }));
            } catch (e) {
                // 詳細ログを出す（response/request/message）
                if (e.response) {
                    console.error('company_detail 取得失敗: response', e.response.status, e.response.data);
                } else if (e.request) {
                    console.error('company_detail 取得失敗: no response, request sent', e.request);
                } else {
                    console.error('company_detail 取得失敗:', e.message);
                }
            }
        };
        fetchDetail();
    }, [selectedCompany?.id]);

    // ヘルパー: 配列 / JSON配列文字列 / 単一URL のいずれでも受け取り、先頭の画像URLを返す
    const pickFirstImage = (v) => {
        if (!v) return null;
        if (Array.isArray(v) && v.length > 0) return v[0];
        if (typeof v === 'string') {
            try {
                const parsed = JSON.parse(v);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
            } catch (e) {
                // JSONでなければそのまま文字列(URL)として扱う
                return v;
            }
        }
        return null;
    };

    // salary を 3桁区切りカンマ付きにフォーマットするヘルパー
    // - 数値または数値文字列を受け取り、整数部にカンマを挿入して返す
    // - 小数があれば小数点以下も維持する
    const formatSalary = (val) => {
        if (val === null || val === undefined || val === '') return '';
        // 数字以外（通貨記号やスペースなど）を除去
        const s = String(val).replace(/[^\d.-]/g, '');
        if (s === '' || s === '-' || s === '.') return '';
        const [intPart, dec] = s.split('.');
        const withComma = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return dec ? `${withComma}.${dec}` : withComma;
    };

    return (
        <>
            <HamburgerMenu />
            <div id="header_item" className="header-filters">
                <div className="dropdown-wrapper">
                    <select className="dropdown" name="prefecture" onChange={handleSearch}>
                        <option value="">地域</option>
                        <optgroup label="北海道・東北">
                            <option value="北海道">北海道</option>
                            <option value="青森県">青森県</option>
                            <option value="岩手県">岩手県</option>
                            <option value="宮城県">宮城県</option>
                            <option value="秋田県">秋田県</option>
                            <option value="山形県">山形県</option>
                            <option value="福島県">福島県</option>
                        </optgroup>
                        <optgroup label="関東">
                            <option value="東京都">東京都</option>
                            <option value="神奈川県">神奈川県</option>
                            <option value="千葉県">千葉県</option>
                            <option value="埼玉県">埼玉県</option>
                            <option value="茨城県">茨城県</option>
                            <option value="栃木県">栃木県</option>
                            <option value="群馬県">群馬県</option>
                        </optgroup>
                        <optgroup label="中部">
                            <option value="新潟県">新潟県</option>
                            <option value="富山県">富山県</option>
                            <option value="石川県">石川県</option>
                            <option value="福井県">福井県</option>
                            <option value="山梨県">山梨県</option>
                            <option value="長野県">長野県</option>
                            <option value="岐阜県">岐阜県</option>
                            <option value="静岡県">静岡県</option>
                            <option value="愛知県">愛知県</option>
                        </optgroup>
                        <optgroup label="近畿">
                            <option value="三重県">三重県</option>
                            <option value="滋賀県">滋賀県</option>
                            <option value="京都府">京都府</option>
                            <option value="大阪府">大阪府</option>
                            <option value="兵庫県">兵庫県</option>
                            <option value="奈良県">奈良県</option>
                            <option value="和歌山県">和歌山県</option>
                        </optgroup>
                        <optgroup label="中国">
                            <option value="鳥取県">鳥取県</option>
                            <option value="島根県">島根県</option>
                            <option value="岡山県">岡山県</option>
                            <option value="広島県">広島県</option>
                            <option value="山口県">山口県</option>
                        </optgroup>
                        <optgroup label="四国">
                            <option value="徳島県">徳島県</option>
                            <option value="香川県">香川県</option>
                            <option value="愛媛県">愛媛県</option>
                            <option value="高知県">高知県</option>
                        </optgroup>
                        <optgroup label="九州・沖縄">
                            <option value="福岡県">福岡県</option>
                            <option value="佐賀県">佐賀県</option>
                            <option value="長崎県">長崎県</option>
                            <option value="熊本県">熊本県</option>
                            <option value="大分県">大分県</option>
                            <option value="宮崎県">宮崎県</option>
                            <option value="鹿児島県">鹿児島県</option>
                            <option value="沖縄県">沖縄県</option>
                        </optgroup>
                    </select>
                </div>

                <div className="dropdown-wrapper">
                    <select className="dropdown" name="job" onChange={handleSearch}>
                        <option value="">職種</option>
                        <optgroup label="IT・エンジニア">
                            <option value="ソフトウェアエンジニア">ソフトウェアエンジニア</option>
                            <option value="Webエンジニア">Webエンジニア</option>
                            <option value="フロントエンドエンジニア">フロントエンドエンジニア</option>
                            <option value="バックエンドエンジニア">バックエンドエンジニア</option>
                            <option value="モバイルエンジニア">モバイルエンジニア</option>
                            <option value="インフラエンジニア">インフラエンジニア</option>
                            <option value="DevOpsエンジニア">DevOpsエンジニア</option>
                            <option value="データエンジニア">データエンジニア</option>
                            <option value="AI・機械学習エンジニア">AI・機械学習エンジニア</option>
                            <option value="セキュリティエンジニア">セキュリティエンジニア</option>
                            <option value="システムエンジニア">システムエンジニア</option>
                            <option value="ネットワークエンジニア">ネットワークエンジニア</option>
                        </optgroup>
                        <optgroup label="デザイン・クリエイティブ">
                            <option value="UI/UXデザイナー">UI/UXデザイナー</option>
                            <option value="Webデザイナー">Webデザイナー</option>
                            <option value="グラフィックデザイナー">グラフィックデザイナー</option>
                            <option value="プロダクトデザイナー">プロダクトデザイナー</option>
                            <option value="動画クリエイター">動画クリエイター</option>
                            <option value="3Dデザイナー">3Dデザイナー</option>
                            <option value="ゲームデザイナー">ゲームデザイナー</option>
                        </optgroup>
                        <optgroup label="営業・セールス">
                            <option value="営業">営業</option>
                            <option value="インサイドセールス">インサイドセールス</option>
                            <option value="フィールドセールス">フィールドセールス</option>
                            <option value="営業マネージャー">営業マネージャー</option>
                            <option value="アカウントマネージャー">アカウントマネージャー</option>
                            <option value="事業開発">事業開発</option>
                        </optgroup>
                        <optgroup label="マーケティング">
                            <option value="デジタルマーケター">デジタルマーケター</option>
                            <option value="コンテンツマーケター">コンテンツマーケター</option>
                            <option value="SEOスペシャリスト">SEOスペシャリスト</option>
                            <option value="SNSマーケター">SNSマーケター</option>
                            <option value="グロースハッカー">グロースハッカー</option>
                            <option value="マーケティングマネージャー">マーケティングマネージャー</option>
                        </optgroup>
                        <optgroup label="企画・プロダクト">
                            <option value="プロダクトマネージャー">プロダクトマネージャー</option>
                            <option value="プロジェクトマネージャー">プロジェクトマネージャー</option>
                            <option value="ビジネスアナリスト">ビジネスアナリスト</option>
                            <option value="プロダクトオーナー">プロダクトオーナー</option>
                            <option value="戦略企画">戦略企画</option>
                        </optgroup>
                        <optgroup label="管理・事務">
                            <option value="総務">総務</option>
                            <option value="人事">人事</option>
                            <option value="経理・会計">経理・会計</option>
                            <option value="財務">財務</option>
                            <option value="法務">法務</option>
                            <option value="事務・アシスタント">事務・アシスタント</option>
                            <option value="秘書">秘書</option>
                        </optgroup>
                        <optgroup label="カスタマーサポート">
                            <option value="カスタマーサポート">カスタマーサポート</option>
                            <option value="カスタマーサクセス">カスタマーサクセス</option>
                            <option value="テクニカルサポート">テクニカルサポート</option>
                            <option value="コールセンター">コールセンター</option>
                        </optgroup>
                        <optgroup label="製造・技術">
                            <option value="製造">製造</option>
                            <option value="品質管理">品質管理</option>
                            <option value="研究開発">研究開発</option>
                            <option value="生産管理">生産管理</option>
                            <option value="機械エンジニア">機械エンジニア</option>
                        </optgroup>
                        <optgroup label="サービス・接客">
                            <option value="販売・接客">販売・接客</option>
                            <option value="飲食サービス">飲食サービス</option>
                            <option value="ホテル・宿泊">ホテル・宿泊</option>
                            <option value="美容・エステ">美容・エステ</option>
                            <option value="医療・介護">医療・介護</option>
                        </optgroup>
                        <optgroup label="その他">
                            <option value="コンサルタント">コンサルタント</option>
                            <option value="翻訳・通訳">翻訳・通訳</option>
                            <option value="ライター・編集">ライター・編集</option>
                            <option value="講師・インストラクター">講師・インストラクター</option>
                            <option value="ドライバー・配送">ドライバー・配送</option>
                            <option value="その他">その他</option>
                        </optgroup>
                    </select>
                </div>

                <div className="dropdown-wrapper">
                    <select className="dropdown" name="employee_size" onChange={handleSearch}>
                        <option value="">従業員規模</option>
                        <option value="1-9">1〜9名</option>
                        <option value="10-49">10〜49名</option>
                        <option value="50-99">50〜99名</option>
                        <option value="100-299">100〜299名</option>
                        <option value="300-999">300〜999名</option>
                        <option value="1000-1000000000000000000">1000名以上</option>
                    </select>
                </div>

                <div className="dropdown-wrapper">
                    <select className="dropdown" name="salary" onChange={handleSearch}>
                        <option value="">給与</option>
                        <option value="350000">月給 35万円以上</option>
                        <option value="400000">月給 40万円以上</option>
                        <option value="450000">月給 45万円以上</option>
                        <option value="500000">月給 50万円以上</option>
                        <option value="550000">月給 55万円以上</option>
                        <option value="600000">月給 60万円以上</option>
                        <option value="700000">月給 70万円以上</option>
                        <option value="800000">月給 80万円以上</option>
                        <option value="900000">月給 90万円以上</option>
                        <option value="1000000">月給 100万円以上</option>
                    </select>
                </div>

                <div style={{ marginLeft: "auto" }}>
                    <div className="search-form">
                        <label>
                            <input type="text" placeholder="キーワードを入力" />
                        </label>
                        <button type="button" onClick={handleSearch}>検索</button>
                    </div>
                </div>
            </div>
            <div id="myMain">
                <div className="container">
                    <div className="content">
                        <div className="left-panel">
                            {items.map((company) => (
                                <div
                                    key={company.id}
                                    className={`company-card ${selectedCompany?.id === company.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedCompany(company)}
                                >
                                    <div className="text-content">
                                        <span className="label">企業名</span>{company.c_name}
                                    </div>
                                    <div className="text-content">
                                        <span className="label">所在地</span>{company.location}
                                    </div>
                                    <div className="text-content">
                                        <span className="label">概要</span>{company.company_detail_description}...
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='right-panel'>
                            {selectedCompany ? (
                                <div className="company-detail-card">
                                    {/* ここに赤文字ボタンを追加 */}
                                    <div style={{ margin: "16px 0" }}>
                                        <button
                                            style={{
                                                color: "red",
                                                background: "none",
                                                border: "none",
                                                fontWeight: "bold",
                                                fontSize: "1.1em",
                                                cursor: "pointer"
                                            }}
                                            onClick={async () => {
                                                try {
                                                    // ユーザー情報取得
                                                    const userRes = await axios.get("http://15.152.5.110:3030/log/whoami", { withCredentials: true });
                                                    if (!userRes.data.loggedIn) {
                                                        alert("ログインしてください");
                                                        return;
                                                    }
                                                    const user = userRes.data.user;

                                                    // 既存チャット企業を取得
                                                    const companiesRes = await axios.get("http://15.152.5.110:3030/user/user_chat/companies", {
                                                        params: { user_id: user.id },
                                                    });
                                                    const existingCompanies = companiesRes.data.map(c => c.id);

                                                    if (existingCompanies.includes(selectedCompany.id)) {
                                                        alert("この企業は既に追加されています");
                                                        return;
                                                    }
                                                    
                                                    // チャット追加API呼び出し
                                                    await axios.post('http://15.152.5.110:3030/user/user_chat/start', {
                                                        user_id: user.id,
                                                        Companies_id: selectedCompany.id,
                                                        // message_text: ''  // 初期メッセージ（空でもOK）
                                                    });
                                                    alert("チャットに追加しました");
                                                } catch (e) {
                                                    alert("追加に失敗しました");
                                                }
                                            }}
                                        >
                                            チャットに追加
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // company 全体を state に入れて遷移（id と state を両方送る）
                                                console.log(selectedCompany);

                                                navigate(`/apply/${selectedCompany.id}`, { state: { company: selectedCompany } });
                                            }}
                                            style={{
                                                background: '#007bff',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '8px 12px',
                                                borderRadius: 4,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            応募する
                                        </button>
                                    </div>
                                    {/* ヘッダー部分 */}
                                    <div className="company-header">
                                        <div className="company-header-content">
                                            <div className="company-logo">
                                                {selectedCompany.logo ? (
                                                    <img src={selectedCompany.logo} alt={`${selectedCompany.name} ロゴ`} />
                                                ) : (
                                                    'ロゴ'
                                                )}
                                            </div>
                                            <div className="company-title">
                                                <h1 className="company-name">{selectedCompany.name}</h1>
                                                <p className="company-industry">IT・ソフトウェア</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* メインコンテンツ */}
                                    <div className="company-content">
                                        {/* 基本情報セクション */}
                                        <div className="company-section">
                                            <h3 className="section-title">会社情報</h3>
                                            <div className="detail-grid">
                                                <div className="detail-label">会社名</div>
                                                <div className="detail-value">{selectedCompany.c_name}</div>

                                                <div className="detail-label">所在地</div>
                                                <div className="detail-value">{selectedCompany.location}</div>

                                                <div className="detail-label">設立年</div>
                                                <div className="detail-value">{selectedCompany.founded_year}年</div>

                                                <div className="detail-label">資本金</div>
                                                <div className="detail-value">{selectedCompany.founded_year}万円</div>

                                                <div className="detail-label">従業員数</div>
                                                <div className="detail-value">{selectedCompany.employee_count}名</div>

                                                <div className="detail-label">事業内容</div>
                                                <div className="detail-value">{selectedCompany.company_detail_description}</div>

                                                <div className="detail-label">ホームページURL</div>
                                                <div className="detail-value">
                                                    <a href="https://example.com" target="_blank" rel="noopener noreferrer">
                                                        https://example.com
                                                    </a>
                                                </div>
                                            </div>
                                        </div>



                                        {/* 募集内容セクション */}
                                        <div className="company-section">
                                            <h3 className="section-title">募集内容</h3>
                                            <div className="detail-grid">
                                                <div className="detail-label">募集職種</div>
                                                <div className="detail-value">{selectedCompany.title}</div>

                                                <div className="detail-label">仕事内容</div>
                                                <div className="detail-value">
                                                    {selectedCompany.JobDescription}
                                                </div>

                                                <div className="detail-label">雇用形態</div>
                                                <div className="detail-value">{selectedCompany.employment_type}</div>
                                                <div className="detail-label">募集人数</div>
                                                <div className="detail-value">{selectedCompany.number_of_hires}</div>
                                            </div>
                                        </div>

                                        {/* 応募資格セクション */}
                                        <div className="company-section">
                                            <h3 className="section_title">応募資格</h3>
                                            <div className="detail-grid">
                                                <div className="detail-label">必須スキル・経験</div>
                                                <div className="detail-value">
                                                    {selectedCompany.required_skills}<br />
                                                    {/* • JavaScript, HTML, CSSの基本知識<br />
                                                    • チーム開発の経験 */}
                                                </div>

                                                <div className="detail-label">歓迎スキル・経験</div>
                                                <div className="detail-value">
                                                    {selectedCompany.preferred_skills}
                                                </div>

                                                <div className="detail-label">学歴・年齢制限</div>
                                                <div className="detail-value">{selectedCompany.education_age_requirements}</div>
                                            </div>
                                        </div>

                                        {/* 勤務条件セクション */}
                                        <div className="company-section">
                                            <h3 className="section_title">勤務条件</h3>
                                            <div className="detail-grid">
                                                <div className="detail-label">勤務地</div>
                                                <div className="detail-value">
                                                    {selectedCompany.work_location}<br />
                                                </div>

                                                <div className="detail-label">勤務時間</div>
                                                <div className="detail-value">
                                                    {selectedCompany.work_hours}
                                                    フレックスタイム制あり（コアタイム：10:00～15:00）
                                                </div>

                                                <div className="detail-label">残業</div>
                                                <div className="detail-value">{selectedCompany.overtime_info}</div>

                                                <div className="detail-label">休日・休暇</div>
                                                <div className="detail-value">
                                                    {selectedCompany.holidays}<br />
                                                </div>
                                            </div>
                                        </div>

                                        {/* 給与・待遇セクション */}
                                        <div className="company-section">
                                            <h3 className="section_title">給与・待遇</h3>
                                            <div className="detail-grid">
                                                <div className="detail-label">給与額</div>
                                                <div className="detail-value">
                                                    月額{formatSalary(selectedCompany.salary)}～{formatSalary(selectedCompany.salary_max)}円<br />
                                                </div>

                                                <div className="detail-label">昇給・賞与</div>
                                                <div className="detail-value">
                                                    {selectedCompany.bonus_info}<br />
                                                </div>

                                                <div className="detail-label">交通費</div>
                                                <div className="detail-value">{selectedCompany.transportation}</div>

                                                <div className="detail-label">各種手当</div>
                                                <div className="detail-value">
                                                    {selectedCompany.transportation}
                                                </div>

                                                <div className="detail-label">試用期間</div>
                                                <div className="detail-value">{selectedCompany.trial_period_conditions}</div>
                                            </div>
                                        </div>

                                        {/* 福利厚生セクション */}
                                        <div className="company-section">
                                            <h3 className="section_title">福利厚生</h3>
                                            <div className="detail-grid">
                                                <div className="detail-label">社会保険</div>
                                                <div className="detail-value">
                                                    {selectedCompany.insurance}
                                                </div>

                                                <div className="detail-label">福利厚生制度</div>
                                                <div className="detail-value">
                                                    {selectedCompany.benefits_system}
                                                </div>

                                                <div className="detail-label">研修制度</div>
                                                <div className="detail-value">
                                                    {selectedCompany.training_details}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 選考情報セクション */}
                                        <div className="company-section">
                                            <h3 className="section_title">選考情報</h3>
                                            <div className="detail-grid">
                                                <div className="detail-label">応募方法</div>
                                                <div className="detail-value">
                                                    {selectedCompany.application_method}
                                                </div>

                                                <div className="detail-label">選考フロー</div>
                                                <div className="detail-value">
                                                    {selectedCompany.selection_flow}
                                                </div>

                                                <div className="detail-label">面接地</div>
                                                <div className="detail-value">
                                                    本社オフィス（{selectedCompany.location}）<br />
                                                    ※オンライン面接も可能
                                                </div>
                                            </div>
                                        </div>

                                        {/* 会社写真セクション */}
                                        <div className="company-section company-photos">
                                            <h3 className="section_title">会社写真</h3>
                                            <div className="photo-grid">
                                                <div className="company-photo">
                                                    {(() => {
                                                        const src = pickFirstImage(selectedCompany.photo) || null;
                                                        return src ? (
                                                            <img src={src} alt={`${selectedCompany.name} オフィス外観`} />
                                                        ) : (
                                                            'オフィス外観'
                                                        );
                                                    })()}
                                                </div>

                                                <div className="company-photo">
                                                    {(() => {
                                                        // CompanyDetails テーブルでは photo_2 を社内風景に使うことがある
                                                        const src = pickFirstImage(selectedCompany.photo_2) || pickFirstImage(selectedCompany.officescenes) || null;
                                                        return src ? (
                                                            <img src={src} alt={`${selectedCompany.name} 社内風景`} />
                                                        ) : (
                                                            '社内風景'
                                                        );
                                                    })()}
                                                </div>

                                                <div className="company-photo">
                                                    {(() => {
                                                        // CompanyDetails テーブルでは photo_3 を作業環境に使うことがある
                                                        const src = pickFirstImage(selectedCompany.photo_3) || pickFirstImage(selectedCompany.workspace) || null;
                                                        return src ? (
                                                            <img src={src} alt={`${selectedCompany.name} 作業環境`} />
                                                        ) : (
                                                            '作業環境'
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* マップセクション */}
                                        <div className="company-section company-map-section">
                                            <h3 className="section_title">アクセス</h3>
                                            <div className="map-container">
                                                <Map work_location={selectedCompany.work_location} />
                                            </div>

                                            <div className="address-info">
                                                <div className="detail-label">住所</div>
                                                <div className="detail-value">{selectedCompany.location}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="company-detail-card">
                                    <div className="company-content">
                                        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1em', padding: '40px' }}>
                                            左側の企業リストから企業を選択してください
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};
