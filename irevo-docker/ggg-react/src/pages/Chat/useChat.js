import { useEffect } from 'react';

function useChat(){
    useEffect(() => {
        // 各チャット相手ごとにメッセージ履歴を保存するためのオブジェクト
        const chatData = {
          "iRevo株式会社": [],
          "テックプラス合同会社": [],
          "株式会社フューチャーリンク": [],
          "デジタルワークス株式会社": [],
          "AIテクノロジーズ": []
        };

        // 現在チャットしている相手の名前（初期はiRevo株式会社）
        let currentChat = "iRevo株式会社";

        // メッセージ一覧を画面に表示する関数
        function renderMessages() {
          const chatBox = document.getElementById("chatMessages");
          if (!chatBox) return;
          chatBox.innerHTML = ""; // 表示を一旦クリアする

          // 現在のチャット相手のメッセージ履歴をループして表示
          chatData[currentChat].forEach(msg => {
            const msgBlock = document.createElement("div");
            msgBlock.className = `message-block ${msg.from}`; // user または bot のクラス

            // botのときだけアイコンを表示
            msgBlock.innerHTML = `
              ${msg.from === "bot" ? '<div class="chatIcon">ア</div>' : ""}
              <div>
                <div class="message">${msg.text}</div>
                <div class="time">${msg.time}</div>
              </div>
            `;

            chatBox.appendChild(msgBlock);
          });

          // 最新のメッセージまでスクロールする
          chatBox.scrollTop = chatBox.scrollHeight;
        }

        // ユーザーがメッセージを送信する関数
        function sendMessage() {
          const input = document.getElementById("chatInput");
          if (!input) return;
          const message = input.value.trim();
          if (!message) return; // 空メッセージは無視
        // テンプレートリテラル `${...}:${...}`
        // 「時」と「分」を文字列として結合
        // 現在の時間を取得 (時:分形式)     時                             分
          const time = `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}`;  // 例 : "14:05"

          // ユーザーのメッセージを保存
          chatData[currentChat].push({ from: "user", text: message, time });
          renderMessages(); // 表示を更新
          input.value = ""; // 入力欄をリセット

          // 0.5秒後にbotの返信を追加
          setTimeout(() => {
            chatData[currentChat].push({ from: "bot", text: "了解しました！", time });
            renderMessages();
          }, 500);
        }

        // イベントハンドラー関数を定義
        function handleChatItemClick(event) {
          const item = event.currentTarget;
          // 他の項目の選択状態を解除
          document.querySelectorAll(".chat-list-item").forEach(i => i.classList.remove("selected"));
          // クリックされた項目を選択状態に変更
          item.classList.add("selected");

          // data-chat属性から選択された会社名を取得して現在の相手を更新
          currentChat = item.getAttribute("data-chat");

          // チャットヘッダーを現在の相手名に変更
          const chatHeader = document.getElementById("chatHeader");
          if (chatHeader) {
            chatHeader.textContent = currentChat;
          }

          // 新しい相手のメッセージ履歴を表示
          renderMessages();
        }

        // 送信ボタンのクリックイベントハンドラー
        function handleSendClick() {
          sendMessage();
        }

        // Enterキーでの送信イベントハンドラー
        function handleInputKeyPress(event) {
          if (event.key === 'Enter') {
            sendMessage();
          }
        }

        // チャット一覧の各項目（会社名）をクリックしたときの処理
        const chatListItems = document.querySelectorAll(".chat-list-item");
        chatListItems.forEach(item => {
          item.addEventListener("click", handleChatItemClick);
        });

        // 送信ボタンのイベントリスナー
        const sendButton = document.querySelector(".chat-input button");
        if (sendButton) {
          sendButton.addEventListener("click", handleSendClick);
        }

        // 入力欄のEnterキーイベントリスナー
        const chatInput = document.getElementById("chatInput");
        if (chatInput) {
          chatInput.addEventListener("keypress", handleInputKeyPress);
        }

        // 初回表示時にメッセージを描画
        renderMessages();

        // クリーンアップ関数
        return () => {
          chatListItems.forEach(item => {
            item.removeEventListener("click", handleChatItemClick);
          });
          if (sendButton) {
            sendButton.removeEventListener("click", handleSendClick);
          }
          if (chatInput) {
            chatInput.removeEventListener("keypress", handleInputKeyPress);
          }
        };
    }, []); // 依存配列を空にして、マウント時のみ実行
}

export default useChat;