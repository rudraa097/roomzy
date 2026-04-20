import React, { useState } from 'react';
import { Modal } from './Modal';
import { Tag } from './Tag';
import { 
  CreditCard, Smartphone, QrCode, Check, 
  ArrowRight, ShieldCheck, Wallet 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  planName: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ 
  show, 
  onClose, 
  onSuccess, 
  amount, 
  planName 
}) => {
  const [method, setMethod] = useState<'upi' | 'card' | 'qr' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(2);
      setTimeout(() => {
        onSuccess();
        onClose();
        setStep(1);
        setMethod(null);
      }, 2000);
    }, 2000);
  };

  const methods = [
    { id: 'upi', label: 'UPI / Google Pay', icon: <Smartphone size={20} />, color: 'bg-blue-50 text-blue-600' },
    { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={20} />, color: 'bg-emerald-50 text-emerald-600' },
    { id: 'qr', label: 'Scan QR Code', icon: <QrCode size={20} />, color: 'bg-violet-50 text-violet-600' }
  ];

  return (
    <Modal show={show} onClose={onClose}>
      <div className="py-2">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
                  <Wallet size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-900">Checkout</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {planName} Plan · ₹{amount.toLocaleString()}
                </p>
              </div>

              <div className="space-y-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Payment Method</div>
                {methods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id as any)}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 transition-all active:scale-[0.98] ${method === m.id ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${m.color}`}>
                      {m.icon}
                    </div>
                    <span className="flex-1 text-left text-sm font-bold text-slate-700">{m.label}</span>
                    <div className={`h-5 w-5 rounded-full border-2 transition-all flex items-center justify-center ${method === m.id ? 'border-blue-600 bg-blue-600' : 'border-slate-200'}`}>
                      {method === m.id && <Check size={12} className="text-white" />}
                    </div>
                  </button>
                ))}
              </div>

              {method === 'qr' && (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-6 border-2 border-dashed border-slate-200">
                  <div className="bg-white p-4 rounded-xl shadow-sm mb-3">
                    <QrCode size={120} className="text-slate-900" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 text-center">Scan this code using any UPI app<br/>(GPay, PhonePe, Paytm)</p>
                </div>
              )}

              {method === 'card' && (
                <div className="space-y-3 rounded-2xl bg-slate-50 p-4">
                  <input type="text" placeholder="Card Number" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold shadow-sm outline-none focus:border-blue-500" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="MM/YY" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold shadow-sm outline-none focus:border-blue-500" />
                    <input type="password" placeholder="CVV" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold shadow-sm outline-none focus:border-blue-500" />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2">
                <button
                  disabled={!method || isProcessing}
                  onClick={handlePay}
                  className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-blue-600 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                >
                  {isProcessing ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      Pay ₹{amount.toLocaleString()} <ArrowRight size={18} />
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                  <ShieldCheck size={12} /> Secure 128-bit SSL Encryption
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-8 text-center"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Payment Success!</h2>
              <p className="mt-2 text-sm font-medium text-slate-500">Your {planName} subscription is now active.</p>
              <div className="mt-8 flex w-full flex-col gap-2">
                <div className="flex justify-between rounded-xl bg-slate-50 p-4 text-xs font-bold">
                  <span className="text-slate-400">Transaction ID</span>
                  <span className="text-slate-900 font-mono">#RZ-8291029</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};
