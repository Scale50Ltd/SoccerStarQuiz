// Background music — multi-layer generated, with optional custom file support
let audioCtx = null
let isPlaying = false
let gainNode = null
let loopTimeout = null
let currentVolume = 0.3

const VOLUME_LEVELS = { leise: 0.15, mittel: 0.3, laut: 0.5 }

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

// ============ OPTIONAL CUSTOM FILE ============
// Only used if a real audio file exists at public/music/background.mp3 or .ogg
let customAudio = null
let customFileUrl = null
let customFileChecked = false

function checkForCustomFile() {
  if (customFileChecked) return
  customFileChecked = true
  // Only accept if content-type is actually audio
  fetch('/music/background.mp3')
    .then(r => {
      const ct = r.headers.get('content-type') || ''
      if (r.ok && ct.includes('audio')) customFileUrl = '/music/background.mp3'
    })
    .catch(() => {})
}
// Fire check in background (non-blocking, result used on next startMusic if available)
try { checkForCustomFile() } catch {}

// ============ GENERATED MUSIC ============
const BPM = 120
const BEAT = 60 / BPM
const BAR = BEAT * 4

const N = {
  C3:131, D3:147, E3:165, F3:175, G3:196, A3:220, B3:247,
  C4:262, D4:294, E4:330, F4:349, G4:392, A4:440, B4:494,
  C5:523, D5:587, E5:659, F5:698, G5:784, A5:880,
}

const SECTIONS = [
  {
    melody: [[N.E5,0.5],[N.G5,0.5],[N.A5,0.5],[N.G5,0.5],[N.E5,0.5],[N.D5,0.5],[N.C5,1],[N.D5,0.5],[N.E5,0.5],[N.G5,0.5],[N.E5,0.5],[N.D5,0.5],[N.C5,0.5],[N.D5,1]],
    bass: [N.C3, N.G3, N.A3, N.G3, N.F3, N.G3, N.C3, N.G3],
    chords: [[N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4],[N.A3,N.C4,N.E4],[N.G3,N.B3,N.D4],[N.F3,N.A3,N.C4],[N.G3,N.B3,N.D4],[N.C4,N.E4,N.G4],[N.C4,N.E4,N.G4]],
  },
  {
    melody: [[N.G5,0.5],[N.A5,0.5],[N.G5,0.5],[N.E5,0.5],[N.D5,0.5],[N.E5,0.5],[N.G5,1],[N.A5,0.5],[N.G5,0.5],[N.E5,0.5],[N.D5,0.5],[N.C5,0.5],[N.D5,0.5],[N.E5,1]],
    bass: [N.A3, N.E3, N.F3, N.G3, N.A3, N.E3, N.G3, N.C3],
    chords: [[N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],[N.F3,N.A3,N.C4],[N.G3,N.B3,N.D4],[N.A3,N.C4,N.E4],[N.A3,N.C4,N.E4],[N.G3,N.B3,N.D4],[N.C4,N.E4,N.G4]],
  },
]

let currentSection = 0

function playDrum(ctx, time, type) {
  try {
    if (type === 'kick') {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.connect(g); g.connect(gainNode)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(150, time)
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.08)
      g.gain.setValueAtTime(0.5, time)
      g.gain.exponentialRampToValueAtTime(0.01, time + 0.12)
      osc.start(time); osc.stop(time + 0.12)
    } else if (type === 'snare') {
      const bufSize = ctx.sampleRate * 0.06
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1)
      const src = ctx.createBufferSource()
      const g = ctx.createGain()
      src.buffer = buf; src.connect(g); g.connect(gainNode)
      g.gain.setValueAtTime(0.3, time)
      g.gain.exponentialRampToValueAtTime(0.01, time + 0.08)
      src.start(time); src.stop(time + 0.08)
    } else {
      const bufSize = ctx.sampleRate * 0.02
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < bufSize; i++) d[i] = (Math.random() * 2 - 1)
      const src = ctx.createBufferSource()
      const g = ctx.createGain()
      const hp = ctx.createBiquadFilter()
      hp.type = 'highpass'; hp.frequency.value = 8000
      src.buffer = buf; src.connect(hp); hp.connect(g); g.connect(gainNode)
      g.gain.setValueAtTime(0.15, time)
      g.gain.exponentialRampToValueAtTime(0.01, time + 0.03)
      src.start(time); src.stop(time + 0.03)
    }
  } catch (e) { /* ignore audio scheduling errors */ }
}

