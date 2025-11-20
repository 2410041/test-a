// 必要なライブラリ・コンポーネントのインポート
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Paperclip, Send, FileText, Search } from "lucide-react";
import Calendar from "react-calendar";
import "./C_Chat.css";
import HamburgerMenu from "../../components/C_Header/C_Header";

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
                const res = await axios.get("http://15.152.5.110:3030/log/whoami", { withCredentials: true });
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
        if (!user?.id) return;
        axios.get("http://15.152.5.110:3030/chat/companyChat/users", {
            params: { Companies_id: user.company_id }
        })
            .then(res => {
                // name, company_name, c_name など複数候補で取得
                const companies = Array.isArray(res.data)
                    ? res.data.map(c => ({
                        id: c.id,
                        name: c.u_nick || `${c.u_Fname} ${c.u_Lname}`
                    }))
                    : [];
                setCompanies(companies);
            })
            .catch(() => setCompanies([]));
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

    // ここに追加：相手ごとのメモを管理
    const [companyMemos, setCompanyMemos] = useState({});

    // 選択中企業のメッセージ一覧
    const messages = selectedCompany ? (companyMessages[selectedCompany.name] || []) : [];

    // 企業選択時に履歴を取得
    useEffect(() => {
        if (!user?.id || !selectedCompany?.id) return;
        const fetchHistory = async () => {
            setLoadingHistory(true);
            try {
                const res = await axios.get("http://15.152.5.110:3030/chat/userChat/history", {
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
            await axios.post("http://15.152.5.110:3030/chat/companyChat/message", {
                user_id: user.id,
                Companies_id: selectedCompany.id,
                message_text: newMessage,
                time: timestamp,
                sender_type: "company"
            });
            // 送信後、履歴を再取得
            const res = await axios.get("http://15.152.5.110:3030/user/user_chat/history", {
                params: { user_id: user.id, Companies_id: selectedCompany.id }
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

    // メモ保存（現状サーバー API が無い場合はローカルのみで保持）
    const handleSaveMemo = async () => {
        if (!user?.id || !selectedCompany?.id) return;
        const memo = companyMemos[selectedCompany.id] || "";
        try {
            await axios.post('http://15.152.5.110:3030/calendar/company_memo', {
                user_id: user.id,
                Companies_id: selectedCompany.id,
                memo_text: memo
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
                    <h2 className="sidebar-title">応募者一覧</h2>
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
                        <h2 className="chat-title">{selectedCompany ? `${selectedCompany.name}` : "応募者を選択してください"}</h2>
                    </Card>

                    {/* --- メッセージ表示エリア --- */}
                    <div className="chat-messages2" role="log" aria-live="polite">
                        {loadingHistory ? (
                            <div>履歴を読み込み中...</div>
                        ) : (
                            messages.map((msg, idx) => (
                                <div key={msg.id || idx} className={`message3 message-${msg.side || (msg.user === "demo_user" ? "right" : "left")}`}>
                                    <div className={`bubble bubble-${msg.side || (msg.user === "demo_user" ? "right" : "left")}`}>
                                        {/* メッセージ本文 */}
                                        {(msg.text || msg.message_text) && <div>{msg.text || msg.message_text}</div>}
                                        {/* 添付ファイルリスト */}
                                        {msg.files && msg.files.length > 0 && (
                                            <ul className="file-list-inline">
                                                {msg.files.map((file, fidx) => (
                                                    <li key={fidx} className="file-item-inline">
                                                        <FileText size={14} /> {typeof file === "string" ? file : file.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {/* タイムスタンプ・既読など */}
                                        <div className={`timestamp ${(msg.side || (msg.user === "demo_user" ? "right" : "left")) === "right" ? "timestamp-right" : ""}`}>
                                            {msg.status || ""} {msg.time}
                                        </div>
                                    </div>
                                </div>
                            ))
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
                    <div className="tab-panel" role="tabpanel">
                        <h3 className="section-title">メモ</h3>
                        {/* ここで選択日を表示 */}
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
                            <Button className="btn" onClick={() => {
                                if (!user?.id || !selectedCompany?.id) return;
                                axios.get("http://15.152.5.110:3030/company_memo", {
                                    params: { user_id: user.id, Companies_id: selectedCompany.id }
                                }).then(res => {
                                    setCompanyMemos(prev => ({ ...prev, [selectedCompany.id]: res.data?.memo_text || "" }));
                                }).catch(() => { });
                            }}>メモを取得</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}