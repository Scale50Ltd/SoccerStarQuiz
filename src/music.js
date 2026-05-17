// Soccer Star Quiz — Background Music
// Retro game-style chiptune, ~1 minute, key of C major
// Warm sound via detuned oscillator pairs + low-pass filter
let audioCtx = null
let isPlaying = false
let master = null
let timer = null
let vol = 0.3
const VOLS = { leise: 0.15, mittel: 0.3, laut: 0.5 }

function ac() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

// Custom file support
let customAudio = null, customUrl = null, customChecked = false
function checkCustom() {
  if (customChecked) return; customChecked = true
  fetch('/music/background.mp3')
    .then(r => { if (r.ok && (r.headers.get('content-type')||'').includes('audio')) customUrl = '/music/background.mp3' })
    .catch(() => {})
}
try { checkCustom() } catch {}

// ============ NOTES (12-TET) ============
const N = m => 440 * Math.pow(2, (m - 69) / 12)
const
  G3=N(55),A3=N(57),B3=N(59),
  C4=N(60),D4=N(62),E4=N(64),F4=N(65),G4=N(67),A4=N(69),B4=N(71),
  C5=N(72),D5=N(74),E5=N(76),F5=N(77),G5=N(79),A5=N(81),
  C3=N(48),D3=N(50),E3=N(52),F3=N(53)

// ============ TIMING ============
const BPM = 132
const B = 60 / BPM          // one beat
const BAR = B * 4            // one bar
const SEC_LEN = BAR * 4      // 4 bars per section
// 8 sections × ~7.3s = ~58s

// ============ WARM SOUND ENGINE ============
// Lead: two slightly detuned square waves + low-pass filter = warm, fat chiptune
function lead(c, freq, t, dur, volume) {
  if (!freq) return
  try {
    const g = c.createGain()
    const lp = c.createBiquadFilter()
    lp.type = 'lowpass'; lp.frequency.value = 2500; lp.Q.value = 0.7
    lp.connect(g); g.connect(master)

    // Two detuned oscillators for chorus/warmth
    const o1 = c.createOscillator(); o1.type = 'square'
    o1.frequency.value = freq * 1.002  // slightly sharp
    o1.connect(lp)
    const o2 = c.createOscillator(); o2.type = 'square'
    o2.frequency.value = freq * 0.998  // slightly flat
    o2.connect(lp)

    const att = Math.min(0.01, dur * 0.05)
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(volume * 0.5, t + att) // ×0.5 because 2 oscillators
    g.gain.setValueAtTime(volume * 0.45, t + dur * 0.7)
    g.gain.linearRampToValueAtTime(0, t + dur)

    o1.start(t); o1.stop(t + dur + 0.01)
    o2.start(t); o2.stop(t + dur + 0.01)
  } catch {}
}

// Bass: triangle wave, simple and clean
function bass(c, freq, t, dur, volume) {
  if (!freq) return
  try {
    const o = c.createOscillator(); o.type = 'triangle'
    const g = c.createGain()
    o.connect(g); g.connect(master)
    o.frequency.value = freq
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(volume, t + 0.01)
    g.gain.setValueAtTime(volume * 0.8, t + dur * 0.6)
    g.gain.linearRampToValueAtTime(0, t + dur)
    o.start(t); o.stop(t + dur + 0.01)
  } catch {}
}

// Chord pad: sine waves, very soft
function pad(c, notes, t, dur, volume) {
  notes.forEach(freq => {
    try {
      const o = c.createOscillator(); o.type = 'sine'
      const g = c.createGain()
      o.connect(g); g.connect(master)
      o.frequency.value = freq
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(volume, t + 0.05)
      g.gain.setValueAtTime(volume * 0.7, t + dur * 0.8)
      g.gain.linearRampToValueAtTime(0, t + dur)
      o.start(t); o.stop(t + dur + 0.02)
    } catch {}
  })
}

