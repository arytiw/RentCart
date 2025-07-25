'use client';

import React, { useState } from "react";

export default function SupportChat() {
  const [messages, setMessages] = useState<{from: "user"|"bot", text: string}[]>([
    {
      from: "bot", 
      text: "👋 Welcome to RentCart Support! I'm here to help you make smart rental decisions:\n\n💡 **Quick Help:**\n• Listing your items for rent\n• Finding the perfect rental\n• Pricing strategies that work\n• Safety & verification tips\n• Maximizing your earnings\n\nWhat would you like help with today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Quick action buttons for common queries
  const quickActions = [
    "How do I price my rental?",
    "What items rent well?",
    "Safety tips for renting",
    "How to get more bookings?",
    "Payment & earnings help"
  ];

  const sendMessage = async (messageText?: string) => {
    const message = messageText || input;
    if (!message.trim()) return;
    
    setMessages(prevMessages => [...prevMessages, {from: "user", text: message}]);
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:9093/api/support/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          message: message,
          context: "rentcart_assistance"
        }),
      });
      
      if (res.ok) {
        const text = await res.text();
        setMessages(msgs => [...msgs, {from: "bot", text}]);
      } else {
        throw new Error('Backend unavailable');
      }
    } catch (error) {
      // Enhanced fallback responses for rental decisions
      const response = getSmartResponse(message);
      setMessages(msgs => [...msgs, {from: "bot", text: response}]);
    }
    
    setInput("");
    setLoading(false);
  };

  // Smart response system for rental/selling guidance
  const getSmartResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Pricing guidance
    if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("charge")) {
      return "💰 **Smart Pricing Strategy:**\n\n🔍 **Research First:**\n• Check similar items in your area\n• Look at successful listings\n• Consider item condition & age\n\n📊 **Pricing Tips:**\n• Start 10-15% below market rate\n• Weekend/holiday rates: +30%\n• Monthly discounts: 15-20% off\n• Bundle deals for multiple items\n\n💡 **Pro Tip:** Items priced competitively get 3x more bookings!";
    }
    
    // What to rent guidance
    if (lowerMessage.includes("what") && (lowerMessage.includes("rent") || lowerMessage.includes("sell"))) {
      return "🎯 **Top Rental Categories:**\n\n🏠 **High Demand Items:**\n• Camera & photography gear\n• Power tools & equipment\n• Party supplies & decorations\n• Outdoor/camping gear\n• Exercise equipment\n\n💎 **Premium Rentals:**\n• Electronics (laptops, gaming)\n• Musical instruments\n• Designer clothing/accessories\n• Professional equipment\n\n📈 **Seasonal Winners:**\n• Summer: AC units, coolers, beach gear\n• Winter: Heaters, holiday decorations\n• Events: Sound systems, projectors";
    }
    
    // Listing optimization
    if (lowerMessage.includes("list") || lowerMessage.includes("post") || lowerMessage.includes("booking")) {
      return "📸 **Create Winning Listings:**\n\n✨ **Photos That Sell:**\n• 5-8 high-quality images\n• Natural lighting (avoid flash)\n• Show item from multiple angles\n• Include size/scale references\n\n📝 **Description Tips:**\n• Clear, honest condition details\n• Mention included accessories\n• Highlight unique features\n• Set clear pickup/delivery terms\n\n🚀 **Boost Your Bookings:**\n• Respond within 1 hour\n• Offer flexible pickup times\n• Provide usage instructions\n• Ask for reviews after rental";
    }
    
    // Safety guidance
    if (lowerMessage.includes("safe") || lowerMessage.includes("security") || lowerMessage.includes("protect")) {
      return "🛡️ **Stay Safe While Renting:**\n\n✅ **Before Meeting:**\n• Verify renter's profile & ID\n• Meet in public places\n• Bring a friend if possible\n• Trust your instincts\n\n💳 **Secure Payments:**\n• Use only platform payments\n• Never accept cash apps/transfers\n• Require security deposits\n• Document item condition\n\n📱 **Smart Practices:**\n• Keep communication on-platform\n• Take photos before/after\n• Set clear rental terms\n• Report suspicious behavior";
    }
    
    // Earnings optimization
    if (lowerMessage.includes("earn") || lowerMessage.includes("money") || lowerMessage.includes("income")) {
      return "💸 **Maximize Your Earnings:**\n\n🎯 **High-ROI Strategies:**\n• Rent frequently used items\n• Offer delivery for +20% premium\n• Create item bundles\n• Maintain 5-star ratings\n\n📊 **Track Performance:**\n• Monitor booking rates\n• Adjust pricing monthly\n• Ask for feedback\n• Expand successful categories\n\n💡 **Pro Tips:**\n• Active renters earn 400% more\n• Quick responses = more bookings\n• Professional photos = higher rates\n• Seasonal items can earn ₹15k+/month";
    }
    
    // General decision help
    if (lowerMessage.includes("decide") || lowerMessage.includes("should i") || lowerMessage.includes("help me")) {
      return "🤔 **Decision Helper:**\n\n❓ **Ask Yourself:**\n• Do I use this item < 12 times/year?\n• Is it in good condition?\n• Would others find it useful?\n• Can I handle rental logistics?\n\n✅ **Good Rental Items:**\n• Expensive but occasionally used\n• Seasonal/event-specific items\n• Professional equipment\n• Trending/popular items\n\n❌ **Skip These:**\n• Personal hygiene items\n• Heavily worn items\n• Items without demand\n• Irreplaceable sentimental items\n\n💭 **Still unsure?** Tell me what item you're considering!";
    }
    
    // Default helpful response
    return "🤗 **I'm here to help you succeed on RentCart!**\n\n🎯 **Popular Questions:**\n• \"How should I price my camera?\" - Get pricing strategies\n• \"What safety tips for meeting renters?\" - Security guidance\n• \"Which items make the most money?\" - Profitable categories\n• \"How to get more bookings?\" - Optimization tips\n\n💡 **Quick Tips:**\n✅ Complete your profile (gets 2x more trust)\n✅ Respond quickly (within 1 hour ideal)\n✅ Professional photos (worth 30% price premium)\n✅ Clear descriptions (reduce questions)\n\n**Try asking: \"What should I know about renting [specific item]?\"**";
  };

  return (
    <div className="max-w-2xl mx-auto p-6 border border-gray-200 rounded-xl shadow-lg bg-white">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
          🤖
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">RentCart Assistant</h2>
          <p className="text-sm text-gray-600">Your rental success partner</p>
        </div>
      </div>
      
      {/* Contact Information Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 mb-4 rounded-lg border-l-4 border-blue-400">
        <h3 className="font-semibold text-blue-800 mb-2">🆘 Need Immediate Help?</h3>
        <div className="text-sm text-blue-700">
          <p className="mb-1">📞 <strong>Call:</strong> +91-{Math.floor(Math.random() * 9000000000) + 1000000000}</p>
          <p>📧 <strong>Email:</strong> support{Math.floor(Math.random() * 1000)}@rentcart.com</p>
        </div>
      </div>
      
      {/* Quick Action Buttons */}
      <div className="mb-3">
        <p className="text-xs text-gray-600 mb-2">💡 Quick Help:</p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => sendMessage(action)}
              className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 px-3 py-2 rounded-full transition-all transform hover:scale-105 border border-blue-200"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-72 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-3 mb-3 rounded border">
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 ${m.from === "user" ? "text-right" : "text-left"}`}>
            <div className={`inline-block max-w-[85%] p-3 rounded-lg ${
              m.from === "user" 
                ? "bg-blue-500 text-white rounded-br-none" 
                : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
            }`}>
              <div className="text-xs opacity-75 mb-1">
                {m.from === "user" ? "You" : "🤖 RentCart Assistant"}
              </div>
              <div className="whitespace-pre-line text-sm leading-relaxed">
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left mb-3">
            <div className="inline-block bg-gray-100 p-3 rounded-lg animate-pulse">
              <div className="text-gray-500 text-sm">🤖 Assistant is thinking...</div>
            </div>
          </div>
        )}
      </div>
      <div className="flex">
        <input
          className="flex-1 border rounded-l p-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          disabled={loading}
          placeholder="Ask about pricing, listing tips, safety..."
        />
        <button
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-r hover:from-blue-600 hover:to-indigo-700 transition-all"
          onClick={() => sendMessage()}
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
} 
