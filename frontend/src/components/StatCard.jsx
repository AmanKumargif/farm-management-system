export default function StatCard({ label, value, accent = 'forest', suffix = '' }) {
  const accentMap = {
    forest: 'border-forest text-forest',
    rust: 'border-rust text-rust',
    wheat: 'border-wheat text-soil',
    soil: 'border-soil text-soil',
  };
  return (
    <div className={`border-l-4 ${accentMap[accent]} bg-white/50 px-5 py-4`}>
      <p className="text-xs uppercase tracking-wide text-ink/60 font-medium">{label}</p>
      <p className="font-display text-3xl mt-1">
        {value}
        <span className="text-base ml-1 font-body text-ink/50">{suffix}</span>
      </p>
    </div>
  );
}
