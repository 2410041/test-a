// mypage
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Mypage.css';
import HamburgerMenu from '../../components/HamburgerMenu/HamburgerMenu';
import Tabnav from '../../components/Pr/tabNav/TabNav';
import Chart from 'chart.js/auto'; // ← 追加（レーダーチャート用）
// 各性格タイプの画像
import Image from '../Mytype/Logical.png';
import Image2 from '../Mytype/Organized.png';
import Image3 from '../Mytype/Friendly.png';
import Image4 from '../Mytype/Creative.png';
import Image5 from '../Mytype/Competitive.png';

function Mypage({ viewUser = null }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scores, setScores] = useState(null); // ← 追加（性格スコア）
    // 追加: DBから取得したチャートデータを保存するstate（誰が見ても分かる）
    const [chartRow, setChartRow] = useState(null);     // DBの生データ行を保持する（chart_title/chart_text 等）
    const [chartScores, setChartScores] = useState(null); // chart_score を配列化したもの（ある場合）
    const [chartText, setChartText] = useState(null);     // chart_text（説明文）
    const navigate = useNavigate(); // ルーティング操作

    // チャート描画部分は不要なので useRef も削除
    const [personalityType, setPersonalityType] = useState(null); // ← 追加（性格タイプ）
    const [loadingChart, setLoadingChart] = useState(true); // データ取得中フラグ

    // 追加: 資格・スキルのマッチング結果を保持するstate
    const [skillMatches, setSkillMatches] = useState([]);
    // 追加: スキル情報取得中かどうかのフラグ
    const [loadingSkills, setLoadingSkills] = useState(false);
    // 追加: スキル取得に関するエラーメッセージ
    const [skillError, setSkillError] = useState(null);

    const [compareCompany, setCompareCompany] = useState('');

    // 追加: Company画面で選択した求人IDを比較対象にする（localStorageから取得）
    const [compareJobOfferId, setCompareJobOfferId] = useState(null);

    // 各カテゴリごとの詳細情報
    const typeDescriptions = {
        Logical: {
            name: "論理的・理性的タイプ",
            strengths: ["分析力が高い", "冷静に判断できる", "説得力がある"],
            weaknesses: ["感情面に疎く見られがち", "柔軟性に欠けることがある"],
            suitableJobs: ["エンジニア", "研究職", "コンサルタント"],
            relationships: "相手の感情に注意を向けると良好な関係が築けます。",
        },
        Organized: {
            name: "計画的・堅実的タイプ",
            strengths: ["努力家", "信頼されやすい", "安定志向"],
            weaknesses: ["柔軟な対応が苦手", "変化に不安を感じやすい"],
            suitableJobs: ["経理職", "事務職", "プロジェクトマネージャー"],
            relationships: "相手を安心させる穏やかな関係を築けます。",
        },
        Friendly: {
            name: "交友的・感覚的タイプ",
            strengths: ["社交的", "共感力が高い", "チームプレイヤー"],
            weaknesses: ["他人に流されやすい", "自分の意見を言えないことがある"],
            suitableJobs: ["販売職", "カウンセラー", "人事職"],
            relationships: "相手の気持ちに寄り添える優しいパートナーです。",
        },
        Creative: {
            name: "冒険的・独創的タイプ",
            strengths: ["発想が豊か", "柔軟な思考", "行動力がある"],
            weaknesses: ["飽きっぽい", "継続が苦手"],
            suitableJobs: ["デザイナー", "企画職", "起業家"],
            relationships: "刺激的で楽しい関係を築きますが、自由を尊重することが大切です。",
        },
        Competitive: {
            name: "競争的・達成志向タイプ",
            strengths: ["目標達成力が高い", "リーダーシップがある", "粘り強い"],
            weaknesses: ["負けず嫌いが強すぎる", "人を競争相手と見やすい"],
            suitableJobs: ["営業職", "経営者", "スポーツ選手"],
            relationships: "お互いを高め合える関係が理想的です。",
        },
    };

    // DBからタイプを取得
    useEffect(() => {
        if (!user?.id) return;

        const fetchPersonality = async () => {
            try {
                // 変更: サーバー側の /chart/:userId に合わせて取得（返り値は配列 row を想定）
                const res = await axios.get(`http://localhost:3030/chart/chart/${user.id}`, { withCredentials: true });
                console.log('[Mypage] chart GET response:', res.data);

                // 安全に rows を取り出す
                const rows = Array.isArray(res.data) ? res.data : (res.data && res.data.data ? res.data.data : [res.data]);
                const item = rows && rows.length ? rows[0] : null;
                if (!item) {
                    setChartRow(null);
                    setChartScores(null);
                    setChartText(null);
                    setPersonalityType(null);
                    return;
                }

                // 生データを保存（誰が見ても分かる変数名の保存）
                setChartRow(item);

                // chart_text は説明文として保存
                if (item.chart_text) setChartText(item.chart_text);

                // chart_score を配列として安全に取り出す（JSON 文字列 / 配列 / CSV に対応）
                let parsedScores = null;
                if (item.chart_score !== undefined && item.chart_score !== null) {
                    if (Array.isArray(item.chart_score)) {
                        parsedScores = item.chart_score;
                    } else if (typeof item.chart_score === 'string') {
                        const s = item.chart_score.trim();
                        try {
                            if (s.startsWith('[') || s.startsWith('{')) {
                                const p = JSON.parse(s);
                                if (Array.isArray(p)) parsedScores = p;
                            } else if (/^[\d\.\s,]+$/.test(s)) {
                                parsedScores = s.split(',').map(x => Number(x.trim())).map(n => Number.isFinite(n) ? n : 0);
                            }
                        } catch (e) {
                            console.warn('[Mypage] chart_score parse failed:', e);
                        }
                    } else if (typeof item.chart_score === 'number') {
                        // 単一数値だった場合はカテゴリ数に応じて等分する等のフォールバックも可能（ここでは null にする）
                        parsedScores = null;
                    }
                }
                setChartScores(Array.isArray(parsedScores) ? parsedScores : null);

                // chart_title があればタイプ名として保存（必要なら使う）
                if (item.chart_title) setPersonalityType(item.chart_title);
            } catch (err) {
                console.error("チャートデータ取得エラー:", err);
            } finally {
                setLoadingChart(false);
            }
        };

        fetchPersonality();
    }, [user]);

    useEffect(() => {
        // If a viewUser prop is provided, show that user's page instead of whoami.
        if (viewUser) {
            // Normalize field names that Mypage expects (u_nick etc.)
            setUser(viewUser);
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:3030/log/whoami", {
                    withCredentials: true
                });
                if (res.data.loggedIn) {
                    setUser(res.data.user);
                    console.log("ユーザー情報:", res.data);
                } else {
                    // 未ログインならログインページにリダイレクト
                    navigate("/login");
                }
            } catch (err) {
                console.error("ユーザー情報取得エラー:", err);
                navigate("/login"); // エラー時もログイン画面へ
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [navigate, viewUser]);

    // 追加: 企業詳細(Company.jsx)で選択した求人IDを受け取る
    useEffect(() => {
        const stored = localStorage.getItem('compareJobOfferId');
        if (stored) {
            const n = Number(stored);
            setCompareJobOfferId(Number.isFinite(n) ? n : stored);
        }
    }, []);

    // チャート描画
    useEffect(() => {
        if (!user?.id) return;
        axios.get(`http://localhost:3030/chart/chart/${user.id}`)
            .then(res => {
                const chartData = Array.isArray(res.data) && res.data.length > 0 ? res.data[0].chart_text : null;
                console.log("チャートデータ取得成功:", chartData);
                // ここでチャートデータを状態に保存したり、表示に使ったりできます
            })
            .catch(err => {
                console.error("チャートデータ取得エラー:", err);
            });
    }, [user]);

    // 追加: skillMaster / userSkill / companySkill を使ったスキルマッチング結果を取得
    useEffect(() => {
        if (!user?.id) return;

        // Company.jsx側で localStorage に保存した compareJobOfferId を優先して使う
        const jobOfferId = compareJobOfferId;

        // 比較対象が無ければ何もしない（マイページ単体表示時にエラーを出さない）
        if (!jobOfferId) return;

        const fetchSkillMatches = async () => {
            // 追加: API呼び出し前にローディング状態とエラーを初期化
            setLoadingSkills(true);
            setSkillError(null);

            try {
                const res = await axios.get(
                    "http://localhost:3030/mypage/skillMatch", {
                    params: {
                        userId: user.id,
                        jobOfferId: 4,
                    },
                    withCredentials: true,
                });

                console.log("スキルマッチングAPIレスポンス:", res.data);

                // 比較企業名
                setCompareCompany(res.data.companyName || '');

                // スキル配列（防御）
                const rows = Array.isArray(res.data?.skills)
                    ? res.data.skills
                    : [];

                setSkillMatches(rows);

            } catch (err) {
                console.error("スキルマッチング取得エラー:", err);
                setSkillError("スキル情報の取得に失敗しました。");
                setSkillMatches([]);
                setCompareCompany('');
            } finally {
                setLoadingSkills(false);
            }
        };

        fetchSkillMatches();
    }, [user, compareJobOfferId]);

    // このページのみスクロール禁止（マウント時に body にクラス追加、アンマウント時に削除）
    useEffect(() => {
        document.body.classList.add('no-scroll');
        document.getElementById('root')?.classList.add('no-scroll');
        return () => {
            document.body.classList.remove('no-scroll');
            document.getElementById('root')?.classList.remove('no-scroll');
        };
    }, []);

    if (loading) {
        return <div>読み込み中...</div>;
    }

    return (
        <div className="mypage-root">
            <HamburgerMenu />
            <div className='main_dai'><strong>マイページ</strong></div>

            {/* プロフィールカード */}
            <div className='my_card_around'>
                <div className="my_card my_profile_card">
                    <div className="my_icon">
                        <img src="./images/gyo.JPG" alt="" className="my_img" />
                        <table className="my_table">
                            <tbody>
                                <tr><td className="my_nic">ニックネーム</td></tr>
                                <tr>
                                    <td className="my_user_name">
                                        {user?.u_nick}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <strong className='mytype'>自己分析結果</strong>
                    <div className='container4'>
                        {loadingChart ? (
                            <p>読み込み中...</p>
                        ) : personalityType ? (
                            <div className={`mypage-type-result ${personalityType ? personalityType.toLowerCase() : ''}`}>
                                <h2>{personalityType}</h2>
                                <h3>{typeDescriptions[personalityType].name}</h3>
                                <h4>長所</h4>
                                <ul>
                                    {typeDescriptions[personalityType].strengths.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                                <h4>短所</h4>
                                <ul>
                                    {typeDescriptions[personalityType].weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                </ul>
                                <h4>向いている仕事</h4>
                                <ul>
                                    {typeDescriptions[personalityType].suitableJobs.map((j, i) => <li key={i}>{j}</li>)}
                                </ul>
                                <h4>人間関係の傾向</h4>
                                <p>{typeDescriptions[personalityType].relationships}</p>
                            </div>
                        ) : (
                            <p>まだ診断結果がありません。</p>
                        )}
                    </div>

                </div>

                {/* 資格カード */}
                <div className="my_card my_qualification_card">
                    <h2 className="my_qu_title">
                        資格・スキル
                        {compareCompany && (
                            <span className="compare-company">
                                （{compareCompany}）
                            </span>
                        )}
                    </h2>

                    {/* 追加: スキルマッチング結果の状態に応じて表示を切り替え */}
                    {loadingSkills ? (
                        <p className="my_qu_loading">スキル情報を読み込み中です...</p>
                    ) : skillError ? (
                        <p className="my_qu_error">{skillError}</p>
                    ) : skillMatches && skillMatches.length > 0 ? (
                        <ul className="my_qu_ul">
                            {skillMatches.flatMap((item, index) =>
                                String(item.skillName || '')
                                    .split(',')
                                    .map((skill, i) => skill.trim())
                                    .filter(Boolean)
                                    .map((skill, i) => (
                                        <li key={`${index}-${i}`}>
                                            <span className={item.matched ? "skill-ok" : "skill-ng"}>
                                                {item.matched ? "✔" : "✖"}
                                            </span>
                                            {" "}
                                            {skill}
                                        </li>
                                    ))
                            )}
                        </ul>
                    ) : (
                        <ul className="my_qu_ul">
                            {/* 追加: マッチング結果がまだない場合は従来の固定資格を表示 */}
                            <li>TOEIC 800</li>
                            <li>基本情報技術者</li>
                            <li>日商簿記2級</li>
                        </ul>
                    )}
                </div>

                {/* タブカード */}
                <div className="my_card my_tab_card">
                    <Tabnav user={user} />
                </div>
            </div>
        </div>
    );
}

export default Mypage;
