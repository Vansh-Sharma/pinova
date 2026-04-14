import { useState } from "react";
import { motion } from "framer-motion";
import { ImageUp } from "lucide-react";

function UploadForm() {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <>
      <motion.label
        whileHover={{ y: -2 }}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={() => setIsDragging(false)}
        className={`mb-5 flex min-h-44 w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-5 text-center transition-all ${
          isDragging
            ? "border-indigo-400 bg-indigo-500/10 shadow-glow"
            : "border-slate-500/45 bg-slate-900/45 hover:border-indigo-400/60"
        }`}
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="mb-3 rounded-full bg-indigo-500/20 p-3 text-indigo-300"
        >
          <ImageUp className="size-5" />
        </motion.div>
        <p className="text-sm font-semibold text-white">Drag and drop your image</p>
        <p className="mt-1 text-xs text-slate-300">or tap to browse</p>
        <input type="file" className="hidden" />
      </motion.label>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Title"
          className="w-full rounded-2xl border border-slate-600/60 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-400 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
        />
        <textarea
          rows={3}
          placeholder="Description"
          className="w-full rounded-2xl border border-slate-600/60 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-400 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          className="w-full rounded-2xl border border-slate-600/60 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-400 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
        />
      </div>
    </>
  );
}

export default UploadForm;
