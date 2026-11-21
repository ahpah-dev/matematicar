import React, { useState } from 'react';
import MathText from './MathText';

export default function InteractiveWidget({ type }) {
  switch (type) {
    case 'venn':
      return <VennWidget />;
    case 'mapping':
      return <MappingWidget />;
    case 'linear':
      return <LinearWidget />;
    case 'quadratic':
      return <QuadraticWidget />;
    case 'triangle':
      return <TriangleWidget />;
    case 'logarithm':
      return <LogarithmWidget />;
    case 'complex':
      return <ComplexWidget />;
    case 'unitcircle':
      return <UnitCircleWidget />;
    case 'vectors':
      return <VectorsWidget />;
    case 'sequence':
      return <SequenceWidget />;
    case 'derivative':
      return <DerivativeWidget />;
    case 'integral':
      return <IntegralWidget />;
    case 'combinatorics':
      return <CombinatoricsWidget />;
    default:
      return null;
  }
}

function MappingWidget() {
  const [mode, setMode] = useState('bijekcija');
  const modes = {
    injekcija: {
      title: 'Injekcija ("1-na-1")',
      desc: 'Svaka strelica gađa RAZLIČIT cilj u B — nema gužve! (Može neko u B ostati prazan.)',
      arrows: [[0, 0], [1, 1], [2, 2]],
      bCount: 4,
    },
    surjekcija: {
      title: 'Surjekcija ("NA" ceo B)',
      desc: 'Svaki element u B je pogođen bar jednom! Nijedna stolica u B nije prazna.',
      arrows: [[0, 0], [1, 1], [2, 1]],
      bCount: 2,
    },
    bijekcija: {
      title: 'Bijekcija (Savršen par!)',
      desc: 'I injekcija i surjekcija! Svako iz A ima tačno jednog para u B — zato ima inverznu funkciju!',
      arrows: [[0, 0], [1, 1], [2, 2]],
      bCount: 3,
    },
  };
  const m = modes[mode];
  const aY = [30, 65, 100];
  const bY = m.bCount === 2 ? [45, 85] : m.bCount === 3 ? [30, 65, 100] : [22, 50, 78, 106];

  return (
    <div className="widget-box">
      <div className="widget-title"><MathText text={"Vrste preslikavanja $f: A \\to B$ — klikni tip!"} /></div>
      <div className="widget-tabs">
        <button className={`widget-pill ${mode === 'injekcija' ? 'active' : ''}`} onClick={() => setMode('injekcija')}>Injekcija</button>
        <button className={`widget-pill ${mode === 'surjekcija' ? 'active' : ''}`} onClick={() => setMode('surjekcija')}>Surjekcija</button>
        <button className={`widget-pill ${mode === 'bijekcija' ? 'active' : ''}`} onClick={() => setMode('bijekcija')}>Bijekcija</button>
      </div>
      <svg viewBox="0 0 260 130" className="widget-svg">
        <ellipse cx="62" cy="65" rx="34" ry="54" fill="rgba(28,176,246,0.14)" stroke="#1CB0F6" strokeWidth="2.5" />
        <ellipse cx="198" cy="65" rx="34" ry="54" fill="rgba(88,204,2,0.14)" stroke="#58CC02" strokeWidth="2.5" />
        <text x="62" y="12" fontSize="11" fontWeight="900" textAnchor="middle" fill="#1CB0F6">A</text>
        <text x="198" y="12" fontSize="11" fontWeight="900" textAnchor="middle" fill="#58CC02">B</text>
        {m.arrows.map(([ai, bi], idx) => (
          <line
            key={idx}
            x1="70"
            y1={aY[ai]}
            x2="188"
            y2={bY[bi]}
            stroke="#FF9600"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
        {aY.map((y, i) => (
          <g key={`a-${i}`}>
            <circle cx="62" cy={y} r="7" fill="#1CB0F6" />
            <text x="62" y={y + 4} fontSize="10" fontWeight="900" textAnchor="middle" fill="#fff">{i + 1}</text>
          </g>
        ))}
        {bY.map((y, i) => (
          <g key={`b-${i}`}>
            <circle cx="198" cy={y} r="7" fill="#58CC02" />
            <text x="198" y={y + 4} fontSize="10" fontWeight="900" textAnchor="middle" fill="#fff">{String.fromCharCode(97 + i)}</text>
          </g>
        ))}
      </svg>
      <div className="widget-caption">
        <strong>{m.title}:</strong> {m.desc}
      </div>
    </div>
  );
}

function VennWidget() {
  const [op, setOp] = useState('union');
  const labels = {
    union: { title: 'Unija ($A \\cup B$)', desc: 'Sve iz A i sve iz B zajedno — kao kad spojiš dve korpe igračaka!' },
    inter: { title: 'Presek ($A \\cap B$)', desc: 'Samo ono što je ZAJEDNIČKO za oba skupa (sredina!).' },
    diff: { title: 'Razlika ($A \\setminus B$)', desc: 'Samo ono što ima A, a NEMA B.' },
  };
  const info = labels[op];

  return (
    <div className="widget-box">
      <div className="widget-title">Interaktivni Venov dijagram — klikni operaciju!</div>
      <div className="widget-tabs">
        <button className={`widget-pill ${op === 'union' ? 'active' : ''}`} onClick={() => setOp('union')}>A ∪ B</button>
        <button className={`widget-pill ${op === 'inter' ? 'active' : ''}`} onClick={() => setOp('inter')}>A ∩ B</button>
        <button className={`widget-pill ${op === 'diff' ? 'active' : ''}`} onClick={() => setOp('diff')}>A \ B</button>
      </div>
      <svg viewBox="0 0 260 130" className="widget-svg">
        <defs>
          <clipPath id="clipA"><circle cx="95" cy="65" r="46" /></clipPath>
          <clipPath id="clipB"><circle cx="165" cy="65" r="46" /></clipPath>
        </defs>
        <circle cx="95" cy="65" r="46" fill={op === 'union' || op === 'diff' ? 'rgba(28, 176, 246, 0.35)' : 'rgba(148,163,184,0.12)'} stroke="#1CB0F6" strokeWidth="2.5" />
        <circle cx="165" cy="65" r="46" fill={op === 'union' ? 'rgba(88, 204, 2, 0.35)' : 'rgba(148,163,184,0.12)'} stroke="#58CC02" strokeWidth="2.5" />
        {op === 'inter' && (
          <circle cx="165" cy="65" r="46" clipPath="url(#clipA)" fill="rgba(255, 150, 0, 0.55)" />
        )}
        {op === 'diff' && (
          <circle cx="165" cy="65" r="46" clipPath="url(#clipA)" fill="var(--bg-card)" />
        )}
        <circle cx="95" cy="65" r="46" fill="none" stroke="#1CB0F6" strokeWidth="2.5" />
        <circle cx="165" cy="65" r="46" fill="none" stroke="#58CC02" strokeWidth="2.5" />
        <text x="66" y="68" fontSize="14" fontWeight="800" fill="var(--text-main)">A</text>
        <text x="184" y="68" fontSize="14" fontWeight="800" fill="var(--text-main)">B</text>
        <text x="130" y="69" fontSize="12" fontWeight="800" textAnchor="middle" fill="var(--text-main)">3, 4</text>
        <text x="72" y="52" fontSize="11" fontWeight="700" fill="var(--text-muted)">1, 2</text>
        <text x="174" y="52" fontSize="11" fontWeight="700" fill="var(--text-muted)">5, 6</text>
      </svg>
      <div className="widget-caption">
        <strong><MathText text={info.title} />:</strong> {info.desc}
      </div>
    </div>
  );
}

function LinearWidget() {
  const [k, setK] = useState(1);
  const [n, setN] = useState(1);

  const toX = (x) => 110 + x * 18;
  const toY = (y) => 75 - y * 14;
  const x1 = -5;
  const x2 = 5;
  const y1 = k * x1 + n;
  const y2 = k * x2 + n;

  return (
    <div className="widget-box">
      <div className="widget-title">
        <MathText text="Pomeraj klizače i gledaj pravu $y = kx + n$" />
      </div>
      <svg viewBox="0 0 220 150" className="widget-svg">
        <line x1="10" y1="75" x2="210" y2="75" stroke="var(--border-strong)" strokeWidth="1.5" />
        <line x1="110" y1="10" x2="110" y2="140" stroke="var(--border-strong)" strokeWidth="1.5" />
        <line
          x1={toX(x1)}
          y1={toY(y1)}
          x2={toX(x2)}
          y2={toY(y2)}
          stroke="#58CC02"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx={toX(0)} cy={toY(n)} r="5" fill="#FF9600" />
        <text x={toX(0) + 8} y={toY(n) - 4} fontSize="11" fontWeight="800" fill="#FF9600">
          n = {n}
        </text>
      </svg>
      <div className="widget-sliders">
        <label>
          <span>
            <MathText text={`Nagib $k = ${k}$ (${k > 0 ? 'raste ↗' : k < 0 ? 'opada ↘' : 'ravna →'})`} />
          </span>
          <input type="range" min="-2" max="2" step="0.5" value={k} onChange={(e) => setK(Number(e.target.value))} />
        </label>
        <label>
          <span>
            <MathText text={`Odsečak na y-osi $n = ${n}$`} />
          </span>
          <input type="range" min="-3" max="3" step="1" value={n} onChange={(e) => setN(Number(e.target.value))} />
        </label>
      </div>
    </div>
  );
}

function QuadraticWidget() {
  const [a, setA] = useState(1);
  const [c, setC] = useState(-1);

  const pts = [];
  for (let x = -3.5; x <= 3.5; x += 0.2) {
    const y = a * x * x + c;
    const px = 110 + x * 24;
    const py = 85 - y * 14;
    pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }

  return (
    <div className="widget-box">
      <div className="widget-title">Igra sa parabolom <MathText text={`$y = ${a}x^2 ${c >= 0 ? '+' : ''}${c}$`} /></div>
      <svg viewBox="0 0 220 150" className="widget-svg">
        <line x1="10" y1="85" x2="210" y2="85" stroke="var(--border-strong)" strokeWidth="1.5" />
        <line x1="110" y1="10" x2="110" y2="140" stroke="var(--border-strong)" strokeWidth="1.5" />
        <polyline fill="none" stroke="#1CB0F6" strokeWidth="3.5" points={pts.join(' ')} />
        <circle cx="110" cy={85 - c * 14} r="5" fill="#FF9600" />
      </svg>
      <div className="widget-sliders">
        <label>
          <span><MathText text={`Otvor $a = ${a}$ (${a > 0 ? 'srećna U' : 'tužna ∩'})`} /></span>
          <input type="range" min="-2" max="2" step="1" value={a} onChange={(e) => setA(Number(e.target.value) || 1)} />
        </label>
        <label>
          <span><MathText text={`Pomeraj gore/dole $c = ${c}$`} /></span>
          <input type="range" min="-3" max="3" step="1" value={c} onChange={(e) => setC(Number(e.target.value))} />
        </label>
      </div>
    </div>
  );
}

function TriangleWidget() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const c = Math.sqrt(a * a + b * b).toFixed(2);
  const scale = 16;
  const x0 = 45;
  const y0 = 120;
  const x1 = x0 + b * scale;
  const y1 = y0 - a * scale;

  return (
    <div className="widget-box">
      <div className="widget-title">Pravougli trougao: Pitagora i trigonometrija uživo</div>
      <svg viewBox="0 0 230 140" className="widget-svg">
        <polygon points={`${x0},${y0} ${x1},${y0} ${x0},${y1}`} fill="rgba(88, 204, 2, 0.2)" stroke="#58CC02" strokeWidth="3" strokeLinejoin="round" />
        <rect x={x0} y={y0 - 12} width="12" height="12" fill="none" stroke="#58CC02" strokeWidth="2" />
        <text x={x0 - 16} y={(y0 + y1) / 2} fontSize="12" fontWeight="800" fill="#1CB0F6">a={a}</text>
        <text x={(x0 + x1) / 2} y={y0 + 16} fontSize="12" fontWeight="800" fill="#FF9600">b={b}</text>
        <text x={(x0 + x1) / 2 + 8} y={(y0 + y1) / 2 - 6} fontSize="12" fontWeight="800" fill="#CE82FF">c={c}</text>
      </svg>
      <div className="widget-sliders">
        <label>
          <span><MathText text={`Kateta $a = ${a}$`} /></span>
          <input type="range" min="2" max="5" step="1" value={a} onChange={(e) => setA(Number(e.target.value))} />
        </label>
        <label>
          <span><MathText text={`Kateta $b = ${b}$`} /></span>
          <input type="range" min="2" max="7" step="1" value={b} onChange={(e) => setB(Number(e.target.value))} />
        </label>
      </div>
      <div className="widget-caption">
        <MathText text={`$${a}^2 + ${b}^2 = ${a * a + b * b} \\Rightarrow c = ${c}$`} />
      </div>
    </div>
  );
}

function LogarithmWidget() {
  const [base, setBase] = useState(2);
  const [exp, setExp] = useState(3);
  const result = Math.pow(base, exp);

  return (
    <div className="widget-box">
      <div className="widget-title">Logaritam pita: "Na koji stepen da podignem osnovu?"</div>
      <div className="log-machine">
        <div className="log-card">
          <div className="log-label">Stepen</div>
          <div className="log-val"><MathText text={`$${base}^{${exp}} = ${result}$`} /></div>
        </div>
        <div className="log-arrow">⟺</div>
        <div className="log-card highlight">
          <div className="log-label">Logaritam</div>
          <div className="log-val"><MathText text={`$\\log_{${base}} ${result} = ${exp}$`} /></div>
        </div>
      </div>
      <div className="widget-sliders">
        <label>
          <span><MathText text={`Osnova $b = ${base}$`} /></span>
          <input type="range" min="2" max="5" step="1" value={base} onChange={(e) => setBase(Number(e.target.value))} />
        </label>
        <label>
          <span><MathText text={`Stepen (rezultat logaritma) $x = ${exp}$`} /></span>
          <input type="range" min="0" max="4" step="1" value={exp} onChange={(e) => setExp(Number(e.target.value))} />
        </label>
      </div>
    </div>
  );
}

function ComplexWidget() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const px = 110 + a * 20;
  const py = 75 - b * 18;
  const mod = Math.sqrt(a * a + b * b).toFixed(2);

  return (
    <div className="widget-box">
      <div className="widget-title">Kompleksni broj u ravni: <MathText text={`$z = ${a} ${b >= 0 ? '+' : ''} ${b}i$`} /></div>
      <svg viewBox="0 0 220 150" className="widget-svg">
        <line x1="15" y1="75" x2="205" y2="75" stroke="var(--border-strong)" strokeWidth="1.5" />
        <line x1="110" y1="10" x2="110" y2="140" stroke="var(--border-strong)" strokeWidth="1.5" />
        <text x="192" y="69" fontSize="10" fill="var(--text-muted)">Re</text>
        <text x="116" y="20" fontSize="10" fill="var(--text-muted)">Im</text>
        <line x1="110" y1="75" x2={px} y2={py} stroke="#CE82FF" strokeWidth="3" />
        <circle cx={px} cy={py} r="6" fill="#CE82FF" />
        <circle cx={px} cy={75 + b * 18} r="4.5" fill="#FF9600" opacity="0.7" />
        <text x={px + 8} y={py - 4} fontSize="11" fontWeight="800" fill="#CE82FF">z</text>
        <text x={px + 8} y={75 + b * 18 + 10} fontSize="10" fontWeight="700" fill="#FF9600">z̄</text>
      </svg>
      <div className="widget-sliders">
        <label>
          <span><MathText text={`Realni deo $a = ${a}$`} /></span>
          <input type="range" min="-3" max="3" step="1" value={a} onChange={(e) => setA(Number(e.target.value))} />
        </label>
        <label>
          <span><MathText text={`Imaginarni deo $b = ${b}$`} /></span>
          <input type="range" min="-3" max="3" step="1" value={b} onChange={(e) => setB(Number(e.target.value))} />
        </label>
      </div>
      <div className="widget-caption">Dužina strelice (modul): <MathText text={`$|z| = \\sqrt{${a}^2 + ${b}^2} = ${mod}$`} /></div>
    </div>
  );
}

function UnitCircleWidget() {
  const [deg, setDeg] = useState(45);
  const rad = (deg * Math.PI) / 180;
  const cx = 110;
  const cy = 75;
  const r = 52;
  const x = cx + r * Math.cos(rad);
  const y = cy - r * Math.sin(rad);

  return (
    <div className="widget-box">
      <div className="widget-title"><MathText text={`Trigonometrijska kružnica — pomeraj ugao $\\alpha = ${deg}^\\circ$`} /></div>
      <svg viewBox="0 0 220 150" className="widget-svg">
        <line x1="25" y1={cy} x2="195" y2={cy} stroke="var(--border-strong)" strokeWidth="1.5" />
        <line x1={cx} y1="10" x2={cx} y2="140" stroke="var(--border-strong)" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--text-muted)" strokeWidth="2" />
        {/* cos (x) */}
        <line x1={cx} y1={cy} x2={x} y2={cy} stroke="#1CB0F6" strokeWidth="3.5" />
        {/* sin (y) */}
        <line x1={x} y1={cy} x2={x} y2={y} stroke="#FF4B4B" strokeWidth="3.5" />
        {/* radius */}
        <line x1={cx} y1={cy} x2={x} y2={y} stroke="#FF9600" strokeWidth="2.5" />
        <circle cx={x} cy={y} r="5" fill="#FF9600" />
      </svg>
      <div className="widget-sliders">
        <label>
          <span><MathText text={`Ugao: $${deg}^\\circ$`} /></span>
          <input type="range" min="0" max="360" step="15" value={deg} onChange={(e) => setDeg(Number(e.target.value))} />
        </label>
      </div>
      <div className="widget-caption">
        <span style={{ color: '#1CB0F6', fontWeight: 800 }}>cos({deg}°) = {Math.cos(rad).toFixed(2)}</span>
        {' · '}
        <span style={{ color: '#FF4B4B', fontWeight: 800 }}>sin({deg}°) = {Math.sin(rad).toFixed(2)}</span>
      </div>
    </div>
  );
}

