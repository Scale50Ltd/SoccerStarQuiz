import { useState } from 'react'
import { playKaChingSound } from '../sounds'

const DIFFICULTIES = [
  { key: 'leicht', label: 'Leicht', color: 'from-green-400 to-emerald-400', rates: { points: 2, stars: 25, goldenStars: 50 } },
  { key: 'mittel', label: 'Mittel', color: 'from-blue-400 to-indigo-400', rates: { points: 5, stars: 40, goldenStars: 75 } },
  { key: 'schwer', label: 'Schwer', color: 'from-purple-500 to-pink-500', rates: { points: 20, stars: 75, goldenStars: 200 } },
]

const TYPES = [
  { type: 'points', label: 'Punkte', emoji: '🎯' },
  { type: 'stars', label: 'Sterne', emoji: '⭐' },
  { type: 'goldenStars', label: 'Gold-Sterne', emoji: '🌟' },
]

export default function ExchangeScreen({ player, onExchange }) {
  const [amounts, setAmounts] = useState({})
  const [notification, setNotification] = useState(null)

  // Get available per difficulty (with fallback for old data)
  function getAvailable(diff, type) {
    const byDiff = player._byDifficulty || {}
    if (byDiff[diff]) return byDiff[diff][type] || 0
    // Fallback: if no _byDifficulty data, treat all existing as 'mittel'
    if (diff === 'mittel' && !byDiff.leicht && !byDiff.schwer) return player[type] || 0
    return 0
  }

  function getAmountKey(diff, type) { return `${diff}_${type}` }

  function handleExchange(diff, type, amount, rate) {
    const avail = getAvailable(diff, type)
    if (avail < amount || amount <= 0) return
    const coins = amount * rate
    playKaChingSound()
    onExchange(type, amount, diff)
    setNotification({ coins, total: player.coins + coins })
    setTimeout(() => setNotification(null), 2000)
  }

  return (
    <div className="py-4 space-y-4">
      <div className="bg-gradient-to-r from-amber-400 to-yellow-400 rounded-2xl px-4 py-3 text-center relative overflow-hidden shadow-lg">
        <span className="font-bold text-lg text-amber-900">🪙 {player.coins} Münzen</span>
        {notification && (
          <div className="absolute inset-0 flex items-center justify-center bg-amber-100/95 animate-pulse rounded-xl">
            <span className="text-lg font-bold text-amber-700">+ {notification.coins} Münzen! → 🪙 {notification.total}</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-xl">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Belohnungen umtauschen</h2>
        <p className="text-gray-500 mb-4 text-xs">Schwere Fragen bringen mehr Münzen!</p>

        {DIFFICULTIES.map(diff => {
          const hasAnything = TYPES.some(t => getAvailable(diff.key, t.type) > 0)
          if (!hasAnything) return null
          return (
            <div key={diff.key} className="mb-4">
              <div className={`bg-gradient-to-r ${diff.color} rounded-xl px-4 py-2 mb-2`}>
                <span className="font-bold text-white text-sm">{diff.label}</span>
              </div>
              <div className="space-y-2 pl-1">
                {TYPES.map(({ type, label, emoji }) => {
                  const available = getAvailable(diff.key, type)
                  if (available <= 0) return null
                  const rate = diff.rates[type]
                  const key = getAmountKey(diff.key, type)
                  const amount = Math.min(amounts[key] || 1, available)
                  return (
                    <div key={type} className="bg-gray-50 rounded-xl p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm">{emoji} {label}</span>
                        <span className="text-xs text-gray-500">Verfügbar: {available}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">1 = {rate} Münzen</p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setAmounts(a => ({ ...a, [key]: Math.max(1, (a[key] || 1) - 1) }))}
                          className="w-8 h-8 bg-gray-200 rounded-lg font-bold text-lg hover:bg-gray-300">-</button>
                        <span className="text-lg font-bold w-6 text-center">{amount}</span>
                        <button onClick={() => setAmounts(a => ({ ...a, [key]: Math.min(available, (a[key] || 1) + 1) }))}
                          className="w-8 h-8 bg-gray-200 rounded-lg font-bold text-lg hover:bg-gray-300">+</button>
                        <span className="text-gray-500 text-sm mx-1">= 🪙 {amount * rate}</span>
                        <button onClick={() => handleExchange(diff.key, type, amount, rate)}
                          disabled={available < amount || amount <= 0}
                          className={`ml-auto px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                            available >= amount && amount > 0
                              ? 'bg-amber-500 text-white hover:bg-amber-600 active:scale-95'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }`}>
                          Tauschen
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* If no per-difficulty data exists yet, show hint */}
        {!player._byDifficulty && (player.points > 0 || player.stars > 0 || player.goldenStars > 0) && (
          <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
            Deine bisherigen Belohnungen werden mit den <strong>Mittel</strong>-Werten umgetauscht.
          </div>
        )}
      </div>
    </div>
  )
}