// Drums
function kick(c, t) {
  try {
    const o = c.createOscillator(); const g = c.createGain()
    o.connect(g); g.connect(master); o.type = 'sine'
    o.frequency.setValueAtTime(150, t)
    o.frequency.exponentialRampToValueAtTime(30, t + 0.1)
    g.gain.setValueAtTime(0.3, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
    o.start(t); o.stop(t + 0.12)
  } catch {}
}
function snare(c, t) {
  try {
    const buf = c.createBuffer(1, c.sampleRate * 0.04, c.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    const s = c.createBufferSource(); s.buffer = buf
    const g = c.createGain(); s.connect(g); g.connect(master)
    g.gain.setValueAtTime(0.15, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.06)
    s.start(t); s.stop(t + 0.06)
  } catch {}
}
function hat(c, t) {
  try {
    const buf = c.createBuffer(1, c.sampleRate * 0.01, c.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    const s = c.createBufferSource(); s.buffer = buf
    const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 9000
    const g = c.createGain(); s.connect(hp); hp.connect(g); g.connect(master)
    g.gain.setValueAtTime(0.06, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.02)
    s.start(t); s.stop(t + 0.02)
  } catch {}
}

// ============ SONG COMPOSITION ============
// 8 sections, each 4 bars of 4 beats = 16 beats
// Melody notes: [freq, duration_in_beats]
// Bass pattern: [freq] per beat (16 entries)
// Chord: [name, notes[]] per bar (4 entries)
// Drum pattern name

const song = [
  // ===== Section 1: INTRO — catchy hook =====
  {
    melody: [
      // Bar 1: Bouncy ascending
      [G4,0.5],[0,0.5],[G4,0.5],[A4,0.5],[B4,0.5],[C5,0.5],[D5,0.5],[0,0.5],
      // Bar 2: Peak and descend
      [E5,0.5],[E5,0.5],[D5,0.5],[C5,0.5],[D5,1],[0,1],
      // Bar 3: Repeat hook
      [G4,0.5],[0,0.5],[G4,0.5],[A4,0.5],[B4,0.5],[C5,0.5],[D5,0.5],[0,0.5],
      // Bar 4: Resolve
      [C5,0.5],[B4,0.5],[A4,0.5],[G4,0.5],[G4,2],
    ],
    bass: [C3,C3,C3,C3, G3,G3,G3,G3, A3,A3,A3,A3, F3,F3,G3,G3],
    chords: [[C4,E4,G4],[G3,B3,D4],[A3,C4,E4],[F3,A3,C4]],
    drums: 'full',
  },
  // ===== Section 2: VERSE — rhythmic answer =====
  {
    melody: [
      [E5,0.5],[D5,0.5],[C5,1],[E5,0.5],[D5,0.5],[C5,0.5],[B4,0.5],
      [A4,1],[B4,0.5],[C5,0.5],[D5,2],
      [E5,0.5],[D5,0.5],[C5,1],[B4,0.5],[A4,0.5],[G4,1],
      [A4,0.5],[B4,0.5],[C5,1],[C5,2],
    ],
    bass: [C3,C3,C3,C3, F3,F3,F3,F3, A3,A3,A3,A3, G3,G3,G3,G3],
    chords: [[C4,E4,G4],[F3,A3,C4],[A3,C4,E4],[G3,B3,D4]],
    drums: 'full',
  },
  // ===== Section 3: CHORUS — big and triumphant =====
  {
    melody: [
      [G5,1],[E5,0.5],[C5,0.5],[D5,0.5],[E5,0.5],[G5,1],
      [A5,1],[G5,0.5],[E5,0.5],[D5,2],
      [G5,1],[E5,0.5],[C5,0.5],[D5,0.5],[E5,0.5],[G5,1],
      [E5,1],[D5,0.5],[C5,0.5],[C5,2],
    ],
    bass: [C3,C3,C3,C3, F3,F3,F3,F3, C3,C3,C3,C3, G3,G3,C3,C3],
    chords: [[C4,E4,G4],[F3,A3,C4],[C4,E4,G4],[G3,B3,D4]],
    drums: 'big',
  },
  // ===== Section 4: BRIDGE — calmer, different feel =====
  {
    melody: [
      [A4,1],[C5,1],[E5,1],[C5,1],
      [F4,1],[A4,1],[C5,2],
      [D5,1],[E5,1],[F5,0.5],[E5,0.5],[D5,1],
      [B4,0.5],[C5,0.5],[D5,1],[G4,2],
    ],
    bass: [A3,A3,A3,A3, F3,F3,F3,F3, D3,D3,D3,D3, G3,G3,G3,G3],
    chords: [[A3,C4,E4],[F3,A3,C4],[D4,F4,A4],[G3,B3,D4]],
    drums: 'half',
  },
  // ===== Section 5: BUILD — rising energy =====
  {
    melody: [
      [C5,0.5],[D5,0.5],[E5,0.5],[C5,0.5],[D5,0.5],[E5,0.5],[F5,0.5],[E5,0.5],
      [D5,0.5],[E5,0.5],[F5,0.5],[D5,0.5],[E5,0.5],[F5,0.5],[G5,0.5],[F5,0.5],
      [E5,0.5],[F5,0.5],[G5,0.5],[E5,0.5],[F5,0.5],[G5,0.5],[A5,0.5],[G5,0.5],
      [G5,1],[A5,1],[G5,2],
    ],
    bass: [C3,C3,C3,C3, D3,D3,D3,D3, E3,E3,E3,E3, G3,G3,G3,G3],
    chords: [[C4,E4,G4],[D4,F4,A4],[E4,G4,B4],[G3,B3,D4]],
    drums: 'build',
  },
  // ===== Section 6: CHORUS 2 — return, even bigger =====
  {
    melody: [
      [G5,0.5],[0,0.5],[G5,0.5],[E5,0.5],[C5,0.5],[D5,0.5],[E5,0.5],[G5,0.5],
      [A5,1],[G5,1],[E5,1],[D5,1],
      [G5,0.5],[0,0.5],[G5,0.5],[E5,0.5],[C5,0.5],[D5,0.5],[E5,0.5],[G5,0.5],
      [E5,1],[D5,0.5],[C5,0.5],[C5,2],
    ],
    bass: [C3,C3,C3,C3, F3,F3,F3,F3, C3,C3,C3,C3, G3,G3,C3,C3],
    chords: [[C4,E4,G4],[F3,A3,C4],[C4,E4,G4],[G3,B3,D4]],
    drums: 'big',
  },
  // ===== Section 7: BREAKDOWN — sparse, breathing room =====
  {
    melody: [
      [C5,2],[E5,2],
      [G5,2],[E5,2],
      [F5,2],[D5,2],
      [E5,1],[D5,1],[C5,2],
    ],
    bass: [C3,C3,C3,C3, C3,C3,C3,C3, F3,F3,F3,F3, G3,G3,C3,C3],
    chords: [[C4,E4,G4],[C4,E4,G4],[F3,A3,C4],[G3,B3,D4]],
    drums: 'sparse',
  },
  // ===== Section 8: FINALE — energetic ending =====
  {
    melody: [
      [G4,0.5],[B4,0.5],[D5,0.5],[G5,0.5],[G5,0.5],[D5,0.5],[B4,0.5],[G4,0.5],
      [A4,0.5],[C5,0.5],[E5,0.5],[A5,0.5],[A5,0.5],[E5,0.5],[C5,0.5],[A4,0.5],
      [G4,0.5],[0,0.5],[G4,0.5],[A4,0.5],[B4,0.5],[C5,0.5],[D5,0.5],[E5,0.5],
      [G5,1],[E5,0.5],[C5,0.5],[C5,2],
    ],
    bass: [G3,G3,G3,G3, A3,A3,A3,A3, C3,C3,C3,C3, C3,C3,C3,C3],
    chords: [[G3,B3,D4],[A3,C4,E4],[C4,E4,G4],[C4,E4,G4]],
    drums: 'full',
  },
]

// Verify all melodies = 16 beats
song.forEach((s, i) => {
  const t = s.melody.reduce((sum, [, d]) => sum + d, 0)
  if (Math.abs(t - 16) > 0.01) console.warn(`Music section ${i}: ${t} beats (need 16)`)
})

let cur = 0

// ============ DRUM PATTERNS ============
function drums(c, t0, pat) {
  for (let bar = 0; bar < 4; bar++) {
    for (let b = 0; b < 4; b++) {
      const t = t0 + bar * BAR + b * B
      if (pat === 'full' || pat === 'big') {
        if (b === 0 || b === 2) kick(c, t)
        if (b === 1 || b === 3) snare(c, t)
        hat(c, t); hat(c, t + B * 0.5)
      }
      if (pat === 'half') {
        if (b === 0) kick(c, t)
        if (b === 2) snare(c, t)
        hat(c, t)
      }
      if (pat === 'build') {
        kick(c, t)
        if (b === 1 || b === 3) snare(c, t)
        hat(c, t); hat(c, t + B * 0.25); hat(c, t + B * 0.5); hat(c, t + B * 0.75)
      }
      if (pat === 'sparse') {
        if (b === 0 && bar % 2 === 0) kick(c, t)
        if (b === 0) hat(c, t)
      }
    }
  }
}

// ============ SECTION PLAYER ============
function play() {
  if (!isPlaying) return
  const c = ac()
  if (!master || master.context !== c) {
    master = c.createGain(); master.connect(c.destination)
  }
  master.gain.value = vol

  const s = song[cur]
  const t0 = c.currentTime + 0.2

  // Drums
  drums(c, t0, s.drums)

  // Bass: one note per beat
  s.bass.forEach((f, i) => bass(c, f, t0 + i * B, B * 0.8, 0.14))

  // Chords: one per bar, sustained
  s.chords.forEach((ch, bar) => {
    const t = t0 + bar * BAR
    // Play chord as gentle arpeggio (strum effect) — sounds nicer than all at once
    ch.forEach((f, j) => pad(c, [f], t + j * 0.03, BAR * 0.9, 0.04))
  })

  // Melody
  let mt = t0
  s.melody.forEach(([freq, beats]) => {
    const dur = beats * B
    lead(c, freq, mt, dur * 0.9, 0.12)
    mt += dur
  })

  cur = (cur + 1) % song.length
  timer = setTimeout(play, (SEC_LEN - 0.15) * 1000)
}

// ============ PUBLIC API ============
export function startMusic() {
  if (isPlaying) return
  if (customUrl) {
    isPlaying = true
    if (customAudio) { customAudio.pause(); customAudio = null }
    customAudio = new Audio(customUrl)
    customAudio.loop = true; customAudio.volume = vol
    customAudio.play().catch(() => { customUrl = null; customAudio = null; isPlaying = false; startMusic() })
    return
  }
  isPlaying = true; cur = 0
  const c = ac()
  const go = () => {
    if (!isPlaying) return
    // Extra safety: ensure master gain exists
    if (!master || master.context !== c) {
      master = c.createGain(); master.connect(c.destination)
    }
    master.gain.value = vol
    play()
  }
  if (c.state === 'suspended') {
    c.resume().then(go).catch(() => { setTimeout(go, 100) })
  } else {
    go()
  }
}

export function stopMusic() {
  isPlaying = false
  if (timer) { clearTimeout(timer); timer = null }
  if (master) { try { master.gain.value = 0 } catch {} }
  master = null
  if (customAudio) { customAudio.pause(); customAudio.currentTime = 0 }
}

export function unlockAudio() {
  const c = ac(); if (c.state === 'suspended') c.resume().catch(() => {})
}

export function setVolume(level) {
  vol = VOLS[level] || VOLS.mittel
  if (master && isPlaying) { try { master.gain.value = vol } catch {} }
  if (customAudio) customAudio.volume = vol
  localStorage.setItem('soccerStarMusicVol', level)
}

export function getVolume() {
  return localStorage.getItem('soccerStarMusicVol') || 'mittel'
}

vol = VOLS[getVolume()] || VOLS.mittel

export function isMusicPlaying() { return isPlaying }
