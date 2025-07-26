'use client';

import React, { useState, useRef, useEffect } from "react";
import { FaPhone, FaEnvelope, FaClock, FaRobot } from "react-icons/fa";

export default function SupportChat() {
  const [messages, setMessages] = useState<{from: "user"|"bot", text: string, timestamp: Date}[]>([
    {
      from: "bot", 
      text: "👋 Welcome to RentCart Support! I'm your AI assistant here to help you succeed with rentals.\n\n� *I can help you with:*\n• Smart pricing strategies\n• Item listing optimization\n• Safety & security tips\n• Earnings maximization\n• Platform best practices\n\nWhat would you like help with today?",
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

  // Enhanced quick action buttons
  const quickActions = [
    { icon: "💰", text: "How do I price my rental?", category: "pricing" },
    { icon: "📈", text: "What items rent well?", category: "items" },
    { icon: "🛡️", text: "Safety tips for renting", category: "safety" },
    { icon: "🚀", text: "How to get more bookings?", category: "optimization" },
    { icon: "💸", text: "Maximize my earnings", category: "earnings" }
  ];

  const sendMessage = async (messageText?: string) => {
    const message = messageText || input;
    if (!message.trim()) return;
    
    setMessages(prevMessages => [...prevMessages, {from: "user", text: message, timestamp: new Date()}]);
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
        setMessages(msgs => [...msgs, {from: "bot", text, timestamp: new Date()}]);
      } else {
        throw new Error('Backend unavailable');
      }
    } catch (error) {
      // Enhanced fallback responses for rental decisions
      const response = getSmartResponse(message);
      setMessages(msgs => [...msgs, {from: "bot", text: response, timestamp: new Date()}]);
    }
    
    setInput("");
    setLoading(false);
  };

  // Enhanced smart response system with more contextual understanding
  const getSmartResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Greeting responses
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "👋 Hello! I'm your RentCart AI assistant. I'm here to help you succeed with your rental business!\n\n🎯 *Popular topics I can help with:*\n• Pricing strategies (\"How to price my camera?\")\n• Listing optimization (\"How to get more bookings?\")\n• Safety tips (\"Is renting safe?\")\n• Earnings advice (\"How to make more money?\")\n\nWhat would you like to know?";
    }

    // Pricing guidance - Enhanced
    if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("charge")) {
      return "💰 *Smart Pricing Strategy:*\n\n🔍 **Market Research:**\n• Check 5-10 similar items in your area\n• Note their condition vs. yours\n• Look at booking frequency\n\n📊 **Pricing Formula:**\n• Base rate: 8-12% of item's current value\n• Weekend premium: +25-35%\n• Peak season: +40-50%\n• Damage deposit: 15-25% of item value\n\n� **Pro Tips:**\n• Start 15% below market, increase gradually\n• Offer weekly discounts (20% off)\n• Bundle related items for higher rates\n• Update prices based on demand\n\n*Example: ₹50,000 camera → ₹500-600/day base rate*";
    }
    
    // What to rent guidance - Enhanced
    if (lowerMessage.includes("what") && (lowerMessage.includes("rent") || lowerMessage.includes("sell"))) {
      return "🎯 *High-Profit Rental Categories:*\n\n💎 **Premium Electronics (₹500-2000/day):**\n• DSLR cameras & lenses\n• MacBooks & gaming laptops\n• Professional audio equipment\n• Drones & action cameras\n\n🔧 **Tools & Equipment (₹300-800/day):**\n• Power tools (drills, saws)\n• Pressure washers\n• Professional cleaning equipment\n• Construction tools\n\n🎉 **Event & Party (₹200-1500/day):**\n• Sound systems & speakers\n• Projectors & screens\n• Party decorations\n• Catering equipment\n\n📈 **Seasonal Winners:**\n• Summer: AC units, coolers, camping gear\n• Monsoon: Dehumidifiers, umbrellas\n• Festivals: decorations, sound systems\n\n*Items that pay for themselves in 10-15 rentals are goldmines!*";
    }
    
    // Listing optimization - Enhanced
    if (lowerMessage.includes("list") || lowerMessage.includes("post") || lowerMessage.includes("booking") || lowerMessage.includes("more rental")) {
      return "📸 *Create Irresistible Listings:*\n\n✨ **Photo Mastery:**\n• 6-8 high-res images (different angles)\n• Natural lighting + clean background\n• Show scale (person using item)\n• Include all accessories/components\n• Before/after shots for tools\n\n📝 **Description That Converts:**\n• Lead with main benefit/use case\n• List ALL included items\n• Mention recent maintenance/upgrades\n• Clear availability calendar\n• Pickup/delivery options\n\n🚀 **Booking Boosters:**\n• Respond within 30 minutes (crucial!)\n• Offer flexible pickup times\n• Provide detailed usage instructions\n• Follow up for reviews\n• Maintain 4.8+ star rating\n\n*Well-optimized listings get 5x more inquiries!*";
    }
    
    // Safety guidance - Enhanced
    if (lowerMessage.includes("safe") || lowerMessage.includes("security") || lowerMessage.includes("protect") || lowerMessage.includes("scam")) {
      return "🛡️ *Complete Safety Guide:*\n\n✅ **Before Meeting:**\n• Verify ID & phone number\n• Check renter's profile & reviews\n• Meet in public spaces (malls, cafes)\n• Bring a friend for expensive items\n• Trust your instincts\n\n💳 **Payment Security:**\n• ONLY use RentCart's payment system\n• Never accept external payments\n• Require full deposit upfront\n• Document item condition (photos/video)\n• Get signed rental agreement\n\n🚨 **Red Flags to Avoid:**\n• Requests for personal contact info\n• Offers to pay extra for quick deal\n• Pickup location changes\n• Pressure to rent immediately\n• Poor communication/grammar\n\n📱 **Best Practices:**\n• Keep all communication on-platform\n• Take timestamped photos\n• Set clear return conditions\n• Report suspicious behavior immediately\n\n*Your safety is worth more than any rental fee!*";
    }
    
    // Earnings optimization - Enhanced
    if (lowerMessage.includes("earn") || lowerMessage.includes("money") || lowerMessage.includes("income") || lowerMessage.includes("profit")) {
      return "💸 *Maximize Your Rental Income:*\n\n🎯 **High-ROI Strategies:**\n• Focus on items you use <12 times/year\n• Offer premium delivery service (+30% fee)\n• Create themed bundles (photography kit)\n• Rent during peak times (weekends/holidays)\n• Cross-promote complementary items\n\n📊 **Performance Tracking:**\n• Monitor booking rates weekly\n• Test different prices monthly\n• Track seasonal demand patterns\n• Ask for detailed feedback\n• Expand successful categories\n\n� **Income Potential Examples:**\n• Camera gear: ₹15,000-25,000/month\n• Power tools: ₹8,000-15,000/month\n• Party equipment: ₹20,000-40,000/month\n• Gaming setup: ₹10,000-18,000/month\n\n🚀 **Pro Secrets:**\n• Active renters earn 400% more\n• Quick responses = 60% more bookings\n• Professional photos = 35% higher rates\n• 5-star ratings = premium pricing power\n\n*Top renters make ₹50,000+ monthly with 10-15 items!*";
    }

    // Technology and platform help
    if (lowerMessage.includes("app") || lowerMessage.includes("website") || lowerMessage.includes("platform") || lowerMessage.includes("technical")) {
      return "📱 *Platform Help & Tips:*\n\n🔧 **Common Solutions:**\n• Clear browser cache if pages load slowly\n• Use mobile app for faster responses\n• Upload photos in JPG format (max 5MB)\n• Check internet connection for uploads\n\n📸 **Photo Upload Tips:**\n• Compress large images before upload\n• Use portrait mode for better quality\n• Natural lighting works best\n• Multiple angles show item condition\n\n💬 **Communication Features:**\n• Use built-in chat for all discussions\n• Quick templates for common responses\n• Auto-notifications for new messages\n• Video call option for expensive items\n\n📧 **Need More Help?**\n• Email: support@rentcart.com\n• Phone: +91-9876543210\n• Live chat: Available 9 AM - 9 PM\n• Response time: Usually within 2 hours\n\n*I'm here 24/7 for instant help!*";
    }
    
    // General decision help - Enhanced
    if (lowerMessage.includes("decide") || lowerMessage.includes("should i") || lowerMessage.includes("help me") || lowerMessage.includes("advice")) {
      return "🤔 *Smart Decision Framework:*\n\n❓ **The 4-Question Test:**\n1. Do I use this <12 times per year?\n2. Is it worth ₹5,000+ in current condition?\n3. Would 5+ people want to rent this?\n4. Can I handle rental logistics?\n\n✅ **Perfect Rental Items:**\n• Expensive but occasionally used\n• High demand in your area\n• Easy to transport/setup\n• Difficult to buy elsewhere\n• Trending/seasonal items\n\n❌ **Avoid These:**\n• Personal hygiene items\n• Heavily worn/damaged items\n• Very niche/specialized tools\n• Items you use daily\n• Sentimental/irreplaceable items\n\n💡 **Quick Success Test:**\n*Search for your item on RentCart - if 5+ similar listings exist with good reviews, you're golden!*\n\n🎯 **Still unsure?** Tell me the specific item and I'll give you personalized advice!";
    }

    // Specific item advice
    if (lowerMessage.includes("camera") || lowerMessage.includes("dslr")) {
      return "📷 *Camera Rental Success Guide:*\n\n💰 **Pricing Sweet Spot:**\n• Entry DSLR: ₹300-500/day\n• Professional DSLR: ₹800-1200/day\n• Premium lenses: ₹200-400/day each\n• Complete kit bundle: +50% premium\n\n📦 **What to Include:**\n• Camera body + kit lens\n• Charger + extra battery\n• Memory card (32GB+)\n• Camera bag/strap\n• Lens cleaning kit\n• Quick start guide\n\n🎯 **Target Customers:**\n• Wedding photographers (weekends)\n• Travel enthusiasts\n• Content creators\n• Photography students\n• Event organizers\n\n⚡ **Pro Tips:**\n• Offer photography tutorials (+₹200)\n• Partner with event planners\n• Create Instagram-worthy example shots\n• Provide lens recommendations\n\n*Cameras are goldmine rentals - high demand, great margins!*";
    }

    // Thank you responses
    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks") || lowerMessage.includes("helpful")) {
      return "🤗 *You're very welcome!* I'm glad I could help!\n\n🌟 *Remember:*\n• I'm available 24/7 for any questions\n• Don't hesitate to ask for specific advice\n• Share your success stories with me!\n• Check back for new tips and strategies\n\n💡 *Quick reminder:* The most successful renters on RentCart are those who:\n✅ Respond quickly to inquiries\n✅ Maintain excellent item condition\n✅ Provide outstanding customer service\n✅ Continuously optimize their listings\n\nWishing you amazing rental success! 🚀💰";
    }
    
    // Default enhanced response
    return "🤖 *I'm your AI rental success coach!*\n\n🎯 **Try asking me:**\n• \"How to price my [specific item]?\"\n• \"Is [item name] profitable to rent?\"\n• \"Safety tips for expensive items\"\n• \"How to get 5-star reviews?\"\n• \"Best times to rent out items\"\n• \"How to handle difficult renters\"\n\n💡 **Popular Success Topics:**\n🏆 Pricing strategies that work\n📸 Creating killer listings\n🛡️ Staying safe while renting\n� Maximizing your earnings\n📱 Platform tips & tricks\n\n*Be specific with your questions - the more details you give me, the better advice I can provide!*\n\nWhat would you like to master first? 🚀";
  };

  // Format timestamp for display
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Contact Information Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FaRobot className="text-xl" />
            <h3 className="font-semibold text-lg">RentCart Support</h3>
          </div>
          <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Online</span>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
            <FaPhone className="text-green-300" />
            <div>
              <div className="font-medium">Call Support</div>
              <div className="text-xs opacity-90">+91-9876543210</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
            <FaEnvelope className="text-blue-300" />
            <div>
              <div className="font-medium">Email Support</div>
              <div className="text-xs opacity-90">support@rentcart.com</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
            <FaClock className="text-yellow-300" />
            <div>
              <div className="font-medium">Response Time</div>
              <div className="text-xs opacity-90">Usually &lt; 2 hours</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="text-sm font-medium text-gray-700 mb-2">Quick Help Topics:</div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => sendMessage(action.text)}
              className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-full text-xs transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span>{action.icon}</span>
              <span>{action.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-4 space-y-4"
           style={{ scrollBehavior: 'smooth' }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] ${
              m.from === "user" 
                ? "bg-blue-500 text-white rounded-2xl rounded-br-md" 
                : "bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-md shadow-sm"
            } p-3`}>
              <div className="flex items-center justify-between text-xs opacity-75 mb-1">
                <span>{m.from === "user" ? "You" : "🤖 AI Assistant"}</span>
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
            <div className="bg-gray-100 rounded-2xl rounded-bl-md p-3 animate-pulse">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span>AI thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask me anything about rentals..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors duration-200 font-medium"
          >
            Send
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          💡 Pro tip: Be specific with your questions for better advice!
        </div>
      </div>
    </div>
  );
}