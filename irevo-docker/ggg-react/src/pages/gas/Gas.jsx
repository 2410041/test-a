import React, { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://15.152.5.110:5001/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();
      setResponse(data.message || "レスポンスに message がありません");
    } catch (error) {
      console.error(error);
      setResponse("エラーが発生しました");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>React → Node.js → GAS テスト</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="送信するテキスト"
      />
      <button onClick={handleSubmit}>送信</button>
      <p>レスポンス: {response}</p>
    </div>
  );
}

export default App;