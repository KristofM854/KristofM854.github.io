import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Button from './Button.jsx'

function Modal({ isOpen, onClose, title, children, actions }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg text-text-primary">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-text-tertiary hover:text-text-primary transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-text-secondary mb-6">{children}</div>
            {actions && <div className="flex gap-3 justify-end">{actions}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
