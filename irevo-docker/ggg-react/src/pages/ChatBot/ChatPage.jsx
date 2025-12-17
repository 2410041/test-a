import { useState, useRef, useEffect } from "react";
import { chatWithGemini, getInterviewEvaluation } from "./geminiService";
import removeMarkdown from "remove-markdown";
import superagent from 'superagent';
import "./ChatAPI.css";
import Header from "../../components/HamburgerMenu/HamburgerMenu";

// スタイル定義
const contentStyle = { width: '80%', textAlign: 'center' }
const textareaStyle = { width: '100%', height: 100 }
const buttonStyle = { ...textareaStyle, fontSize: 30 }
const audioStyle = { ...textareaStyle }

export default function ChatAPIPage() {
    // チャットメッセージの配列
    const [messages, setMessages] = useState([]);
    // 入力欄のテキスト
    const [input, setInput] = useState("");
    // 送信中フラグ
    const [loading, setLoading] = useState(false);
    // 検索履歴
    const [history, setHistory] = useState([]);
    // 選択中の履歴
    const [selectedHistory, setSelectedHistory] = useState(null);
    // VOICEVOXから返ってきた音声データ
    const [audioData, setAudioData] = useState();
    // 音声認識中フラグ
    const [isListening, setIsListening] = useState(false);
    // audioタグへの参照
    const audioRef = useRef(null);
    // 音声認識インスタンスへの参照
    const recognitionRef = useRef(null);

    const [speakerId, setSpeakerId] = useState(13);

    const BotBoy = () => {
        setSpeakerId(13);
    };
    const BotGirl = () => {
        setSpeakerId(27);
    };
    const zundaVoice = () => {
        setSpeakerId(3);
    }

    // 音声データがセットされたら自動再生
    useEffect(() => {
        if (audioData && audioRef.current) {
            audioRef.current.play().catch(error => {
                console.error('自動再生エラー:', error)
            })
        }
    }, [audioData])

    // 音声認識の初期化（マウント時に1度だけ）
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.lang = "ja-JP";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            setIsListening(false);
        };

        // 無音で認識が終わったら2秒後に再開
        recognition.onend = () => {
            if (isListening) {
                setTimeout(() => {
                    if (isListening) recognition.start();
                }, 1000); // 1秒待って再開
            }
        };

        recognition.onerror = () => setIsListening(false);

        recognitionRef.current = recognition;
    }, [isListening]);

    // 音声入力開始ボタン押下時の処理
    const handleStartListening = () => {
        if (recognitionRef.current) {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    // メッセージ送信処理
    const sendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;
        // ユーザーのメッセージを即時表示
        const userMessage = { text: input, sender: "user" };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);
        setAudioData(null); // 前の音声データをクリア
        try {
            // Gemini APIでAI応答を取得
            const response = await chatWithGemini(input);
            const botMessage = { text: response, sender: "bot" };
            setMessages(prev => [...prev, botMessage]);
            // 履歴に追加（重複は除外、最大20件）
            setHistory(prev => [input, ...prev.filter(h => h !== input)].slice(0, 20));
            setSelectedHistory(null);

            // VOICEVOX APIで音声合成用クエリ作成
            const queryRes = await superagent
                .post('http://localhost:50021/audio_query')
                .query({ speaker: speakerId, text: response })

            if (!queryRes) return

            // VOICEVOX APIで音声合成
            const voiceRes = await superagent
                .post('http://localhost:50021/synthesis')
                .query({ speaker: speakerId })
                .send(queryRes.body)
                .responseType('blob')

            if (!voiceRes) return

            // 音声データをstateにセット
            setAudioData(voiceRes.body)

        } catch (error) {
            // エラー時はbotのエラーメッセージを表示
            const errorMessage = { text: "エラーが発生しました", sender: "bot" };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    // 履歴クリック時にその履歴の内容でチャットを再現
    const handleHistoryClick = (item) => {
        setSelectedHistory(item);
        // 履歴クリック時は、その質問だけをメッセージ欄に表示し、再度APIコール
        setMessages([{ text: item, sender: "user" }]);
        setInput("");
        setLoading(true);
        chatWithGemini(item)
            .then(response => {
                setMessages(prev => [...prev, { text: response, sender: "bot" }]);
            })
            .catch(() => {
                setMessages(prev => [...prev, { text: "エラーが発生しました", sender: "bot" }]);
            })
            .finally(() => setLoading(false));
    };

    // 終了ボタン押下時の処理
    const handleFinish = async () => {
        const userMessages = messages.filter(m => m.sender === "user").map(m => m.text).join("\n");
        setLoading(true);
        try {
            const response = await getInterviewEvaluation(userMessages);
            const botMessage = { text: response, sender: "bot" };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "評価取得中にエラーが発生しました", sender: "bot" }]);
        } finally {
            setLoading(false);
        }
    };

    // 画面全体スクロール禁止（この画面だけ）
    useEffect(() => {
        document.body.classList.add("no-scroll");
        document.getElementById("root")?.classList.add("no-scroll");
        return () => {
            document.body.classList.remove("no-scroll");
            document.getElementById("root")?.classList.remove("no-scroll");
        };
    }, []);

    return (
        <>
            <Header />
            <div className="app-container">

                {/* 右側：チャット画面 */}
                <div className="chat-container">
                    <div className="chat-header">AIチャット</div>
                    <div className="chat-messages">
                        {/* 先に表示：messagesの最後以外 */}
                        {messages.slice(0, -1).map((msg, idx) => (
                            <div key={idx} className={`message-block ${msg.sender}`}>
                                {msg.sender === "bot" && <div className="chatIcon">B</div>}
                                <div className="message">{removeMarkdown(msg.text)}</div>
                            </div>
                        ))}

                        {/* 最後のメッセージはbotの返答＋音声が揃ったときのみ表示 */}
                        {(audioData && messages.length > 0 && messages[messages.length - 1].sender === "bot") ? (
                            <>
                                <div className={`message-block bot`}>
                                    <div className="chatIcon">B</div>
                                    <div className="message">{removeMarkdown(messages[messages.length - 1].text)}</div>
                                </div>
                                <div style={contentStyle}>
                                    <audio
                                        ref={audioRef}
                                        style={audioStyle}
                                        controls
                                        src={window.URL.createObjectURL(audioData)}
                                    />
                                </div>
                            </>
                        ) : null}
                    </div>
                    {/* 入力欄と送信・音声入力ボタン */}
                    <form className="chat-input" onSubmit={sendMessage}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="メッセージを入力..."
                            disabled={loading}
                            className="chat-input-text"
                        />
                        <div className="chat-input-buttons-all">
                            <button type="submit" disabled={loading || !input.trim()} className="chat-send-btn">
                                {loading ? "送信中..." : "送信"}
                            </button>
                            <button
                                type="button"
                                onClick={handleStartListening}
                                disabled={isListening || loading}
                                title="音声入力"
                                className="chat-voice-btn"
                            >
                                {isListening ? "🎤認識中..." : "音声認識"}
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    const userMessages = messages.filter(m => m.sender === "user").map(m => m.text).join("\n");
                                    setLoading(true);
                                    try {
                                        const response = await getInterviewEvaluation(userMessages);
                                        const botMessage = { text: response, sender: "bot" };
                                        setMessages(prev => [...prev, botMessage]);
                                    } catch (error) {
                                        setMessages(prev => [...prev, { text: "評価取得中にエラーが発生しました", sender: "bot" }]);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading || messages.filter(m => m.sender === "user").length === 0}
                                title="面接練習の評価・アドバイスをもらう"
                                className="chat-finish-btn"
                                style={{ marginLeft: "auto" }}
                            >
                                終了（評価・アドバイス）
                            </button>
                        </div>
                    </form>

                    {/* ここに音声選択ボタンを表示（入力欄の下） */}
                    <div className="voice-selection">
                        <button
                            type="button"
                            onClick={BotBoy}
                            className="chat-voice-btn-on"
                        >
                            男性
                        </button>
                        <button
                            type="button"
                            onClick={BotGirl}
                            className="chat-voice-btn-on"
                        >
                            女性
                        </button>
                        <button
                            type="button"
                            onClick={zundaVoice}
                            className="chat-voice-btn-on"
                        >
                            ずんだもん
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};