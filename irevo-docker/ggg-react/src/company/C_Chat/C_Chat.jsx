// 必要なライブラリ・コンポーネントのインポート
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Paperclip, Send, FileText } from "lucide-react";
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

    //  ログイン企業の情報取得
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:3030/company/whoami", {
                    withCredentials: true
                });

                if (response.data.loggedIn) {
                    setUser(response.data.company); // company をセット
                }
            } catch (error) {
                console.error("whoami error:", error);
                setUser(null);
            } finally {
                setUserLoading(false);
            }
        };
        fetchUser();
    }, []);

    // スクロール禁止
    useEffect(() => {
        document.body.classList.add("no-scroll");
        document.getElementById("root")?.classList.add("no-scroll");
        return () => {
            document.body.classList.remove("no-scroll");
            document.getElementById("root")?.classList.remove("no-scroll");
        };
    }, []);

    // 応募者一覧
    const [users, setUsers] = useState([]);

    // 会話相手選択
    const [selectedUser, setSelectedUser] = useState(null);

    // 応募者一覧を取得
    useEffect(() => {
        if (!user?.id) return;
        axios.get("http://localhost:3030/chat/companyChat/users", {
            params: { Companies_id: user.id }
        })
            .then((res) => {
                const fetched = Array.isArray(res.data)
                    ? res.data.map((c) => ({
                        id: c.id,
                        name: c.u_nick || `${c.u_Fname} ${c.u_Lname}`
                    }))
                    : [];

                setUsers(fetched);

                // ★ ここで最初のユーザーを自動選択 ★
                if (fetched.length > 0 && !selectedUser) {
                    setSelectedUser(fetched[0]);
                }

            })
            .catch((err) => {
                console.error("応募者一覧取得エラー:", err);
                setUsers([]);
            });
    }, [user]);

    // チャット履歴
    const [companyMessages, setCompanyMessages] = useState({});
    const [loadingHistory, setLoadingHistory] = useState(false);

    const messages = selectedUser ? (companyMessages[selectedUser.id] || []) : [];

    // チャット履歴取得
    useEffect(() => {
        if (!user?.id || !selectedUser?.id) return;

        const fetchHistory = async () => {
            setLoadingHistory(true);
            try {
                const res = await axios.get("http://localhost:3030/chat/userChat/history", {
                    params: {
                        user_id: selectedUser.id, // 応募者
                        Companies_id: user.id    // 企業ID
                    }
                });

                setCompanyMessages((prev) => ({
                    ...prev,
                    [selectedUser.id]: res.data || []
                }));
            } catch (err) {
                console.error("history error:", err);
            }
            setLoadingHistory(false);
        };
        fetchHistory();
    }, [selectedUser, user]);

    // メッセージ送信
    const [newMessage, setNewMessage] = useState("");
    const [attachedFiles, setAttachedFiles] = useState([]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user?.id || !selectedUser?.id) return;

        try {
            await axios.post("http://localhost:3030/chat/companyChat/message", {
                user_id: selectedUser.id,
                Companies_id: user.id,
                message_text: newMessage,
                sender_type: "company"
            });

            // 再取得
            const response = await axios.get("http://localhost:3030/chat/userChat/history", {
                params: {
                    user_id: selectedUser.id,
                    Companies_id: user.id
                }
            });

            setCompanyMessages((prev) => ({
                ...prev,
                [selectedUser.id]: response.data || []
            }));

        } catch (err) {
            console.error("send error:", err);
        }

        setNewMessage("");
        setAttachedFiles([]);
    };

    // 添付ファイル
    const handleAttachFile = (e) => {
        const files = Array.from(e.target.files);
        setAttachedFiles([...attachedFiles, ...files]);
    };

    // メモ
    const [companyMemos, setCompanyMemos] = useState({});

    const handleSaveMemo = async () => {
        if (!selectedUser?.id || !user?.id) return;

        const memo = companyMemos[selectedUser.id] || "";

        try {
            await axios.post("http://localhost:3030/calendar/company_memo", {
                user_id: selectedUser.id,
                Companies_id: user.id,
                memo_text: memo
            });
        } catch (e) {
            console.warn("メモ保存API未実装のためローカル保存のみ");
        }
    };

    // 時刻フォーマット
    const formatTime = (rawTime) => {
        if (!rawTime) return "";

        const msgTime = new Date(rawTime);
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        const diff = now - msgTime;

        return diff < oneDay
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
    };

    return (
        <>
            <HamburgerMenu />
            <div className="jobchat-container">

                {/* 左：応募者一覧 */}
                <div className="sidebar-left">
                    <h2 className="sidebar-title">応募者一覧</h2>
                    <ul className="company-list">
                        {users.map((app) => (
                            <li
                                key={app.id}
                                className={`company-item ${selectedUser?.id === app.id ? "active" : ""}`}
                                onClick={() => setSelectedUser(app)}
                            >
                                {app.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 中央：チャット */}
                <div className="chat-area">
                    <Card className="chat-header">
                        <h2 className="chat-title">
                            {selectedUser ? `${selectedUser.name}` : "応募者を選択してください"}
                        </h2>
                    </Card>

                    <div className="chat-messages2" role="log">
                        {loadingHistory ? (
                            <div>読み込み中...</div>
                        ) : (
                            messages.map((msg, item) => {

                                const formattedTime = formatTime(msg.time);

                                return (
                                    <div
                                        key={item}
                                        className={`message3 message-${msg.sender_type === "company" ? "right" : "left"}`}
                                    >
                                        <div className={`bubble bubble-${msg.sender_type === "company" ? "right" : "left"}`}>
                                            <div>{msg.message_text}</div>

                                            <div className="timestamp">{formattedTime}</div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* メッセージ入力 */}
                    <div className="chat-input2">
                        <input
                            type="file"
                            id="file-upload"
                            style={{ display: "none" }}
                            multiple
                            onChange={handleAttachFile}
                        />

                        <button
                            className="btn btn-icon"
                            onClick={() => document.getElementById("file-upload").click()}
                        >
                            <Paperclip />
                        </button>

                        <Input
                            placeholder="メッセージを入力..."
                            className="flex-1"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        />

                        <Button className="btn-icon send-btn" onClick={handleSendMessage}>
                            <Send />
                        </Button>
                    </div>
                </div>

                {/* 右：メモ */}
                <div className="sidebar-right">
                    <div className="tab-panel">
                        <h3 className="section-title">メモ</h3>
                        <textarea
                            className="memo-box"
                            placeholder="メモを入力..."
                            value={selectedUser ? companyMemos[selectedUser.id] || "" : ""}
                            onChange={(e) =>
                                selectedUser &&
                                setCompanyMemos((prev) => ({
                                    ...prev,
                                    [selectedUser.id]: e.target.value
                                }))
                            }
                        />
                        <Button className="btn2" onClick={handleSaveMemo}>メモを保存</Button>
                    </div>
                </div>
            </div>
        </>
    );
}