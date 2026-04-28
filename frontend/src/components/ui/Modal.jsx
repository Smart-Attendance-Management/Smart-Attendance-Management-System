import { X } from 'lucide-react';

export default function Modal({ title, subtitle, onClose, children, width = 520 }) {
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box" style={{ maxWidth: width }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>{title}</h3>
            {subtitle && <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9ca3af' }}>{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f3f4f6', border: 'none', borderRadius: 8,
              width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#6b7280', flexShrink: 0, marginLeft: 12,
            }}
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
