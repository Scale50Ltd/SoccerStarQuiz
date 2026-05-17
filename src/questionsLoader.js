// Lazy question loader — loads all questions on first quiz start, caches by difficulty

const cache = {} // { leicht: [...], mittel: [...], schwer: [...] }
let loaded = false

export async function loadQuestions(difficulty) {
  if (cache[difficulty]) return cache[difficulty]

  if (!loaded) {
    // Single dynamic import — Vite puts this in a separate chunk (not loaded at app start)
    const mod = await import('./questions.js')
    const all = mod.questions

    cache.leicht = all.filter(q => q.difficulty === 'leicht')
    cache.mittel = all.filter(q => q.difficulty === 'mittel')
    cache.schwer = all.filter(q => q.difficulty === 'schwer')
    loaded = true
  }

  return cache[difficulty] || []
}

// Synchronous access after first load
export function getLoadedQuestions(difficulty) {
  return cache[difficulty] || null
}

export function isLoaded() {
  return loaded
}
