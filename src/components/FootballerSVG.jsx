// Realistic footballer SVG with per-joint animation (no whole-div movement)

const HAIRSTYLES = {
  kurz: (color) => <path d="M-13,-5 Q-14,-10 -12,-14 Q0,-19 12,-14 Q14,-10 13,-5 Q0,-9 -13,-5 Z" fill={color} />,
  stachel: (color) => <g fill={color}><path d="M-13,-5 Q-14,-10 -12,-14 Q0,-19 12,-14 Q14,-10 13,-5 Q0,-9 -13,-5 Z" /><polygon points="-6,-14 -4,-23 -2,-14" /><polygon points="2,-16 4,-25 6,-16" /><polygon points="8,-14 10,-23 12,-14" /></g>,
  lang: (color) => <g fill={color}><path d="M-14,-5 Q-15,-10 -13,-15 Q0,-20 13,-15 Q15,-10 14,-5 Q0,-9 -14,-5 Z" /><path d="M-14,-3 Q-17,6 -13,14 L-11,0 Z" /><path d="M14,-3 Q17,6 13,14 L11,0 Z" /></g>,
  locken: (color) => <g fill={color}><ellipse cx="0" cy="-10" rx="13" ry="8" /><circle cx="-9" cy="-12" r="4" /><circle cx="0" cy="-15" r="4" /><circle cx="9" cy="-12" r="4" /><circle cx="-6" cy="-6" r="3.5" /><circle cx="6" cy="-6" r="3.5" /></g>,
  irokese: (color) => <g fill={color}><path d="M-12,-5 Q-13,-10 -11,-13 Q0,-17 11,-13 Q13,-10 12,-5 Q0,-8 -12,-5 Z" /><rect x="-2" y="-26" width="4" height="14" rx="2" /></g>,
  zopf: (color) => <g fill={color}><path d="M-13,-5 Q-14,-10 -12,-14 Q0,-19 12,-14 Q14,-10 13,-5 Q0,-9 -13,-5 Z" /><ellipse cx="0" cy="12" rx="2" ry="9" /></g>,
}

// Each ball has: fill, stroke, and a unique "detail" renderer
const BALLS = {
  ball_einfach: { fill: '#fff', stroke: '#333', type: 'classic' },
  ball_training: { fill: '#f5f5f4', stroke: '#78716c', type: 'panels' },
  ball_blitz: { fill: '#fef3c7', stroke: '#d97706', type: 'blitz' },
  ball_feuer: { fill: '#fca5a5', stroke: '#dc2626', type: 'feuer' },
  ball_gold: { fill: '#fbbf24', stroke: '#92400e', type: 'gold' },
  ball_neon: { fill: '#86efac', stroke: '#16a34a', type: 'neon' },
  ball_eis: { fill: '#e0f2fe', stroke: '#0284c7', type: 'eis' },
  ball_regenbogen: { fill: '#fff', stroke: '#8b5cf6', type: 'regenbogen' },
  ball_diamant: { fill: '#bfdbfe', stroke: '#1d4ed8', type: 'diamant' },
  ball_galaxie: { fill: '#1e1b4b', stroke: '#6d28d9', type: 'galaxie' },
  ball_plasma: { fill: '#581c87', stroke: '#a855f7', type: 'plasma' },
  ball_stern: { fill: '#fef08a', stroke: '#ca8a04', type: 'stern' },
  ball_supernova: { fill: '#1e1b4b', stroke: '#f59e0b', type: 'supernova' },
  ball_kosmos: { fill: '#0f172a', stroke: '#6366f1', type: 'kosmos' },
}

const BACKGROUNDS = {
  bg_bolz: { sky: '#87ceeb', ground: '#4ade80', type: 'bolz' },
  bg_park: { sky: '#93c5fd', ground: '#86efac', type: 'park' },
  bg_schulhof: { sky: '#a5b4fc', ground: '#d4d4d4', type: 'schulhof' },
  bg_stadion: { sky: '#60a5fa', ground: '#22c55e', type: 'stadion' },
  bg_arena: { sky: '#6366f1', ground: '#16a34a', type: 'arena' },
  bg_nacht: { sky: '#1e1b4b', ground: '#166534', type: 'nacht' },
  bg_strand: { sky: '#38bdf8', ground: '#fde68a', type: 'strand' },
  bg_schnee: { sky: '#e0f2fe', ground: '#f1f5f9', type: 'schnee' },
  bg_wueste: { sky: '#fbbf24', ground: '#d97706', type: 'wueste' },
  bg_dschungel: { sky: '#15803d', ground: '#166534', type: 'dschungel' },
  bg_vulkan: { sky: '#450a0a', ground: '#7f1d1d', type: 'vulkan' },
  bg_unterwasser: { sky: '#0c4a6e', ground: '#164e63', type: 'unterwasser' },
  bg_wolken: { sky: '#bfdbfe', ground: '#e0f2fe', type: 'wolken' },
  bg_weltraum: { sky: '#0f172a', ground: '#1e293b', type: 'weltraum' },
  bg_regenbogen: { sky: '#c084fc', ground: '#86efac', type: 'regenbogen' },
  bg_finale: { sky: '#312e81', ground: '#15803d', type: 'finale' },
}

