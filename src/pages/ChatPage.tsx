import React, { useState, useRef, useEffect } from 'react';
import { Room, ChatMessage } from '../types';
import { CHAT_MSGS } from '../constants';
import { ChevronLeft, Video, Phone, Send, Image as ImageIcon, Languages, Check, CheckCheck } from 'lucide-react';
import { Tag } from '../components/Tag';

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
          <button onClick={onBack}><ChevronLeft size={24} /></button>
          <img src={chatPartner.avatar} className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <div className="text-sm font-bold">{chatPartner.name}</div>
          </div>
          <button onClick={() => showToast("Video call starting...")}><Video size={20} /></button>
          <button onClick={() => showToast("Calling...")}><Phone size={20} /></button>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4">
        {msgs.map(m => (
          <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className="bg-white p-2 rounded-lg shadow-sm">{m.text}</div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <button onClick={() => send()} className="bg-blue-600 text-white px-3 py-2 rounded">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
