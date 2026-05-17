import { useState, useRef, useEffect } from 'react'
import { playKaChingSound } from '../sounds'

const GOLD_RATES = { leicht: 50, mittel: 75, schwer: 200 }

const DIFF_STYLES = {
  leicht: { label: 'Leicht', color: 'from-green-400 to-emerald-400', badge: 'bg-green-100 text-green-700' },
  mittel: { label: 'Mittel', color: 'from-blue-400 to-indigo-400', badge: 'bg-blue-100 text-blue-700' },
  schwer: { label: 'Schwer', color: 'from-purple-500 to-pink-500', badge: 'bg-purple-100 text-purple-700' },
}

export default function ExchangeScreen({ player, onPointsToGold, onStarsToGold, onGoldToCoins }) {
  const [notification, setNotification] = useState(null)
  const [displayCoins, setDisplayCoins] = useState(player.coins)
  const animRef = useRef(null)

  useEffect(() => {
    setDisplayCoins(player.coins)
  }, [player.coins])

  function getAvailable(diff, type) {
    const byDiff = player._byDifficulty || {}
    if (byDiff[diff]) return byDiff[diff][type] || 0
    if (diff === 'mittel' && !byDiff.leicht && !byDiff.schwer) return player[type] || 0
    return 0
  }

  function animateCoins(coinsBefore, coinsAfter) {
    playKaChingSound()
    const gained = coinsAfter - coinsBefore
    setNotification({ coins: gained, total: coinsAfter })
    const duration = 1000
    const startTime = performance.now()
    function animate(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      setDisplayCoins(Math.round(coinsBefore + (coinsAfter - coinsBefore) * progress))
      if (progress < 1) animRef.current = requestAnimationFrame(animate)
    }
    if (animRef.current) cancelAnimationFrame(animRef.current)
    animRef.current = requestAnimationFrame(animate)
    setTimeout(() => setNotification(null), 2000)
  }

  function handlePointsToGold(diff) {
    const avail = getAvailable(diff, 'points')
    if (avail < 10) return
    onPointsToGold(diff, 1)
  }

  function handleStarsToGold(diff) {
    const avail = getAvailable(diff, 'stars')
    if (avail < 2) return
    onStarsToGold(diff, 1)
  }

  function handleGoldToCoins(diff) {
    const avail = getAvailable(diff, 'goldenStars')
    if (avail < 1) return
    const rate = GOLD_RATES[diff] || GOLD_RATES.mittel
    const coinsBefore = player.coins
    const coinsAfter = coinsBefore + rate
    onGoldToCoins(diff, 1)
    animateCoins(coinsBefore, coinsAfter)
  }

  const diffs = ['leicht', 'mittel', 'schwer']
  const hasAnyByDiff = !!player._byDifficulty
  const hasAnything = diffs.some(d =>
    getAvailable(d, 'points') > 0 || getAvailable(d, 'stars') > 0 || getAvailable(d, 'goldenStars') > 0
  )

  return (
    <div className="py-4 space-y-4">
      {/* Coin display */}
      <div className="bg-gradient-to-r from-amber-400 to-yellow-400 rounded-2xl px-4 py-3 text-center relative overflow-hidden shadow-lg">
        <span className="font-bold text-lg text-amber-900">🪙 {displayCoins} Münzen</span>
        {notification && (
          <div className="absolute inset-0 flex items-center justify-center bg-amber-100/95 animate-pulse rounded-xl">
            <span className="text-lg font-bold text-amber-700">+ {notification.coins} Münzen! → 🪙 {notification.total}</span>
          </div>
        )}
      </div>

      {/* Explanation */}
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-4 shadow-lg border-2 border-amber-200">
        <h2 className="text-lg font-bold text-gray-800 mb-2">So funktioniert der Tausch</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="bg-green-100 rounded-full px-2 py-0.5 font-bold text-green-700 text-xs">1</span>
            <span>🎯 <strong>10 Punkte</strong> → 🌟 <strong>1 goldener Stern</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 rounded-full px-2 py-0.5 font-bold text-blue-700 text-xs">2</span>
            <span>⭐ <strong>2 Sterne</strong> → 🌟 <strong>1 goldener Stern</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 rounded-full px-2 py-0.5 font-bold text-amber-700 text-xs">3</span>
            <span>🌟 <strong>Goldene Sterne</strong> → 🪙 <strong>Münzen!</strong></span>
          </div>
        </div>
      </div>

      {/* Overall totals */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-2xl p-3 text-center shadow-md border border-gray-100">
          <div className="text-2xl font-extrabold text-green-600">{player.points}</div>
          <div className="text-xs font-bold text-gray-500">🎯 Punkte</div>
        </div>
        <div className="bg-white rounded-2xl p-3 text-center shadow-md border border-gray-100">
          <div className="text-2xl font-extrabold text-yellow-500">{player.stars}</div>
          <div className="text-xs font-bold text-gray-500">⭐ Sterne</div>
        </div>
        <div className="bg-white rounded-2xl p-3 text-center shadow-md border border-gray-100">
          <div className="text-2xl font-extrabold text-amber-500">{player.goldenStars}</div>
          <div className="text-xs font-bold text-gray-500">🌟 Gold</div>
        </div>
      </div>

      {/* Exchange per difficulty */}
      {diffs.map(diff => {
        const style = DIFF_STYLES[diff]
        const points = getAvailable(diff, 'points')
        const stars = getAvailable(diff, 'stars')
        const gold = getAvailable(diff, 'goldenStars')
        const rate = GOLD_RATES[diff]

        if (points <= 0 && stars <= 0 && gold <= 0) return null

        return (
          <div key={diff} className="rounded-2xl overflow-hidden shadow-xl">
            <div className={`bg-gradient-to-r ${style.color} px-5 py-3`}>
              <span className="font-bold text-white text-lg drop-shadow">{style.label}</span>
            </div>
            <div className="bg-white p-4 space-y-3">

              {/* Points → Gold */}
              {points > 0 && (
                <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-700">🎯 Punkte → 🌟 Gold</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.badge}`}>{points} verfügbar</span>
                  </div>
                  <button
                    onClick={() => handlePointsToGold(diff)}
                    disabled={points < 10}
                    className={`w-full py-3.5 rounded-2xl font-bold text-base transition-all ${
                      points >= 10
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md hover:brightness-110 active:scale-95'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {points >= 10
                      ? `🎯 10 Punkte → 🌟 1 goldener Stern`
                      : `Noch ${10 - points} Punkte nötig`
                    }
                  </button>
                </div>
              )}

              {/* Stars → Gold */}
              {stars > 0 && (
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-700">⭐ Sterne → 🌟 Gold</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.badge}`}>{stars} verfügbar</span>
                  </div>
                  <button
                    onClick={() => handleStarsToGold(diff)}
                    disabled={stars < 2}
                    className={`w-full py-3.5 rounded-2xl font-bold text-base transition-all ${
                      stars >= 2
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:brightness-110 active:scale-95'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {stars >= 2
                      ? `⭐ 2 Sterne → 🌟 1 goldener Stern`
                      : `Noch ${2 - stars} Stern(e) nötig`
                    }
                  </button>
                </div>
              )}

              {/* Gold → Coins */}
              {gold > 0 && (
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-gray-700">🌟 Gold → 🪙 Münzen</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style.badge}`}>{gold} verfügbar</span>
                  </div>
                  <button
                    onClick={() => handleGoldToCoins(diff)}
                    className="w-full py-3.5 rounded-2xl font-bold text-base bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
                  >
                    🌟 1 goldener Stern → 🪙 {rate} Münzen
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Hint for old data without per-difficulty tracking */}
      {!hasAnyByDiff && (player.points > 0 || player.stars > 0 || player.goldenStars > 0) && (
        <div className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-700 border border-blue-200">
          💡 Deine bisherigen Belohnungen werden als <strong>Mittel</strong> gewertet. Spiele neue Runden, um Belohnungen pro Schwierigkeit zu sammeln!
        </div>
      )}

      {/* Nothing to exchange */}
      {!hasAnything && (
        <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
          <div className="text-4xl mb-3">⚽</div>
          <p className="text-gray-600 font-bold">Spiele Quiz-Runden, um Punkte und Sterne zu sammeln!</p>
          <p className="text-gray-400 text-sm mt-1">Dann kannst du hier tauschen.</p>
        </div>
      )}
    </div>
  )
}