function VectorsWidget() {
  const [ax, setAx] = useState(3);
  const [bx, setBx] = useState(2);
  const ox = 40;
  const oy = 105;
  const s = 22;

  return (
    <div className="widget-box">
      <div className="widget-title"><MathText text="Nadovezivanje vektora: $\vec a + \vec b$" /></div>
      <svg viewBox="0 0 230 130" className="widget-svg">
        <line x1={ox} y1={oy} x2={ox + ax * s} y2={oy - 2 * s} stroke="#1CB0F6" strokeWidth="3.5" />
        <circle cx={ox + ax * s} cy={oy - 2 * s} r="4" fill="#1CB0F6" />
        <line x1={ox + ax * s} y1={oy - 2 * s} x2={ox + (ax + bx) * s} y2={oy - 3 * s} stroke="#FF9600" strokeWidth="3.5" />
        <circle cx={ox + (ax + bx) * s} cy={oy - 3 * s} r="4" fill="#FF9600" />
        <line x1={ox} y1={oy} x2={ox + (ax + bx) * s} y2={oy - 3 * s} stroke="#58CC02" strokeWidth="3.5" strokeDasharray="5 3" />
        <text x={ox + ax * s * 0.4} y={oy - s - 6} fontSize="12" fontWeight="800" fill="#1CB0F6">a</text>
        <text x={ox + (ax + bx * 0.5) * s} y={oy - 2.7 * s - 4} fontSize="12" fontWeight="800" fill="#FF9600">b</text>
        <text x={ox + (ax + bx) * s * 0.52} y={oy - 1.1 * s} fontSize="12" fontWeight="800" fill="#58CC02">a + b</text>
      </svg>
      <div className="widget-sliders">
        <label>
          <span><MathText text={`Dužina vektora $a_x = ${ax}$`} /></span>
          <input type="range" min="1" max="4" step="1" value={ax} onChange={(e) => setAx(Number(e.target.value))} />
        </label>
        <label>
          <span><MathText text={`Dužina vektora $b_x = ${bx}$`} /></span>
          <input type="range" min="1" max="3" step="1" value={bx} onChange={(e) => setBx(Number(e.target.value))} />
        </label>
      </div>
    </div>
  );
}

