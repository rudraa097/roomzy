import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  msg: string;
}

export const Toast: React.FC<ToastProps> = ({ msg }) => {
  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          className="fixed top-14 left-1/2 z-[9990] max-w-[320px] -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-center text-xs font-medium text-white shadow-2xl"
        >
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
