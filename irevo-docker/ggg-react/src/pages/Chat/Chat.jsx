import HamburgerMenu from "../../components/HamburgerMenu/HamburgerMenu";
import useChat from './useChat'; // カスタムフックをインポート
import './Chat.css';

function Chat() {

    useChat();

    return (
        <>
            <HamburgerMenu />
            <main className="main" id="myMain">
                <div className="app-container">
                    {/* 左側のチャットリストを表示する部分 */}
                    <div className="chat-list">
                        <div className="chat-list-header">チャット一覧</div>
                        {/* data-chat 属性を使って、それぞれの相手の識別子を指定 */}
                        <div className="chat-list-item selected" data-chat="iRevo株式会社">
                            iRevo株式会社
                        </div>
                        <div className="chat-list-item" data-chat="テックプラス合同会社">
                            テックプラス合同会社
                        </div>
                        <div className="chat-list-item" data-chat="株式会社フューチャーリンク">
                            株式会社フューチャーリンク
                        </div>
                        <div className="chat-list-item" data-chat="デジタルワークス株式会社">
                            デジタルワークス株式会社
                        </div>
                        <div className="chat-list-item" data-chat="AIテクノロジーズ">
                            AIテクノロジーズ
                        </div>
                    </div>
                    {/* 右側のチャット表示エリア */}
                    <div className="chat-container">
                        {/* 現在選択されているチャット相手の名前を表示するヘッダー */}
                        <div className="chat-header" id="chatHeader">
                            iRevo株式会社
                        </div>
                        {/* メッセージ一覧が表示される領域 */}
                        <div id="chatMessages" className="chat-messages">
                            {/* JavaScriptで動的にメッセージを追加 */}
                        </div>
                        {/* 入力欄と送信ボタン */}
                        <div className="chat-input">
                            <input type="text" id="chatInput" placeholder="メッセージを入力..." />
                            <button type="button">送信</button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Chat;