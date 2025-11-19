// 必要なライブラリ・コンポーネントのインポート
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Paperclip, Send, FileText, Search } from "lucide-react";
import Calendar from "react-calendar";
import "./Testchat.css";
import HamburgerMenu from "../../components/HamburgerMenu/HamburgerMenu";

// 汎用カードコンポーネント
const Card = ({ children, className }) => (
    <div className={`card ${className}`}>{children}</div>
);

// 汎用ボタンコンポーネント
const Button = ({ children, className, ...props }) => (
    <button className={`btn ${className}`} {...props}>{children}</button>
);

// 汎用インプットコンポーネント
const Input = ({ className, ...props }) => (
    <input className={`input ${className}`} {...props} />
);

export default function JobChatUI() {
    // ユーザー情報の状態管理
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    // 初回マウント時にログインユーザー情報を取得
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:3030/log/whoami", { withCredentials: true });
                if (res.data.loggedIn) {
                    setUser(res.data.user);
                }
            } catch (err) {
                setUser(null);
            } finally {
                setUserLoading(false);
            }
        };
        fetchUser();
    }, []);

    // この画面のみスクロール禁止
    useEffect(() => {
        document.body.classList.add("no-scroll");
        document.getElementById("root")?.classList.add("no-scroll");
        return () => {
            document.body.classList.remove("no-scroll");
            document.getElementById("root")?.classList.remove("no-scroll");
        };
    }, []);

    // カレンダーで選択中の日付
    const [selectedDate, setSelectedDate] = useState(new Date());
    // 添付ファイル一覧
    const [allFiles, setAllFiles] = useState([
        { name: "履歴書" },
        { name: "ES" },
        { name: "ポートフォリオ" }
    ]);
    // チャット可能な企業一覧
    const [companies, setCompanies] = useState([]);
    // ユーザーIDが取得できたら企業一覧を取得
    useEffect(() => {
        const fetchCompanies = async () => {
            if (!user?.id) return;
            try {
                const res = await axios.get("http://localhost:3030/chat/userChat/companies", {
                    params: { user_id: user.id },
                });
                const companies = Array.isArray(res.data)
                    ? res.data.map(c => ({
                        id: c.id,
                        name: c.name || c.company_name || c.c_name || "(企業名未設定)"
                    }))
                    : [];
                setCompanies(companies);
            } catch (err) {
                console.error("企業一覧取得エラー:", err);
                setCompanies([]);
            }
        };
        fetchCompanies();
    }, [user]);

    // 選択中の企業
    const [selectedCompany, setSelectedCompany] = useState(null);
    // 企業一覧が取得できたら最初の企業を自動選択
    useEffect(() => {
        if (companies.length > 0 && !selectedCompany) {
            setSelectedCompany(companies[0]);
        }
    }, [companies, selectedCompany]);

    // 企業ごとのメッセージ履歴管理
    const [companyMessages, setCompanyMessages] = useState({});
    // 新規メッセージ入力欄
    const [newMessage, setNewMessage] = useState("");
    // 履歴取得中フラグ
    const [loadingHistory, setLoadingHistory] = useState(false);
    // 添付ファイル（送信前）
    const [attachedFiles, setAttachedFiles] = useState([]);
    // カレンダーの予定（面接日程）: { toDateString(): text }
    const [calendarEvents, setCalendarEvents] = useState({});
    // 予定入力欄
    const [eventInput, setEventInput] = useState("");

    // ここに追加：企業ごとのメモを管理
    const [companyMemos, setCompanyMemos] = useState({});
    // タブ管理（calendar | memo）
    const [activeTab, setActiveTab] = useState("calendar");

    // 選択中企業のメッセージ一覧
    const messages = selectedCompany ? (companyMessages[selectedCompany.name] || []) : [];

    // 企業選択時に履歴を取得
    useEffect(() => {
        if (!user?.id || !selectedCompany?.id) return;
        const fetchHistory = async () => {
            setLoadingHistory(true);
            try {
                const res = await axios.get("http://localhost:3030/chat/userChat/history", {
                    params: {
                        user_id: user.id,
                        Companies_id: selectedCompany.id
                    }
                });
                console.log("Fetched history:", res.data);
                // DB履歴をcompanyMessagesに反映
                setCompanyMessages(prev => ({
                    ...prev,
                    [selectedCompany.name]: res.data || []
                }));
            } catch (e) {
                // エラー時は空
                setCompanyMessages(prev => ({
                    ...prev,
                    [selectedCompany.name]: []
                }));
            }
            setLoadingHistory(false);
        };
        fetchHistory();
    }, [selectedCompany, user]);

    // メッセージ送信処理
    const handleSendMessage = async () => {
        // メッセージまたはファイルが空、またはユーザー情報・企業未選択時は送信しない
        if ((!newMessage.trim() && attachedFiles.length === 0) || !user?.id || !selectedCompany?.id) return;

        const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        try {
            // サーバーにメッセージ送信（現行 API 仕様に合わせる）
            await axios.post("http://localhost:3030/chat/userChat/message", {
                user_id: user.id,
                Companies_id: selectedCompany.id,
                message_text: newMessage,
                time: timestamp,
                sender_type: "user"
            });
            // 送信後、履歴を再取得
            const res = await axios.get("http://localhost:3030/chat/userChat/history", {
                params: {
                    user_id: user.id,
                    Companies_id: selectedCompany.id
                }
            });
            setCompanyMessages(prev => ({
                ...prev,
                [selectedCompany.name]: res.data || []
            }));
        } catch (e) {
            // サーバーエラー時はローカルで履歴追加
            setCompanyMessages(prev => ({
                ...prev,
                [selectedCompany.name]: [...(prev[selectedCompany.name] || []), {
                    id: (prev[selectedCompany.name]?.length || 0) + 1,
                    text: newMessage,
                    side: "right",
                    time: timestamp,
                    status: "送信失敗（ローカル保存）",
                    files: attachedFiles.map(f => f.name)
                }]
            }));
        }
        // 添付ファイル一覧に追加
        setAllFiles(prev => [...prev, ...attachedFiles.map((f) => ({ name: f.name }))]);
        // 入力欄・添付ファイルをリセット
        setNewMessage("");
        setAttachedFiles([]);
    };

    // ファイル添付時の処理
    const handleAttachFile = (event) => {
        const files = Array.from(event.target.files);
        setAttachedFiles([...attachedFiles, ...files]);
    };

    // カレンダー日付クリック時に予定入力欄を表示
    const handleDateClick = (date) => {
        setSelectedDate(date);
        // ここでは既存の予定を入力欄に表示しない
        // setEventInput(calendarEvents[date.toDateString()] || "");
    };

    // 選択中の企業の予定をサーバーから取得
    useEffect(() => {
        const fetchEvents = async () => {
            if (!user?.id || !selectedCompany?.id) return;
            try {
                // --- ここでDBから予定を取得 ---
                const res = await axios.get('http://localhost:3030/calendar/calendarEvent', {
                    params: { user_id: user.id, Companies_id: selectedCompany.id }
                });
                // --- DBの結果をカレンダー表示用オブジェクトに変換 ---
                const map = {};
                (res.data || []).forEach(ev => {
                    const key = new Date(ev.event_date).toDateString();
                    console.log(ev.event_text);
                    map[key] = map[key]
                        // 同日の複数予定を改行で結合
                        ? `${map[key]}<br>${ev.event_text}`
                        : ev.event_text;
                });
                // --- カレンダー表示用state更新 ---
                setCalendarEvents(map);

                // 予定を入力欄に反映しないように変更
                // これにより、保存済みの予定がテキストボックスに自動表示されなくなる
                // setEventInput(map[selectedDate.toDateString()] || "");

            } catch (e) {
                setCalendarEvents({});
            }
        };
        fetchEvents();
    }, [user, selectedCompany]);

    // 予定を保存（DBへ）
    // 日本のロケールを指定し、指定の形式でフォーマットする
    const formatter = new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const handleSaveEvent = async () => {
        if (!user?.id || !selectedCompany?.id) return;
        let dateStr;

        if (selectedDate instanceof Date) {
            const dateStrTemp = new Date(selectedDate);
            dateStr = formatter.format(dateStrTemp).replaceAll('/', '-');
            console.log("test" + dateStr);
        } else {
            dateStr = String(selectedDate);
            console.log("else test" + dateStr);
        }

        try {
            await axios.post('http://localhost:3030/calendar/calendarEvent', {
                user_id: user.id,
                Companies_id: selectedCompany.id,
                event_date: dateStr,
                event_text: eventInput
            });
            // ローカルのマップを更新（同日複数件は改行で連結）
            const key = selectedDate.toDateString();
            setCalendarEvents(prev => ({
                ...prev,
                [key]: prev[key] ? `${prev[key]}<br>${eventInput}` : eventInput
            }));
            // 保存後は入力欄をクリア
            setEventInput("");
        } catch (e) {
            // エラー時はローカルのみ更新（フォールバック）
            const key = selectedDate.toDateString();
            setCalendarEvents(prev => ({
                ...prev,
                [key]: prev[key] ? `${prev[key]}<br>${eventInput}` : eventInput
            }));
            setEventInput("");
        }

        console.log("companies:", companies);
    };

    // メモ保存（現状サーバー API が無い場合はローカルのみで保持）
    const handleSaveMemo = async () => {
        let dateStr;

        if (!user?.id || !selectedCompany?.id) return;
        const memo = companyMemos[selectedCompany.id] || "";

        if (selectedDate instanceof Date) {
            const dateStrTemp = new Date(selectedDate);
            dateStr = formatter.format(dateStrTemp).replaceAll('/', '-');
            console.log("test" + dateStr);
        } else {
            dateStr = String(selectedDate);
            console.log("else test" + dateStr);
        }

        try {
            await axios.post('http://localhost:3030/calendar/companyMemo', {
                user_id: user.id,
                Companies_id: selectedCompany.id,
                memo_text: memo,
                create_at: dateStr
            });
        } catch (e) {
            console.warn('company_memo API が未実装のためローカル保存のみです');
        }
    };

    // --- 画面描画 ---
    return (
        <>
            <HamburgerMenu />
            <div className="jobchat-container">
                {/* --- 左サイドバー: 企業一覧 --- */}
                <div className="sidebar-left">
                    <h2 className="sidebar-title">企業一覧</h2>
                    <ul className="company-list">
                        {companies.map((company, idx) => (
                            <li
                                className={`company-item ${selectedCompany && selectedCompany.id === company.id ? 'active' : ''}`}
                                data-company-id={company.id}
                                key={company.id + '-' + idx}
                                onClick={() => setSelectedCompany(company)}
                                aria-current={selectedCompany && selectedCompany.id === company.id}
                            >
                                {company.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* --- チャットエリア --- */}
                <div className="chat-area">
                    <Card className="chat-header">
                        <h2 className="chat-title">{selectedCompany ? `${selectedCompany.name} - 採用担当` : "企業を選択してください"}</h2>
                    </Card>

                    {/* --- メッセージ表示エリア --- */}
                    <div className="chat-messages2" role="log" aria-live="polite">
                        {loadingHistory ? (
                            <div>履歴を読み込み中...</div>
                        ) : messages.length > 0 ? (
                            messages
                                .filter(msg => msg && (msg.text || msg.message_text)) // nullや空文字を除外
                                .map((msg, idx) => {
                                    // --- 日付・時間フォーマット処理 ---
                                    const msgTime = new Date(msg.time);
                                    const now = new Date();
                                    const diff = now - msgTime;
                                    const oneDay = 24 * 60 * 60 * 1000;

                                    // 1日未満 → 「HH:MM」
                                    // 1日以上前 → 「MM/DD HH:MM」
                                    const formattedTime = diff < oneDay
                                        ? msgTime.toLocaleTimeString("ja-JP", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                        : msgTime.toLocaleString("ja-JP", {
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        });

                                    return (
                                        <div
                                            key={msg.id || idx}
                                            className={`message3 message-${msg.side || (msg.user === "demo_user" ? "right" : "left")}`}
                                        >
                                            <div
                                                className={`bubble bubble-${msg.side || (msg.user === "demo_user" ? "right" : "left")}`}
                                            >
                                                {/* --- メッセージ本文 --- */}
                                                <div>{msg.text || msg.message_text}</div>

                                                {/* --- 添付ファイルがある場合 --- */}
                                                {msg.files && msg.files.length > 0 && (
                                                    <ul className="file-list-inline">
                                                        {msg.files.map((file, fidx) => (
                                                            <li key={fidx} className="file-item-inline">
                                                                <FileText size={14} />{" "}
                                                                {typeof file === "string" ? file : file.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {/* --- タイムスタンプ --- */}
                                                <div
                                                    className={`timestamp ${(msg.side || (msg.user === "demo_user" ? "right" : "left")) === "right"
                                                        ? "timestamp-right"
                                                        : ""
                                                        }`}
                                                >
                                                    {msg.status || ""} {formattedTime}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                        ) : (
                            <div className="no-message">まだメッセージはありません</div>
                        )}
                    </div>

                    {/* --- 入力エリア --- */}
                    <div className="chat-input2">
                        {/* ファイル添付ボタン（非表示inputと連動） */}
                        <input
                            type="file"
                            id="file-upload"
                            style={{ display: "none" }}
                            multiple
                            onChange={handleAttachFile}
                        />
                        <Button
                            className="btn-icon"
                            aria-label="添付"
                            onClick={() => document.getElementById("file-upload").click()}
                        >
                            <Paperclip />
                        </Button>

                        {/* メッセージ入力欄 */}
                        <Input
                            aria-label="メッセージ入力"
                            placeholder="メッセージを入力..."
                            className="flex-1"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        />

                        {/* 送信ボタン */}
                        <Button className="btn-icon send-btn" aria-label="送信" onClick={handleSendMessage}>
                            <Send />
                        </Button>
                    </div>
                </div>

                <div className="sidebar-right">
                    <div className="tabs" role="tablist" aria-label="右サイドバータブ">
                        <button
                            className={`tab-btn ${activeTab === "calendar" ? "active" : ""}`}
                            onClick={() => setActiveTab("calendar")}
                            role="tab"
                            aria-selected={activeTab === "calendar"}
                        >
                            カレンダー
                        </button>
                        <button
                            className={`tab-btn ${activeTab === "memo" ? "active" : ""}`}
                            onClick={() => setActiveTab("memo")}
                            role="tab"
                            aria-selected={activeTab === "memo"}
                        >
                            メモ
                        </button>
                    </div>

                    {activeTab === "calendar" && (
                        <div className="tab-panel" role="tabpanel">
                            <h3 className="section-title">面接日程</h3>
                            <Calendar
                                onChange={handleDateClick}
                                value={selectedDate}
                                className="custom-calendar"
                                formatShortWeekday={(locale, date) => {
                                    return date.toLocaleDateString(locale, { weekday: 'short' });
                                }}
                                tileContent={({ date }) =>
                                    calendarEvents[date.toDateString()] ? (
                                        <span style={{ color: "#00bfc5ff", fontSize: "0.8em" }}>♦</span>
                                    ) : null
                                }
                            />
                            <div style={{ marginTop: "1em" }}>
                                <Input
                                    aria-label="予定入力"
                                    placeholder="この日の予定を入力..."
                                    value={eventInput}
                                    onChange={e => setEventInput(e.target.value)}
                                />
                                <Button className="btn btn-primary" onClick={handleSaveEvent}>
                                    予定を保存
                                </Button>
                            </div>
                            {calendarEvents[selectedDate.toDateString()] && (
                                <div style={{ marginTop: "0.5em", color: "#2d3748" }}>
                                    <strong>予定</strong><br /><span dangerouslySetInnerHTML={{ __html: calendarEvents[selectedDate.toDateString()] }} />
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "memo" && (
                        <div className="tab-panel" role="tabpanel">
                            <h3 className="section-title">メモ</h3>
                            {/* ここで選択日を表示 */}
                            <div style={{ marginBottom: "0.5rem", color: "#2d3748" }}>
                                <strong>選択日:</strong> {selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')} (${selectedDate.toLocaleDateString(undefined, { weekday: 'short' })})` : "-"}
                            </div>
                            <textarea
                                className="memo-box"
                                placeholder="メモを入力..."
                                value={selectedCompany ? (companyMemos[selectedCompany.id] || "") : ""}
                                onChange={e => {
                                    if (!selectedCompany) return;
                                    const v = e.target.value;
                                    setCompanyMemos(prev => ({ ...prev, [selectedCompany.id]: v }));
                                }}
                            />
                            <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                                <Button className="btn2" onClick={handleSaveMemo}>メモを保存</Button>
                                <Button className="btn" onClick={async () => {
                                    if (!user?.id || !selectedCompany?.id) return;
                                    await axios.get("http://localhost:3030/calendar/companyMemo", {
                                        params: {
                                            user_id: user.id,
                                            Companies_id: selectedCompany.id,
                                            memo_text: memo
                                        }
                                    }).then(res => {
                                        setCompanyMemos(prev => ({ ...prev, [selectedCompany.id]: res.data?.memo_text || "" }));
                                    }).catch(() => { });
                                }}>メモを取得</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}