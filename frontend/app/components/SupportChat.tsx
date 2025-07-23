'use client';

import React, { useState } from "react";

export default function SupportChat() {
  const [messages, setMessages] = useState<{from: "user"|"bot", text: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, {from: "user", text: input}]);
    setLoading(true);
    const res = await fetch("http://localhost:9093/api/support/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message: input}),
    });
    const text = await res.text();
    setMessages(msgs => [...msgs, {from: "bot", text}]);
    setInput("");
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-2">Support Chat</h2>
      <div className="h-64 overflow-y-auto bg-gray-50 p-2 mb-2 rounded">
        {messages.map((m, i) => (
          <div key={i} className={`mb-1 text-${m.from === "user" ? "right" : "left"}`}>
            <span className={m.from === "user" ? "text-blue-600" : "text-green-600"}>
              <b>{m.from === "user" ? "You" : "Bot"}:</b> {m.text}
            </span>
          </div>
        ))}
        {loading && <div className="text-gray-400">Bot is typing...</div>}
      </div>
      <div className="flex">
        <input
          className="flex-1 border rounded p-2 mr-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          disabled={loading}
          placeholder="Type your message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
} 