// Animation keyframes for each pose (angles oscillate between two states)
// Format: { joint: [fromAngle, toAngle], duration (s) }
const ANIMATIONS = {
  default: { // Idle breathing — arms visibly at sides
    lShoulder: [12, 16], rShoulder: [-12, -16], lElbow: [8, 14], rElbow: [8, 14],
    lHip: [0, 2], rHip: [0, -2], lKnee: [0, 0], rKnee: [0, 0], dur: 2.5
  },
  jubel: { // Arms wave up/down — clearly visible
    lShoulder: [-155, -170], rShoulder: [155, 170], lElbow: [-10, -25], rElbow: [-10, -25],
    lHip: [0, 2], rHip: [0, -2], lKnee: [0, 0], rKnee: [0, 0], dur: 0.8
  },
  sprint: { // Running cycle: arms and legs alternate
    lShoulder: [-25, 15], rShoulder: [25, -15], lElbow: [20, 35], rElbow: [20, 35],
    lHip: [22, -12], rHip: [-14, 22], lKnee: [-5, 15], rKnee: [18, -5], dur: 0.7
  },
  jonglieren: { // Knee bounce with ball
    lShoulder: [6, 10], rShoulder: [-6, -10], lElbow: [8, 12], rElbow: [8, 12],
    lHip: [0, 2], rHip: [-28, -38], lKnee: [0, 0], rKnee: [35, 50], dur: 0.8
  },
  sprung: { // Jump: legs bend then extend
    lShoulder: [-30, -40], rShoulder: [30, 40], lElbow: [-8, -15], rElbow: [-8, -15],
    lHip: [10, 18], rHip: [10, 18], lKnee: [-10, -18], rKnee: [-10, -18], dur: 1.0
  },
  torwart: { // Ready stance: sway side to side
    lShoulder: [-50, -55], rShoulder: [50, 55], lElbow: [18, 25], rElbow: [18, 25],
    lHip: [-6, -4], rHip: [6, 4], lKnee: [3, 5], rKnee: [3, 5], dur: 1.2
  },
  dribbling: { // Ball control: weight shift
    lShoulder: [8, 14], rShoulder: [-5, -10], lElbow: [10, 15], rElbow: [10, 15],
    lHip: [-3, 2], rHip: [6, 12], lKnee: [0, 0], rKnee: [-4, -8], dur: 0.9
  },
  cool: { // Cool lean: subtle sway
    lShoulder: [18, 24], rShoulder: [-22, -28], lElbow: [22, 30], rElbow: [32, 38],
    lHip: [2, 5], rHip: [-3, -6], lKnee: [0, 2], rKnee: [1, 3], dur: 2.0
  },
  kraft: { // Flex: arms pump
    lShoulder: [-108, -118], rShoulder: [108, 118], lElbow: [-68, -78], rElbow: [-68, -78],
    lHip: [1, 3], rHip: [-1, -3], lKnee: [0, 0], rKnee: [0, 0], dur: 0.9
  },
  fallrueck: { // Kick motion
    lShoulder: [12, 18], rShoulder: [-8, -14], lElbow: [8, 14], rElbow: [10, 16],
    lHip: [4, 8], rHip: [-28, -38], lKnee: [0, 5], rKnee: [22, 32], dur: 1.0
  },
  krone: { // Royal wave
    lShoulder: [4, 8], rShoulder: [-148, -158], lElbow: [6, 10], rElbow: [-8, -15],
    lHip: [0, 2], rHip: [0, -2], lKnee: [0, 0], rKnee: [0, 0], dur: 1.5
  },
  handsfeet: { // Hands and feet active
    lShoulder: [-38, -48], rShoulder: [38, 48], lElbow: [12, 20], rElbow: [12, 20],
    lHip: [6, 12], rHip: [-6, -12], lKnee: [0, 0], rKnee: [0, 0], dur: 1.2
  },
}

const GROUND_Y = 72
const CHAR_Y = GROUND_Y - 40

// Animated joint: wraps children in a group with SVG animateTransform
function AnimJoint({ from, to, dur, children }) {
  const values = `${from};${to};${from}`
  return (
    <g>
      <animateTransform
        attributeName="transform"
        type="rotate"
        values={values}
        dur={`${dur}s`}
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
        keyTimes="0;0.5;1"
      />
      {children}
    </g>
  )
}

function Arm({ fromShoulder, toShoulder, fromElbow, toElbow, dur, trikotColor, skinColor }) {
  return (
    <AnimJoint from={fromShoulder} to={toShoulder} dur={dur}>
      <path d="M-3.5,0 L-3.5,14 Q0,15.5 3.5,14 L3.5,0 Z" fill={trikotColor} />
      <g transform="translate(0, 14)">
        <AnimJoint from={fromElbow} to={toElbow} dur={dur * 0.8}>
          <path d="M-2.8,0 L-2.5,11 Q0,12.5 2.5,11 L2.8,0 Z" fill={skinColor} />
          {/* Subtle arm shading */}
          <path d="M-2.8,0 L-2.5,11 Q0,12.5 0,11 L0,0 Z" fill="rgba(0,0,0,0.05)" />
          {/* Hand with fingers */}
          <g transform="translate(0, 12)">
            <path d="M-2.5,0 Q-3,1.5 -2.5,3 Q-1.5,4.5 0,4.5 Q1.5,4.5 2.5,3 Q3,1.5 2.5,0 Z" fill={skinColor} />
            {/* Finger lines */}
            <path d="M-1.5,3 L-1.5,5.5" fill="none" stroke={skinColor} strokeWidth="1" />
            <path d="M0,3.5 L0,6" fill="none" stroke={skinColor} strokeWidth="1" />
            <path d="M1.5,3 L1.5,5.5" fill="none" stroke={skinColor} strokeWidth="1" />
            {/* Finger tips */}
            <circle cx="-1.5" cy="5.5" r="0.6" fill={skinColor} />
            <circle cx="0" cy="6" r="0.6" fill={skinColor} />
            <circle cx="1.5" cy="5.5" r="0.6" fill={skinColor} />
            {/* Thumb */}
            <path d="M-2.5,1 Q-3.5,2 -3,3.5" fill="none" stroke={skinColor} strokeWidth="1.2" strokeLinecap="round" />
          </g>
        </AnimJoint>
      </g>
    </AnimJoint>
  )
}

