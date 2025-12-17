// React本体と必要なフックをインポート
import React, { useState, useEffect, useRef } from "react";
// レーダーチャート描画用ライブラリ
import Chart from "chart.js/auto";
// スタイルシート
import "./Mytype.css";
// ハンバーガーメニューコンポーネント
import HamburgerMenu from "../../components/HamburgerMenu/HamburgerMenu";
// 各性格タイプの画像
import Image from './Logical.png';
import Image2 from './Organized.png';
import Image3 from './Friendly.png';
import Image4 from './Creative.png';
import Image5 from './Competitive.png';
// API通信用
import axios from "axios";



// 性格診断テストのメインコンポーネント


export default function Mytype() {

    // ユーザー情報取得用
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    // 性格カテゴリ一覧
    const categories = ['Logical', 'Organized', 'Friendly', 'Creative', 'Competitive'];
    // 各カテゴリの初期スコア（全て0）
    const initialScores = Object.fromEntries(categories.map(cat => [cat, 0]));
    // 各カテゴリのスコアを管理
    const [scores, setScores] = useState(initialScores);
    // 現在の質問番号
    const [currentQuestion, setCurrentQuestion] = useState(0);
    // 回答履歴（戻るボタン用）
    const [answerHistory, setAnswerHistory] = useState([]);
    // 結果チャート表示フラグ
    const [showChart, setShowChart] = useState(false);
    // チャート描画用のcanvas参照
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    // 診断テストの全質問
    const questions = [
        // Logical（論理的・理性的）
        { text: "判断の際は感情よりもデータや事実を重視する。", category: "Logical" },
        { text: "問題を分析してから行動する。", category: "Logical" },
        { text: "論理的な議論が得意だ。", category: "Logical" },
        { text: "感情的な判断をすることが多い。", category: "Logical", reverse: true },
        { text: "客観的に物事を見られる。", category: "Logical" },

        // Organized（計画的・堅実的）
        { text: "計画を立てて行動するのが好きだ。", category: "Organized" },
        { text: "スケジュール管理は得意なほうだ。", category: "Organized" },
        { text: "予定変更はあまり好きではない。", category: "Organized" },
        { text: "行き当たりばったりで動くことが多い。", category: "Organized", reverse: true },
        { text: "効率的に作業を進めることを意識している。", category: "Organized" },

        // Friendly（交友的・感覚的）
        { text: "初対面の人ともすぐに打ち解けられる。", category: "Friendly" },
        { text: "人の話を聞くのが好きだ。", category: "Friendly" },
        { text: "チームで働くのが好きだ。", category: "Friendly" },
        { text: "一人で行動するのが好きだ。", category: "Friendly", reverse: true },
        { text: "人に喜んでもらうと嬉しい。", category: "Friendly" },

        // Creative（冒険的・独創的）
        { text: "新しいアイデアを考えるのが好きだ。", category: "Creative" },
        { text: "ルールよりも柔軟性を大切にする。", category: "Creative" },
        { text: "新しい挑戦にワクワクする。", category: "Creative" },
        { text: "冒険よりも安全を選ぶことが多い。", category: "Creative", reverse: true },
        { text: "直感的にひらめくことが多い。", category: "Creative" },

        // Competitive（競争的・達成志向的）
        { text: "高い目標を設定するのが好きだ。", category: "Competitive" },
        { text: "勝負ごとに燃えるタイプだ。", category: "Competitive" },
        { text: "競うよりも協力したい。", category: "Competitive", reverse: true },
        { text: "達成感がモチベーションになる。", category: "Competitive" },
        { text: "ライバルがいるとやる気が出る。", category: "Competitive" }

    ];

    // 各質問ごとの重み（同じ回答をしてもカテゴリ間で差が出るようにするため）
    // deterministic に重みを生成。必要なら個別調整も可能。
    const questionWeights = questions.map((_, i) => {
        // ベース 0.9 〜 1.3 の範囲で、質問位置とカテゴリで差をつける
        const withinCategory = i % 5; // 0..4
        const categoryIndex = Math.floor(i / 5); // 0..4
        return 0.9 + withinCategory * 0.08 + categoryIndex * 0.02;
    });

    // カテゴリごとの性格タイプ説明
    const personalityDescriptions = {
        Logical: "あなたは論理的で理性的な思考を大切にするタイプです。物事を客観的に分析し、感情に左右されずに判断できます。",
        Organized: "あなたは計画的で堅実なタイプです。ルールやスケジュールを守り、着実に目標に向かって進むことが得意です。",
        Friendly: "あなたは交友的で感覚的なタイプです。人とのつながりや共感を大切にし、周囲と調和を図ることが得意です。",
        Creative: "あなたは冒険的で独創的なタイプです。新しいことへの挑戦や自由な発想を楽しみ、自分らしさを大切にします。",
        Competitive: "あなたは競争心が強く、達成志向の高いタイプです。目標を定め、努力して結果を出すことにやりがいを感じます。"
    };

    // ここに下記を追加します
    const typeDescriptions = {
        Logical: {
            name: "論理的・理性的タイプ",
            color: "blue",
            strengths: ["分析力が高い", "冷静に判断できる", "説得力がある"],
            weaknesses: ["感情面に疎く見られがち", "柔軟性に欠けることがある"],
            suitableJobs: ["エンジニア", "研究職", "コンサルタント"],
            relationships: "相手の感情に注意を向けると良好な関係が築けます。",
        },
        Organized: {
            name: "計画的・堅実的タイプ",
            color: "green",
            strengths: ["努力家", "信頼されやすい", "安定志向"],
            weaknesses: ["柔軟な対応が苦手", "変化に不安を感じやすい"],
            suitableJobs: ["経理職", "事務職", "プロジェクトマネージャー"],
            relationships: "相手を安心させる穏やかな関係を築けます。",
        },
        Friendly: {
            name: "交友的・感覚的タイプ",
            color: "orange",
            strengths: ["社交的", "共感力が高い", "チームプレイヤー"],
            weaknesses: ["他人に流されやすい", "自分の意見を言えないことがある"],
            suitableJobs: ["販売職", "カウンセラー", "人事職"],
            relationships: "相手の気持ちに寄り添える優しいパートナーです。",
        },
        Creative: {
            name: "冒険的・独創的タイプ",
            color: "purple",
            strengths: ["発想が豊か", "柔軟な思考", "行動力がある"],
            weaknesses: ["飽きっぽい", "継続が苦手"],
            suitableJobs: ["デザイナー", "企画職", "起業家"],
            relationships: "刺激的で楽しい関係を築きますが、自由を尊重することが大切です。",
        },
        Competitive: {
            name: "競争的・達成志向タイプ",
            color: "red",
            strengths: ["目標達成力が高い", "リーダーシップがある", "粘り強い"],
            weaknesses: ["負けず嫌いが強すぎる", "人を競争相手と見やすい"],
            suitableJobs: ["営業職", "経営者", "スポーツ選手"],
            relationships: "お互いを高め合える関係が理想的です。",
        },
    };

    // 各カテゴリごとの画像
    const personalityImages = {
        Logical: Image,
        Organized: Image2,
        Friendly: Image3,
        Creative: Image4,
        Competitive: Image5
    };

    // 各カテゴリごとの色（クラス名）
    const personalityColors = {
        Logical: 'logical',
        Organized: 'organized',
        Friendly: 'friendly',
        Creative: 'creative',
        Competitive: 'competitive'
    }

    // 最もスコアが高いカテゴリを求める
    // スコアが最も高かったカテゴリを1つ取得
    const getTopPersonality = () => {
        let topCategory = null;
        let maxScore = -1;
        for (const category in scores) {
            if (scores[category] > maxScore) {
                maxScore = scores[category];
                topCategory = category;
            }
        }
        return topCategory;
    };

    const topPersonality = getTopPersonality();
    const topDetail = typeDescriptions[topPersonality] || null;



    // 回答ボタン押下時の処理
    // value: 1〜5のスコア
    const handleAnswer = (value) => {
        const question = questions[currentQuestion];
        const scoreValue = question.reverse ? 6 - value : value;
        // 重みを乗算して保存（整数で管理するため丸める）
        const weight = questionWeights[currentQuestion] ?? 1;
        const weighted = Math.round(scoreValue * weight);
        setScores((prev) => {
            const updated = { ...prev, [question.category]: prev[question.category] + weighted };
            return updated;
        });
        setAnswerHistory((prev) => [...prev, { category: question.category, value: scoreValue }]);
        setCurrentQuestion((prev) => {
            const next = prev + 1;
            if (next < questions.length) return next;
            setShowChart(true);
            return prev;
        });
    };


    // 戻るボタン押下時の処理
    const handleBack = () => {
        setAnswerHistory((prevHistory) => {
            if (prevHistory.length === 0) return prevHistory;
            const last = prevHistory[prevHistory.length - 1];
            setScores((prevScores) => ({ ...prevScores, [last.category]: prevScores[last.category] - last.value }));
            setCurrentQuestion((prevQ) => Math.max(prevQ - 1, 0));
            return prevHistory.slice(0, -1);
        });
    };


    // チャート表示時にレーダーチャートを描画
    useEffect(() => {
        // デバッグ用ログ
        // console.log("mytypeの中身" + categories.map(c => scores[c]));
        let tmp = categories.map(c => scores[c]);
        console.log(tmp[0]);
        // let hoge = tmp.split(',');
        // console.log(hoge[0]);

        // tmp = categories.map(c => scores[c]);
        // console.log(tmp);
        // showChartがtrueかつcanvasが存在する場合のみ描画
        if (showChart && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            new Chart(ctx, {
                type: 'radar',
                data: {
                    // 各カテゴリの日本語ラベル
                    labels: categories.map(cat => ({
                        Logical: '論理的・理性的',
                        Organized: '計画的・堅実的',
                        Friendly: '交友的・感覚的',
                        Creative: '冒険的・独創的',
                        Competitive: '競争的・達成志向的'
                    }[cat])),
                    datasets: [{
                        label: '診断結果',
                        data: categories.map(c => scores[c]),
                        backgroundColor: 'rgba(0,123,230,0.2)',
                        borderColor: '#007be6',
                        borderWidth: 2,
                        pointBackgroundColor: '#007be6'
                    }]
                },
                options: {
                    scales: {
                        r: {
                            beginAtZero: true,
                            suggestedMax: 25
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: context => `スコア: ${context.formattedValue}`
                            }
                        }
                    }
                }
            });

        }
    }, [showChart]);


    // 回答ボタンのグラデーション色
    const gradientColors = ['#d0e8ff', '#a4d4ff', '#78c0ff', '#4cacf7', '#2897f0'];
    // const userId = 1; // ログインユーザーID（認証連携なら取得）

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:3030/log/whoami", {
                    withCredentials: true,
                });
                if (res.data.loggedIn) {
                    setUser(res.data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("ユーザー情報取得エラー:", err);
                setUser(null);
            } finally {
                setUserLoading(false);
            }
        };
        fetchUser();
    }, []);

    // 診断結果をサーバーに保存する場合の例（コメントアウト）
    useEffect(() => {
        if (showChart && user) {
            const personalityType = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
            axios.post(`http://localhost:3030/chart/chart/${user.id}`, {
                user_id: user.id,
                chart_title: personalityType,
                chart_text: personalityType + "タイプ",
            }, { withCredentials: true })
                .then(res => {
                    console.log("診断結果保存成功:", res.data);
                })
                .catch(err => {
                    console.error("診断結果保存エラー:", err);
                });
        }
    }, [showChart, user]);


    // 画面描画部分
    return (
        <>
            {/* ハンバーガーメニュー */}
            <HamburgerMenu />
            <title>性格診断テスト</title>
            <div className='body'>
                <div className='maindai'>性格診断テスト</div>
                <div className="container2">
                    {/* 診断中の画面 */}
                    {!showChart && (
                        <>
                            {/* 質問番号表示 - 表示用に防御的に計算（オフバイワン対策） */}
                            {(() => {
                                const displayIndex = currentQuestion < questions.length ? currentQuestion + 1 : questions.length;
                                return <div className="question-number">{`${displayIndex} / ${questions.length}`}</div>;
                            })()}
                            {/* 質問文 */}
                            <div className="question2">{questions[currentQuestion].text}</div>
                            {/* 回答ボタン（1〜5） */}
                            <div className="options">
                                <div className="label">そう思わない</div>
                                {gradientColors.map((color, index) => (
                                    <div
                                        key={index}
                                        className="option"
                                        style={{ backgroundColor: color }}
                                        onClick={() => handleAnswer(index + 1)}
                                    />
                                ))}
                                <div className="label">そう思う</div>
                            </div>
                            {/* 戻るボタン */}
                            {currentQuestion > 0 && (
                                <div className="back-button" onClick={handleBack}>← 戻る</div>
                            )}
                            {/* 進捗バー */}
                            <div className="progress-container">
                                {(() => {
                                    const displayIndex = currentQuestion < questions.length ? currentQuestion + 1 : questions.length;
                                    const percent = Math.round((displayIndex / questions.length) * 100);
                                    return (
                                        <>
                                            <div
                                                className="progress-bar"
                                                style={{ width: `${(displayIndex / questions.length) * 100}%` }}
                                            />
                                            {/* 進捗率テキスト */}
                                            <div className="progress-text">進捗：{percent}%</div>
                                        </>
                                    );
                                })()}
                            </div>
                        </>
                    )}
                    {/* 診断結果画面 */}
                    {showChart && (
                        <div>
                            {/* レーダーチャート */}
                            <canvas ref={chartRef} />
                            <div className="result-text" id={personalityColors[getTopPersonality()]}>
                                <h2 className='personaldai'>あなたの性格タイプ</h2>
                                {/* 性格タイプ名 */}
                                <h3 className={personalityColors[getTopPersonality()]}>{{
                                    Logical: '論理的・理性的',
                                    Organized: '計画的・堅実的',
                                    Friendly: '交友的・感覚的',
                                    Creative: '冒険的・独創的',
                                    Competitive: '競争的・達成志向的'
                                }[getTopPersonality()]}</h3>
                                {/* 性格タイプ画像 */}
                                <img src={personalityImages[getTopPersonality()]} className='image' />
                                {/* 性格タイプ説明文 */}
                                <p className='personal'>{personalityDescriptions[getTopPersonality()]}</p>

                            </div>
                            {topDetail && (
                                <div className={`type-result ${topPersonality ? personalityColors[topPersonality] : ''}`}>
                                    <h3>長所</h3>
                                    <ul>
                                        {topDetail.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                    <h3>短所</h3>
                                    <ul>
                                        {topDetail.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                    </ul>

                                    <h3>向いている仕事</h3>
                                    <ul>
                                        {topDetail.suitableJobs.map((j, i) => <li key={i}>{j}</li>)}
                                    </ul>

                                    <h3>人間関係の傾向</h3>
                                    <p>{topDetail.relationships}</p>
                                </div>
                            )}
                            {/* マイページへのリンク */}
                            <a href="Mypage"><div className='back_mypage'>マイページへ</div></a>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}


// サーバー側保存API例（参考）
// server.js
// app.post('/user/result', (req, res) => {
//   const { userId, scores, personalityType } = req.body;
//   db.query(
//     'UPDATE user SET personality_scores = ?, personality_type = ? WHERE id = ?',
//     [JSON.stringify(scores), personalityType, userId],
//     (err) => {
//       if (err) return res.status(500).json({ error: err });
//       res.json({ success: true });
//     }
//   );
// });