function SequenceWidget() {
  const [d, setD] = useState(3);
  const terms = [2, 2 + d, 2 + 2 * d, 2 + 3 * d, 2 + 4 * d];

  return (
    <div className="widget-box">
      <div className="widget-title"><MathText text={`Aritmetički niz: svaki korak dodaje isti broj $d = ${d}$`} /></div>
      <div className="seq-row">
        {terms.map((val, i) => (
          <div key={i} className="seq-node">
            <span className="seq-idx">a<sub>{i + 1}</sub></span>
            <span className="seq-val">{val}</span>
          </div>
        ))}
      </div>
      <div className="widget-sliders">
        <label>
          <span><MathText text={`Razlika (korak) $d = ${d}$`} /></span>
          <input type="range" min="1" max="7" step="1" value={d} onChange={(e) => setD(Number(e.target.value))} />
        </label>
      </div>
      <div className="widget-caption">
        Formula: <MathText text={`$a_n = 2 + (n - 1)\\cdot ${d}$`} />
      </div>
    </div>
  );
}

function DerivativeWidget() {
  const [x0, setX0] = useState(1);
  const slope = 2 * x0;
  const y0 = x0 * x0;

  const toX = (x) => 110 + x * 28;
  const toY = (y) => 120 - y * 18;

  const pts = [];
  for (let x = -2.4; x <= 2.4; x += 0.15) {
    pts.push(`${toX(x).toFixed(1)},${toY(x * x).toFixed(1)}`);
  }

  const lx1 = x0 - 1.3;
  const lx2 = x0 + 1.3;
  const ly1 = y0 + slope * (lx1 - x0);
  const ly2 = y0 + slope * (lx2 - x0);

  return (
    <div className="widget-box">
      <div className="widget-title"><MathText text="Izvod je nagib skijaša (tangente) na brdu $f(x) = x^2$" /></div>
      <svg viewBox="0 0 220 145" className="widget-svg">
        <line x1="15" y1="120" x2="205" y2="120" stroke="var(--border-strong)" strokeWidth="1.5" />
        <line x1="110" y1="10" x2="110" y2="135" stroke="var(--border-strong)" strokeWidth="1.5" />
        <polyline fill="none" stroke="#1CB0F6" strokeWidth="3.5" points={pts.join(' ')} />
        <line x1={toX(lx1)} y1={toY(ly1)} x2={toX(lx2)} y2={toY(ly2)} stroke="#FF9600" strokeWidth="3" />
        <circle cx={toX(x0)} cy={toY(y0)} r="5.5" fill="#FF4B4B" />
      </svg>
      <div className="widget-sliders">
        <label>
          <span><MathText text={`Tačka $x = ${x0}$ → Izvod (nagib) $f'(${x0}) = 2 \\cdot (${x0}) = ${slope}$`} /></span>
          <input type="range" min="-2" max="2" step="0.5" value={x0} onChange={(e) => setX0(Number(e.target.value))} />
        </label>
      </div>
    </div>
  );
}

