// Full-viewport SVG stadium background — perfectly symmetric, scrollable
export default function StadiumBg() {
  const rows = 5
  const cols = 20
  const crowdColors = ['#ef4444', '#3b82f6', '#fbbf24', '#10b981', '#fff', '#f97316', '#8b5cf6']

  return (
    <div className="stadium-bg-scroll">
      <svg
        viewBox="0 0 1000 1400"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="skyGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="pitchGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
        </defs>

        {/* ===== SKY & ROOF (top section) ===== */}
        <rect width="1000" height="1400" fill="url(#skyGrad2)" />

        {/* Stadium roof - symmetric arch */}
        <path d="M0,0 L0,220 Q500,100 1000,220 L1000,0 Z" fill="#1e293b" opacity="0.95" />
        {/* Roof edge */}
        <path d="M0,220 Q500,100 1000,220" fill="none" stroke="#64748b" strokeWidth="5" />

        {/* Symmetric roof trusses */}
        {[100, 250, 400, 500, 600, 750, 900].map((x, i) => {
          const y2 = 220 - Math.sin((x / 1000) * Math.PI) * 110
          return <line key={`truss-${i}`} x1={x} y1={40} x2={x} y2={y2} stroke="#475569" strokeWidth="3" opacity="0.6" />
        })}

        {/* Symmetric floodlights */}
        {[100, 300, 500, 700, 900].map((x, i) => {
          const y = 220 - Math.sin((x / 1000) * Math.PI) * 110 - 20
          return <rect key={`light-${i}`} x={x - 15} y={y} width="30" height="12" rx="3" fill="#fef3c7" opacity="0.9" />
        })}

        {/* ===== UPPER STANDS (symmetric curve) ===== */}
        <path d="M0,220 L0,380 Q500,310 1000,380 L1000,220 Q500,100 0,220 Z" fill="#374151" />
        {/* Stand row lines */}
        {[250, 280, 310, 340, 360].map((baseY, row) => (
          <path
            key={`row-${row}`}
            d={`M0,${baseY} Q500,${baseY - 60 + row * 5} 1000,${baseY}`}
            fill="none" stroke="#1f2937" strokeWidth="1.5" opacity="0.4"
          />
        ))}
        {/* Upper crowd - symmetric */}
        <g opacity="0.55">
          {Array.from({ length: rows * cols }).map((_, i) => {
            const row = Math.floor(i / cols)
            const col = i % cols
            const x = 25 + col * (950 / cols)
            const baseY = 235 + row * 28
            const curve = -Math.sin((x / 1000) * Math.PI) * 50
            return (
              <circle key={`u-${i}`} cx={x} cy={baseY + curve} r={3 + (i % 2)}
                fill={crowdColors[i % crowdColors.length]} />
            )
          })}
        </g>

        {/* ===== LEFT STAND ===== */}
        <rect x="0" y="380" width="100" height="640" fill="#374151" />
        <rect x="0" y="380" width="100" height="640" fill="#1f2937" opacity="0.3" />
        <g opacity="0.45">
          {Array.from({ length: 48 }).map((_, i) => {
            const row = Math.floor(i / 3)
            const col = i % 3
            return (
              <circle key={`l-${i}`} cx={20 + col * 30} cy={400 + row * 38}
                r={3 + (i % 2)} fill={crowdColors[i % crowdColors.length]} />
            )
          })}
        </g>

        {/* ===== RIGHT STAND (mirror of left) ===== */}
        <rect x="900" y="380" width="100" height="640" fill="#374151" />
        <rect x="900" y="380" width="100" height="640" fill="#1f2937" opacity="0.3" />
        <g opacity="0.45">
          {Array.from({ length: 48 }).map((_, i) => {
            const row = Math.floor(i / 3)
            const col = i % 3
            return (
              <circle key={`r-${i}`} cx={920 + col * 30} cy={400 + row * 38}
                r={3 + (i % 2)} fill={crowdColors[(i + 3) % crowdColors.length]} />
            )
          })}
        </g>

        {/* ===== PITCH (centered, symmetric) ===== */}
        <rect x="100" y="380" width="800" height="640" fill="url(#pitchGrad)" />

        {/* Grass stripes - symmetric horizontal bands */}
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={`stripe-${i}`} x="100" y={380 + i * 80} width="800" height="40"
            fill="#1a9e40" opacity={i % 2 === 0 ? 0.35 : 0} />
        ))}

        {/* Field boundary */}
        <rect x="130" y="410" width="740" height="580" fill="none" stroke="#fff" strokeWidth="3" opacity="0.6" rx="2" />

        {/* Center line - perfectly centered */}
        <line x1="130" y1="700" x2="870" y2="700" stroke="#fff" strokeWidth="2.5" opacity="0.5" />

        {/* Center circle - exact center */}
        <circle cx="500" cy="700" r="65" fill="none" stroke="#fff" strokeWidth="2.5" opacity="0.5" />
        <circle cx="500" cy="700" r="4" fill="#fff" opacity="0.5" />

        {/* Top penalty area */}
        <rect x="320" y="410" width="360" height="100" fill="none" stroke="#fff" strokeWidth="2" opacity="0.45" />
        <rect x="380" y="410" width="240" height="45" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.35" />
        <circle cx="500" cy="490" r="4" fill="#fff" opacity="0.4" />
        {/* Penalty arc top */}
        <path d="M380,510 Q500,545 620,510" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.35" />

        {/* Bottom penalty area (mirror) */}
        <rect x="320" y="890" width="360" height="100" fill="none" stroke="#fff" strokeWidth="2" opacity="0.45" />
        <rect x="380" y="945" width="240" height="45" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.35" />
        <circle cx="500" cy="910" r="4" fill="#fff" opacity="0.4" />
        {/* Penalty arc bottom */}
        <path d="M380,890 Q500,855 620,890" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.35" />

        {/* Corner arcs - all 4 symmetric */}
        <path d="M130,410 Q140,420 130,420" fill="none" stroke="#fff" strokeWidth="2" opacity="0.4" />
        <path d="M870,410 Q860,420 870,420" fill="none" stroke="#fff" strokeWidth="2" opacity="0.4" />
        <path d="M130,990 Q140,980 130,980" fill="none" stroke="#fff" strokeWidth="2" opacity="0.4" />
        <path d="M870,990 Q860,980 870,980" fill="none" stroke="#fff" strokeWidth="2" opacity="0.4" />

        {/* ===== LOWER STANDS ===== */}
        <rect x="0" y="1020" width="1000" height="380" fill="#374151" />
        <rect x="0" y="1020" width="1000" height="380" fill="#1f2937" opacity="0.3" />
        {/* Lower stand row lines */}
        {[1050, 1090, 1130, 1170, 1210].map((y, i) => (
          <line key={`lrow-${i}`} x1="0" y1={y} x2="1000" y2={y} stroke="#1f2937" strokeWidth="1.5" opacity="0.3" />
        ))}
        {/* Lower crowd */}
        <g opacity="0.5">
          {Array.from({ length: 80 }).map((_, i) => {
            const row = Math.floor(i / 20)
            const col = i % 20
            return (
              <circle key={`lo-${i}`} cx={30 + col * 48} cy={1040 + row * 45 + (i % 3) * 6}
                r={4 + (i % 2) * 2} fill={crowdColors[(i + 2) % crowdColors.length]} />
            )
          })}
        </g>

        {/* Ambient light glow on pitch */}
        <ellipse cx="500" cy="700" rx="350" ry="280" fill="#fef3c7" opacity="0.03" />
      </svg>
    </div>
  )
}