function Leg({ fromHip, toHip, fromKnee, toKnee, dur, skinColor, trikotColor, sockColor, shoeColor, trikotAccent }) {
  return (
    <AnimJoint from={fromHip} to={toHip} dur={dur}>
      <path d="M-4.5,0 L-4.5,8 Q0,9.5 4.5,8 L4.5,0 Z" fill={trikotColor} opacity="0.92" />
      <path d="M-3.8,7 L-3.5,16 Q0,17 3.5,16 L3.8,7 Z" fill={skinColor} />
      {/* Subtle leg shading */}
      <path d="M-3.8,7 L-3.5,16 Q0,17 0,16 L0,7 Z" fill="rgba(0,0,0,0.04)" />
      <g transform="translate(0, 16)">
        <AnimJoint from={fromKnee} to={toKnee} dur={dur * 0.9}>
          <path d="M-3.2,0 L-3,13 Q0,14.5 3,13 L3.2,0 Z" fill={skinColor} />
          <path d="M-3.2,11 L-3.2,20 Q0,21.5 3.2,20 L3.2,11 Z" fill={sockColor} />
          <rect x="-3.2" y="11" width="6.4" height="1.8" rx="0.8" fill={trikotAccent} />
          {/* Football boot — elongated shape with studs */}
          <g>
            {/* Boot body — longer in front, shorter at heel */}
            <path d="M-3,19 L-3.5,21 Q-3,23.5 0,24 Q4,24.5 6,23 Q7,22 6.5,20.5 L4,19 Q2,18.5 0,19 Z" fill={shoeColor} />
            {/* Boot top/ankle */}
            <path d="M-3,19 Q0,17.5 4,19 L4,20.5 Q0,19 -3,20.5 Z" fill={shoeColor} opacity="0.85" />
            {/* Lace area */}
            <line x1="0" y1="19.5" x2="0" y2="21" stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" />
            <line x1="-0.8" y1="20" x2="0.8" y2="20" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
            <line x1="-0.6" y1="20.8" x2="0.6" y2="20.8" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
            {/* Accent stripe */}
            <path d="M-2,21.5 Q1,20 4,21" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
            {/* Sole */}
            <path d="M-3,23.5 Q0,24.5 6,23.5 Q6,24.5 0,25 Q-3,24.5 -3,23.5 Z" fill="#111" opacity="0.6" />
            {/* Studs */}
            <circle cx="-1" cy="24.2" r="0.5" fill="#333" />
            <circle cx="1.5" cy="24.3" r="0.5" fill="#333" />
            <circle cx="4" cy="24" r="0.5" fill="#333" />
          </g>
        </AnimJoint>
      </g>
    </AnimJoint>
  )
}

function Face({ skinColor, eyeColor, hairColor, hairFn }) {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="13" ry="15" fill={skinColor} />
      {/* Face shading for depth */}
      <ellipse cx="-5" cy="8" rx="5" ry="4" fill="rgba(0,0,0,0.04)" />
      <ellipse cx="5" cy="8" rx="5" ry="4" fill="rgba(0,0,0,0.04)" />
      {/* Warm cheeks */}
      <ellipse cx="-7" cy="4" rx="3.5" ry="2.5" fill="#e8847a" opacity="0.12" />
      <ellipse cx="7" cy="4" rx="3.5" ry="2.5" fill="#e8847a" opacity="0.12" />
      {/* Forehead highlight */}
      <ellipse cx="0" cy="-6" rx="6" ry="4" fill="rgba(255,255,255,0.06)" />
      <ellipse cx="-13" cy="0" rx="2.5" ry="3.5" fill={skinColor} />
      <ellipse cx="13" cy="0" rx="2.5" ry="3.5" fill={skinColor} />
      {hairFn(hairColor)}
      <path d="M-8,0.5 Q-5,-1.8 -2,0.5 Q-5,2.5 -8,0.5 Z" fill="white" />
      <path d="M2,0.5 Q5,-1.8 8,0.5 Q5,2.5 2,0.5 Z" fill="white" />
      <path d="M-8,0.5 Q-5,-1.8 -2,0.5" fill="none" stroke={hairColor} strokeWidth="0.5" opacity="0.5" />
      <path d="M2,0.5 Q5,-1.8 8,0.5" fill="none" stroke={hairColor} strokeWidth="0.5" opacity="0.5" />
      <circle cx="-5" cy="0.7" r="1.8" fill={eyeColor} />
      <circle cx="5" cy="0.7" r="1.8" fill={eyeColor} />
      <circle cx="-5" cy="0.7" r="0.9" fill="#111" />
      <circle cx="5" cy="0.7" r="0.9" fill="#111" />
      <circle cx="-4.3" cy="0" r="0.5" fill="white" opacity="0.9" />
      <circle cx="5.7" cy="0" r="0.5" fill="white" opacity="0.9" />
      <path d="M-8,-2.3 Q-5,-3.8 -2,-2.3" fill="none" stroke={hairColor} strokeWidth="0.8" strokeLinecap="round" />
      <path d="M2,-2.3 Q5,-3.8 8,-2.3" fill="none" stroke={hairColor} strokeWidth="0.8" strokeLinecap="round" />
      <path d="M-1.5,6 Q0,7.5 1.5,6" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="0.7" strokeLinecap="round" />
      <path d="M-3,9.5 Q-1.5,8.8 0,9 Q1.5,8.8 3,9.5" fill="#c08080" opacity="0.6" />
      <path d="M-3,9.5 Q0,11.5 3,9.5" fill="#d09090" opacity="0.4" />
      <path d="M-3,9.5 Q0,10.5 3,9.5" fill="none" stroke="#a06060" strokeWidth="0.5" strokeLinecap="round" />
    </g>
  )
}

