/** Static hole cross-sections: tapped, clearance + counterbore, countersink.
 *  Same drawing language as the fastener sheet (hatched section, dimension lines). */
function Plate({ x, holeL, holeR, children }: { x: number; holeL: number; holeR: number; children?: React.ReactNode }) {
  const t = 70, b = 220;
  return (
    <g transform={`translate(${x},0)`}>
      <polygon points={`0,${t} ${holeL},${t} ${holeL},${b} 0,${b}`} fill="url(#hatchA)" className="outline" />
      <polygon points={`${holeR},${t} 260,${t} 260,${b} ${holeR},${b}`} fill="url(#hatchB)" className="outline" />
      {children}
    </g>
  );
}

function Dim({ x1, x2, y, label, anchor = "middle" }: { x1: number; x2: number; y: number; label: string; anchor?: "middle" | "start" }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} className="dim" markerStart="url(#ah)" markerEnd="url(#ah)" />
      <text x={anchor === "middle" ? (x1 + x2) / 2 : x1} y={y - 7} textAnchor={anchor} className="dtxt">{label}</text>
    </g>
  );
}

export function HoleDiagram() {
  return (
    <div className="chart-plate">
      <svg viewBox="0 0 900 300" role="img" aria-label="Cross-sections: tap drill hole with thread, clearance hole with counterbore, clearance hole with countersink">
        <defs>
          <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,1 L10,5 L0,9 z" fill="#2c6e9e" />
          </marker>
          <pattern id="hatchA" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" className="hatch" />
          </pattern>
          <pattern id="hatchB" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2="0" y2="8" className="hatch" />
          </pattern>
        </defs>

        {/* A — tapped hole: tap drill = minor diameter, thread cut out to the major */}
        <Plate x={20} holeL={108} holeR={152}>
          <line x1="130" y1="50" x2="130" y2="240" className="centre" />
          <line x1="98" y1="70" x2="98" y2="220" className="thin" strokeDasharray="5 3" />
          <line x1="162" y1="70" x2="162" y2="220" className="thin" strokeDasharray="5 3" />
          {[90, 110, 130, 150, 170, 190, 210].map((y) => (
            <line key={y} x1="98" y1={y} x2="108" y2={y - 5} className="thin" />
          ))}
          {[90, 110, 130, 150, 170, 190, 210].map((y) => (
            <line key={`r${y}`} x1="152" y1={y - 5} x2="162" y2={y} className="thin" />
          ))}
          <Dim x1={108} x2={152} y={42} label="tap drill" />
        </Plate>
        <text x="150" y="268" textAnchor="middle" className="ttl">Tapped hole</text>
        <text x="150" y="286" textAnchor="middle" className="sub">drill → tap · thread bites past the drill</text>

        {/* B — clearance hole + socket head counterbore */}
        <Plate x={320} holeL={95} holeR={165}>
          <rect x="70" y="70" width="25" height="55" fill="#fff" className="outline" />
          <rect x="165" y="70" width="25" height="55" fill="#fff" className="outline" />
          <line x1="130" y1="50" x2="130" y2="240" className="centre" />
          <Dim x1={95} x2={165} y={190} label="clearance" />
          <Dim x1={70} x2={190} y={42} label="counterbore" />
        </Plate>
        <text x="450" y="268" textAnchor="middle" className="ttl">Clearance + C’bore</text>
        <text x="450" y="286" textAnchor="middle" className="sub">socket head sits flush or below</text>

        {/* C — clearance hole + countersink for flat head */}
        <Plate x={620} holeL={105} holeR={155}>
          <polygon points="105,125 70,70 105,70" fill="#fff" className="outline" />
          <polygon points="155,125 190,70 155,70" fill="#fff" className="outline" />
          <line x1="130" y1="50" x2="130" y2="240" className="centre" />
          <Dim x1={105} x2={155} y={190} label="clearance" />
          <Dim x1={70} x2={190} y={42} label="countersink" />
        </Plate>
        <text x="750" y="268" textAnchor="middle" className="ttl">Countersink</text>
        <text x="750" y="286" textAnchor="middle" className="sub">90° · flat head sits flush</text>
      </svg>
    </div>
  );
}
