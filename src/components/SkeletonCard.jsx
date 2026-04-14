function SkeletonCard({ shapeClass }) {
  return (
    <article className="break-inside-avoid rounded-brand border border-white/5 bg-brand-card/70 p-3">
      <div className={`w-full overflow-hidden rounded-2xl bg-slate-700/60 ${shapeClass}`}>
        <div className="h-full w-full animate-pulse bg-gradient-to-br from-slate-600/40 to-slate-500/20" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-4 w-4/5 animate-pulse rounded bg-slate-700/70" />
        <div className="h-3 w-full animate-pulse rounded bg-slate-700/60" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-700/60" />
      </div>
    </article>
  );
}

export default SkeletonCard;
