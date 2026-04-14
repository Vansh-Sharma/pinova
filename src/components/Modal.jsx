import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

function Modal({ isOpen, onClose, title, description, children, footer }) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="glass-panel w-full max-w-xl rounded-[26px] p-5 md:p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white md:text-xl">{title}</h2>
                {description ? <p className="text-sm text-slate-300">{description}</p> : null}
              </div>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={onClose}
                className="rounded-xl bg-slate-800/80 p-2 text-slate-200 hover:text-white"
              >
                <X className="size-4" />
              </motion.button>
            </div>

            {children}
            {footer ? <div className="mt-5 flex justify-end gap-2">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default Modal;
