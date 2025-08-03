'use client';

import React, { useState, useRef, useEffect } from "react";
import { FaPhone, FaEnvelope, FaClock, FaRobot, FaPaperPlane } from "react-icons/fa";
import { buildUrl, API_CONFIG } from '../config/api';

export default function SupportChat() {
  const [messages, setMessages] = useState<{from: "user"|"bot", text: string, timestamp: Date}[]>([
    {
      from: "bot", 
      text: "👋 Hi! I'm your RentCart AI assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simplified quick action buttons
  const quickActions = [
    { text: "Pricing help", category: "pricing" },
    { text: "Safety tips", category: "safety" },
    { text: "Earnings advice", category: "earnings" },
    { text: "Listing tips", category: "listing" }
  ];

  const sendMessage = async (messageText?: string) => {
    const message = messageText || input;
    if (!message.trim()) return;
    
    setMessages(prevMessages => [...prevMessages, {from: "user", text: message, timestamp: new Date()}]);
    setLoading(true);
    
    try {
      const url = buildUrl('SUPPORT_SERVICE', API_CONFIG.ENDPOINTS.SUPPORT_CHAT);
      const res = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          message: message,
          context: "rentcart_assistance"
        }),
      });
      
      if (res.ok) {
        const text = await res.text();
        setMessages(msgs => [...msgs, {from: "bot", text, timestamp: new Date()}]);
      } else {
        throw new Error('Backend unavailable');
      }
    } catch (error) {
      const response = getSmartResponse(message);
      setMessages(msgs => [...msgs, {from: "bot", text: response, timestamp: new Date()}]);
    }
    
    setInput("");
    setLoading(false);
  };

  // Simplified smart response system
  const getSmartResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "👋 Hello! I'm here to help you succeed with your rentals. What would you like to know?";
    }

    if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("charge")) {
      return "💰 **Pricing Tips:**\n\n• Research similar items in your area\n• Start 15% below market rate\n• Consider 8-12% of item value as daily rate\n• Offer weekly discounts for better bookings\n\nWhat specific item are you pricing?";
    }
    
    if (lowerMessage.includes("safe") || lowerMessage.includes("security")) {
      return "🛡️ **Safety First:**\n\n• Always meet in public places\n• Use RentCart's payment system only\n• Take photos before and after\n• Verify renter's profile and reviews\n• Trust your instincts\n\nNeed more specific safety advice?";
    }
    
    if (lowerMessage.includes("earn") || lowerMessage.includes("money") || lowerMessage.includes("income")) {
      return "💸 **Maximize Earnings:**\n\n• Respond quickly to inquiries\n• Maintain excellent item condition\n• Provide clear instructions\n• Ask for reviews after rentals\n• Offer delivery for convenience\n\nWhat type of items do you rent?";
    }

    if (lowerMessage.includes("list") || lowerMessage.includes("post") || lowerMessage.includes("booking")) {
      return "📸 **Better Listings:**\n\n• Use high-quality photos (6-8 images)\n• Write clear, detailed descriptions\n• Include all accessories\n• Set realistic availability\n• Respond within 30 minutes\n\nNeed help with a specific listing?";
    }

    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return "🤗 You're welcome! I'm here 24/7 if you need more help. Good luck with your rentals! 🚀";
    }
    
    return "🤖 I'm here to help with rental success! Try asking about:\n\n• Pricing strategies\n• Safety tips\n• Earnings optimization\n• Listing improvements\n\nWhat would you like to know?";
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Clean Header */}
        <div className="bg-gradient-to-r from-alibaba-orange to-alibaba-orange-dark text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
            <FaRobot className="text-xl" />
        </div>
            <div>
                <h2 className="font-bold text-xl">RentCart Support</h2>
                <p className="text-white/90 text-sm">AI Assistant • 24/7 Available</p>
          </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Online</span>
          </div>
        </div>
      </div>

        {/* Quick Actions */}
      <div className="p-4 bg-gray-50 border-b">
          <p className="text-sm text-gray-600 mb-3">Quick help:</p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => sendMessage(action.text)}
                className="px-4 py-2 bg-white hover:bg-alibaba-orange hover:text-white border border-gray-200 hover:border-alibaba-orange rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
                {action.text}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
        <div className="h-96 overflow-y-auto bg-gray-50 p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] ${
              m.from === "user" 
                  ? "bg-alibaba-orange text-white rounded-2xl rounded-br-md" 
                : "bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-md shadow-sm"
              } p-4`}>
                <div className="flex items-center justify-between text-xs opacity-75 mb-2">
                  <span className="font-medium">{m.from === "user" ? "You" : "AI Assistant"}</span>
                <span>{formatTime(m.timestamp)}</span>
              </div>
              <div className="whitespace-pre-line text-sm leading-relaxed">
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-4 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-alibaba-orange rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-alibaba-orange rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-alibaba-orange rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
          <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask me anything about rentals..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-alibaba-orange focus:border-transparent text-sm"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
              className="px-6 py-3 bg-alibaba-orange hover:bg-alibaba-orange-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium flex items-center gap-2"
          >
              <FaPaperPlane className="text-sm" />
            Send
          </button>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <FaPhone className="text-alibaba-orange text-xl mx-auto mb-2" />
          <h3 className="font-semibold text-gray-800">Call Support</h3>
          <p className="text-sm text-gray-600">+91-9876543210</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <FaEnvelope className="text-alibaba-orange text-xl mx-auto mb-2" />
          <h3 className="font-semibold text-gray-800">Email Support</h3>
          <p className="text-sm text-gray-600">support@rentcart.com</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <FaClock className="text-alibaba-orange text-xl mx-auto mb-2" />
          <h3 className="font-semibold text-gray-800">Response Time</h3>
          <p className="text-sm text-gray-600">Usually &lt; 2 hours</p>
        </div>
      </div>
    </div>
  );
}