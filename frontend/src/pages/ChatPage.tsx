import React, { useState, useRef, useEffect } from 'react';
import { Room, ChatMessage } from '../types';
import { CHAT_MSGS } from '../constants';
import { ChevronLeft, Video, Phone, Send, Image as ImageIcon, Languages, Check, CheckCheck } from 'lucide-react';
import { Tag } from '../components/Tag';
import { motion } from 'framer-motion';

interface ChatPageProps {
  room: Room | null;
  onBack: () => void;
  showToast: (msg: string) => void;
  onNav: (page: string, data?: any) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({ room, onBack, showToast, onNav }) => {
  const [msgs, setMsgs] = useState<ChatMessage[]>(CHAT_MSGS);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("EN");
  const chatRef = useRef<HTMLDivElement>(null);
  
  const r = room || {
    id: 1,
    title: "Modern Studio Apartment",
    rent: 18000,
    verified: true,
    imgs: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80"],
    owner: {
      name: "Priya Sharma",
      avatar: "https://i.pravatar.cc/60?img=47",
      responseTime: "Usually within 1 hr"
    }
  };

  const isRoommateChat = (room as any)?.chatWithOccupant;
  const chatPartner = isRoommateChat && r.currentOccupant ? r.currentOccupant : r.owner;

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          showToast("Notifications enabled! 🔔");
        }
      });
    }
  };

  const triggerNotification = (title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: chatPartner.avatar,
      });
    }
  };

  const send = (text?: string) => {
    const txt = text || input.trim();
    if (!txt) return;
    
    const newMsg: ChatMessage = {
      id: Date.now(),
      from: "user",
      text: txt,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent"
    };
    
    setMsgs(m => [...m, newMsg]);
    setInput("");

    // Simulate status updates
    setTimeout(() => {
      setMsgs(current => current.map(msg => msg.id === newMsg.id ? { ...msg, status: "delivered" } : msg));
    }, 1000);

    setTimeout(() => {
      setMsgs(current => current.map(msg => msg.id === newMsg.id ? { ...msg, status: "read" } : msg));
    }, 2000);
    
    setTimeout(() => {
      const replies = [
        "Thanks for reaching out! I'll get back to you shortly.",
        "Sure! Let me check and confirm that.",
        "That sounds great! Let's schedule a time that works for you.",
        "I'll share the exact address and details soon. 😊"
      ];
      const replyText = replies[Math.floor(Math.random() * replies.length)];
      const reply: ChatMessage = {
        id: Date.now() + 1,
        from: "owner",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMsgs(m => [...m, reply]);
      triggerNotification(`New message from ${chatPartner.name}`, replyText);
    }, 1500);
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [msgs]);

  const QUICK_REPLIES = ["Is it available?", "Can I visit tomorrow?", "Negotiation?", "Bring a pet?"];

  return (
    <div className="flex h-full flex-col bg-slate-50">
      {/* Header */}
      <div className="shrink-0 border-b border-slate-100 bg-white p-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-slate-600">
            <ChevronLeft size={24} />
          </button>
          <div className="relative">
            <img src={chatPartner.avatar} className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-bold text-slate-900">{chatPartner.name}</div>
            <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Online</div>
          </div>
          <div className="flex gap-3 text-slate-400">
            <button 
              onClick={requestNotificationPermission}
              className={Notification.permission === "granted" ? "text-blue-600" : "text-slate-400"}
              title="Enable Notifications"
            >
              <Languages size={20} className="hidden" /> {/* Spacer/Reference */}
              <span className="text-lg">🔔</span>
            </button>
            <button onClick={() => showToast("Video call starting...")}><Video size={20} /></button>
            <button onClick={() => showToast(`${isRoommateChat ? "Calling roommate" : "Calling owner"}...`)}><Phone size={20} /></button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Languages size={14} className="text-slate-400" />
          <div className="flex gap-1.5">
            {["EN", "HI", "MR", "TA"].map(l => (
              <button 
                key={l} 
                onClick={() => { setLang(l); showToast(`Translated to ${l}`); }}
                className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${lang === l ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Property Context */}
      <div className="flex shrink-0 items-center gap-3 border-b border-blue-100 bg-blue-50 p-2 px-4">
        <img src={r.imgs[0]} className="h-10 w-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
        <div className="flex-1 min-w-0">
          <div className="truncate text-[11px] font-bold text-blue-900">{r.title}</div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black text-blue-600">₹{r.rent.toLocaleString()}/mo</span>
            {r.verified && <Tag bg="bg-blue-100" color="text-blue-700" className="text-[9px] px-1.5">✓ Verified</Tag>}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {msgs.map(m => (
          <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            {m.from === "owner" && (
              <img src={r.owner.avatar} className="mr-2 h-7 w-7 self-end rounded-full object-cover" referrerPolicy="no-referrer" />
            )}
            <div className="max-w-[75%]">
              <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-xs ${m.from === "user" ? "rounded-br-none bg-blue-600 text-white" : "rounded-bl-none border border-slate-100 bg-white text-slate-800"}`}>
                {m.text}
              </div>
              <div className={`mt-1 flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                {m.time}
                {m.from === "user" && (
                  <span className="ml-1">
                    {m.status === "read" ? (
                      <CheckCheck size={10} className="text-blue-500" />
                    ) : m.status === "delivered" ? (
                      <CheckCheck size={10} className="text-slate-400" />
                    ) : (
                      <Check size={10} className="text-slate-400" />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Replies */}
      <div className="flex shrink-0 gap-2 overflow-x-auto p-2 px-4">
        {QUICK_REPLIES.map(q => (
          <button 
            key={q} 
            onClick={() => send(q)}
            className="whitespace-nowrap rounded-full border border-blue-200 bg-white px-4 py-1.5 text-xs font-bold text-blue-600 shadow-sm active:bg-blue-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-slate-100 bg-white p-3 pb-safe">
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
            <ImageIcon size={20} />
          </button>
          <input 
            value={input} 
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Type a message…" 
            className="flex-1 rounded-xl bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button 
            onClick={() => send()}
            disabled={!input.trim()}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${input.trim() ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-300"}`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
