// LayoutPushUp.jsx
import React from "react";

const LayoutPushUp = ({ children }) => {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",  // スクロール禁止
      }}
    >
      {/* メインコンテンツ */}
      <div style={{ paddingBottom: "100px" }}>
        {children}
      </div>

      {/* 下に配置する空要素（画面内に押し上げるためのスペーサー） */}
      <div
        style={{
          height: "200px",
        }}
      ></div>
    </div>
  );
};

export default LayoutPushUp;