function IntegralWidget() {
  const [b, setB] = useState(2);
  const area = ((b * b * b) / 3).toFixed(2);
  const toX = (x) => 45 + x * 45;
  const toY = (y) => 125 - y * 14;

  const curvePts = [];
  const areaPts = [`${toX(0)},${toY(0)}`];
  for (let x = 0; x <= 2.6; x += 0.1) {
    curvePts.push(`${toX(x).toFixed(1)},${toY(x * x).toFixed(1)}`);
  }
  for (let x = 0; x <= b + 0.01; x += 0.1) {
    const cx = Math.min(x, b);
    areaPts.push(`${toX(cx).toFixed(1)},${toY(cx * cx).toFixed(1)}`);
  }
  areaPts.push(`${toX(b)},${toY(0)}`);

  return (
    <div className="widget-box">
      <div className="widget-title"><MathText text="Određeni integral = površina ispod krive $y = x^2$" /></div>
      <svg viewBox="0 0 220 145" className="widget-svg">
        <polygon points={areaPts.join(' ')} fill="rgba(88, 204, 2, 0.35)" />
        <line x1="25" y1="125" x2="195" y2="125" stroke="var(--border-strong)" strokeWidth="1.5" />
        <line x1="45" y1="10" x2="45" y2="135" stroke="var(--border-strong)" strokeWidth="1.5" />
        <polyline fill="none" stroke="#58CC02" strokeWidth="3.5" points={curvePts.join(' ')} />
      </svg>
      <div className="widget-sliders">
        <label>
          <span><MathText text={`Gornja granica $b = ${b}$`} /></span>
          <input type="range" min="0.5" max="2.5" step="0.5" value={b} onChange={(e) => setB(Number(e.target.value))} />
        </label>
      </div>
      <div className="widget-caption">
        <MathText text={`$\\int_0^{${b}} x^2\\,dx = \\frac{${b}^3}{3} = ${area}$`} />
      </div>
    </div>
  );
}

function CombinatoricsWidget() {
  const [n, setN] = useState(4);
  const fact = (num) => (num <= 1 ? 1 : num * fact(num - 1));
  const perms = fact(n);
  const combs = (n * (n - 1)) / 2;

  return (
    <div className="widget-box">
      <div className="widget-title">Redosled bitan (Permutacije) vs Nije bitan (Kombinacije)</div>
      <div className="combo-balls">
        {['🍎', '🍋', '🫐', '🍇', '🥝'].slice(0, n).map((e, i) => (
          <span key={i} className="combo-ball">{e}</span>
        ))}
      </div>
      <div className="widget-sliders">
        <label>
          <span><MathText text={`Broj voćkica $n = ${n}$`} /></span>
          <input type="range" min="2" max="5" step="1" value={n} onChange={(e) => setN(Number(e.target.value))} />
        </label>
      </div>
      <div className="widget-caption">
        Načina da ih poređaš u red: <strong>{n}! = {perms}</strong> · Parova bez redosleda: <strong>C({n}, 2) = {combs}</strong>
      </div>
    </div>
  );
}
