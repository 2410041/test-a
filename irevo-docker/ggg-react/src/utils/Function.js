// src/utils/formatTime.js
export function formatChatTime(timeString) {
    const msgTime = new Date(timeString);
    const now = new Date();
    const diff = now - msgTime;
    const oneDay = 24 * 60 * 60 * 1000;

    // 1日未満 → HH:MM
    if (diff < oneDay) {
        return msgTime.toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    // 1日以上 → MM/DD HH:MM
    return msgTime.toLocaleString("ja-JP", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}