function BallSVG({ ballId, x, y }) {
  const ball = BALLS[ballId] || BALLS.ball_einfach
  const r = 6
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r={r} fill={ball.fill} stroke={ball.stroke} strokeWidth="1" />
      {/* Unique detail per ball type */}
      {ball.type === 'classic' && <g>
        <path d="M-2,-4 L2,-4 L3,-1 L1,2 L-3,1 Z" fill="#333" opacity="0.7" />
        <path d="M3,2 L5,0 L4,-2" fill="none" stroke="#333" strokeWidth="0.5" opacity="0.4" />
      </g>}
      {ball.type === 'panels' && <g>
        <line x1="-4" y1="-3" x2="4" y2="-3" stroke="#999" strokeWidth="0.5" />
        <line x1="-3" y1="3" x2="5" y2="2" stroke="#999" strokeWidth="0.5" />
        <line x1="0" y1="-6" x2="0" y2="6" stroke="#999" strokeWidth="0.5" />
      </g>}
      {ball.type === 'blitz' && <g>
        <polygon points="-1,-4 2,-1 0,0 3,4 -1,1 1,0 -2,-3" fill="#d97706" opacity="0.8" />
      </g>}
      {ball.type === 'feuer' && <g>
        <path d="M-2,-3 Q0,-6 2,-3 Q1,-1 2,1 Q0,4 -2,1 Q-1,-1 -2,-3 Z" fill="#ef4444" opacity="0.6" />
        <path d="M-1,-2 Q0,-4 1,-2 Q0,0 1,1 Q0,3 -1,1 Q0,0 -1,-2 Z" fill="#fbbf24" opacity="0.5" />
      </g>}
      {ball.type === 'gold' && <g>
        <circle cx="0" cy="0" r={r - 1} fill="none" stroke="#92400e" strokeWidth="0.5" opacity="0.4" />
        <circle cx="-2" cy="-2" r="2.5" fill="#fef08a" opacity="0.4" />
        <path d="M-1,-3 L0,-4 L1,-3" fill="none" stroke="#92400e" strokeWidth="0.6" opacity="0.5" />
      </g>}
      {ball.type === 'neon' && <g>
        <circle cx="0" cy="0" r={r - 0.5} fill="none" stroke="#4ade80" strokeWidth="1.5" opacity="0.5" />
        <circle cx="0" cy="0" r={r + 1} fill="none" stroke="#4ade80" strokeWidth="0.5" opacity="0.2" />
      </g>}
      {ball.type === 'eis' && <g>
        <line x1="-3" y1="-2" x2="-1" y2="2" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.6" />
        <line x1="1" y1="-3" x2="3" y2="1" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.5" />
        <line x1="-2" y1="1" x2="2" y2="3" stroke="#0ea5e9" strokeWidth="0.5" opacity="0.4" />
        <circle cx="2" cy="-2" r="0.8" fill="#fff" opacity="0.7" />
      </g>}
      {ball.type === 'regenbogen' && <g>
        <path d="M-5,0 Q0,-5 5,0" fill="none" stroke="#ef4444" strokeWidth="0.8" opacity="0.7" />
        <path d="M-4,1 Q0,-3 4,1" fill="none" stroke="#fbbf24" strokeWidth="0.8" opacity="0.7" />
        <path d="M-3,2 Q0,-1 3,2" fill="none" stroke="#22c55e" strokeWidth="0.8" opacity="0.7" />
        <path d="M-4,3 Q0,1 4,3" fill="none" stroke="#3b82f6" strokeWidth="0.8" opacity="0.7" />
      </g>}
      {ball.type === 'diamant' && <g>
        <polygon points="0,-4 3,-1 2,3 -2,3 -3,-1" fill="none" stroke="#1d4ed8" strokeWidth="0.6" opacity="0.6" />
        <line x1="0" y1="-4" x2="0" y2="3" stroke="#60a5fa" strokeWidth="0.4" opacity="0.4" />
        <line x1="-3" y1="-1" x2="2" y2="3" stroke="#60a5fa" strokeWidth="0.4" opacity="0.3" />
        <circle cx="-1" cy="-1" r="1.5" fill="#fff" opacity="0.3" />
      </g>}
      {ball.type === 'galaxie' && <g>
        <circle cx="-2" cy="-2" r="0.7" fill="#fff" opacity="0.8" />
        <circle cx="2" cy="1" r="0.5" fill="#fff" opacity="0.6" />
        <circle cx="-1" cy="3" r="0.4" fill="#fff" opacity="0.5" />
        <circle cx="3" cy="-3" r="0.5" fill="#a78bfa" opacity="0.7" />
        <ellipse cx="0" cy="0" rx="4" ry="1.5" fill="none" stroke="#a78bfa" strokeWidth="0.5" opacity="0.4" transform="rotate(-20)" />
      </g>}
      {ball.type === 'plasma' && <g>
        <circle cx="0" cy="0" r="3" fill="#a855f7" opacity="0.3" />
        <circle cx="0" cy="0" r="1.5" fill="#e879f9" opacity="0.5" />
        <circle cx="0" cy="0" r={r + 0.5} fill="none" stroke="#c084fc" strokeWidth="0.5" opacity="0.4" />
      </g>}
      {ball.type === 'stern' && <g>
        <polygon points="0,-4 1.2,-1.5 4,-1.5 2,0.5 3,3.5 0,1.8 -3,3.5 -2,0.5 -4,-1.5 -1.2,-1.5" fill="#ca8a04" opacity="0.5" />
      </g>}
      {ball.type === 'supernova' && <g>
        <circle cx="0" cy="0" r="2.5" fill="#f59e0b" opacity="0.6" />
        <circle cx="0" cy="0" r="1" fill="#fef3c7" opacity="0.8" />
        <line x1="0" y1="-5.5" x2="0" y2="-3.5" stroke="#f59e0b" strokeWidth="0.5" opacity="0.5" />
        <line x1="0" y1="3.5" x2="0" y2="5.5" stroke="#f59e0b" strokeWidth="0.5" opacity="0.5" />
        <line x1="-5" y1="0" x2="-3.5" y2="0" stroke="#f59e0b" strokeWidth="0.5" opacity="0.5" />
        <line x1="3.5" y1="0" x2="5" y2="0" stroke="#f59e0b" strokeWidth="0.5" opacity="0.5" />
      </g>}
      {ball.type === 'kosmos' && <g>
        <circle cx="-1.5" cy="-1.5" r="0.6" fill="#fff" opacity="0.7" />
        <circle cx="2" cy="2" r="0.4" fill="#fff" opacity="0.5" />
        <circle cx="-2" cy="2" r="0.3" fill="#818cf8" opacity="0.6" />
        <ellipse cx="1" cy="-1" rx="3" ry="1" fill="none" stroke="#6366f1" strokeWidth="0.6" opacity="0.4" transform="rotate(30)" />
        <circle cx="3" cy="-2" r="1.2" fill="#4f46e5" opacity="0.3" />
        <circle cx="3" cy="-2" r="0.5" fill="#c7d2fe" opacity="0.4" />
      </g>}
      {/* Highlight on all balls */}
      <circle cx="-2" cy="-2.5" r="1.8" fill="white" opacity="0.25" />
    </g>
  )
}

