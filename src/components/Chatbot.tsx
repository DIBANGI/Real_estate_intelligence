import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';

const suggestedQuestions = [
  'What is the average price in Bandra, Mumbai?',
  'Is Bangalore a good city to invest in?',
  'Which areas have highest appreciation?',
  'How do I calculate ROI on a property?',
];

const botResponses: Record<string, string> = {
  default: "I'm your AI real estate assistant. I can help you with property prices, market trends, investment advice, and area recommendations. What would you like to know?",
  greeting: "Hello! I'm your AI real estate assistant. I can help you predict property prices, analyze fair value, recommend best areas, and provide market insights. How can I assist you today?",
  price: "Property prices vary significantly by location. In Mumbai, prices range from ₹8,000 to ₹45,000 per sqft depending on the area. Bandra and Worli are premium zones, while Thane and Mira Road offer more affordable options. Would you like a specific price prediction?",
  mumbai: "Mumbai is India's most expensive real estate market. Key metrics: Average price ₹18,500/sqft, Annual appreciation 8.4%, Demand score 94/100. Premium areas: Bandra (₹22-35k/sqft), Worli (₹28-50k/sqft), Andheri (₹12-18k/sqft). Good investment potential in Powai and Thane.",
  bangalore: "Bangalore offers excellent investment opportunities. Average price ₹8,200/sqft, Annual growth 12.1%, Demand score 92/100. IT hub zones like Whitefield, Koramangala, and Marathahalli show strong appreciation. Emerging areas: Sarjapur, Electronic City Phase 2.",
  hyderabad: "Hyderabad is currently the hottest real estate market. Average price ₹7,800/sqft, Annual appreciation 15.6% — highest among all cities. Hitech City and Gachibowli are prime IT corridors. Jubilee Hills and Banjara Hills are luxury zones. Excellent ROI potential.",
  invest: "Top investment markets by AI score: 1) Hyderabad (Score: 93) — 15.6% annual growth, affordable base prices. 2) Bangalore (Score: 91) — consistent IT demand. 3) Pune (Score: 87) — growing startup ecosystem. I recommend a 5-7 year hold period for maximum returns.",
  roi: "ROI calculation: ROI = (Annual Rental Income - Annual Expenses) / Property Cost × 100. Typical rental yield in Bangalore: 3-4%. Capital appreciation adds another 10-15% annually. For investment-grade properties, expect total returns of 14-18% per year in Hyderabad and Bangalore.",
  appreciation: "AI-predicted appreciation for 2024-2030: Hyderabad leads at 15.6% CAGR, followed by Bangalore at 12.1%, Pune at 11.8%, and Chennai at 9.2%. Key drivers: IT sector expansion, infrastructure projects, metro connectivity.",
  bandra: "Bandra, Mumbai is one of India's most sought-after localities. Current price: ₹22,000-35,000/sqft. Year-on-year growth: 9.2%. Premium location with sea views, excellent connectivity, and vibrant social scene. Ideal for long-term investment, though high entry price.",
  affordable: "Most affordable yet promising locations: 1) Whitefield, Bangalore (₹6,500-8,000/sqft) 2) Kondapur, Hyderabad (₹6,000-7,500/sqft) 3) OMR, Chennai (₹4,500-6,000/sqft) 4) Hinjewadi, Pune (₹5,500-7,000/sqft). All show 10-15% annual appreciation.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return botResponses.greeting;
  if (lower.includes('bandra')) return botResponses.bandra;
  if (lower.includes('mumbai')) return botResponses.mumbai;
  if (lower.includes('bangalore') || lower.includes('bengaluru')) return botResponses.bangalore;
  if (lower.includes('hyderabad')) return botResponses.hyderabad;
  if (lower.includes('price') || lower.includes('cost') || lower.includes('sqft')) return botResponses.price;
  if (lower.includes('invest') || lower.includes('best city') || lower.includes('top city')) return botResponses.invest;
  if (lower.includes('roi') || lower.includes('return') || lower.includes('rental')) return botResponses.roi;
  if (lower.includes('appreciat') || lower.includes('growth') || lower.includes('future')) return botResponses.appreciation;
  if (lower.includes('affordable') || lower.includes('cheap') || lower.includes('budget')) return botResponses.affordable;
  return botResponses.default;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: botResponses.greeting,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
    const response = getResponse(text);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => {
    setMessages([{
      id: '0', role: 'assistant', content: botResponses.greeting, timestamp: new Date(),
    }]);
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all hover:scale-110"
        style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', boxShadow: '0 0 25px rgba(14,165,233,0.5)' }}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full text-xs flex items-center justify-center font-bold text-slate-900">
            AI
          </span>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-96 rounded-3xl overflow-hidden shadow-2xl border border-sky-500/20 animate-slide-up"
          style={{
            height: '540px',
            background: 'rgba(2,8,24,0.97)',
            backdropFilter: 'blur(30px)',
          }}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/8 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(0,212,255,0.08))' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center relative"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #00d4ff)' }}>
              <Bot size={18} className="text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Estate AI Assistant</div>
              <div className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                Online · Responds instantly
              </div>
            </div>
            <button onClick={resetChat} className="ml-auto text-slate-500 hover:text-slate-300 transition-colors">
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ height: '380px' }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'assistant'
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'bg-white/10 text-slate-300'
                }`}>
                  {msg.role === 'assistant' ? <Sparkles size={12} /> : <User size={12} />}
                </div>
                <div className={`max-w-xs px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'assistant'
                    ? 'rounded-tl-none text-slate-300'
                    : 'rounded-tr-none text-white'
                }`}
                  style={{
                    background: msg.role === 'assistant'
                      ? 'rgba(255,255,255,0.05)'
                      : 'linear-gradient(135deg, rgba(14,165,233,0.3), rgba(14,165,233,0.2))',
                    border: '1px solid ' + (msg.role === 'assistant' ? 'rgba(255,255,255,0.07)' : 'rgba(14,165,233,0.3)'),
                  }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={12} />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {suggestedQuestions.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)}
                    className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border border-sky-500/30 text-sky-400 hover:bg-sky-500/10 transition-colors whitespace-nowrap">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-4 pb-4 pt-2 border-t border-white/8">
            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-white/10 focus-within:border-sky-500/40 transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about properties, prices, areas..."
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
              />
              <button onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className="w-7 h-7 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 hover:scale-110"
                style={{ background: input.trim() ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : 'rgba(255,255,255,0.1)' }}>
                <Send size={13} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
