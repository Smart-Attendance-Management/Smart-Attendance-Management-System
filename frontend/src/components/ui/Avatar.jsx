const COLORS = [
  ['#e0f2f1', '#009688'], ['#dbeafe', '#2563eb'], ['#fce7f3', '#be185d'],
  ['#fef9c3', '#ca8a04'], ['#ede9fe', '#7c3aed'], ['#fee2e2', '#dc2626'],
  ['#dcfce7', '#16a34a'], ['#ffedd5', '#ea580c'],
];

function colorFromStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}

export default function Avatar({ name, size = 36, className = '' }) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  const [bg, fg] = colorFromStr(name || '?');
  return (
    <div
      className={className}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: bg, color: fg,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: size * 0.36, flexShrink: 0,
        userSelect: 'none', letterSpacing: '0.5px',
      }}
    >
      {initials}
    </div>
  );
}