function BackgroundSVG({ bgId }) {
  const bg = BACKGROUNDS[bgId]
  if (!bg) return null
  const W = 110, X = -55, Y = -85, H = 170
  // Ground starts high (y=-30) so objects stand on grass, not in the sky
  const groundStart = -30
  return (
    <g>
      {/* Sky — only the top portion */}
      <rect x={X} y={Y} width={W} height={H} fill={bg.sky} rx="6" />
      {/* Ground — covers from groundStart down (most of the scene is green) */}
      <rect x={X} y={groundStart} width={W} height={H - (groundStart - Y)} fill={bg.ground} />
      {/* Subtle gradient: darker ground in front for depth */}
      <rect x={X} y={40} width={W} height={45} fill="rgba(0,0,0,0.06)" />

      {/* Type-specific details — everything placed ON the ground */}
      {bg.type === 'bolz' && <g opacity="0.7">
        {/* Left tree — realistic with layered crown */}
        <ellipse cx="-35" cy="20" rx="7" ry="2" fill="rgba(0,0,0,0.12)" />
        <path d="M-36.5,0 L-36,20 L-33,20 L-33.5,0 Z" fill="#5c3310" />
        <path d="M-37,5 L-37.5,8 L-35.5,7 Z" fill="#5c3310" opacity="0.6" />
        <ellipse cx="-35" cy="-4" rx="11" ry="9" fill="#1a7a3a" />
        <ellipse cx="-38" cy="-6" rx="7" ry="6" fill="#166534" />
        <ellipse cx="-32" cy="-2" rx="7" ry="6" fill="#1f9e42" opacity="0.7" />
        <ellipse cx="-35" cy="-8" rx="5" ry="4" fill="#22c55e" opacity="0.4" />
        {/* Right tree */}
        <ellipse cx="38" cy="20" rx="5" ry="1.5" fill="rgba(0,0,0,0.1)" />
        <path d="M37,5 L36.5,20 L39.5,20 L39,5 Z" fill="#5c3310" />
        <ellipse cx="38" cy="0" rx="8" ry="7" fill="#1a7a3a" />
        <ellipse cx="36" cy="-2" rx="5" ry="5" fill="#166534" />
        <ellipse cx="40" cy="2" rx="5" ry="4" fill="#1f9e42" opacity="0.7" />
        {/* Goal */}
        <rect x="-18" y="30" width="36" height="30" fill="none" stroke="#fff" strokeWidth="1.5" rx="1" />
      </g>}
      {bg.type === 'park' && <g opacity="0.65">
        {/* Left tree */}
        <ellipse cx="-38" cy="22" rx="6" ry="2" fill="rgba(0,0,0,0.1)" />
        <path d="M-39.5,5 L-39,22 L-36.5,22 L-37,5 Z" fill="#5c3310" />
        <ellipse cx="-38" cy="0" rx="9" ry="8" fill="#1a7a3a" />
        <ellipse cx="-40" cy="-2" rx="6" ry="5" fill="#166534" />
        <ellipse cx="-36" cy="2" rx="5" ry="4" fill="#22c55e" opacity="0.5" />
        {/* Right tree */}
        <ellipse cx="35" cy="25" rx="5" ry="1.5" fill="rgba(0,0,0,0.1)" />
        <path d="M33.5,8 L33,25 L36,25 L35.5,8 Z" fill="#5c3310" />
        <ellipse cx="35" cy="3" rx="8" ry="7" fill="#1a7a3a" />
        <ellipse cx="33" cy="1" rx="5" ry="5" fill="#166534" />
        <ellipse cx="37" cy="5" rx="4" ry="4" fill="#1f9e42" opacity="0.6" />
        {/* Center tree */}
        <ellipse cx="0" cy="15" rx="4" ry="1.2" fill="rgba(0,0,0,0.08)" />
        <path d="M-1,-5 L-0.5,15 L1.5,15 L1,-5 Z" fill="#5c3310" />
        <ellipse cx="0" cy="-10" rx="6" ry="5.5" fill="#1a7a3a" />
        <ellipse cx="-2" cy="-11" rx="4" ry="4" fill="#166534" />
        <ellipse cx="2" cy="-8" rx="3.5" ry="3" fill="#22c55e" opacity="0.5" />
      </g>}
      {bg.type === 'schulhof' && <g opacity="0.45">
        <rect x="-48" y="-25" width="28" height="50" fill="#9ca3af" rx="2" />
        <rect x="-44" y="-18" width="5" height="7" fill="#bfdbfe" /><rect x="-36" y="-18" width="5" height="7" fill="#bfdbfe" />
        <rect x="-44" y="-6" width="5" height="7" fill="#bfdbfe" /><rect x="-36" y="-6" width="5" height="7" fill="#bfdbfe" />
        <rect x="22" y="-15" width="24" height="40" fill="#9ca3af" rx="2" />
        <rect x="26" y="-8" width="5" height="6" fill="#bfdbfe" /><rect x="34" y="-8" width="5" height="6" fill="#bfdbfe" />
      </g>}
      {bg.type === 'stadion' && <g opacity="0.4">
        <rect x="-50" y={groundStart} width="100" height="20" fill="#374151" opacity="0.5" />
        <path d="M-50,-35 Q0,-50 50,-35" fill="none" stroke="#6b7280" strokeWidth="2" />
        <rect x="-35" y="25" width="70" height="40" fill="none" stroke="#fff" strokeWidth="1.5" rx="1" />
      </g>}
      {bg.type === 'arena' && <g opacity="0.4">
        <path d="M-55,-40 Q0,-55 55,-40" fill="none" stroke="#9ca3af" strokeWidth="2" />
        <rect x="-50" y={groundStart} width="100" height="25" fill="#374151" opacity="0.5" />
        <rect x="-30" y="25" width="60" height="38" fill="none" stroke="#fff" strokeWidth="1.5" rx="1" />
      </g>}
      {bg.type === 'nacht' && <g>
        <circle cx="35" cy="-55" r="7" fill="#fde68a" opacity="0.7" />
        <circle cx="-30" cy="-60" r="1" fill="#fff" opacity="0.5" /><circle cx="-10" cy="-65" r="0.8" fill="#fff" opacity="0.4" />
        <circle cx="15" cy="-70" r="1" fill="#fff" opacity="0.5" /><circle cx="-40" cy="-50" r="0.7" fill="#fff" opacity="0.3" />
        {/* Floodlights standing on ground */}
        <rect x="-48" y={groundStart} width="3" height={GROUND_Y - groundStart} fill="#555" />
        <rect x="-50" y={groundStart - 4} width="7" height="5" fill="#fde68a" rx="1" />
        <rect x="44" y={groundStart} width="3" height={GROUND_Y - groundStart} fill="#555" />
        <rect x="42" y={groundStart - 4} width="7" height="5" fill="#fde68a" rx="1" />
        <g opacity="0.3"><rect x="-25" y="25" width="50" height="38" fill="none" stroke="#fff" strokeWidth="1.5" rx="1" /></g>
      </g>}
      {bg.type === 'strand' && <g>
        <circle cx="38" cy="-55" r="9" fill="#fbbf24" opacity="0.5" />
        <path d="M-55,55 Q-20,48 10,52 Q35,56 55,50" fill="#0ea5e9" opacity="0.25" />
      </g>}
      {bg.type === 'schnee' && <g>
        <circle cx="-20" cy="-45" r="1.8" fill="#fff" opacity="0.6" /><circle cx="10" cy="-55" r="1.5" fill="#fff" opacity="0.5" />
        <circle cx="30" cy="-40" r="1.8" fill="#fff" opacity="0.5" /><circle cx="-35" cy="-60" r="1.5" fill="#fff" opacity="0.4" />
        <circle cx="5" cy="-35" r="1" fill="#fff" opacity="0.4" /><circle cx="-10" cy="-50" r="1.5" fill="#fff" opacity="0.5" />
      </g>}
      {bg.type === 'wueste' && <g>
        <circle cx="35" cy="-55" r="11" fill="#fff" opacity="0.25" />
        <path d="M-55,40 Q-25,30 0,38 Q25,45 55,35" fill="#92400e" opacity="0.2" />
      </g>}
      {bg.type === 'dschungel' && <g opacity="0.55">
        {/* Palm trees standing on ground */}
        <ellipse cx="-42" cy="18" rx="4" ry="1.5" fill="rgba(0,0,0,0.1)" />
        <rect x="-43" y="-15" width="2.5" height="33" fill="#713f12" />
        <path d="M-48,-18 Q-42,-30 -36,-18" fill="#15803d" />
        <path d="M-50,-15 Q-42,-28 -34,-15" fill="#166534" />
        <ellipse cx="42" cy="18" rx="4" ry="1.5" fill="rgba(0,0,0,0.1)" />
        <rect x="41" y="-10" width="2.5" height="28" fill="#713f12" />
        <path d="M36,-12 Q42,-25 48,-12" fill="#15803d" />
        <path d="M34,-10 Q42,-22 50,-10" fill="#166534" />
      </g>}
      {bg.type === 'vulkan' && <g>
        {/* Volcano rising from ground */}
        <path d="M-25,-28 L-5,-65 L15,-28 Z" fill="#7f1d1d" opacity="0.7" />
        <circle cx="4" cy="-62" r="3.5" fill="#f97316" opacity="0.6" />
        <circle cx="0" cy="-59" r="2" fill="#fbbf24" opacity="0.5" />
      </g>}
      {bg.type === 'unterwasser' && <g>
        <circle cx="-25" cy="-40" r="3" fill="#67e8f9" opacity="0.3" /><circle cx="20" cy="-50" r="2" fill="#67e8f9" opacity="0.3" />
        <circle cx="-10" cy="-60" r="2.5" fill="#67e8f9" opacity="0.25" /><circle cx="35" cy="-30" r="2" fill="#67e8f9" opacity="0.2" />
        <path d="M-40,40 Q-35,35 -30,40 Q-25,45 -20,40" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.3" />
        <path d="M20,50 Q25,45 30,50 Q35,55 40,50" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.3" />
      </g>}
      {bg.type === 'wolken' && <g opacity="0.4">
        <ellipse cx="-25" cy="-55" rx="15" ry="7" fill="#fff" /><ellipse cx="-18" cy="-58" rx="8" ry="5" fill="#fff" />
        <ellipse cx="25" cy="-40" rx="12" ry="6" fill="#fff" /><ellipse cx="30" cy="-43" rx="7" ry="4" fill="#fff" />
        <ellipse cx="0" cy="-70" rx="10" ry="5" fill="#fff" />
      </g>}
      {bg.type === 'weltraum' && <g>
        <circle cx="-30" cy="-60" r="1.2" fill="#fff" opacity="0.7" /><circle cx="20" cy="-70" r="1" fill="#fff" opacity="0.5" />
        <circle cx="-10" cy="-50" r="0.8" fill="#fff" opacity="0.4" /><circle cx="40" cy="-55" r="1" fill="#fff" opacity="0.6" />
        <circle cx="5" cy="-75" r="0.7" fill="#fff" opacity="0.3" /><circle cx="-40" cy="-45" r="0.9" fill="#fff" opacity="0.5" />
        <circle cx="30" cy="-35" r="4" fill="#6366f1" opacity="0.3" /><circle cx="32" cy="-36" r="1.5" fill="#a78bfa" opacity="0.4" />
        <ellipse cx="-20" cy="-30" rx="5" ry="2" fill="#fbbf24" opacity="0.15" />
      </g>}
      {bg.type === 'regenbogen' && <g opacity="0.4">
        <path d="M-45,-30 Q0,-70 45,-30" fill="none" stroke="#ef4444" strokeWidth="3" />
        <path d="M-43,-27 Q0,-65 43,-27" fill="none" stroke="#f97316" strokeWidth="3" />
        <path d="M-41,-24 Q0,-60 41,-24" fill="none" stroke="#fbbf24" strokeWidth="3" />
        <path d="M-39,-21 Q0,-55 39,-21" fill="none" stroke="#22c55e" strokeWidth="3" />
        <path d="M-37,-18 Q0,-50 37,-18" fill="none" stroke="#3b82f6" strokeWidth="3" />
        <path d="M-35,-15 Q0,-45 35,-15" fill="none" stroke="#8b5cf6" strokeWidth="3" />
      </g>}
      {bg.type === 'finale' && <g>
        <rect x={X} y="-40" width={W} height="60" fill="rgba(0,0,0,0.15)" />
        <path d="M-55,-50 Q0,-70 55,-50" fill="none" stroke="#6b7280" strokeWidth="2" opacity="0.5" />
        <g opacity="0.5">
          <circle cx="-30" cy="-60" r="2" fill="#ef4444" /><circle cx="-25" cy="-65" r="1.5" fill="#fbbf24" />
          <circle cx="25" cy="-55" r="2" fill="#3b82f6" /><circle cx="30" cy="-60" r="1.5" fill="#10b981" />
        </g>
        <g opacity="0.3"><rect x="-35" y="20" width="70" height="45" fill="none" stroke="#fff" strokeWidth="2" rx="2" /></g>
      </g>}
    </g>
  )
}

