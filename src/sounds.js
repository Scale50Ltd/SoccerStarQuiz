let audioCtx = null
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

export function playKaChingSound() {
  const ctx = getAudioCtx()
  // First "ka" - short click
  const osc1 = ctx.createOscillator()
  const gain1 = ctx.createGain()
  osc1.connect(gain1)
  gain1.connect(ctx.destination)
  osc1.type = 'sine'
  osc1.frequency.setValueAtTime(1800, ctx.currentTime)
  gain1.gain.setValueAtTime(0.3, ctx.currentTime)
  gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)
  osc1.start(ctx.currentTime)
  osc1.stop(ctx.currentTime + 0.08)

  // Second "ching" - bright ring
  const osc2 = ctx.createOscillator()
  const gain2 = ctx.createGain()
  osc2.connect(gain2)
  gain2.connect(ctx.destination)
  osc2.type = 'sine'
  osc2.frequency.setValueAtTime(2400, ctx.currentTime + 0.1)
  osc2.frequency.setValueAtTime(3200, ctx.currentTime + 0.15)
  gain2.gain.setValueAtTime(0.35, ctx.currentTime + 0.1)
  gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
  osc2.start(ctx.currentTime + 0.1)
  osc2.stop(ctx.currentTime + 0.5)

  // Third shimmer
  const osc3 = ctx.createOscillator()
  const gain3 = ctx.createGain()
  osc3.connect(gain3)
  gain3.connect(ctx.destination)
  osc3.type = 'triangle'
  osc3.frequency.setValueAtTime(4000, ctx.currentTime + 0.15)
  gain3.gain.setValueAtTime(0.15, ctx.currentTime + 0.15)
  gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6)
  osc3.start(ctx.currentTime + 0.15)
  osc3.stop(ctx.currentTime + 0.6)
}

export function playCorrectSound() {
  const ctx = getAudioCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(523, ctx.currentTime)
  osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1)
  osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2)
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.4)
}

export function playWrongSound() {
  const ctx = getAudioCtx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(300, ctx.currentTime)
  osc.frequency.setValueAtTime(200, ctx.currentTime + 0.2)
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.4)
}

export function playUnlockSound() {
  const ctx = getAudioCtx()
  // Ascending sparkle sound
  const notes = [523, 659, 784, 1047]
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'triangle'
    osc.frequency.value = freq
    const t = ctx.currentTime + i * 0.12
    gain.gain.setValueAtTime(0.25, t)
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2)
    osc.start(t)
    osc.stop(t + 0.25)
  })
}
