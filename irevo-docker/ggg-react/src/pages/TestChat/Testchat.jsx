// 必要なライブラリを読み込む部分です
import React, { useState, useEffect } from "react"; // React とフックを読み込む
import axios from "axios"; // サーバーと通信するための道具
import { Paperclip, Send, FileText, Search } from "lucide-react"; // アイコンを使うための読み込み
import Calendar from "react-calendar"; // カレンダー用のコンポーネント
import "./Testchat.css"; // このページの見た目を定義したファイル
import HamburgerMenu from "../../components/HamburgerMenu/HamburgerMenu"; // ハンバーガーメニューを使う

// 祝日の一覧を用意している部分です
const holidays = [
    // ここには 2025 年と 2026 年の祝日を入れています
    new Date("2025-01-01"), // 元日
    new Date("2025-01-13"), // 成人の日
    new Date("2025-02-11"), // 建国記念の日
    new Date("2025-02-23"), // 天皇誕生日
    new Date("2025-03-20"), // 春分の日
    new Date("2025-04-29"), // 昭和の日
    new Date("2025-05-03"), // 憲法記念日
    new Date("2025-05-04"), // みどりの日
    new Date("2025-05-05"), // こどもの日
    new Date("2025-05-06"), // 振替休日
    new Date("2025-07-21"), // 海の日
    new Date("2025-08-11"), // 山の日
    new Date("2025-09-15"), // 敬老の日
    new Date("2025-09-23"), // 秋分の日
    new Date("2025-10-13"), // 体育の日
    new Date("2025-11-03"), // 文化の日
    new Date("2025-11-23"), // 勤労感謝の日
    new Date("2025-11-24"), // 振替休日

    // 2026 年の祝日も同様に並べています
    new Date("2026-01-01"),
    new Date("2026-01-12"),
    new Date("2026-02-11"),
    new Date("2026-02-23"),
    new Date("2026-03-20"),
    new Date("2026-04-29"),
    new Date("2026-05-03"),
    new Date("2026-05-04"),
    new Date("2026-05-05"),
    new Date("2026-07-20"),
    new Date("2026-08-11"),
    new Date("2026-09-21"),
    new Date("2026-09-22"), // 国民の休日の例
    new Date("2026-09-23"),
    new Date("2026-10-12"),
    new Date("2026-11-03"),
    new Date("2026-11-23")
];

// 小さなカードを作るためのヘルパーコンポーネント
const Card = ({ children, className }) => (
    <div className={`card ${className}`}>{children}</div> // 見た目用の div を返す
);

// 小さなボタンを作るためのコンポーネント
const Button = ({ children, className, ...props }) => (
    <button className={`btn ${className}`} {...props}>
        {children}
    </button>
);

// 入力欄の見た目を統一するコンポーネント
const Input = ({ className, ...props }) => (
    <input className={`input ${className}`} {...props} />
);

// 文章中の URL をリンクにするための関数です
const linkify = (text) => {
    // 何もない場合はそのまま返す
    if (!text && text !== "") return text; 
    // 文字列に変換する
    const str = String(text); 
    // URL を見つける正規表現
    const urlRegex = /((https?:\/\/)[^\s]+|(www\.[^\s]+))/gi;
    // 出力する要素をためる配列
    const elements = [];
    // 最後に追加した位置を記録する 
    let lastIndex = 0;
    let match;
    while ((match = urlRegex.exec(str)) !== null) {
        // マッチした位置
        const index = match.index;
        // 前の文字列を追加
        if (index > lastIndex) elements.push(str.slice(lastIndex, index));
        // 見つかった URL
        const url = match[0]; 
        // href を整える
        const href = url.startsWith("www.") ? `https://${url}` : url;
        elements.push(
            <a key={index} href={href} target="_blank" rel="noreferrer">
                {url}
            </a>
        ); 
        // ↑ リンク要素を作る
        // 位置を更新する
        lastIndex = index + url.length;
    }
    // 残りを追加
    if (lastIndex < str.length) elements.push(str.slice(lastIndex));
    // 結果を返す
    return elements.length ? elements : str;
};

