export default function CircularProgress({ pct = 0, size = 120, stroke = 10, label = '', sublabel = '' }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const color = pct >= 75 ? '#009688' : pct >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="circular-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#f0f0f0" strokeWidth={stroke}
        />
        {/* Fill */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="pct-label" style={{ fontSize: size * 0.18, color }}>
        <span style={{ fontWeight: 800, fontSize: size * 0.2, color }}>{pct}%</span>
        {sublabel && (
          <span style={{ fontSize: size * 0.13, color: '#9ca3af', fontWeight: 500, marginTop: 2 }}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