function PoseEffects({ pose }) {
  if (!pose || pose === 'default') return null
  switch (pose) {
    case 'krone': return <g><polygon points="-5,-81 -3,-86 0,-81 3,-88 6,-81 9,-86 11,-81" fill="#fbbf24" stroke="#92400e" strokeWidth="0.4" /></g>
    case 'jonglieren': return <g><circle cx="12" cy="55" r="5" fill="#fff" stroke="#333" strokeWidth="0.8"><animate attributeName="cy" values="55;47;55" dur="0.8s" repeatCount="indefinite" /></circle></g>
    case 'dribbling': return <g><circle cx="10" cy={GROUND_Y - 4} r="5" fill="#fff" stroke="#333" strokeWidth="0.8"><animate attributeName="cx" values="8;14;8" dur="0.9s" repeatCount="indefinite" /></circle></g>
    default: return null
  }
}

// Trikot pattern overlay (rendered on top of the base torso color)
function TrikotPatternOverlay({ pattern }) {
  if (!pattern) return null
  // Patterns are drawn within the torso clip area (roughly -12,-42 to 12,2)
  switch (pattern) {
    case 'flammen': return (
      <g opacity="0.8">
        <path d="M-8,2 Q-6,-8 -4,-2 Q-2,-12 0,-4 Q2,-14 4,-2 Q6,-8 8,2 Z" fill="#f97316" />
        <path d="M-6,2 Q-4,-5 -2,0 Q0,-8 2,0 Q4,-5 6,2 Z" fill="#fbbf24" />
        <path d="M-10,2 Q-8,-12 -6,-4 Q-4,-18 -2,-6 Q0,-20 2,-6 Q4,-18 6,-4 Q8,-12 10,2 Z" fill="#ef4444" opacity="0.6" />
      </g>
    )
    case 'regenbogen': return (
      <g opacity="0.7">
        <rect x="-12" y="-40" width="24" height="5" fill="#ef4444" rx="1" />
        <rect x="-12" y="-35" width="24" height="5" fill="#f97316" rx="1" />
        <rect x="-12" y="-30" width="24" height="5" fill="#fbbf24" rx="1" />
        <rect x="-12" y="-25" width="24" height="5" fill="#22c55e" rx="1" />
        <rect x="-12" y="-20" width="24" height="5" fill="#3b82f6" rx="1" />
        <rect x="-12" y="-15" width="24" height="5" fill="#8b5cf6" rx="1" />
        <rect x="-12" y="-10" width="24" height="5" fill="#ec4899" rx="1" />
      </g>
    )
    case 'gold': return (
      <g opacity="0.4">
        <rect x="-8" y="-36" width="16" height="2" fill="#fef08a" rx="1" />
        <rect x="-6" y="-26" width="12" height="1.5" fill="#fef08a" rx="1" />
        <rect x="-8" y="-16" width="16" height="2" fill="#fef08a" rx="1" />
        <circle cx="-4" cy="-30" r="2" fill="#fff" opacity="0.3" />
      </g>
    )
    case 'silber': return (
      <g opacity="0.3">
        <rect x="-8" y="-35" width="16" height="1.5" fill="#fff" rx="1" />
        <rect x="-7" y="-25" width="14" height="1.5" fill="#fff" rx="1" />
        <rect x="-8" y="-15" width="16" height="1.5" fill="#fff" rx="1" />
      </g>
    )
    case 'neon': return (
      <g opacity="0.5">
        <rect x="-12" y="-42" width="24" height="44" fill="none" stroke="#fff" strokeWidth="1.5" rx="3" />
        <rect x="-8" y="-38" width="16" height="36" fill="none" stroke="#fff" strokeWidth="0.8" rx="2" />
      </g>
    )
    case 'eis': return (
      <g opacity="0.5">
        <line x1="-8" y1="-35" x2="-3" y2="-20" stroke="#0ea5e9" strokeWidth="0.8" />
        <line x1="3" y1="-38" x2="8" y2="-22" stroke="#0ea5e9" strokeWidth="0.8" />
        <line x1="-5" y1="-15" x2="5" y2="-5" stroke="#0ea5e9" strokeWidth="0.8" />
        <circle cx="0" cy="-30" r="2" fill="#fff" opacity="0.4" />
        <circle cx="5" cy="-20" r="1.5" fill="#fff" opacity="0.3" />
      </g>
    )
    case 'galaxie': return (
      <g opacity="0.7">
        <circle cx="-4" cy="-30" r="1" fill="#fff" opacity="0.8" />
        <circle cx="5" cy="-20" r="0.7" fill="#fff" opacity="0.6" />
        <circle cx="-2" cy="-15" r="0.5" fill="#a78bfa" opacity="0.7" />
        <circle cx="3" cy="-35" r="0.6" fill="#fff" opacity="0.5" />
        <circle cx="-6" cy="-22" r="0.4" fill="#c4b5fd" opacity="0.6" />
        <ellipse cx="0" cy="-25" rx="7" ry="2" fill="none" stroke="#a78bfa" strokeWidth="0.5" opacity="0.4" transform="rotate(-15)" />
      </g>
    )
    case 'blitz': return (
      <g opacity="0.8">
        <polygon points="-2,-38 3,-25 0,-25 4,-10 -3,-22 0,-22 -4,-36" fill="#fbbf24" />
      </g>
    )
    case 'diamant': return (
      <g opacity="0.5">
        <polygon points="0,-35 5,-25 0,-15 -5,-25" fill="none" stroke="#0c4a6e" strokeWidth="0.8" />
        <line x1="0" y1="-35" x2="0" y2="-15" stroke="#60a5fa" strokeWidth="0.4" />
        <line x1="-5" y1="-25" x2="5" y2="-25" stroke="#60a5fa" strokeWidth="0.4" />
        <circle cx="-1" cy="-28" r="2" fill="#fff" opacity="0.3" />
      </g>
    )
    case 'champion': return (
      <g opacity="0.6">
        <polygon points="0,-35 2,-30 5,-30 3,-27 4,-23 0,-25 -4,-23 -3,-27 -5,-30 -2,-30" fill="#fbbf24" />
        <rect x="-6" y="-12" width="12" height="1.5" fill="#fbbf24" rx="0.5" />
        <rect x="-8" y="-8" width="16" height="1.5" fill="#fbbf24" rx="0.5" />
      </g>
    )
    case 'legend': return (
      <g opacity="0.5">
        <polygon points="0,-36 1.5,-32 4,-32 2,-30 3,-27 0,-29 -3,-27 -2,-30 -4,-32 -1.5,-32" fill="#fbbf24" />
        <polygon points="0,-18 1,-15 3,-15 1.5,-14 2,-11 0,-13 -2,-11 -1.5,-14 -3,-15 -1,-15" fill="#fbbf24" />
        <rect x="-5" y="-5" width="10" height="1" fill="#fbbf24" rx="0.5" />
      </g>
    )
    case 'wm': return (
      <g opacity="0.6">
        <polygon points="0,-34 1.5,-30 4,-30 2,-28 2.5,-25 0,-27 -2.5,-25 -2,-28 -4,-30 -1.5,-30" fill="#fbbf24" />
        <text x="0" y="-8" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#fbbf24" opacity="0.8">WM</text>
      </g>
    )
    default: return null
  }
}

