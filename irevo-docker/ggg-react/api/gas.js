const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5001;

// CORS有効化（Reactからのアクセスを許可）
app.use(cors());
app.use(express.json());

// GASのURL（デプロイ済み）
const GAS_URL = "https://script.google.com/macros/s/AKfycbxj4m0KdL1A6lrQHkWev4BTjBtdxr1m89O6m9i_mgkMwuFhqxNavwNtmF9FPgdOQYUl/exec";

// React から呼び出すAPI
app.post("/api/summary", async (req, res) => {
  try {
    // Reactから受け取ったデータ
    const { text } = req.body;

    // GASへリクエスト
    const response = await axios.post(GAS_URL, { text });

    // GASのレスポンスをReactへ返す
    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "GASへのリクエストに失敗しました" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});