function playNote(ctx, freq, start, dur, type, vol) {
  try {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.connect(g); g.connect(gainNode)
    osc.type = type
    osc.frequency.value = freq
    g.gain.setValueAtTime(0, start)
    g.gain.linearRampToValueAtTime(vol, start + 0.015)
    g.gain.setValueAtTime(vol, start + dur - 0.05)
    g.gain.linearRampToValueAtTime(0, start + dur)
    osc.start(start); osc.stop(start + dur + 0.01)
  } catch (e) { /* ignore */ }
}

function playSection() {
  if (!isPlaying) return

  const ctx = getCtx()
  // Always recreate gainNode to avoid stale references
  if (!gainNode || gainNode.context !== ctx) {
    gainNode = ctx.createGain()
    gainNode.connect(ctx.destination)
  }
  gainNode.gain.value = currentVolume

  const section = SECTIONS[currentSection % SECTIONS.length]
  const t0 = ctx.currentTime + 0.1
  const sectionLen = BAR * 4

  // Drums
  for (let bar = 0; bar < 4; bar++) {
    for (let beat = 0; beat < 4; beat++) {
      const t = t0 + bar * BAR + beat * BEAT
      if (beat === 0 || beat === 2) playDrum(ctx, t, 'kick')
      if (beat === 1 || beat === 3) playDrum(ctx, t, 'snare')
      playDrum(ctx, t, 'hat')
      playDrum(ctx, t + BEAT * 0.5, 'hat')
    }
  }

  // Bass
  for (let rep = 0; rep < 2; rep++) {
    section.bass.forEach((freq, i) => {
      playNote(ctx, freq, t0 + rep * BAR * 2 + i * BEAT, BEAT * 0.75, 'triangle', 0.2)
    })
  }

  // Chords
  for (let rep = 0; rep < 2; rep++) {
    section.chords.forEach((chord, i) => {
      const t = t0 + rep * BAR * 2 + i * BEAT
      chord.forEach(f => playNote(ctx, f, t, BEAT * 0.85, 'sine', 0.06))
    })
  }

  // Melody
  for (let rep = 0; rep < 2; rep++) {
    let mt = t0 + rep * BAR * 2
    section.melody.forEach(([freq, beats]) => {
      const dur = beats * BEAT
      playNote(ctx, freq, mt, dur * 0.8, 'square', 0.1)
      mt += dur
    })
  }

  currentSection++
  loopTimeout = setTimeout(playSection, (sectionLen - 0.1) * 1000)
}

// ============ PUBLIC API ============

export function startMusic() {
  if (isPlaying) return

  // If custom audio file is confirmed available, use it
  if (customFileUrl) {
    isPlaying = true
    if (customAudio) { customAudio.pause(); customAudio = null }
    customAudio = new Audio(customFileUrl)
    customAudio.loop = true
    customAudio.volume = currentVolume
    customAudio.play().catch(() => {
      // Custom file failed — fall back to generated
      customFileUrl = null
      customAudio = null
      isPlaying = false
      startMusic()
    })
    return
  }

  // Generated music
  isPlaying = true
  currentSection = Math.floor(Math.random() * SECTIONS.length)
  playSection()
}

export function stopMusic() {
  isPlaying = false
  if (loopTimeout) { clearTimeout(loopTimeout); loopTimeout = null }
  if (gainNode) {
    try { gainNode.gain.value = 0 } catch {}
  }
  gainNode = null // Force fresh gainNode on next start
  if (customAudio) { customAudio.pause(); customAudio.currentTime = 0 }
}

// Must be called from a user gesture to unlock AudioContext
export function unlockAudio() {
  getCtx() // This creates + resumes the context
}

export function setVolume(level) {
  currentVolume = VOLUME_LEVELS[level] || VOLUME_LEVELS.mittel
  if (gainNode && isPlaying) {
    try { gainNode.gain.value = currentVolume } catch {}
  }
  if (customAudio) customAudio.volume = currentVolume
  localStorage.setItem('soccerStarMusicVol', level)
}

export function getVolume() {
  return localStorage.getItem('soccerStarMusicVol') || 'mittel'
}

currentVolume = VOLUME_LEVELS[getVolume()] || VOLUME_LEVELS.mittel

export function isMusicPlaying() { return isPlaying }