export default function FootballerSVG({
  skinColor = '#f4c28d', hairColor = '#4a2c17', hairstyle = 'kurz', eyeColor = '#1e40af',
  shoeColor = '#1e1e1e', sockColor = '#ffffff', trikotColor = '#22c55e', trikotAccent = '#ffffff',
  trikotName = '', trikotNumber = '', trikotPattern = null, ballId = null, bgId = null, pose = null, animation = null, size = 200,
}) {
  const hairFn = HAIRSTYLES[hairstyle] || HAIRSTYLES.kurz
  const anim = ANIMATIONS[pose] || ANIMATIONS[animation] || ANIMATIONS.default
  const dur = anim.dur

  return (
    <div style={{ display: 'inline-block', width: size, height: size * 1.1 }}>
      <svg width={size} height={size * 1.1} viewBox="-55 -85 110 170" style={{ display: 'block' }}>
        <defs>
          <radialGradient id="sunG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#fef08a" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="fS" x="-15%" y="-5%" width="130%" height="112%">
            <feDropShadow dx="0.4" dy="0.8" stdDeviation="0.6" floodOpacity="0.1" />
          </filter>
        </defs>

        {bgId ? <BackgroundSVG bgId={bgId} /> : <rect x="-55" y="-85" width="110" height="170" fill="#c8ecd8" rx="6" />}
        <circle cx="35" cy="-65" r="12" fill="url(#sunG)" />
        <circle cx="35" cy="-65" r="5" fill="#fbbf24" opacity="0.8" />

        <rect x="-55" y={GROUND_Y} width="110" height="13" fill="#2d8a4e" opacity={bgId ? 0 : 0.5} />
        <ellipse cx="0" cy={GROUND_Y + 0.5} rx="11" ry="2" fill="rgba(0,0,0,0.18)" />

        <g transform={`translate(0, ${CHAR_Y})`} filter="url(#fS)">
          {/* Legs */}
          <g transform="translate(-4, 0)">
            <Leg fromHip={anim.lHip[0]} toHip={anim.lHip[1]} fromKnee={anim.lKnee[0]} toKnee={anim.lKnee[1]} dur={dur}
              skinColor={skinColor} trikotColor={trikotColor} sockColor={sockColor} shoeColor={shoeColor} trikotAccent={trikotAccent} />
          </g>
          <g transform="translate(4, 0)">
            <Leg fromHip={anim.rHip[0]} toHip={anim.rHip[1]} fromKnee={anim.rKnee[0]} toKnee={anim.rKnee[1]} dur={dur}
              skinColor={skinColor} trikotColor={trikotColor} sockColor={sockColor} shoeColor={shoeColor} trikotAccent={trikotAccent} />
          </g>

          {/* Torso — softer, more fabric-like shape */}
          <path d="M-13,-42 Q-14,-38 -14,-34 L-13,-10 Q-12,0 -7,2 L7,2 Q12,0 13,-10 L14,-34 Q14,-38 13,-42 Z" fill={trikotColor} />
          {/* Fabric folds / shading for 3D cloth look */}
          <path d="M-8,-35 Q-6,-20 -7,-5" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.8" />
          <path d="M8,-35 Q6,-20 7,-5" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.8" />
          <path d="M-4,-10 Q0,-8 4,-10" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.6" />
          <path d="M-10,-30 Q-8,-28 -10,-25" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
          <path d="M10,-30 Q8,-28 10,-25" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
          {/* Side shading for shape */}
          <path d="M-13,-42 Q-14,-38 -14,-34 L-13,-10 Q-12,0 -7,2 L-3,2 L-3,-42 Z" fill="rgba(0,0,0,0.04)" />
          {/* Trikot pattern overlay */}
          <TrikotPatternOverlay pattern={trikotPattern} />
          {/* Accent stripes */}
          <path d="M-13,-38 L-13,-5" fill="none" stroke={trikotAccent} strokeWidth="1.5" opacity="0.2" />
          <path d="M13,-38 L13,-5" fill="none" stroke={trikotAccent} strokeWidth="1.5" opacity="0.2" />
          {/* Rounded collar */}
          <path d="M-5,-44 Q0,-41 5,-44" fill="none" stroke={trikotAccent} strokeWidth="1.8" strokeLinecap="round" />
          {/* Hem bottom */}
          <path d="M-7,2 Q0,3.5 7,2" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.6" />
          {trikotNumber && <text x="0" y="-16" textAnchor="middle" fontSize="10" fontWeight="bold" fill={trikotAccent} opacity="0.7">{trikotNumber}</text>}

          {/* Neck */}
          <rect x="-2.5" y="-46" width="5" height="6" rx="2" fill={skinColor} />

          {/* Head — rendered BEFORE arms so arms are visible on top */}
          <g transform="translate(0, -60)">
            <Face skinColor={skinColor} eyeColor={eyeColor} hairColor={hairColor} hairFn={hairFn} />
          </g>

          {/* Arms — rendered LAST (on top of everything) so always visible */}
          <g transform="translate(-15, -40)">
            <Arm fromShoulder={anim.lShoulder[0]} toShoulder={anim.lShoulder[1]} fromElbow={anim.lElbow[0]} toElbow={anim.lElbow[1]} dur={dur}
              trikotColor={trikotColor} skinColor={skinColor} />
          </g>
          <g transform="translate(15, -40)">
            <Arm fromShoulder={anim.rShoulder[0]} toShoulder={anim.rShoulder[1]} fromElbow={anim.rElbow[0]} toElbow={anim.rElbow[1]} dur={dur}
              trikotColor={trikotColor} skinColor={skinColor} />
          </g>
        </g>

        <PoseEffects pose={pose} />

        {ballId && pose !== 'jonglieren' && pose !== 'dribbling' && (
          <BallSVG ballId={ballId} x={20} y={GROUND_Y - 4} />
        )}

        {trikotName && <text x="0" y={GROUND_Y + 10} textAnchor="middle" fontSize="5" fontWeight="bold" fill="#1a6b36" opacity="0.6">{trikotName}</text>}
      </svg>
    </div>
  )
}

export { HAIRSTYLES, BALLS, BACKGROUNDS }
