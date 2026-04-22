// redeploy fix
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[2000] flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 max-h-[85vh] w-full max-w-[420px] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
