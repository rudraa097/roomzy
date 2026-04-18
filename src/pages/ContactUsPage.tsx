import React from 'react';
import { ChevronLeft, Mail, Phone, MessageSquare, MapPin, Send } from 'lucide-react';

interface ContactUsPageProps {
  onBack: () => void;
  showToast: (msg: string) => void;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({ onBack, showToast }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Message sent successfully! We'll get back to you soon. 📩");
    onBack();
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-4 border-b border-slate-100 px-4 py-4">
        <button onClick={onBack} className="rounded-full p-1 hover:bg-slate-100">
          <ChevronLeft size={24} className="text-slate-600" />
        </button>
        <h1 className="text-xl font-black text-slate-900">Contact Us</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-black text-slate-900">Get in Touch</h2>
          <p className="text-sm text-slate-500">Have questions or concerns? We're here to help you.</p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4">
          <div className="flex items-center gap-4 rounded-2xl bg-blue-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Mail size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-blue-600/60">Email Us</div>
              <div className="text-sm font-black text-slate-900">support@roomzy.com</div>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-emerald-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Phone size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/60">Call Us</div>
              <div className="text-sm font-black text-slate-900">+91 98765 43210</div>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-violet-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
              <MapPin size={20} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-violet-600/60">Our Office</div>
              <div className="text-sm font-black text-slate-900">Bandra West, Mumbai, India</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-black text-slate-900">Send a Message</h3>
          
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Your Name</label>
            <input 
              required
              type="text" 
              placeholder="John Doe" 
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
            <input 
              required
              type="email" 
              placeholder="john@example.com" 
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500" 
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">Message</label>
            <textarea 
              required
              placeholder="How can we help you?" 
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 resize-none" 
            />
          </div>

          <button 
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-sm font-black text-white shadow-xl shadow-blue-100 active:scale-95"
          >
            <Send size={18} />
            SEND MESSAGE
          </button>
        </form>
      </div>
    </div>
  );
};