// このコンポーネントが画面の本体です
export default function JobChatUI() {
    // ユーザー情報を入れる変数
    const [user, setUser] = useState(null);
    // ユーザー取得中の合図
    const [userLoading, setUserLoading] = useState(true);

    // 最初の読み込みでログインユーザーを取得する
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("http://localhost:3030/log/whoami", {
                    withCredentials: true
                });
                if (res.data.loggedIn) {
                    // ログインしていればユーザー情報を保存
                    setUser(res.data.user);
                }
            } catch (err) {
                // 失敗したら null にする
                setUser(null);
            } finally {
                // 読み込み終わり
                setUserLoading(false);
            }
        };
        // 実行する
        fetchUser();
    }, []);
    // ↑ 一度だけ実行する

    // この画面の間だけスクロールを止める処理
    useEffect(() => {
        // body にクラスを付ける
        document.body.classList.add("no-scroll");
        // root も同じ
        document.getElementById("root")?.classList.add("no-scroll");
        return () => {
            // 終わったら外す
            document.body.classList.remove("no-scroll");
            document.getElementById("root")?.classList.remove("no-scroll");
        };
    }, []);
    // ↑ マウントとアンマウントで動く

    // カレンダーで選んだ日を保存する変数
    const [selectedDate, setSelectedDate] = useState(new Date());
    // 添付ファイルの候補一覧を作る
    const [allFiles, setAllFiles] = useState([
        { name: "履歴書" },
        { name: "ES" },
        { name: "ポートフォリオ" }
    ]);
    // チャット可能な企業一覧を入れる場所
    const [companies, setCompanies] = useState([]);

    // ユーザー ID が分かったら企業一覧をサーバーから取る
    useEffect(() => {
        const fetchCompanies = async () => {
            if (!user?.id) return; // ユーザーがいないなら何もしない
            try {
                const res = await axios.get("http://localhost:3030/chat/userChat/companies", {
                    params: {
                        user_id: user.id
                    }
                }
                ); // 企業情報を取りに行く
                const companies = Array.isArray(res.data)
                    ? res.data.map((c) => ({
                        id: c.id,
                        name: c.name || c.company_name || c.c_name || "(企業名未設定)"
                    }))
                    : [];
                    // ↑ データが配列なら整形する
                    // 保存する
                setCompanies(companies); 
            } catch (err) {
                // エラーを表示
                console.error("企業一覧取得エラー:", err);
                // 空にする
                setCompanies([]);
            }
        };
        // 実行
        fetchCompanies();
    }, [user]);
    // ↑ user が変わったら再実行

    // 選択中の企業を保存する
    const [selectedCompany, setSelectedCompany] = useState(null);

    // 企業一覧が取れたら最初の企業を選ぶ
    useEffect(() => {
        if (companies.length > 0 && !selectedCompany) {
            setSelectedCompany(companies[0]);
        }
    }, [companies, selectedCompany]);

    // 各企業ごとのメッセージを入れる場所
    const [companyMessages, setCompanyMessages] = useState({});
    // 新しいメッセージを入力する場所
    const [newMessage, setNewMessage] = useState("");
    // 履歴取得中の合図
    const [loadingHistory, setLoadingHistory] = useState(false);
    // 送る前の添付ファイルを保存する
    const [attachedFiles, setAttachedFiles] = useState([]);
    // カレンダーで管理する予定を入れる場所
    const [calendarEvents, setCalendarEvents] = useState({});
    // 予定の題名と詳しい内容を入れる
    const [eventTitle, setEventTitle] = useState("");
    const [eventDetail, setEventDetail] = useState("");

    // 企業ごとのメモを管理する場所
    const [companyMemos, setCompanyMemos] = useState({});
    // 右側のタブ状態を管理する
    const [activeTab, setActiveTab] = useState("calendar");

    // 表示するメッセージを計算する
    const messages = selectedCompany
        ? companyMessages[selectedCompany.name] || []
        : [];

    // 企業を選んだときに履歴を取りに行く
    useEffect(() => {
        // 条件がなければやめる
        if (!user?.id || !selectedCompany?.id) return;
        const fetchHistory = async () => {
            // 取得中マークを立てる
            setLoadingHistory(true);
            try {
                const res = await axios.get("http://localhost:3030/chat/userChat/history", {
                    params: {
                        user_id: user.id,
                        Companies_id: selectedCompany.id
                    }
                }
                );
                // ↑ 履歴を取る
                // ログに出す
                console.log("Fetched history:", res.data);
                const rows = Array.isArray(res.data)
                    ? res.data
                    // 形式を整える
                    : res.data?.messages || [];
                const normalized = rows.map((m) => {
                    // 送信者が分からない場合は自分か企業かを判定する
                    const senderType =
                        m.sender_type ||
                        (m.user_id === user.id ? "user" : "company");

                    return {
                        id: m.id ?? m.message_id ?? m.id,
                        text: m.text ?? m.message_text ?? m.body ?? "",
                        time: m.time ?? m.created_at ?? m.timestamp ?? new Date().toISOString(),
                        files: m.files ?? m.attachments ?? m.files_list ?? [],
                        status: m.status ?? "",
                        sender_type: senderType
                    };
                });
                setCompanyMessages((prev) => ({
                    ...prev,
                    [selectedCompany.name]: normalized
                }));
                // ↑ メッセージを保存する
            } catch (e) {
                // エラーなら空にしておく
                setCompanyMessages((prev) => ({
                    ...prev,
                    [selectedCompany.name]: []
                }));
            }
            // 取得終わり
            setLoadingHistory(false);
        };
        // 実行する
        fetchHistory();
    }, [selectedCompany, user]);
    // ↑ 選んだ会社やユーザーが変わったら再取得

    // メッセージを送る関数
    const handleSendMessage = async () => {
        // メッセージとファイルが無くても送らない
        if (
            (!newMessage.trim() && attachedFiles.length === 0) ||
            !user?.id ||
            !selectedCompany?.id
        )
            return;

        const timestamp = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
        // ↑ 時刻を作る

        try {
            // サーバーに送信する API を呼ぶ
            await axios.post("http://localhost:3030/chat/userChat/message", {
                params: {
                    user_id: user.id,
                    Companies_id: selectedCompany.id,
                    message_text: newMessage,
                    time: timestamp,
                    sender_type: "user"
                }
            });
            // 送った後で履歴をもう一度取りに行く
            const res = await axios.get("http://localhost:3030/chat/userChat/history", {
                params: {
                    user_id: user.id,
                    Companies_id: selectedCompany.id
                }
            }
            );
            const rows = Array.isArray(res.data)
                ? res.data
                : res.data?.messages || [];
            const normalized = rows.map((m) => {
                const senderType =
                    m.sender_type ||
                    (m.user_id === user.id ? "user" : "company");

                return {
                    id: m.id ?? m.message_id ?? m.id,
                    text: m.text ?? m.message_text ?? m.body ?? "",
                    time: m.time ?? m.created_at ?? m.timestamp ?? new Date().toISOString(),
                    files: m.files ?? m.attachments ?? m.files_list ?? [],
                    status: m.status ?? "",
                    sender_type: senderType
                };
            });
            // 取得した履歴で画面を更新する
            setCompanyMessages((prev) => ({
                ...prev,
                [selectedCompany.name]: normalized
            }));
        } catch (e) {
            // 送信に失敗したらローカルで仮に追加する
            setCompanyMessages((prev) => ({
                ...prev,
                [selectedCompany.name]: [
                    ...(prev[selectedCompany.name] || []),
                    {
                        id: (prev[selectedCompany.name]?.length || 0) + 1,
                        text: newMessage,
                        side: "right",
                        sender_type: "user",
                        time: timestamp,
                        status: "送信失敗（ローカル保存）",
                        files: attachedFiles.map((f) => f.name)
                    }
                ]
            }));
        }
        // 添付ファイル候補に追加する
        setAllFiles((prev) => [
            ...prev,
            ...attachedFiles.map((f) => ({ name: f.name }))
        ]);
        // 入力欄と添付をリセットする
        setNewMessage("");
        setAttachedFiles([]);
    };

    // ファイルを添付したときの処理
    const handleAttachFile = (event) => {
        // 選んだファイルを配列にする
        const files = Array.from(event.target.files);
        // 追加する
        setAttachedFiles([...attachedFiles, ...files]);
    };

    // カレンダーの日付を選ぶ処理
    const handleDateClick = (date) => {
        // 選択した日を保存する
        setSelectedDate(date);
    };

    // サーバーから選んだ企業の予定を取得する関数
    const fetchEvents = async () => {
        // 条件がないならやらない
        if (!user?.id || !selectedCompany?.id) return;
        try {
            const res = await axios.get("http://localhost:3030/calendar/calendarEvent", {
                params: {
                    user_id: user.id,
                    Companies_id: selectedCompany.id
                }
            }
            );
            // 結果を日付ごとの地図にする
            const map = {};
            (res.data || []).forEach((ev) => {
                // 日付のキーを作る
                const key = new Date(ev.event_date).toDateString();
                // id を探す
                const id = ev.id ?? ev.event_id ?? ev.calendarEvents_id ?? null;
                // 題名を探す
                const title = ev.event_txt ?? ev.event_title ?? ev.event_text ?? "(無題)";
                // 詳細を探す
                const detail = ev.event_detail ?? ev.event_text ?? "";
                // なければ配列を作る
                if (!map[key]) map[key] = [];
                // 予定を追加する
                map[key].push({ id, title, detail });
            });
            // 保存する
            setCalendarEvents(map);
        } catch (e) {
            // 失敗したら空にする
            setCalendarEvents({});
        }
    };

    useEffect(() => {
        const fetchEventsEffect = async () => {
            // 条件がないならやめる
            if (!user?.id || !selectedCompany?.id) return;
            try {
                const res = await axios.get("http://localhost:3030/calendar/calendarEvent", {
                    params: {
                        user_id: user.id,
                        Companies_id: selectedCompany.id
                    }
                }
                );
                const map = {};
                (res.data || []).forEach((ev) => {
                    const key = new Date(ev.event_date).toDateString();
                    // 予定の本文をログに出す
                    console.log(ev.event_text);
                    map[key] = map[key]
                        ? `${map[key]}<br>${ev.event_text}`
                        // HTML の改行でつなげる処理
                        : ev.event_text;
                });
                setCalendarEvents(map);
            } catch (e) {
                // 失敗時は空にする
                setCalendarEvents({});
            }
        };
        // 実行
        fetchEventsEffect();
    }, [user, selectedCompany]);

    // 予定を保存するためのフォーマッタを作る
    const formatter = new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });

    // 予定を保存する処理
    const handleSaveEvent = async () => {
        // 条件が無ければやめる
        if (!user?.id || !selectedCompany?.id) return;
        let dateStr;

        if (selectedDate instanceof Date) {
            const dateStrTemp = new Date(selectedDate);
            // 日付を文字列にする
            dateStr = formatter.format(dateStrTemp).replaceAll("/", "-");
            console.log("test" + dateStr);
        } else {
            dateStr = String(selectedDate);
            console.log("else test" + dateStr);
        }

        try {
            await axios.post("http://localhost:3030/calendar/calendarEvent", {
                params: {
                    user_id: user.id,
                    Companies_id: selectedCompany.id,
                    event_date: dateStr,
                    // 入力から題名を送る
                    event_text: eventTitle,
                    event_detail: eventDetail
                }
            });
            // 保存後に予定を再取得する
            await fetchEvents();
            // 入力欄をクリアする
            setEventTitle("");
            setEventDetail("");
        } catch (e) {
            setEventTitle("");
            setEventDetail("");
        }

        console.log("companies:", companies);
    };

    // メモを保存する処理
    const handleSaveMemo = async () => {
        let dateStr;

        // 条件が無ければやめる
        if (!user?.id || !selectedCompany?.id) return;
        const memo = companyMemos[selectedCompany.id] || "";

        if (selectedDate instanceof Date) {
            const dateStrTemp = new Date(selectedDate);
            dateStr = formatter.format(dateStrTemp).replaceAll("/", "-");
            console.log("test" + dateStr);
        } else {
            dateStr = String(selectedDate);
            console.log("else test" + dateStr);
        }

        try {
            await axios.post("http://localhost:3030/calendar/companyMemo", {
                params: {
                    user_id: user.id,
                    Companies_id: selectedCompany.id,
                    memo_text: memo,
                    create_at: dateStr
                }
            });
        } catch (e) {
            console.warn("company_memo API が未実装のためローカル保存のみです");
        }
    };

    // 予定を削除する処理
    const handleDeleteEvent = async (eventId) => {
        if (!eventId || !user?.id || !selectedCompany?.id) return;
        if (!window.confirm("本当にこの予定を削除しますか？")) return;
        try {
            await axios.delete("http://localhost:3030/calendar/calendarEvent", {
                data: {
                    id: eventId,
                    user_id: user.id,
                    Companies_id: selectedCompany.id
                }
            });
            // 削除後に再取得
            await fetchEvents();
        } catch (e) {
            console.error("イベント削除エラー", e);
            // ユーザーに知らせる
            alert("予定の削除に失敗しました");
        }
    };

    useEffect(() => {
        // カレンダーの曜日部分のタイトルを消して見た目を整える
        const weekdayElements = document.querySelectorAll(
            ".react-calendar__month-view__weekdays__weekday abbr"
        );

        weekdayElements.forEach((el) => {
            // title 属性を消す
            el.removeAttribute("title");
        });
        // 一度だけ実行
    }, []);

    // ここから画面を描画する部分です
    return (
        <>
        {/* ハンバーガーメニューを表示 */}
            <HamburgerMenu /> 
            <div className="jobchat-container">
                {/* 左側の企業一覧 */}
                <div className="sidebar-left">
                    <h2 className="sidebar-title">企業一覧</h2>
                    <ul className="company-list">
                        {companies.map((company, idx) => (
                            <li
                                className={`company-item ${selectedCompany && selectedCompany.id === company.id
                                    ? "active"
                                    : ""
                                    }`}
                                data-company-id={company.id}
                                key={company.id + "-" + idx}
                                // クリックしたら会社を選ぶ
                                onClick={() => setSelectedCompany(company)}
                                aria-current={
                                    selectedCompany && selectedCompany.id === company.id
                                }
                            >
                                {company.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ここがチャットのメインエリアです */}
                <div className="chat-area">
                    <Card className="chat-header">
                        <h2 className="chat-title">
                            {selectedCompany
                                ? `${selectedCompany.name} - 採用担当`
                                : "企業を選択してください"}
                        </h2>
                    </Card>

                    {/* メッセージ一覧を表示するエリア */}
                    <div
                        className="chat-messages2"
                        role="log"
                        aria-live="polite"
                    >
                        {loadingHistory ? (
                            <div>履歴を読み込み中...</div>
                        ) : messages.length > 0 ? (
                            messages
                            // 中身があるものだけ表示
                                .filter((msg) => msg && (msg.text || msg.message_text))
                                .map((msg, idx) => {
                                    // 時刻を Date に変換
                                    const msgTime = new Date(msg.time);
                                    const now = new Date();
                                    const diff = now - msgTime;
                                    // 1 日のミリ秒
                                    const oneDay = 24 * 60 * 60 * 1000;

                                    const formattedTime =
                                        diff < oneDay
                                            ? msgTime.toLocaleTimeString("ja-JP", {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })
                                            : msgTime.toLocaleString("ja-JP", {
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            });
                                            // ↑ 時刻の文字列を作る

                                    const side =
                                        msg.sender_type === "user"
                                            ? "right"
                                            // 送信者によって左右を変える
                                            : "left";

                                    return (
                                        <div
                                            key={msg.id || idx}
                                            className={`message3 message-${side}`}
                                        >
                                            <div className={`bubble bubble-${side}`}>
                                                {/* メッセージ本文 */}
                                                <div>{linkify(msg.text || msg.message_text)}</div>

                                                {msg.files && msg.files.length > 0 && (
                                                    <ul className="file-list-inline">
                                                        {msg.files.map((file, fidx) => (
                                                            <li
                                                                key={fidx}
                                                                className="file-item-inline"
                                                            >
                                                                <FileText size={14} />{" "}
                                                                {typeof file === "string"
                                                                    ? file
                                                                    : file.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                {/* ↑ 添付ファイルがあれば表示 */}

                                                <div
                                                    className={`timestamp ${side === "right"
                                                        ? "timestamp-right"
                                                        : ""
                                                        }`}
                                                >
                                                    {msg.status || ""} {formattedTime}
                                                    {/* ↑ ステータスと時刻を表示 */}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                        ) : (
                            <div className="no-message">
                                まだメッセージはありません
                            </div>
                        )}
                    </div>

                    {/* メッセージ入力の部分 */}
                    <div className="chat-input2">
                        <input
                            type="file"
                            id="file-upload"
                            style={{ display: "none" }}
                            multiple
                            onChange={handleAttachFile}
                        />
                        {/* ↑ 実際のファイル選択は隠してボタンで開く */}

                        <Button
                            className="btn-icon"
                            aria-label="添付"
                            onClick={() =>
                                document.getElementById("file-upload").click()
                            }
                        >
                            {/* クリップのアイコン */}
                            <Paperclip />
                        </Button>

                        <Input
                            aria-label="メッセージ入力"
                            placeholder="メッセージを入力..."
                            className="flex-1"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSendMessage()
                            }
                        />
                        {/* ↑ テキスト入力 */}

                        <Button
                            className="btn-icon send-btn"
                            aria-label="送信"
                            onClick={handleSendMessage}
                        >
                            <Send />
                            {/* ↑ 送信アイコン */}
                        </Button>
                    </div>
                </div>

                {/* 右側のサイドバー */}
                <div className="sidebar-right">
                    <div
                        className="tabs"
                        role="tablist"
                        aria-label="右サイドバータブ"
                    >
                        <button
                            className={`tab-btn ${activeTab === "calendar" ? "active" : ""
                                }`}
                            onClick={() => setActiveTab("calendar")}
                            role="tab"
                            aria-selected={activeTab === "calendar"}
                        >
                            カレンダー
                        </button>
                        <button
                            className={`tab-btn ${activeTab === "memo" ? "active" : ""
                                }`}
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
                                    return date.toLocaleDateString(locale, {
                                        weekday: "short"
                                    });
                                }}
                                tileContent={({ date }) => {
                                    const evRaw =
                                        calendarEvents[date.toDateString()];
                                    if (!evRaw) return null;
                                    const events = Array.isArray(evRaw)
                                        ? evRaw
                                        : String(evRaw)
                                            .split(/<br\s*\/?\>/i)
                                            .filter(Boolean)
                                            .map((t) => ({ title: t, detail: "" }));
                                    const count = events.length;
                                    const maxDots = 5;
                                    const titleForTooltip = events
                                        .map((e) => e.title)
                                        .join("\n");
                                    return (
                                        <div
                                            className="event-indicators"
                                            aria-hidden="true"
                                            title={titleForTooltip}
                                        >
                                            {count <= maxDots ? (
                                                events.map((it, i) => (
                                                    <span
                                                        key={i}
                                                        className="event-indicator"
                                                    />
                                                ))
                                            ) : (
                                                <>
                                                    {events
                                                        .slice(0, maxDots - 1)
                                                        .map((it, i) => (
                                                            <span
                                                                key={i}
                                                                className="event-indicator"
                                                            />
                                                        ))}
                                                    <span className="event-indicator more">
                                                        +{count - (maxDots - 1)}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    );
                                }}
                                locale="ja-JP"
                                calendarType="gregory"
                                tileClassName={({ date, view }) => {
                                    if (view === "month") {
                                        if (
                                            holidays.some(
                                                (h) =>
                                                    h.toDateString() ===
                                                    date.toDateString()
                                            )
                                        ) {
                                            return "holiday";
                                        }
                                        if (date.getDay() === 0) return "sunday";
                                        if (date.getDay() === 6) return "saturday";
                                    }
                                }}
                            />
                            <div
                                style={{
                                    marginTop: "1em",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.5rem"
                                }}
                            >
                                <Input
                                    aria-label="予定の題名"
                                    placeholder="予定の題名を入力..."
                                    value={eventTitle}
                                    onChange={(e) => setEventTitle(e.target.value)}
                                />
                                <textarea
                                    aria-label="予定の詳細"
                                    className="input"
                                    placeholder="詳細を入力..."
                                    value={eventDetail}
                                    onChange={(e) => setEventDetail(e.target.value)}
                                    style={{
                                        minHeight: "4rem",
                                        resize: "vertical"
                                    }}
                                />
                                <Button
                                    className="btn btn-primary"
                                    onClick={handleSaveEvent}
                                >
                                    予定を保存
                                </Button>
                            </div>

                            {/* 選択した日の予定をリスト表示する部分 */}
                            {(() => {
                                const raw =
                                    calendarEvents[selectedDate.toDateString()];
                                if (!raw) return null;
                                const events = Array.isArray(raw)
                                    ? raw
                                    : String(raw)
                                        .split(/<br\s*\/?\>/i)
                                        .filter(Boolean)
                                        .map((t) => ({ title: t, detail: "" }));
                                return (
                                    <div
                                        style={{
                                            marginTop: "0.5em",
                                            color: "#2d3748"
                                        }}
                                    >
                                        <strong>予定</strong>
                                        {events.map((ev, idx) => (
                                            <div
                                                key={ev.id ?? idx}
                                                style={{
                                                    marginTop: "0.5rem",
                                                    padding: "0.5rem",
                                                    background: "#fff",
                                                    borderRadius: "6px",
                                                    border: "1px solid #e2e8f0",
                                                    display: "flex",
                                                    gap: "0.5rem",
                                                    alignItems: "flex-start",
                                                    justifyContent: "space-between"
                                                }}
                                            >
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 700 }}>
                                                        {ev.title}
                                                    </div>
                                                    {ev.detail ? (
                                                        <div
                                                            style={{
                                                                marginTop: "0.25rem",
                                                                whiteSpace: "pre-wrap",
                                                                color: "#4a5568"
                                                            }}
                                                        >
                                                            {ev.detail}
                                                        </div>
                                                    ) : null}
                                                </div>
                                                <div
                                                    style={{
                                                        marginLeft: "0.5rem",
                                                        display: "flex",
                                                        alignItems: "center"
                                                    }}
                                                >
                                                    {ev.id ? (
                                                        <button
                                                            className="btn3"
                                                            onClick={() =>
                                                                handleDeleteEvent(ev.id)
                                                            }
                                                            aria-label="予定を削除"
                                                        >
                                                            削除
                                                        </button>
                                                    ) : (
                                                        <span
                                                            style={{
                                                                fontSize: "0.8rem",
                                                                color: "#718096"
                                                            }}
                                                        >
                                                            ID不明
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {activeTab === "memo" && (
                        <div className="tab-panel" role="tabpanel">
                            <h3 className="section-title">メモ</h3>
                            <textarea
                                className="memo-box"
                                placeholder="メモを入力..."
                                value={
                                    selectedCompany
                                        ? companyMemos[selectedCompany.id] || ""
                                        : ""
                                }
                                onChange={(e) => {
                                    if (!selectedCompany) return;
                                    const v = e.target.value;
                                    setCompanyMemos((prev) => ({
                                        ...prev,
                                        [selectedCompany.id]: v
                                    }));
                                }}
                            />
                            <div
                                style={{
                                    marginTop: "0.5rem",
                                    display: "flex",
                                    gap: "0.5rem"
                                }}
                            >
                                <Button
                                    className="btn2"
                                    onClick={handleSaveMemo}
                                >
                                    メモを保存
                                </Button>
                                <Button
                                    className="btn"
                                    onClick={async () => {
                                        if (!user?.id || !selectedCompany?.id) return;
                                        await axios
                                            .get("http://localhost:3030/calendar/companyMemo", {
                                                params: {
                                                    user_id: user.id,
                                                    Companies_id: selectedCompany.id
                                                }
                                            }
                                            )
                                            .then((res) => {
                                                setCompanyMemos((prev) => ({
                                                    ...prev,
                                                    [selectedCompany.id]:
                                                        res.data?.memo_text || ""
                                                }));
                                            })
                                            .catch(() => { });
                                    }}
                                >
                                    メモを取得
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}