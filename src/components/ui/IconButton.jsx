import { motion } from "framer-motion";

function IconButton({ icon: Icon, label, onClick, className = "", iconClassName = "size-4", filled = false, fillColor = "currentColor" }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ y: -1 }}
      aria-label={label}
      onClick={onClick}
      className={`grid size-8 place-items-center rounded-full bg-slate-900/70 text-slate-100 backdrop-blur transition-colors hover:bg-slate-800 ${className}`}
    >
      <Icon className={iconClassName} fill={filled ? fillColor : "none"} />
    </motion.button>
  );
}

export default IconButton;
